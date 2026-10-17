// Cartoon character library: every character is a hand-built SVG with
// CSS-driven "alive" animations (breathing bob, blinking, ear wiggle,
// talking mouth, happy hop). See css/style.css for the keyframes.

const OL = '#4A2E1F';
const st = (w = 4.5) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const delay = () => (Math.random() * -5).toFixed(2);

export { ANIMALS, ANIMAL_KINDS, animal } from './animals.js';
import { kit, mix, eyes as tEyes, mouth as tMouth } from './toon.js';

/* ---------- shared face parts ---------- */
function eyes(cy = 86, dx = 21, r = 1) {
  const e = (x) => `
    <ellipse cx="${x}" cy="${cy}" rx="${10 * r}" ry="${12.5 * r}" fill="#fff" ${st(3)}/>
    <ellipse class="c-pupil" cx="${x + 1.5}" cy="${cy + 2}" rx="${6 * r}" ry="${7.5 * r}" fill="#2B1B12"/>
    <circle cx="${x + 3.5}" cy="${cy - 2.5}" r="${2.8 * r}" fill="#fff"/>`;
  return `<g class="c-eyes">${e(100 - dx)}${e(100 + dx)}</g>`;
}
function cheeks(y = 106, dx = 34) {
  return `<ellipse cx="${100 - dx}" cy="${y}" rx="9" ry="6" fill="#FF8FA3" opacity=".65"/>
          <ellipse cx="${100 + dx}" cy="${y}" rx="9" ry="6" fill="#FF8FA3" opacity=".65"/>`;
}
function mouth(y = 112, w = 10, cx = 100) {
  return `<path class="c-smile" d="M${cx - w} ${y} Q${cx} ${y + w * 1.1} ${cx + w} ${y}" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
    <g class="c-open"><ellipse cx="${cx}" cy="${y + 4}" rx="${w * 0.9}" ry="${w}" fill="#9C2A3A" ${st(3.5)}/>
    <ellipse cx="${cx}" cy="${y + 9}" rx="${w * 0.55}" ry="${w * 0.38}" fill="#FF7A90"/></g>`;
}
/* ---------- Blox: block buddies ---------- */
export const COLORS = {
  red:    { c: '#FF5A5F', d: '#D63A40' },
  blue:   { c: '#3FA7F5', d: '#1C7ED6' },
  yellow: { c: '#FFD43B', d: '#F0A800' },
  green:  { c: '#51CF66', d: '#2F9E44' },
  orange: { c: '#FF922B', d: '#E8590C' },
  purple: { c: '#B57EDC', d: '#8B4FC2' },
  pink:   { c: '#FF8FC7', d: '#E64F9B' },
};
export const COLOR_NAMES = Object.keys(COLORS);

