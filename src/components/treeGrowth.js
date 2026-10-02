export const clamp = value => Math.max(0, Math.min(1, value));
export const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function point(curve, t) {
  const s = 1 - t;
  return [0, 1].map(axis => s ** 3 * curve[0][axis] + 3 * s * s * t * curve[1][axis] + 3 * s * t * t * curve[2][axis] + t ** 3 * curve[3][axis]);
}
const branches = [];
function branch(curve, width, start, duration, color, leaf = false, parent = null, at = 0) {
  const item = { curve, width, start, duration, color, leaf, parent, at, endWidth: width * (width > 20 ? 0.45 : 0.12), points: Array.from({ length: 65 }, (_, i) => point(curve, i / 64)) };
  item.length = item.points.slice(1).reduce((total, p, i) => total + Math.hypot(p[0] - item.points[i][0], p[1] - item.points[i][1]), 0);
  branches.push(item);
  return item;
}
const trunk = branch([[400, 760], [337, 641], [459, 565], [400, 432]], 32, 0.04, 0.40, '#77a69e');
export const disciplines = [
  { name: 'Ciencia', color: '#91dfce', start: 0.66, side: 'left', top: '1%' },
  { name: 'Tecnología', color: '#a4afff', start: 0.67, side: 'right', top: '1%' },
  { name: 'Arte', color: '#e3a5ce', start: 0.57, side: 'left', top: '55%' },
  { name: 'Humanidades', color: '#e7ce99', start: 0.60, side: 'right', top: '55%' },
];
const colors = disciplines.map(item => item.color);
const crown = [
  branch([point(trunk.curve, 1), [400, 394], [226, 377], [239, 216]], 18, 0.44, 0.22, colors[0], false, trunk, 1),
  branch([point(trunk.curve, 1), [400, 394], [593, 364], [574, 208]], 18, 0.44, 0.23, colors[1], false, trunk, 1),
  branch([point(trunk.curve, 0.68), [298, 402], [183, 535], [113, 399]], 15, 0.34, 0.23, colors[2], false, trunk, 0.68),
  branch([point(trunk.curve, 0.78), [486, 383], [622, 530], [689, 389]], 15, 0.37, 0.23, colors[3], false, trunk, 0.78),
];
crown.forEach((item, index) => { item.discipline = disciplines[index]; });
// Children start only after their parent tip reaches the attachment point.
function twig(parent, at, end, bend, width, leaf = true) {
  const origin = point(parent.curve, at);
  const before = point(parent.curve, Math.max(0, at - 0.015));
  const direction = [origin[0] - before[0], origin[1] - before[1]];
  const length = Math.hypot(...direction) || 1;
  const reach = Math.min(20, Math.hypot(end[0] - origin[0], end[1] - origin[1]) * 0.22);
  const control = [origin[0] + direction[0] / length * reach, origin[1] + direction[1] / length * reach];
  const item = branch([origin, control, [end[0] - bend * 0.3, end[1] + 35], end], width, parent.start + parent.duration * at, 0.19, parent.color, leaf, parent, at);
  item.discipline = parent.discipline;
  return item;
}
const ends = [
  [[91, 287], [129, 152], [221, 95], [331, 112], [367, 238]],
  [[709, 286], [679, 150], [583, 90], [472, 108], [437, 229]],
  [[82, 497], [67, 353], [163, 316], [240, 462], [272, 543]],
  [[717, 490], [732, 348], [634, 308], [565, 460], [526, 542]],
];
crown.forEach((parent, group) => {
  ends[group].forEach((end, index) => {
    const limb = twig(parent, [0.48, 0.75, 1, 0.9, 0.38][index], end, (end[0] < 400 ? -1 : 1) * 38, 6.5);
    for (let i = 0; i < 3; i++) {
      const at = 0.45 + i * 0.20;
      const origin = point(limb.curve, at);
      const sign = (i + index) % 2 ? 1 : -1;
      twig(limb, at, [origin[0] + sign * (25 + i * 6), origin[1] - 29 - i * 6], sign * 15, 2.4);
    }
  });
});
for (let i = 0; i < 7; i++) {
  const x = 96 + i * 102;
  const origin = point(trunk.curve, 0.035);
  const offset = (i - 3) * 3;
  const distance = Math.abs(i - 3);
  const start = distance === 0 ? 0.07 : 0.16 + distance * 0.028;
  const duration = distance === 0 ? 0.31 : 0.24;
  const root = branch([[origin[0] + offset, origin[1] - offset * 0.4], [390 + (i - 3) * 23, 817], [x + (400 - x) * 0.28, 836], [x, 910 + (i % 3) * 20]], 12 - distance, start, duration, '#819db2');
  root.isRoot = true;
  root.primaryRoot = distance === 0;
  if (root.primaryRoot) continue;
  for (let j = 0; j < 2; j++) {
    const at = 0.58 + j * 0.2, p = point(root.curve, at);
    const previous = point(root.curve, at - 0.02);
    const direction = [p[0] - previous[0], p[1] - previous[1]];
    const length = Math.hypot(...direction);
    const control = [p[0] + direction[0] / length * 12, p[1] + direction[1] / length * 12];
    const side = j ? 1 : -1;
    // Fine roots emerge from established roots, following the parent's direction.
    const childStart = Math.max(0.34 / 0.88, root.start + (at + 0.12) * root.duration);
    branch([p, control, [p[0] + side * 24, p[1] + 26], [p[0] + side * 34, p[1] + 44]], 2.4, childStart, 0.16, '#96b7af', false, root, at);
  }
}
branches.forEach(item => {
  if (item.parent && item.at === 1) {
    item.parent.endWidth = Math.max(item.parent.endWidth, item.width);
    item.parent.continues = true;
  }
});
branches.forEach(item => {
  if (item.parent) {
    const parentWidth = item.parent.width * (1 - item.at) + item.parent.endWidth * item.at;
    item.width = Math.min(item.width, parentWidth * 0.9);
    item.endWidth = Math.min(item.endWidth, item.width * 0.8);
  }
  item.start *= 0.88; item.duration *= 0.88;
});
export { branches };

