import assert from 'node:assert/strict';
import test from 'node:test';
import { branches, growthPoint, point } from '../src/components/treeGrowth.js';

const roots = branches.filter(item => item.isRoot);
const rootChildren = branches.filter(item => item.parent?.isRoot);

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
