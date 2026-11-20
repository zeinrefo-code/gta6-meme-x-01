// draw-meme.mjs — draws the GTA 6 meme for make.fun competition gta6-meme-x-01
// as a 1024x1024 PNG (meme.png), using Node 22 standard library only.
// No network, no downloaded images: every pixel is drawn in code.
//
// The joke: a skeleton has been waiting at his desk since GTA V (2013) for
// GTA 6, while the make.fun ghost floats in with a magenta coin — at least
// his AI agent earns money on make.fun while he waits.

import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const W = 1024;
const H = 1024;
const buf = Buffer.alloc(W * H * 4); // RGBA, opaque

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}

function px(x, y, c) {
  x |= 0; y |= 0;
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255;
}

function fillRect(x0, y0, x1, y1, c) {
  for (let y = Math.max(0, y0 | 0); y <= Math.min(H - 1, y1 | 0); y++)
    for (let x = Math.max(0, x0 | 0); x <= Math.min(W - 1, x1 | 0); x++) px(x, y, c);
}

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t) | 0, lerp(c1[1], c2[1], t) | 0, lerp(c1[2], c2[2], t) | 0, 255];
}

// ---- PNG encoder (stdlib only) ----
function crc32(b) {
  let table = crc32.t;
  if (!table) {
    table = crc32.t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = table[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

function savePng(path) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(H * (1 + W * 4));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 4)] = 0;
    buf.copy(raw, y * (1 + W * 4) + 1, y * W * 4, (y + 1) * W * 4);
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  return png.length;
}

// ---- 5x7 bitmap font (glyphs as 7 rows of 5) ----
const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '##..#', '#.#.#', '#..##', '#..##', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#..##', '#.#.#', '##..#', '#...#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '...#.', '..#..', '..#..', '..#..'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '.##..', '.#...'],
  '!': ['..#..', '..#..', '..#..', '..#..', '..#..', '.....', '..#..'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
  "'": ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '-': ['.....', '.....', '.....', '.###.', '.....', '.....', '.....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '(': ['...##', '..#..', '.#...', '.#...', '.#...', '..#..', '...##'],
  ')': ['##...', '..#..', '...#.', '...#.', '...#.', '..#..', '##...'],
  $: ['..#..', '.####', '#.#..', '.###.', '..#.#', '####.', '..#..'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '=': ['.....', '.....', '#####', '.....', '#####', '.....', '.....'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '#.##.', '#..##'],
  a: ['.....', '.....', '.###.', '....#', '.####', '#...#', '.###.'],
  e: ['.....', '.....', '.###.', '#...#', '#####', '#....', '.###.'],
  f: ['..##.', '.#...', '.#...', '####.', '.#...', '.#...', '.#...'],
  k: ['.....', '.....', '#..#.', '#.#..', '##...', '#.#..', '#..#.'],
  m: ['.....', '.....', '##.#.', '#.#.#', '#.#.#', '#.#.#', '#.#.#'],
  n: ['.....', '.....', '.##..', '#..#.', '#..#.', '#..#.', '#..#.'],
  u: ['.....', '.....', '#...#', '#...#', '#...#', '#..##', '.##.#'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

function textWidth(str, scale) {
  return str.length * 6 * scale - scale;
}

// Draw text centred on cx, top edge at y, with a thick outline for legibility.
function drawText(str, cx, y, scale, color, outline) {
  const w = textWidth(str, scale);
  let x = Math.round(cx - w / 2);
  const off = Math.max(2, Math.round(scale / 3));
  const draw = (col, dx, dy) => {
    let gx = x + dx;
    for (const ch of str) {
      const g = FONT[ch] || FONT[' '];
      for (let r = 0; r < 7; r++)
        for (let c = 0; c < 5; c++)
          if (g[r][c] === '#') fillRect(gx + dx + c * scale, y + dy + r * scale, gx + dx + (c + 1) * scale - 1, y + dy + (r + 1) * scale - 1, col);
      gx += 6 * scale;
    }
  };
  draw(outline, -off, 0); draw(outline, off, 0); draw(outline, 0, -off); draw(outline, 0, off);
  draw(color, 0, 0);
}

// ---- shapes ----
function fillCircle(cx, cy, r, c) {
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++)
      if (x * x + y * y <= r * r) px(cx + x, cy + y, c);
}

function fillEllipse(cx, cy, rx, ry, c) {
  for (let y = -ry; y <= ry; y++)
    for (let x = -rx; x <= rx; x++)
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) px(cx + x, cy + y, c);
}

// Thick line: stamp circles along the segment.
function thickLine(x0, y0, x1, y1, w, c) {
  const dx = x1 - x0, dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    fillCircle(Math.round(x0 + dx * t), Math.round(y0 + dy * t), Math.max(1, Math.round(w / 2)), c);
  }
}

// Filled polygon, scanline even-odd.
function fillPoly(pts, c) {
  let minY = Infinity, maxY = -Infinity;
  for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
      if ((y0 <= y && y1 > y) || (y1 <= y && y0 > y)) {
        xs.push(x0 + (y - y0) * (x1 - x0) / (y1 - y0));
      }
    }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2)
      for (let x = Math.ceil(xs[k]); x <= Math.floor(xs[k + 1]); x++) px(x, y, c);
  }
}