export function branchGrowth(item, progress) {
  const growth = clamp((progress - item.start) / item.duration);
  return item.curve === trunk.curve ? growth + 0.12 * (1 - ease(growth / 0.20)) : growth;
}

export function growthPoint(item, t, progress) {
  const p = point(item.curve, t);
  const settled = ease((progress - 0.11) / 0.07);
  if (item.curve === trunk.curve) {
    const young = ease((progress - 0.025) / 0.055) * (1 - ease((progress - 0.10) / 0.08));
    const bend = Math.sin(Math.PI * clamp(t / branchGrowth(item, progress))) ** 2;
    p[0] = 400 + (p[0] - 400) * settled - 5 * bend * young;
  }
  if (item.isRoot) {
    const weight = (1 - ease((progress - 0.20) / 0.10)) * (1 - t) ** 3;
    p[0] += (400 - item.curve[0][0]) * weight;
    p[1] += (760 - item.curve[0][1]) * weight;
    if (item.primaryRoot) {
      // Match the stem tangent at the base, then curl the young root outward.
      const bend = ((30 + 90 * settled) * t - 500 * t ** 2) * (1 - t) ** 2;
      p[0] += bend * (1 - ease((progress - 0.18) / 0.12));
    }
  }
  if (item.parent?.isRoot && progress < 0.30) {
    const origin = growthPoint(item.parent, item.at, progress);
    const resting = point(item.parent.curve, item.at);
    p[0] += origin[0] - resting[0]; p[1] += origin[1] - resting[1];
  }
  return p;
}

