import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { branches, clamp, disciplines, growthPoint, point } from '../src/components/treeGrowth.js';

for (const discipline of disciplines) {
  assert.equal(branches.filter(item => item.discipline === discipline).length, 21, 'Every discipline must include its main branch and all descendants');
}

for (const progress of [0.08, 0.09, 0.10, 0.11]) {
  const trunk = branches[0];
  assert.equal(growthPoint(trunk, clamp((progress - trunk.start) / trunk.duration), progress)[0], 400, 'Sprout must emerge at the seed center');
  for (const root of branches.filter(item => item.isRoot)) {
    assert.deepEqual(growthPoint(root, 0, progress), [400, 760], 'Early roots must share the seed center');
  }
}
for (const item of branches) {
  for (const t of [0, 0.25, 0.5, 1]) assert.deepEqual(growthPoint(item, t, 1), point(item.curve, t), 'Mature tree geometry must remain unchanged');
}

for (const item of branches.filter(item => item.parent)) {
  assert.deepEqual(item.curve[0], point(item.parent.curve, item.at));
  assert.deepEqual(growthPoint(item, 0, item.start), growthPoint(item.parent, item.at, item.start));
  assert(item.width <= item.parent.width * (1 - item.at) + item.parent.endWidth * item.at);
}
const tips = [0.1, 0.3, 0.5, 1].map(progress => Math.min(...branches
  .filter(item => progress > item.start)
  .map(item => point(item.curve, clamp((progress - item.start) / item.duration))[1])));
for (let i = 1; i < tips.length; i++) assert(tips[i] < tips[i - 1], 'Geometry must grow upwards');

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
const url = process.argv[2] || 'http://127.0.0.1:4179';

