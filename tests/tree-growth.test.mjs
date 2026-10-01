import assert from 'node:assert/strict';
import test from 'node:test';
import { attachmentAt, branches, clamp, growthPoint, point, seedOpacity } from '../src/components/treeGrowth.js';

const roots = branches.filter(item => item.isRoot);
const rootChildren = branches.filter(item => item.parent?.isRoot);

test('seed stays visible while opening, then fades and returns when scrolling back', () => {
  assert.equal(seedOpacity(0.04), 1);
  assert.equal(seedOpacity(0.095), 1);
  const middle = seedOpacity(0.1225);
  assert.ok(middle > 0 && middle < 1);
  assert.equal(seedOpacity(0.16), 0);
  assert.equal(seedOpacity(1), 0);
  assert.equal(seedOpacity(0.1225), middle);
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
      const b = growthPoint(child.parent, attachmentAt(child, progress), progress);
      assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.001);
    }
    assert.ok(child.start >= child.parent.start + child.parent.duration * (child.seedlingAt ?? child.at) - 1e-9);
  }
});

test('young primary root curves away from the center and branches behind its growing tip', () => {
  const root = roots.find(item => item.primaryRoot);
  assert.ok(growthPoint(root, 0.25, 0.14)[0] < 390);
  const child = rootChildren.find(item => item.seedlingAt != null);
  assert.ok(child.start < 0.14);
  for (let progress = child.start; progress <= 0.30; progress += 0.001) {
    const parentGrowth = clamp((progress - root.start) / root.duration);
    assert.ok(attachmentAt(child, progress) <= parentGrowth + 1e-9);
  }
});

test('young root continues the stem direction without an angular elbow', () => {
  const root = roots.find(item => item.primaryRoot), stem = branches[0];
  for (const progress of [0.12, 0.14, 0.16, 0.18]) {
    const a = growthPoint(stem, 0, progress), b = growthPoint(stem, 0.0001, progress);
    const c = growthPoint(root, 0, progress), d = growthPoint(root, 0.0001, progress);
    const up = [b[0] - a[0], b[1] - a[1]], down = [d[0] - c[0], d[1] - c[1]];
    const alignment = (up[0] * down[0] + up[1] * down[1]) / (Math.hypot(...up) * Math.hypot(...down));
    assert.ok(alignment < -0.99);
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
