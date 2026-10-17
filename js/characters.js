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
const FOODS = {
  carrot: `<path d="M52 94 L28 36 Q50 24 72 36 Z" fill="#FF922B" ${st(4)}/>
    <path d="M38 48 l10 2 M44 64 l10 2 M48 80 l8 1" stroke="${OL}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 30 Q40 10 30 14 Q40 20 46 30 M50 30 Q52 6 60 6 Q56 18 54 30 M52 30 Q66 12 74 18 Q62 22 56 32" fill="#51CF66" ${st(3.5)}/>`,
  bone: `<g fill="#FFF8E7" ${st(4)}><circle cx="22" cy="38" r="13"/><circle cx="22" cy="62" r="13"/><circle cx="78" cy="38" r="13"/><circle cx="78" cy="62" r="13"/></g>
    <rect x="20" y="37" width="60" height="26" fill="#FFF8E7"/><path d="M28 37 H72 M28 63 H72" stroke="${OL}" stroke-width="4"/>`,
  banana: `<path d="M16 26 Q18 82 78 84 Q90 82 88 74 Q38 70 32 22 Z" fill="#FFE066" ${st(4)}/>
    <path d="M16 26 L18 14 L30 18 L32 22" fill="#8B5A2B" ${st(3.5)}/><path d="M30 40 Q36 64 64 72" fill="none" stroke="#F0A800" stroke-width="3" stroke-linecap="round"/>`,
  fish: `<path d="M70 50 L94 30 L94 70 Z" fill="#3FA7F5" ${st(4)}/><ellipse cx="44" cy="50" rx="34" ry="22" fill="#74C0FC" ${st(4)}/>
    <circle cx="28" cy="45" r="6" fill="#fff" ${st(2.5)}/><circle cx="29" cy="46" r="3" fill="${OL}"/>
    <path d="M44 34 Q50 50 44 66 M56 36 Q62 50 56 64" fill="none" stroke="#1C7ED6" stroke-width="3" stroke-linecap="round"/>`,
  honey: `<path d="M20 40 Q16 92 50 92 Q84 92 80 40 Z" fill="#E8A33D" ${st(4)}/><rect x="16" y="26" width="68" height="18" rx="8" fill="#C77B1F" ${st(4)}/>
    <path d="M30 44 Q30 62 36 62 Q42 62 42 44 M58 44 Q58 56 63 56 Q68 56 68 44" fill="#FFD43B"/>
    <text x="50" y="80" font-size="16" text-anchor="middle" fill="#7A4E2A" font-family="sans-serif" font-weight="bold">HONEY</text>`,
  corn: `<path d="M50 96 Q22 70 30 40 Q40 52 50 96 M50 96 Q78 70 70 40 Q60 52 50 96" fill="#51CF66" ${st(3.5)}/>
    <ellipse cx="50" cy="44" rx="18" ry="38" fill="#FFD43B" ${st(4)}/>
    <g fill="#F0A800">${[18, 30, 42, 54, 66].map((y) => `<circle cx="43" cy="${y}" r="3.5"/><circle cx="57" cy="${y}" r="3.5"/>`).join('')}</g>
    <path d="M50 96 Q34 80 38 56 M50 96 Q66 80 62 56" fill="#69DB7C" ${st(3.5)}/>`,
  apple: `<path d="M50 30 C 30 18, 10 34, 14 58 C 18 84, 38 96, 50 88 C 62 96, 82 84, 86 58 C 90 34, 70 18, 50 30 Z" fill="#FF5A5F" ${st(4)}/>
    <path d="M50 30 Q48 16 54 8" fill="none" stroke="#7A4E2A" stroke-width="5" stroke-linecap="round"/>
    <path d="M54 18 Q66 6 78 14 Q68 26 54 18 Z" fill="#51CF66" ${st(3)}/><ellipse cx="32" cy="44" rx="6" ry="10" fill="#fff" opacity=".5"/>`,
  acorn: `<path d="M30 46 Q30 88 50 92 Q70 88 70 46 Z" fill="#D9A15A" ${st(4)}/>
    <ellipse cx="42" cy="62" rx="5" ry="12" fill="#fff" opacity=".35"/>
    <path d="M18 48 Q20 24 50 22 Q80 24 82 48 Q50 56 18 48 Z" fill="#8A5A2E" ${st(4)}/>
    <path d="M30 34 l8 8 M42 28 l8 10 M56 28 l8 10 M68 34 l6 8" stroke="#5E3A1A" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M50 22 Q50 12 58 8" fill="none" stroke="#5E3A1A" stroke-width="5" stroke-linecap="round"/>`,
  bamboo: `<g ${st(4)}><rect x="38" y="6" width="22" height="90" rx="8" fill="#8CE99A"/></g>
    <path d="M38 34 H60 M38 64 H60" stroke="${OL}" stroke-width="4"/>
    <path d="M60 30 Q84 18 92 28 Q78 36 60 30 Z M38 58 Q14 46 8 56 Q22 64 38 58 Z" fill="#51CF66" ${st(3)}/>`,
};
export const FOOD_KINDS = Object.keys(FOODS);
export function food(kind, cls = '') {
  return `<svg class="food ${cls}" data-food="${kind}" viewBox="0 0 100 100">${FOODS[kind]}</svg>`;
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