function branchShape(item, growth, progress) {
  if (growth <= 0) return null;
  const seed = item.curve === trunk.curve ? seedBlend(progress) : 0;
  const count = Math.floor(growth * 64);
  const settling = (progress < 0.30 && (item.isRoot || item.parent?.isRoot)) || (progress < 0.18 && item.curve === trunk.curve);
  const seedSamples = seed > 0 ? Array.from({ length: 33 }, (_, i) => growth * i / 32) : null;
  const points = seedSamples
    ? seedSamples.map(t => growthPoint(item, t, progress))
    : settling
      ? item.points.slice(0, count + 1).map((_, i) => growthPoint(item, i / 64, progress))
      : item.points.slice(0, count + 1);
  if (!seedSamples && count < 64 && growth > count / 64) points.push(growthPoint(item, growth, progress));
  if (points.length < 2) return null;
  const sides = [[], []];
  const lightSides = [[], []];
  const germinating = item.isRoot || item.curve === trunk.curve;
  const maturity = germinating ? ease((progress - 0.14) / 0.14) : 1;
  const widthScale = germinating ? 0.30 + maturity * 0.70 : 1;
  // Keep the entire young shoot visible before it thickens into the trunk.
  const rootWidth = item.primaryRoot ? 3.6 : 1.8;
  const youngWidth = (item.isRoot ? rootWidth : 7.2) * ease(growth * item.length / 8);
  const youngDiameter = t => youngWidth * (1 - 0.85 * t / growth);
  const restingTip = item.width > 10 ? 0 : 0.06;
  const tipFloor = restingTip + (1 - restingTip) * (1 - maturity) * (item.isRoot ? 0.12 : 0.24);
  const tipLength = item.width > 10 ? Math.min(0.35, item.width * 3 / item.length) : 1 / 16;
  const crownWidth = item.curve === trunk.curve && growth === 1
    ? Math.max(item.endWidth * tipFloor, ...crown.slice(0, 2).map(child => {
      const amount = clamp((progress - child.start) / child.duration);
      const childTipLength = Math.min(0.35, child.width * 3 / child.length);
      return child.width * Math.min(1, amount * 4) * Math.sin(clamp(amount / childTipLength) * Math.PI / 2);
    }))
    : 0;
  points.forEach((p, i) => {
    const t = seedSamples ? seedSamples[i] : i === points.length - 1 ? growth : i / 64;
    let a = growthPoint(item, Math.max(0, t - 0.001), progress);
    let b = growthPoint(item, Math.min(1, t + 0.001), progress);
    const crownBase = item.parent === trunk && item.at === 1;
    if ((crownBase && i === 0) || (item.curve === trunk.curve && i === points.length - 1 && growth === 1)) {
      a = trunk.curve[2]; b = trunk.curve[3];
    }
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const tip = tipFloor + (1 - tipFloor) * Math.sin(clamp((growth - t) / tipLength) * Math.PI / 2);
    const joined = item.continues && item.curve !== trunk.curve ? ease((progress - item.start - item.duration) / 0.07) : 0;
    const taper = tip + (1 - tip) * joined;
    const neck = item.curve === trunk.curve
      ? 1 - 0.6 * (1 - ease((progress - 0.18) / 0.10)) * (1 - ease(t / 0.10))
      : 1;
    const matureDiameter = (item.width * (1 - t) + item.endWidth * t) * Math.min(1, growth * 4) * taper * widthScale * neck;
    const stemDiameter = youngDiameter(t) * (1 - maturity) + matureDiameter * maturity;
    // The seed and shoot share one outline, so the seed never fades into a gap.
    const seedDiameter = seed > 0 ? 32 * Math.sin(Math.PI * clamp(t / growth)) ** 0.8 : 0;
    const diameter = seedDiameter * seed + stemDiameter * (1 - seed);
    // Grow the fork into the existing tip without narrowing the completed stem.
    const width = (diameter + crownWidth * (1 - tip)) / 2;
    sides[0].push([p[0] - (b[1] - a[1]) / length * width, p[1] + (b[0] - a[0]) / length * width]);
    sides[1].push([p[0] + (b[1] - a[1]) / length * width, p[1] - (b[0] - a[0]) / length * width]);
    if (item.discipline) {
      const inset = width * 0.32;
      lightSides[0].push([p[0] - (b[1] - a[1]) / length * inset, p[1] + (b[0] - a[0]) / length * inset]);
      lightSides[1].push([p[0] + (b[1] - a[1]) / length * inset, p[1] - (b[0] - a[0]) / length * inset]);
    }
  });
  const shape = new Path2D();
  [...sides[0], ...[...sides[1]].reverse()].forEach((p, i) => i ? shape.lineTo(...p) : shape.moveTo(...p));
  shape.closePath();
  const caps = new Path2D();
  const radius = (youngDiameter(0) * (1 - maturity) + item.width * Math.min(1, growth * 4) * Math.min(1, growth * 16 + 0.06) * widthScale * maturity) / 2;
  if (item.curve !== trunk.curve && !(item.parent === trunk && item.at === 1)) {
    const joint = new Path2D();
    joint.arc(...points[0], radius, 0, Math.PI * 2, true);
    caps.addPath(joint);
  }
  if (item.width > 10 || germinating) {
    const tipPoint = points.at(-1);
    const tipT = count < 64 ? growth : 1;
    const joined = item.continues ? ease((progress - item.start - item.duration) / 0.07) : 0;
    const tipRadius = (youngDiameter(tipT) * (1 - maturity) + (item.width * (1 - tipT) + item.endWidth * tipT) * Math.min(1, growth * 4) * tipFloor * (count < 64 ? 1 : 1 - joined) * widthScale * maturity) * (1 - seed) / 2;
    if (tipRadius > 0.2) {
      const tipCap = new Path2D();
      tipCap.arc(...tipPoint, tipRadius, 0, Math.PI * 2, true);
      caps.addPath(tipCap);
    }
  }
  const illumination = new Path2D();
  if (item.discipline) {
    [...lightSides[0], ...lightSides[1].reverse()].forEach((p, i) => i ? illumination.lineTo(...p) : illumination.moveTo(...p));
    illumination.closePath();
  }
  shape.addPath(caps);
  return { shape, caps, sides, illumination, points, item, widthScale };
}