// Blox: glossy toy-brick buddies in the same soft 3D style as the animals.
// Shapes: cube, brick (long), tall (pillar), round (drum). Studs stick up
// above y=0 and tuck under whatever is stacked on top.
export const BLOX_SHAPES = {
  cube:  { w: 180, h: 170, studs: 2, eye: 1 },
  brick: { w: 300, h: 140, studs: 3, eye: 0.95 },
  tall:  { w: 130, h: 230, studs: 1, eye: 0.85 },
  round: { w: 180, h: 160, studs: 0, eye: 1 },
};
export const BLOX_PAD = 10, BLOX_STUD = 26;
export function blox(color, cls = '', shape = 'cube') {
  const k = COLORS[color] || { c: color, d: color };
  const S = BLOX_SHAPES[shape];
  const K = kit();
  const { w, h } = S, x0 = BLOX_PAD, cx = x0 + w / 2;
  const body = K.vol(k.c, { hi: 0.42, lo: -0.28, fx: 0.28, fy: 0.18, r: 0.95 });
  const side = K.lin([[0, mix(k.c, 0.25)], [1, mix(k.c, -0.25)]], 0, 0, 1, 0);
  const lip = K.lin([[0, mix(k.c, 0.45)], [1, k.c]]);
  let studs = '';
  for (let i = 0; i < S.studs; i++) {
    const sx = x0 + (w / S.studs) * (i + 0.5);
    studs += `<rect x="${sx - 22}" y="-18" width="44" height="26" rx="6" fill="${side}"/>
      <ellipse cx="${sx}" cy="-18" rx="22" ry="8" fill="${lip}"/>
      <ellipse cx="${sx - 7}" cy="-20" rx="8" ry="3" fill="#fff" opacity=".55"/>`;
  }
  const shell = S.studs === 0
    ? `<rect x="${x0}" y="10" width="${w}" height="${h - 10}" rx="34" fill="${body}"/>
       <ellipse cx="${cx}" cy="18" rx="${w / 2}" ry="18" fill="${lip}"/>
       <ellipse cx="${cx}" cy="18" rx="${w / 2 - 14}" ry="10" fill="${mix(k.c, 0.15)}" opacity=".8"/>`
    : `<rect x="${x0}" y="0" width="${w}" height="${h}" rx="28" fill="${body}"/>
       <rect x="${x0 + 4}" y="2" width="${w - 8}" height="20" rx="10" fill="${lip}" opacity=".9"/>`;
  const s = S.eye, faceY = h * 0.48;
  const dx = Math.min(38, w * 0.22) * s;
  return `<svg class="char blox ${cls}" data-shape="${shape}" viewBox="0 ${-BLOX_STUD} ${w + BLOX_PAD * 2} ${h + BLOX_STUD}" style="--d:${delay()}s"><defs>${K.defs.join('')}</defs><g class="c-bob">
    ${studs}${shell}
    ${K.glow(cx, h - 6, w / 2, 14, '#000', 0.22)}
    ${K.spec(x0 + w * 0.26, h * 0.24, w * 0.16, h * 0.09, 0.6, -15)}
    <g transform="translate(${cx - 100} 0)">
      ${tEyes(K, faceY, dx, { rx: 20 * s, ry: 22 * s, iris: '#4A2E1F', ir: 0.92 })}
      ${K.glow(100 - dx - 16 * s, faceY + 28 * s, 15 * s, 9 * s, '#FF5A7A', 0.5)}${K.glow(100 + dx + 16 * s, faceY + 28 * s, 15 * s, 9 * s, '#FF5A7A', 0.5)}
      ${tMouth(K, 100, faceY + 32 * s, 17 * s)}
    </g>
  </g></svg>`;
}

// Golden star that crowns a finished tower.
export function crown(cls = '') {
  const K = kit();
  const gold = K.vol('#FFD43B', { hi: 0.5, lo: -0.3 });
  let d = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 40 : 92, t = -Math.PI / 2 + (i * Math.PI) / 5;
    d += `${i ? 'L' : 'M'}${(100 + Math.cos(t) * r).toFixed(1)} ${(100 + Math.sin(t) * r).toFixed(1)} `;
  }
  return `<svg class="char crown ${cls}" viewBox="0 0 200 190" style="--d:${delay()}s"><defs>${K.defs.join('')}</defs><g class="c-bob">
    <path d="${d}Z" fill="${gold}" stroke="#E8A400" stroke-width="5" stroke-linejoin="round"/>
    ${K.spec(78, 70, 22, 12, 0.7, -20)}
    <g transform="translate(0 10)">${tEyes(K, 92, 18, { rx: 11, ry: 12.5, iris: '#4A2E1F' })}${tMouth(K, 100, 116, 10)}</g>
  </g></svg>`;
}

/* ---------- Foods ---------- */
export const FOOD_FOR = { bunny: 'carrot', dog: 'bone', monkey: 'banana', cat: 'fish', bear: 'honey', chick: 'corn', squirrel: 'acorn', panda: 'bamboo' };
// Soft 3D-rendered food art (generated with SpriteCook), one WebP per food.
const FOODS = ['carrot', 'bone', 'banana', 'fish', 'honey', 'corn', 'apple', 'acorn', 'bamboo'];
export const FOOD_KINDS = FOODS;
export function food(kind, cls = '') {
  return `<img class="food ${cls}" data-food="${kind}" src="img/food/${kind}.webp" alt="" draggable="false">`;
}

