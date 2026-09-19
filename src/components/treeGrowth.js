export const clamp = value => Math.max(0, Math.min(1, value));
export const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function point(curve, t) {
  const s = 1 - t;
  return [0, 1].map(axis => s ** 3 * curve[0][axis] + 3 * s * s * t * curve[1][axis] + 3 * s * t * t * curve[2][axis] + t ** 3 * curve[3][axis]);
}
const branches = [];
function branch(curve, width, start, duration, color, leaf = false, parent = null, at = 0) {
  const item = { curve, width, start, duration, color, leaf, parent, at, endWidth: width * (width > 20 ? 0.45 : 0.12), points: Array.from({ length: 65 }, (_, i) => point(curve, i / 64)) };
  branches.push(item);
  return item;
}
const trunk = branch([[400, 760], [337, 641], [459, 565], [400, 432]], 32, 0.09, 0.35, '#77a69e');
const colors = ['#91dfce', '#a4afff', '#e3a5ce', '#e7ce99'];
const crown = [
  branch([point(trunk.curve, 1), [348, 345], [196, 390], [239, 216]], 18, 0.44, 0.22, colors[0], false, trunk, 1),
  branch([point(trunk.curve, 1), [449, 342], [617, 368], [574, 208]], 18, 0.44, 0.23, colors[1], false, trunk, 1),
  branch([point(trunk.curve, 0.68), [298, 402], [183, 535], [113, 399]], 15, 0.34, 0.23, colors[2], false, trunk, 0.68),
  branch([point(trunk.curve, 0.78), [486, 383], [622, 530], [689, 389]], 15, 0.37, 0.23, colors[3], false, trunk, 0.78),
];
// Children start only after their parent tip reaches the attachment point.
function twig(parent, at, end, bend, width, leaf = true) {
  const origin = point(parent.curve, at);
  const before = point(parent.curve, Math.max(0, at - 0.015));
  const direction = [origin[0] - before[0], origin[1] - before[1]];
  const length = Math.hypot(...direction) || 1;
  const reach = Math.min(20, Math.hypot(end[0] - origin[0], end[1] - origin[1]) * 0.22);
  const control = [origin[0] + direction[0] / length * reach, origin[1] + direction[1] / length * reach];
  return branch([origin, control, [end[0] - bend * 0.3, end[1] + 35], end], width, parent.start + parent.duration * at, 0.19, parent.color, leaf, parent, at);
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
  const root = branch([[400, 760], [390 + (i - 3) * 23, 817], [x + (400 - x) * 0.28, 836], [x, 910 + (i % 3) * 20]], 12 - Math.abs(i - 3), 0.05 + Math.abs(i - 3) * 0.016, 0.28, '#819db2');
  for (let j = 0; j < 2; j++) {
    const at = 0.58 + j * 0.2, p = point(root.curve, at);
    branch([p, [p[0] + 14, p[1] + 22], [p[0] + (j ? 38 : -32), p[1] + 20], [p[0] + (j ? 45 : -38), p[1] + 55]], 3, root.start + at * root.duration, 0.16, '#96b7af', false, root, at);
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

function branchShape(item, growth) {
  if (growth <= 0) return null;
  const count = Math.floor(growth * 64);
  const points = item.points.slice(0, count + 1);
  if (count < 64) points.push(point(item.curve, growth));
  if (points.length < 2) return null;
  const sides = [[], []];
  points.forEach((p, i) => {
    const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const t = i === points.length - 1 ? growth : i / 64;
    const tip = Math.min(1, (growth - t) * 16 + 0.06);
    const taper = tip + (1 - tip) * (item.continues ? ease((growth - 0.9) / 0.1) : 0);
    const width = (item.width * (1 - t) + item.endWidth * t) * Math.min(1, growth * 4) * taper / 2;
    sides[0].push([p[0] - (b[1] - a[1]) / length * width, p[1] + (b[0] - a[0]) / length * width]);
    sides[1].push([p[0] + (b[1] - a[1]) / length * width, p[1] - (b[0] - a[0]) / length * width]);
  });
  const shape = new Path2D();
  [...sides[0], ...sides[1].reverse()].forEach((p, i) => i ? shape.lineTo(...p) : shape.moveTo(...p));
  shape.closePath();
  const radius = item.width * Math.min(1, growth * 4) * Math.min(1, growth * 16 + 0.06) / 2;
  const joint = new Path2D();
  joint.arc(...points[0], radius, 0, Math.PI * 2, true);
  shape.addPath(joint);
  return { shape, points, item };
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
export function createTreeRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  ctx.save(); ctx.scale(canvas.width / 800, canvas.height / 1000);
  const bark = ctx.createLinearGradient(100, 800, 710, 180);
  bark.addColorStop(0, '#466d74'); bark.addColorStop(0.5, '#779e99'); bark.addColorStop(1, '#8c94b5');
  const items = branches.map(item => {
    const gradient = ctx.createLinearGradient(...item.curve[0], ...item.curve[3]);
    gradient.addColorStop(0, '#8daea6'); gradient.addColorStop(0.4, '#b1c6b7'); gradient.addColorStop(1, item.color);
    return { ...item, gradient };
  });
  ctx.restore();
  return progress => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.scale(canvas.width / 800, canvas.height / 1000);
    const seedScale = 1 - ease((progress - 0.13) / 0.19);
    if (progress > 0 && seedScale > 0) {
      const opening = ease((progress - 0.04) / 0.14);
      for (const side of [-1, 1]) {
        ctx.save(); ctx.translate(400 + side * opening * 12 * seedScale, 760);
        ctx.rotate(side * (0.25 + opening * 0.45)); ctx.scale(seedScale * (1 - opening * 0.55), seedScale * (1 - opening * 0.35));
        ctx.beginPath(); ctx.moveTo(0, -23); ctx.bezierCurveTo(side * 28, -5, side * 19, 20, 0, 25); ctx.quadraticCurveTo(side * 4, 0, 0, -23);
        ctx.fillStyle = side < 0 ? '#afbd99' : '#7e85ab'; ctx.fill(); ctx.restore();
      }
    }
    const shapes = items.map(item => branchShape(item, clamp((progress - item.start) / item.duration))).filter(Boolean);
    // One continuous surface prevents separate branch fills from cutting across junctions.
    const body = new Path2D();
    shapes.forEach(({ shape }) => body.addPath(shape));
    ctx.fillStyle = bark; ctx.fill(body);
    ctx.save(); ctx.clip(body); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    shapes.forEach(({ points, item }) => {
      if (points.length < 5) return;
      ctx.beginPath();
      points.slice(2, -1).forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p));
      ctx.strokeStyle = item.gradient;
      ctx.lineWidth = item.width > 10 ? item.width * 0.24 : 0.55;
      ctx.stroke();
    });
    ctx.restore();
    items.forEach(item => drawLeaf(ctx, item, progress));
    ctx.restore();
  };
}