// Four-pointed sparkle (the ghost's eyes).
function sparkle(cx, cy, R, r, c) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const ang = (Math.PI / 4) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
  }
  fillPoly(pts, c);
}

// Five-pointed star (the coin's star).
function star5(cx, cy, R, r, c) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? R : r;
    pts.push([cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)]);
  }
  fillPoly(pts, c);
}

// ---- palette ----
const INK = hex('#14081f');      // near-black purple
const BONE = hex('#f7f3e8');     // skeleton white
const WHITE = hex('#ffffff');
const MAGENTA = hex('#ff2e88');  // make.fun coin magenta
const GOLD = hex('#ffe9a8');     // sunset sun
const DESK = hex('#8a5a2b');
const DESK_DARK = hex('#6b4420');

// ---- scene: Vice City sunset ----
// Sky gradient: deep purple -> magenta -> orange, down to the horizon.
const SKY_TOP = hex('#2b0f54'), SKY_MID = hex('#a4137e'), SKY_LOW = hex('#ff7a3d');
for (let y = 0; y < 720; y++) {
  const t = y / 720;
  const c = t < 0.5 ? lerpColor(SKY_TOP, SKY_MID, t * 2) : lerpColor(SKY_MID, SKY_LOW, (t - 0.5) * 2);
  for (let x = 0; x < W; x++) px(x, y, c);
}
// A few early stars high in the sky.
const STAR_SEED = [[90, 60], [180, 34], [420, 80], [520, 40], [950, 90], [880, 40], [640, 55], [300, 110]];
for (const [sx, sy] of STAR_SEED) { fillCircle(sx, sy, 2, WHITE); fillCircle(sx, sy, 1, WHITE); }

// The sun, low over Vice City.
fillCircle(760, 300, 118, hex('#ffcf5e'));
fillCircle(760, 300, 96, GOLD);
fillCircle(760, 300, 70, hex('#fff3c4'));

// Skyline silhouette.
const SIL = hex('#1d0b33');
const buildings = [[0, 640, 90, 760], [90, 600, 170, 760], [170, 660, 260, 760], [520, 620, 600, 760], [600, 665, 690, 760], [900, 610, 980, 760], [980, 660, 1024, 760]];
for (const [x0, y0, x1, y1] of buildings) fillRect(x0, y0, x1, y1, SIL);
// Lit windows.
const WIN = hex('#ffd76a');
for (const [bx, by, bw] of [[100, 620, 60], [530, 640, 60], [910, 630, 60], [20, 660, 60]]) {
  for (let wy = by; wy < by + 100; wy += 26)
    for (let wx = bx; wx < bx + bw; wx += 22)
      if ((wx * 7 + wy * 13) % 3 !== 0) fillRect(wx, wy, wx + 7, wy + 10, WIN);
}

// Ground.
fillRect(0, 760, 1023, 1023, hex('#17102a'));
fillRect(0, 760, 1023, 772, hex('#241640'));

// Palm trees framing the scene.
function palm(bx, lean) {
  const topX = bx + lean, topY = 470;
  thickLine(bx, 770, topX, topY + 40, 16, SIL);
  // Fronds: each bends out from the crown, then droops down at the tip.
  for (const [dx, dy] of [[-95, -25], [-70, -55], [-25, -70], [25, -70], [70, -55], [95, -25]]) {
    const mx = topX + dx * 0.55, my = topY + 30 + dy * 0.55;
    const ex = topX + dx, ey = topY + 30 + dy + 58;
    thickLine(topX, topY + 30, mx, my, 8, SIL);
    thickLine(mx, my, ex, ey, 6, SIL);
  }
  fillCircle(topX, topY + 28, 14, SIL);
}
palm(66, 26);
palm(958, -26);

// ---- the waiter: a skeleton at his desk, waiting since 2013 ----
// Chair back (dark, behind the bones).
fillRect(272, 560, 408, 760, hex('#241640'));

// Desk.
fillRect(170, 640, 540, 668, DESK);
fillRect(170, 640, 540, 650, hex('#a06a35'));
fillRect(190, 668, 206, 760, DESK_DARK);
fillRect(504, 668, 520, 760, DESK_DARK);

// Ribcage torso above the desk.
fillEllipse(342, 592, 46, 58, BONE);
for (const ry of [566, 582, 598, 614]) thickLine(302, ry, 382, ry, 5, INK);
// Spine.
thickLine(342, 540, 342, 640, 8, BONE);