function smoothForkContour(shapes) {
  const stem = shapes.find(({ item }) => item.curve === trunk.curve);
  const limb = shapes.find(({ item }) => item.curve === crown[0].curve);
  const sibling = shapes.find(({ item }) => item.curve === crown[1].curve);
  if (!stem || !limb || !sibling || limb.sides[1].length < 3 || sibling.sides[1].length < 3) return;
  const a = stem.sides[1].at(-3), joint = stem.sides[1].at(-1), b = limb.sides[1][2];
  if (Math.hypot(joint[0] - limb.sides[1][0][0], joint[1] - limb.sides[1][0][1]) > 0.01) return;
  const midpoint = (p, q) => p.map((value, axis) => (value + q[axis]) / 2);
  const leftControl = midpoint(a, joint), rightControl = midpoint(joint, b);
  const seam = midpoint(leftControl, rightControl);
  // Split one quadratic curve across both outlines so the join has a shared tangent.
  for (const part of [stem, limb, sibling]) {
    const shape = new Path2D();
    part.sides[0].forEach((p, i) => i ? shape.lineTo(...p) : shape.moveTo(...p));
    if (part === stem) {
      shape.lineTo(...seam);
      shape.quadraticCurveTo(...leftControl, ...a);
      for (let i = part.sides[1].length - 4; i >= 0; i--) shape.lineTo(...part.sides[1][i]);
    } else {
      for (let i = part.sides[1].length - 1; i >= 2; i--) shape.lineTo(...part.sides[1][i]);
      if (part === sibling) shape.lineTo(...b);
      shape.quadraticCurveTo(...rightControl, ...seam);
    }
    shape.closePath(); shape.addPath(part.caps); part.shape = shape;
  }
}
function drawLeaf(ctx, item, progress) {
  if (!item.leaf) return;
  const growth = ease((progress - item.start - item.duration) / 0.088);
  if (!growth) return;
  const tip = item.curve[3], previous = item.curve[2];
  const size = item.width > 3 ? 28 : 20;
  ctx.save(); ctx.translate(...tip);
  ctx.rotate(Math.atan2(tip[1] - previous[1], tip[0] - previous[0]) + Math.PI / 2);
  ctx.scale(growth * (0.35 + growth * 0.65), growth);
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-size * 0.65, -size * 0.38, -size * 0.45, -size, 0, -size * 1.4);
  ctx.bezierCurveTo(size * 0.55, -size, size * 0.62, -size * 0.38, 0, 0);
  ctx.fillStyle = '#497f79'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size * 1.4);
  ctx.bezierCurveTo(size * 0.55, -size, size * 0.62, -size * 0.38, 0, 0);
  ctx.fillStyle = '#78aa98'; ctx.fill();
  ctx.strokeStyle = '#9fc7bd'; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -size * 1.3);
  for (let i = 1; i < 4; i++) { const y = -size * i * 0.27; ctx.moveTo(0, y); ctx.lineTo(-size * 0.24, y - size * 0.2); ctx.moveTo(0, y); ctx.lineTo(size * 0.22, y - size * 0.2); }
  ctx.strokeStyle = '#a6c5b6'; ctx.lineWidth = 0.65; ctx.stroke(); ctx.restore();
}

