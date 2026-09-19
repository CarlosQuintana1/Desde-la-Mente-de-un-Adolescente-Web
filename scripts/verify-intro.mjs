import assert from 'node:assert/strict';
import { branches, clamp, point } from '../src/components/treeGrowth.js';

for (const item of branches.filter(item => item.parent)) {
  assert.deepEqual(item.curve[0], point(item.parent.curve, item.at));
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