// Skull, resting its cheek on its hand after 13 years.
fillCircle(336, 472, 60, INK);            // thick black outline
fillCircle(336, 472, 54, BONE);
fillEllipse(314, 462, 15, 19, INK);       // eye sockets
fillEllipse(360, 462, 15, 19, INK);
fillPoly([[336, 484], [328, 498], [344, 498]], INK); // nose
// Jaw with teeth.
fillRect(306, 512, 366, 540, INK);
fillRect(309, 512, 363, 537, BONE);
for (const tx of [322, 334, 346, 356]) thickLine(tx, 514, tx, 536, 2, INK);
thickLine(309, 526, 363, 526, 2, INK);
// Cracks of old age on the skull.
thickLine(300, 428, 312, 444, 3, INK);
thickLine(312, 444, 306, 456, 3, INK);

// Left arm: elbow on the desk, hand holding the skull up.
thickLine(306, 566, 258, 640, 12, BONE);
thickLine(258, 640, 292, 528, 12, BONE);
fillCircle(294, 524, 15, INK);
fillCircle(294, 524, 11, BONE);
// Right arm: resting flat on the desk.
thickLine(380, 566, 452, 632, 12, BONE);
fillCircle(456, 632, 12, INK);
fillCircle(456, 632, 9, BONE);

// Calendar on the desk, still open on 2013 — with a big red X.
fillRect(418, 568, 532, 640, INK);
fillRect(421, 571, 529, 637, WHITE);
fillRect(421, 571, 529, 594, hex('#d21f3c'));
drawText('2013', 475, 600, 4, INK, WHITE);
const RED = hex('#d21f3c');
thickLine(426, 576, 524, 632, 5, RED);
thickLine(524, 576, 426, 632, 5, RED);

// Cobweb in the desk corner: he has been here a while.
const WEB = hex('#cfc8e8');
for (let i = 1; i <= 3; i++) {
  const r = i * 12;
  for (let a = 0; a <= 20; a++) {
    const t = (a / 20) * Math.PI / 2;
    px(Math.round(540 - r * Math.cos(t)), Math.round(640 - r * Math.sin(t)), WEB);
  }
}
thickLine(540, 640, 540, 604, 2, WEB);
thickLine(540, 640, 504, 640, 2, WEB);
thickLine(540, 640, 514, 614, 2, WEB);

// ---- the make.fun ghost: white, thick black outline, sparkle eyes,
//      a round little hand holding a magenta coin with a white star ----
const GX = 780; // ghost centre x
const GY = 300; // ghost top y
// Shadow on the ground: it floats.
fillEllipse(GX, 700, 110, 16, hex('#0e0618'));
// Body silhouette: black outline shape drawn slightly larger behind.
function ghostBody(cx, cy, w, h, c) {
  // Rounded top, straight sides, wavy three-scallop bottom.
  fillEllipse(cx, cy + w / 2, w / 2, w / 2, c);
  fillRect(cx - w / 2, cy + w / 2, cx + w / 2, cy + h - 26, c);
  for (let i = 0; i < 3; i++) {
    const sx = cx - w / 2 + (i + 0.5) * (w / 3);
    fillCircle(sx, cy + h - 26, w / 6, c);
  }
}
ghostBody(GX, GY, 250, 300, INK);
ghostBody(GX, GY, 236, 288, WHITE);
// Sparkle eyes.
sparkle(GX - 48, GY + 130, 30, 9, INK);
sparkle(GX + 48, GY + 130, 30, 9, INK);
// Little smile, drawn as a thick arc.
let prevSx = null, prevSy = null;
for (let a = 0; a <= 16; a++) {
  const t = (a / 16) * Math.PI;
  const sx = Math.round(GX + 34 * Math.cos(t)), sy = Math.round(GY + 182 + 16 * Math.sin(t));
  if (prevSx !== null) thickLine(prevSx, prevSy, sx, sy, 4, INK);
  prevSx = sx; prevSy = sy;
}
// Magenta coin with a white star, held in the round little hand:
// the coin is drawn first, the hand overlaps its edge, so it reads as held.
fillCircle(GX - 172, GY + 200, 58, INK);
fillCircle(GX - 172, GY + 200, 52, MAGENTA);
fillCircle(GX - 172, GY + 200, 44, hex('#ff5da2'));
star5(GX - 172, GY + 200, 34, 14, WHITE);
// Round little hand, reaching out to the left, gripping the coin's edge.
fillCircle(GX - 118, GY + 206, 26, INK);
fillCircle(GX - 118, GY + 206, 20, WHITE);

// ---- captions: BIG, so they still read at 480x480 ----
const OUT = INK;
drawText('WAITING FOR GTA 6', 512, 28, 9, WHITE, OUT);
drawText('SINCE 2013...', 512, 118, 9, GOLD, OUT);
drawText('MY AI AGENT EARNS', 512, 800, 8, WHITE, OUT);
drawText('ON make.fun', 512, 878, 8, MAGENTA, OUT);

// ---- write it out ----
const bytes = savePng('meme.png');
console.log(`meme.png written: 1024x1024, ${bytes} bytes`);
