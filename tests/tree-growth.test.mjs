import assert from 'node:assert/strict';
import test from 'node:test';
import { branches, growthPoint, point, seedPose } from '../src/components/treeGrowth.js';

const roots = branches.filter(item => item.isRoot);
const rootChildren = branches.filter(item => item.parent?.isRoot);

test('seed halves open completely downward before fading away', () => {
  const closed = seedPose(0.04);
  assert.equal(closed.angle, 0);
  assert.equal(closed.spread, 0);
  assert.equal(closed.opacity, 1);
  const opened = seedPose(0.17);
  assert.ok(opened.angle > Math.PI / 2);
  assert.ok(opened.y - 40 * Math.cos(opened.angle) > opened.y);
  assert.equal(opened.opacity, 1);
  const falling = seedPose(0.20);
  assert.ok(falling.y > opened.y);
  assert.ok(falling.spread > opened.spread);
  assert.ok(falling.opacity > 0 && falling.opacity < 1);
  assert.equal(seedPose(0.24).opacity, 0);
});

test('seed opening and falling stay continuous and reversible with scroll', () => {
  const firstVisit = seedPose(0.12);
  let previous = seedPose(0);
  for (let step = 1; step <= 240; step++) {
    const next = seedPose(step / 1000);
    assert.ok(next.angle >= previous.angle && next.angle - previous.angle < 0.04);
    assert.ok(next.spread >= previous.spread && next.spread - previous.spread < 0.5);
    assert.ok(next.y >= previous.y && next.y - previous.y < 0.6);
    assert.ok(next.opacity <= previous.opacity && previous.opacity - next.opacity < 0.03);
    previous = next;
  }
  for (const progress of [1, 0.04, 0.20, 0.08]) seedPose(progress);
  assert.deepEqual(seedPose(0.12), firstVisit);
});

test('germination starts with one root at the seed, before the lateral roots', () => {
  for (const progress of [0.08, 0.10, 0.12, 0.14]) {
    const active = roots.filter(item => progress > item.start);
    assert.equal(active.length, 1);
    assert.deepEqual(growthPoint(active[0], 0, progress), [400, 760]);
  }
});

test('root branches stay attached while the roots settle into the trunk', () => {
  for (const child of rootChildren) {
    for (const progress of [child.start + 0.001, 0.20, 0.24, 0.28, 0.30]) {
      const a = growthPoint(child, 0, progress);
      const b = growthPoint(child.parent, child.at, progress);
      assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.001);
    }
    assert.ok(child.start >= child.parent.start + child.parent.duration * child.at - 1e-9);
  }
});

test('settled tree points retain their original curves', () => {
  for (const item of branches) {
    for (const progress of [0.30, 0.65, 1]) {
      for (const t of [0, 0.35, 0.65, 1]) {
        assert.deepEqual(growthPoint(item, t, progress), point(item.curve, t));
      }
    }
  }
});