export function seedBlend(progress) {
  return 1 - ease((progress - 0.02) / 0.09);
}

export function createTreeRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  ctx.save(); ctx.scale(canvas.width / 800, canvas.height / 1000);
  const bark = ctx.createLinearGradient(100, 800, 710, 180);
  bark.addColorStop(0, '#466d74'); bark.addColorStop(0.5, '#779e99'); bark.addColorStop(1, '#8c94b5');
  const items = branches.map(item => {
    const joinsTrunk = item.discipline && item.parent === trunk;
    const gradient = ctx.createLinearGradient(...item.curve[0], ...item.curve[3]);
    gradient.addColorStop(0, item.isRoot || joinsTrunk ? '#8daea600' : '#8daea6');
    if (joinsTrunk) gradient.addColorStop(0.1, '#8daea6');
    if (item.isRoot) gradient.addColorStop(0.2, '#8daea6');
    gradient.addColorStop(0.4, '#b1c6b7'); gradient.addColorStop(1, item.discipline ? '#8daea6' : item.color);
    let lightPaint = item.discipline?.color;
    if (joinsTrunk) {
      lightPaint = ctx.createLinearGradient(...item.curve[0], ...point(item.curve, 0.1));
      lightPaint.addColorStop(0, `${item.color}00`);
      lightPaint.addColorStop(1, item.color);
    }
    return { ...item, gradient, lightPaint };
  });
  ctx.restore();
  return progress => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.scale(canvas.width / 800, canvas.height / 1000);
    const shapes = items.map(item => branchShape(item, branchGrowth(item, progress), progress)).filter(Boolean);
    smoothForkContour(shapes);
    // One continuous surface prevents separate branch fills from cutting across junctions.
    const body = new Path2D();
    shapes.forEach(({ shape }) => body.addPath(shape));
    ctx.fillStyle = bark; ctx.fill(body);
    const seed = seedBlend(progress);
    if (seed > 0) {
      const stem = shapes.find(({ item }) => item.curve === trunk.curve);
      ctx.save(); ctx.clip(stem.shape); ctx.globalAlpha = seed;
      for (const side of [0, 1]) {
        ctx.beginPath();
        [...stem.sides[side], ...[...stem.points].reverse()].forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
        ctx.closePath(); ctx.fillStyle = side ? '#afbd99' : '#7e85ab'; ctx.fill();
      }
      ctx.restore();
    }
    ctx.save(); ctx.clip(body); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    shapes.forEach(({ illumination, points, item, widthScale }) => {
      if (item.discipline) {
        ctx.fillStyle = item.gradient; ctx.fill(illumination);
        return;
      }
      if (points.length < 5) return;
      ctx.beginPath();
      points.slice(2, -1).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
      ctx.strokeStyle = item.gradient;
      ctx.lineWidth = (item.width > 10 ? item.width * 0.24 : 0.55) * widthScale;
      ctx.globalAlpha = item.curve === trunk.curve || item.primaryRoot ? ease((progress - 0.09) / 0.09) : 1;
      ctx.stroke(); ctx.globalAlpha = 1;
    });
    shapes.forEach(({ illumination, item }) => {
      if (!item.discipline) return;
      const light = ease((progress - item.discipline.start * 0.88) / 0.10);
      if (!light) return;
      ctx.save();
      ctx.fillStyle = item.lightPaint;
      ctx.globalAlpha = light;
      ctx.fill(illumination); ctx.restore();
    });
    ctx.restore();
    items.forEach(item => drawLeaf(ctx, item, progress));
    ctx.restore();
  };
}
