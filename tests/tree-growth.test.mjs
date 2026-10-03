import assert from 'node:assert/strict';
import test from 'node:test';
import { branchGrowth, branches, clamp, growthPoint, point, seedState } from '../src/components/treeGrowth.js';

const roots = branches.filter(item => item.isRoot);
const rootChildren = branches.filter(item => item.parent?.isRoot);

test('the seed opens before fading, with the root emerging before the shoot', () => {
  const root = roots.find(item => item.primaryRoot), stem = branches[0];
  assert.equal(seedState(0.025).opening, 0);
  assert.equal(seedState(0.085).opening, 1);
  assert.equal(seedState(0.085).opacity, 1);
  assert.equal(seedState(0.15).opacity, 0);
  assert.ok(branchGrowth(root, 0.05) > 0);
  assert.equal(branchGrowth(stem, 0.05), 0);
  assert.ok(branchGrowth(stem, 0.08) > 0);
  let previous = seedState(0);
  let rootGrowth = 0;
  for (let step = 1; step <= 180; step++) {
    const progress = step / 1000, state = seedState(progress);
    assert.ok(state.opening >= previous.opening);
    assert.ok(state.opacity <= previous.opacity);
    assert.ok(Math.abs(state.opening - previous.opening) < 0.03);
    assert.ok(Math.abs(state.opacity - previous.opacity) < 0.03);
    assert.ok(branchGrowth(root, progress) >= rootGrowth);
    rootGrowth = branchGrowth(root, progress);
    previous = state;
  }
});

test('the shoot grows continuously upward and rejoins the established tree sequence', () => {
  const stem = branches[0];
  let previous = growthPoint(stem, branchGrowth(stem, 0), 0);
  for (let step = 1; step <= 180; step++) {
    const progress = step / 1000, growth = branchGrowth(stem, progress);
    const tip = growthPoint(stem, growth, progress);
    assert.ok(tip[1] <= previous[1]);
    assert.ok(previous[1] - tip[1] < 2);
    assert.deepEqual(growthPoint(stem, 0, progress), [400, 760]);
    previous = tip;
  }
  for (const progress of [0.15, 0.18, 0.3, 0.65, 1]) {
    for (const item of branches) {
      assert.equal(branchGrowth(item, progress), clamp((progress - item.start) / item.duration));
    }
  }
});

test('germination starts with one root at the seed, before the lateral roots', () => {
  for (const progress of [0.08, 0.10, 0.12, 0.14]) {
    const active = roots.filter(item => branchGrowth(item, progress) > 0);
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

test('primary root remains a continuous taper and fine roots wait for established lateral roots', () => {
  const root = roots.find(item => item.primaryRoot);
  assert.ok(growthPoint(root, 0.25, 0.14)[0] < 390);
  assert.ok(rootChildren.every(child => child.parent !== root));
  for (const child of rootChildren) {
    assert.ok(child.start >= 0.34);
    const parentGrowth = clamp((child.start - child.parent.start) / child.parent.duration);
    assert.ok(parentGrowth >= child.at + 0.1);
    const a = point(child.parent.curve, child.at - 0.02), b = point(child.parent.curve, child.at);
    const c = child.curve[1];
    const parentDirection = [b[0] - a[0], b[1] - a[1]], childDirection = [c[0] - b[0], c[1] - b[1]];
    const alignment = (parentDirection[0] * childDirection[0] + parentDirection[1] * childDirection[1]) / (Math.hypot(...parentDirection) * Math.hypot(...childDirection));
    assert.ok(alignment > 0.999);
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
