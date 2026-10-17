// Character library built from the Kenney sprite packs (CC0, see sprites/):
// animal faces, shape-character bodies with faces, and scenery. Each sprite
// sits in an SVG with CSS-driven "alive" animations (breathing bob, happy hop,
// talking squash). See css/style.css for the keyframes.

const delay = () => (Math.random() * -5).toFixed(2);
const K = 'img/kenney';

export { ANIMALS, ANIMAL_KINDS, animal } from './animals.js';

// A Kenney face (face_a … face_l) centred at (cx, cy), `w` wide.
function face(cx, cy, w, f = 'a') {
  const h = w * 0.58;
  return `<g class="c-face"><image href="${K}/faces/face_${f}.png" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}"/></g>`;
}

/* ---------- Blox: shape-character buddies ---------- */
// c = main colour, d = darker shade (sampled from the Kenney bodies).
export const COLORS = {
  red:    { c: '#DE5A72', d: '#C23A4E' },
  blue:   { c: '#779CEA', d: '#5468D8' },
  yellow: { c: '#FDC249', d: '#E89A10' },
  green:  { c: '#6BC785', d: '#3E9A55' },
  purple: { c: '#9C68E7', d: '#6E44C2' },
  pink:   { c: '#FF8FD7', d: '#E6589E' },
};
export const COLOR_NAMES = Object.keys(COLORS);

// Tower block shapes. BLOX_STUD is head-room above the body that the
// tower game leaves for the block stacked on top (kept for its maths).
export const BLOX_SHAPES = {
  cube:  { w: 180, h: 170, body: 'squircle', eye: 1 },
  brick: { w: 300, h: 140, body: 'squircle', eye: 0.95 },
  tall:  { w: 130, h: 230, body: 'squircle', eye: 0.85 },
  round: { w: 180, h: 170, body: 'circle', eye: 1 },
};
export const BLOX_PAD = 10, BLOX_STUD = 26;
export function blox(color, cls = '', shape = 'cube') {
  const S = BLOX_SHAPES[shape];
  const { w, h } = S, x0 = BLOX_PAD, cx = x0 + w / 2;
  const fw = Math.min(w, h) * 0.62 * S.eye;
  return `<svg class="char blox ${cls}" data-shape="${shape}" viewBox="0 ${-BLOX_STUD} ${w + BLOX_PAD * 2} ${h + BLOX_STUD}" style="--d:${delay()}s"><g class="c-bob">
    <ellipse cx="${cx}" cy="${h - 2}" rx="${w / 2 - 6}" ry="7" fill="#000" opacity=".14"/>
    <image href="${K}/shapes/${color}_${S.body}.png" x="${x0}" y="0" width="${w}" height="${h}" preserveAspectRatio="none"/>
    ${face(cx, h * 0.5, fw)}
  </g></svg>`;
}

// Gold star coin that crowns a finished tower.
export function crown(cls = '') {
  return `<svg class="char crown ${cls}" viewBox="0 0 200 190" style="--d:${delay()}s"><g class="c-bob">
    <image href="${K}/scene/star-coin.png" x="10" y="0" width="180" height="183"/>
  </g></svg>`;
}

/* ---------- Foods ---------- */
// Only animals with a food they'd recognise play Feed Me.
export const FOOD_FOR = { bunny: 'carrot', monkey: 'banana', panda: 'bamboo', penguin: 'fish', pig: 'apple', parrot: 'corn' };
const FOODS = ['carrot', 'banana', 'bamboo', 'fish', 'apple', 'corn'];
export const FOOD_KINDS = FOODS;
export function food(kind, cls = '') {
  return `<img class="food ${cls}" data-food="${kind}" src="img/food/${kind}.webp" alt="" draggable="false">`;
}

/* ---------- Shapes with faces ---------- */
export const SHAPES = {
  circle:   { name: 'circle',   color: 'green',  body: 'circle' },
  triangle: { name: 'triangle', color: 'red',    body: 'triangle', face: [34, 70, 36] },
  square:   { name: 'square',   color: 'blue',   body: 'square' },
  diamond:  { name: 'diamond',  color: 'purple', body: 'rhombus' },
};
export const SHAPE_KINDS = Object.keys(SHAPES);
const shapeSrc = (kind) => `${K}/shapes/${SHAPES[kind].color}_${SHAPES[kind].body}.png`;
export function shape(kind, cls = '', withFace = true) {
  return `<svg class="char shape ${cls}" data-shape="${kind}" viewBox="0 0 100 100" style="--d:${delay()}s"><g class="c-bob">
    <image href="${shapeSrc(kind)}" x="4" y="4" width="92" height="92"/>${withFace ? face(...(SHAPES[kind].face || [50, 52, 46])) : ''}</g></svg>`;
}
// The matching hole: the same sprite as a dark, slightly larger silhouette.
export function hole(kind) {
  return `<svg class="hole" viewBox="0 0 100 100"><filter id="hole-${kind}"><feColorMatrix values="0 0 0 0 .24  0 0 0 0 .16  0 0 0 0 .12  0 0 0 .9 0"/></filter>
    <image href="${shapeSrc(kind)}" x="1" y="1" width="98" height="98" filter="url(#hole-${kind})"/></svg>`;
}

/* ---------- Scenery ---------- */
export function bush() {
  return `<svg class="bush" viewBox="0 0 200 140" preserveAspectRatio="none">
    <image href="${K}/scene/bush.png" x="0" y="0" width="200" height="140" preserveAspectRatio="none"/></svg>`;
}

// A sunny yellow shape buddy.
export function sun(cls = '') {
  return `<svg class="char sun ${cls}" viewBox="0 0 200 200" style="--d:${delay()}s"><g class="sun-rays">
    <image href="${K}/scene/star_07.png" x="-40" y="-40" width="280" height="280" opacity=".9"/></g>
    <image href="${K}/shapes/yellow_circle.png" x="40" y="40" width="120" height="120"/>${face(100, 104, 64)}</svg>`;
}
