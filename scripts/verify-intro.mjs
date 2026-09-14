import assert from 'node:assert/strict';

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
    for (const progress of reduced ? [0, 1, 0] : [0, 0.23, 0.57, 0.72, 1, 0.57, 0]) {
      await page.evaluate(p => {
        const hero = document.querySelector('.hero');
        window.scrollTo({ top: p * (hero.offsetHeight - hero.querySelector('.hero-stage').clientHeight), behavior: 'instant' });
      }, progress);
      await page.waitForTimeout(300);
      const result = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        const property = name => Number(hero.style.getPropertyValue(name));
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          quote: property('--hero-quote-opacity'),
          complete: property('--tree-complete'),
          branches: [0, 1, 2, 3].map(i => property(`--branch-${i}`)),
          labels: [...hero.querySelectorAll('.mind-tree-label')].map(label => {
            const r = label.getBoundingClientRect();
            return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, opacity: Number(getComputedStyle(label).opacity) };
          }),
        };
      });
      assert.equal(result.overflow, 0);
      if (progress === 0) assert.equal(result.quote, 1);
      if (progress === 0.57) {
        assert(result.branches[0] > 0 && result.branches[1] === 0);
        if (forward) assert.deepEqual(result, forward);
        forward = result;
      }
      if (progress === 1) {
        assert.equal(result.complete, 1);
        for (const label of result.labels) {
          assert.equal(label.opacity, 1);
          assert(label.left >= 0 && label.right <= width && label.top >= 0 && label.bottom <= height);
        }
        // Inspect the rendered screenshot, including SVG masks and the raster asset.
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