/* ---------- Shapes with faces ---------- */
function starPath(cx = 50, cy = 53, R = 46, r = 21) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r : R;
    const t = -Math.PI / 2 + (i * Math.PI) / 5;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(t) * rad).toFixed(1)} ${(cy + Math.sin(t) * rad).toFixed(1)} `;
  }
  return d + 'Z';
}
export const SHAPES = {
  circle:   { name: 'circle',   color: '#FF5A5F', el: (f, s) => `<circle cx="50" cy="50" r="42" fill="${f}" ${s}/>` },
  square:   { name: 'square',   color: '#3FA7F5', el: (f, s) => `<rect x="10" y="10" width="80" height="80" rx="10" fill="${f}" ${s}/>` },
  triangle: { name: 'triangle', color: '#51CF66', el: (f, s) => `<path d="M50 8 L94 88 L6 88 Z" fill="${f}" ${s}/>` },
  star:     { name: 'star',     color: '#FFD43B', el: (f, s) => `<path d="${starPath()}" fill="${f}" ${s}/>` },
  heart:    { name: 'heart',    color: '#FF8FC7', el: (f, s) => `<path d="M50 90 C 10 62, 2 34, 22 18 C 36 8, 48 16, 50 28 C 52 16, 64 8, 78 18 C 98 34, 90 62, 50 90 Z" fill="${f}" ${s}/>` },
};
export const SHAPE_KINDS = Object.keys(SHAPES);
export function shape(kind, cls = '', withFace = true) {
  const s = SHAPES[kind];
  const fy = kind === 'triangle' ? 62 : 50;
  const face = withFace ? `<g class="c-eyes"><circle cx="40" cy="${fy - 4}" r="5" fill="${OL}"/><circle cx="60" cy="${fy - 4}" r="5" fill="${OL}"/>
      <circle cx="41.5" cy="${fy - 6}" r="1.8" fill="#fff"/><circle cx="61.5" cy="${fy - 6}" r="1.8" fill="#fff"/></g>
      <path d="M42 ${fy + 6} Q50 ${fy + 14} 58 ${fy + 6}" fill="none" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>` : '';
  return `<svg class="char shape ${cls}" data-shape="${kind}" viewBox="0 0 100 100" style="--d:${delay()}s"><g class="c-bob">${s.el(s.color, st(4))}${face}</g></svg>`;
}
export function hole(kind) {
  return `<svg class="hole" viewBox="0 0 100 100">${SHAPES[kind].el('#3D2A1E', 'stroke="#2A1A10" stroke-width="3" stroke-linejoin="round"')}</svg>`;
}

/* ---------- Scenery ---------- */
export function bush() {
  return `<svg class="bush" viewBox="0 0 200 140" preserveAspectRatio="none">
    <g fill="#40C057" ${st()}>
      <circle cx="40" cy="80" r="38"/><circle cx="160" cy="80" r="38"/><circle cx="76" cy="52" r="40"/><circle cx="124" cy="52" r="40"/>
      <rect x="10" y="80" width="180" height="58" rx="22"/>
    </g>
    <g fill="#40C057"><circle cx="40" cy="84" r="34"/><circle cx="160" cy="84" r="34"/><circle cx="76" cy="56" r="36"/><circle cx="124" cy="56" r="36"/><rect x="14" y="84" width="172" height="50" rx="20"/></g>
    <g fill="#69DB7C"><circle cx="70" cy="44" r="12"/><circle cx="130" cy="46" r="10"/><circle cx="38" cy="76" r="9"/></g>
    <g><circle cx="56" cy="96" r="7" fill="#FF8FC7" ${st(2.5)}/><circle cx="56" cy="96" r="2.5" fill="#FFD43B"/>
       <circle cx="148" cy="104" r="7" fill="#FFD43B" ${st(2.5)}/><circle cx="148" cy="104" r="2.5" fill="#FF922B"/>
       <circle cx="104" cy="30" r="6" fill="#fff" ${st(2.5)}/><circle cx="104" cy="30" r="2.2" fill="#FFD43B"/></g>
  </svg>`;
}

export function sun(cls = '') {
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<rect x="96" y="6" width="8" height="26" rx="4" fill="#FFC21A" transform="rotate(${i * 30} 100 100)"/>`;
  return `<svg class="char sun ${cls}" viewBox="0 0 200 200" style="--d:${delay()}s"><g class="sun-rays">${rays}</g>
    <circle cx="100" cy="100" r="58" fill="#FFE066" ${st()}/>
    ${eyes(92, 22, 0.9)}${cheeks(112, 34)}${mouth(116, 12)}</svg>`;
}