try {
  const geometryPage = await browser.newPage();
  const source = await readFile(new URL('../src/components/treeGrowth.js', import.meta.url), 'utf8');
  const rendering = await geometryPage.evaluate(async source => {
    const { createTreeRenderer, branches, point } = await import(URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 2000;
    const ctx = canvas.getContext('2d'), fill = ctx.fill.bind(ctx);
    let translucent = 0, captureBranches = false, branchImage, pathCount = 0;
    const mainLights = [];
    ctx.fill = (...args) => {
      if (ctx.globalAlpha < 1 && args.length === 0) translucent++;
      // Inspect the branch layer before opaque leaves cover some sample points.
      if (captureBranches && !branchImage && args.length === 0) branchImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (captureBranches && args[0] instanceof Path2D) {
        if (pathCount >= 1 && pathCount <= 4) mainLights.push(args[0]);
        pathCount++;
      }
      fill(...args);
    };
    const draw = createTreeRenderer(canvas);
    for (let step = 370; step <= 520; step++) draw(step / 1000);
    const jointAlpha = [];
    for (const p of [0.42, 0.44, 0.48, 1]) {
      draw(p);
      for (const offset of [-3, 0, 3]) jointAlpha.push(ctx.getImageData(Math.round((400 + offset) * 2), Math.round((432 - offset * 59 / 133) * 2), 1, 1).data[3]);
    }
    captureBranches = true; draw(1);
    const branchCanvas = document.createElement('canvas'); branchCanvas.width = canvas.width; branchCanvas.height = canvas.height;
    const branchContext = branchCanvas.getContext('2d'); branchContext.putImageData(branchImage, 0, 0);
    const lights = branches.filter(item => item.parent === branches[0]).flatMap(item => [0.12, 0.5, 0.85].map(t => {
      const p = point(item.curve, t), expected = item.color.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16));
      const pixels = branchContext.getImageData(Math.round(p[0] * 2) - 2, Math.round(p[1] * 2) - 2, 5, 5).data;
      let closest = Infinity;
      for (let i = 0; i < pixels.length; i += 4) closest = Math.min(closest, Math.hypot(...expected.map((channel, axis) => channel - pixels[i + axis])));
      return { discipline: item.discipline.name, t, distance: closest };
    }));
    const transitions = branches.filter(item => item.parent === branches[0]).map((item, index) => {
      const expected = item.color.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16));
      // Measure each light alone so crossing twigs do not inflate its width.
      const layer = document.createElement('canvas'); layer.width = canvas.width; layer.height = canvas.height;
      const isolated = layer.getContext('2d'); isolated.scale(2, 2); isolated.fillStyle = item.color; isolated.fill(mainLights[index]);
      const distanceAt = (p, context = branchContext) => {
        const pixel = context.getImageData(Math.round(p[0] * 2), Math.round(p[1] * 2), 1, 1).data;
        if (pixel[3] < 200) return Infinity;
        return Math.hypot(...expected.map((channel, axis) => channel - pixel[axis]));
      };
      const widths = [0.24, 0.64].map(t => {
        const p = point(item.curve, t), next = point(item.curve, t + 0.001);
        const dx = next[0] - p[0], dy = next[1] - p[1], length = Math.hypot(dx, dy);
        let width = 0;
        for (let offset = -8; offset <= 8; offset += 0.25) {
          if (distanceAt([p[0] - dy / length * offset, p[1] + dx / length * offset], isolated) < 30) width += 0.25;
        }
        return width;
      });
      return { name: item.discipline.name, base: distanceAt(point(item.curve, 0.015)), widths };
    });
    return { translucent, jointAlpha, lights, transitions };
  }, source);
  assert.equal(rendering.translucent, 0, 'The crown must grow as geometry, without a fading junction overlay');
  assert(rendering.jointAlpha.every(alpha => alpha > 240), 'The trunk and crown must stay connected during growth');
  assert(rendering.lights.every(sample => sample.distance < 30), `Each discipline color must cover the start, middle and end of its branch: ${JSON.stringify(rendering.lights)}`);
  assert(rendering.transitions.every(sample => sample.base > 30 && sample.widths[1] > 0 && sample.widths[1] < sample.widths[0]), `Lights must blend into the trunk and taper with their branches: ${JSON.stringify(rendering.transitions)}`);
  await geometryPage.close();
  for (const [width, height, reduced] of [[1440, 900, false], [390, 844, false], [320, 568, false], [844, 390, false], [390, 844, true]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 769, hasTouch: width < 769, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1300);
    let forward;
    const growth = [];
    assert.equal(await page.locator('.mind-tree-wave, .mind-tree filter, .mind-tree mask').count(), 0);
    for (const progress of reduced ? [0, 1, 0] : [0, 0.27, 0.42, 0.46, 0.50, 0.57, 0.61, 0.65, 0.72, 1, 0.57, 0]) {
      await page.evaluate(p => {
        const hero = document.querySelector('.hero');
        window.scrollTo({ top: p * (hero.offsetHeight - hero.querySelector('.hero-stage').clientHeight), behavior: 'instant' });
      }, progress);
      await page.waitForTimeout(300);
      const result = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        const property = name => Number(hero.style.getPropertyValue(name));
        const canvas = hero.querySelector('canvas');
        const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let painted = 0, top = canvas.height, bottom = 0, hash = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 30) { painted++; const y = Math.floor(i / 4 / canvas.width); top = Math.min(top, y); bottom = Math.max(bottom, y); }
          hash = (hash * 31 + data[i + 3]) >>> 0;
        }
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          quote: property('--hero-quote-opacity'),
          complete: property('--tree-complete'),
          geometry: { painted, top, bottom, hash, height: canvas.height },
          labels: [...hero.querySelectorAll('.mind-tree-label')].map(label => {
            const r = label.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, opacity: Number(getComputedStyle(label).opacity) };
          }),
        };
      });
      assert.equal(result.overflow, 0);
      if (progress === 0.42 && !reduced) assert(result.geometry.top > result.geometry.height * 0.7 && result.geometry.bottom < result.geometry.height * 0.82, 'Seed must remain anchored at the base');
      if (process.env.SCREENSHOT_DIR && progress > 0.4) await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/tree-${width}-${progress}${reduced ? '-reduced' : ''}.png` });
      if (progress === 0) assert.equal(result.quote, 1);
      if (progress === 0.57) {
        assert(result.geometry.painted > 50);
        if (forward) assert.deepEqual(result, forward);
        forward = result;
      }
      if ([0.42, 0.57, 0.72, 1].includes(progress) && !reduced && growth.length < 4) growth.push(result.geometry);
      if (progress === 1) {
        assert.equal(result.complete, 1);
        for (const label of result.labels) {
          assert.equal(label.opacity, 1);
          assert(label.left >= 0 && label.right <= width && label.top >= 0 && label.bottom <= height);
        }
        // Inspect visible pixels as well as the canvas backing store.
        const screenshot = await page.screenshot();
        const paintedPixels = await page.evaluate(async data => {
          const image = new Image();
          image.src = data;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.width; canvas.height = image.height;
          const context = canvas.getContext('2d');
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, Math.round(image.height * 0.3), image.width, Math.round(image.height * 0.4)).data;
          let visible = 0;
          for (let i = 0; i < pixels.length; i += 4) if (pixels[i] > 50 && pixels[i + 1] > 70) visible++;
          return visible;
        }, `data:image/png;base64,${screenshot.toString('base64')}`);
        assert(paintedPixels > 500, 'Tree painting must be visible, not just its labels');
      }
    }
    if (!reduced) {
      assert.equal(growth.length, 4);
      for (let i = 1; i < growth.length; i++) {
        assert(growth[i].painted > growth[i - 1].painted, 'Growth must add geometry');
        assert(growth[i].top < growth[i].bottom, 'Framed growth must remain visible');
        assert(growth[i].top < growth[i - 1].top, 'The growing tip must advance upwards without camera motion');
      }
    }
    await page.goto(`${url.replace(/\/$/, '')}/#acercadma`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1300);
    assert(await page.locator('#acercadma').evaluate(element => { const rect = element.getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0; }));
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}x${height}${reduced ? ' reduced motion' : ''}`);
    await page.close();
  }
} finally {
  await browser.close();
}
