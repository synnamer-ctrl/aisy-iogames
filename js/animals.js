// Cartoon animals, each drawn with its own real-animal anatomy (sitting
// four-legged poses, snouts, manes, trunks, hooves, tails) plus soft
// gradient shading. CSS classes hook the "alive" animations:
// c-bob, c-eyes, c-pupil, c-ears, c-tail, c-leg-*, c-arm-*, c-trunk,
// c-smile / c-open (mouth closed / open).

export const ANIMALS = {
  cat:      { name: 'kitty',    plural: 'kitties',   sound: 'Meow!',            c: '#F6A54E', light: '#FFF4E6', dark: '#D97A2B', ol: '#7A3E12', iris: '#7CC242' },
  dog:      { name: 'puppy',    plural: 'puppies',   sound: 'Woof woof!',       c: '#D29455', light: '#FFF8EE', dark: '#5E3B22', ol: '#4A2A12', iris: '#7A4A22' },
  bunny:    { name: 'bunny',    plural: 'bunnies',   sound: 'Hop hop hop!',     c: '#F4F0F8', light: '#FFFFFF', dark: '#FFB7C9', ol: '#6E5F86', iris: '#4A3A6A' },
  bear:     { name: 'bear',     plural: 'bears',     sound: 'Grrr!',            c: '#A86B3E', light: '#EBC79D', dark: '#6B3F20', ol: '#47260E', iris: '#4A2A14' },
  frog:     { name: 'froggy',   plural: 'froggies',  sound: 'Ribbit ribbit!',   c: '#72CC48', light: '#EAF8C8', dark: '#3E8E2A', ol: '#2D5E16', iris: '#D9A520' },
  pig:      { name: 'piggy',    plural: 'piggies',   sound: 'Oink oink!',       c: '#FFB9CA', light: '#FFDCE5', dark: '#F28CA6', ol: '#A8435F', iris: '#4A2A30' },
  chick:    { name: 'chick',    plural: 'chicks',    sound: 'Cheep cheep!',     c: '#FFD83A', light: '#FFF2A8', dark: '#FF9A1F', ol: '#A86A00', iris: '#2B1B12' },
  lion:     { name: 'lion',     plural: 'lions',     sound: 'Roar!',            c: '#F7C552', light: '#FFF1CC', dark: '#D9741A', ol: '#7A4210', iris: '#8A5A14' },
  cow:      { name: 'cow',      plural: 'cows',      sound: 'Moooo!',           c: '#FFFFFF', light: '#FFC6D4', dark: '#2E2A2A', ol: '#3A3333', iris: '#3A2312' },
  monkey:   { name: 'monkey',   plural: 'monkeys',   sound: 'Ooh ooh aah aah!', c: '#8E5A32', light: '#F2D3AA', dark: '#5E3A1E', ol: '#3E220E', iris: '#4A2A14' },
  elephant: { name: 'elephant', plural: 'elephants', sound: 'Toot toot!',       c: '#A3B6CB', light: '#CDDAE7', dark: '#FFC2D1', ol: '#3F536B', iris: '#2B2B3A' },
  panda:    { name: 'panda',    plural: 'pandas',    sound: 'Munch munch!',     c: '#FFFFFF', light: '#FFFFFF', dark: '#2D2B2E', ol: '#2D2B2E', iris: '#3A2312' },
};
export const ANIMAL_KINDS = Object.keys(ANIMALS);

/* ---------- helpers ---------- */
let UID = 0;
const f1 = (n) => +n.toFixed(1);
function mix(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  const tgt = t > 0 ? 255 : 0, k = Math.abs(t);
  const ch = (v) => Math.round(v + (tgt - v) * k);
  return '#' + ((1 << 24) | (ch(n >> 16) << 16) | (ch((n >> 8) & 255) << 8) | ch(n & 255)).toString(16).slice(1);
}
// Per-instance gradients so every shape gets soft light-from-top-left shading.
function paint(a) {
  const id = 'an' + (UID++).toString(36);
  const g = (n, c) => `<radialGradient id="${id}${n}" cx="38%" cy="28%" r="80%">
    <stop offset="0" stop-color="${mix(c, 0.32)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${mix(c, -0.17)}"/></radialGradient>`;
  return {
    a, ol: a.ol,
    defs: `<defs>${g('f', a.c)}${g('l', a.light)}${g('d', a.dark)}</defs>`,
    F: `url(#${id}f)`, L: `url(#${id}l)`, D: `url(#${id}d)`,
  };
}
const S = (p, w = 3.4) => `stroke="${p.ol}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

function eyes(p, y, dx, s = 1, iris = p.a.iris) {
  const e = (x) => `
    <ellipse cx="${x}" cy="${y}" rx="${9.5 * s}" ry="${11.5 * s}" fill="#fff" stroke="#2B1B12" stroke-width="2.4"/>
    <g class="c-pupil">
      <ellipse cx="${f1(x + 0.8 * s)}" cy="${f1(y + 1.6 * s)}" rx="${f1(7 * s)}" ry="${f1(8.6 * s)}" fill="${iris}"/>
      <ellipse cx="${f1(x + 0.8 * s)}" cy="${f1(y + 2 * s)}" rx="${f1(4.2 * s)}" ry="${f1(5.4 * s)}" fill="#140C08"/>
      <circle cx="${f1(x + 3.4 * s)}" cy="${f1(y - 2.6 * s)}" r="${f1(2.9 * s)}" fill="#fff"/>
      <circle cx="${f1(x - 2.4 * s)}" cy="${f1(y + 5 * s)}" r="${f1(1.3 * s)}" fill="#fff" opacity=".85"/>
    </g>`;
  return `<g class="c-eyes">${e(100 - dx)}${e(100 + dx)}</g>`;
}
const blush = (y, dx, rx = 9) => `<ellipse cx="${100 - dx}" cy="${y}" rx="${rx}" ry="${rx * 0.6}" fill="#FF7F9A" opacity=".42"/>
  <ellipse cx="${100 + dx}" cy="${y}" rx="${rx}" ry="${rx * 0.6}" fill="#FF7F9A" opacity=".42"/>`;

// Little "ω" mouth under a nose, with an open version for talking/eating.
function wMouth(p, y, w = 7, x = 100) {
  return `<path class="c-smile" d="M${x} ${y - 5} L${x} ${y} M${x - w} ${y - 1} Q${x - w / 2} ${y + 5} ${x} ${y} Q${x + w / 2} ${y + 5} ${x + w} ${y - 1}" fill="none" ${S(p, 2.6)}/>
  ${openMouth(p, x, y, w)}`;
}
function smile(p, y, w = 9, x = 100) {
  return `<path class="c-smile" d="M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}" fill="none" ${S(p, 2.8)}/>${openMouth(p, x, y, w)}`;
}
function openMouth(p, x, y, w) {
  return `<g class="c-open"><path d="M${x - w} ${y - 1} Q${x} ${y - 3} ${x + w} ${y - 1} Q${x + w} ${y + 12} ${x} ${y + 13} Q${x - w} ${y + 12} ${x - w} ${y - 1} Z" fill="#8E2A3A" ${S(p, 2.4)}/>
    <ellipse cx="${x}" cy="${y + 9}" rx="${f1(w * 0.55)}" ry="${f1(w * 0.36)}" fill="#FF7E95"/></g>`;
}

// Bumpy outline (manes, fluffy edges).
function bumpy(cx, cy, rIn, rOut, n, rot = 0) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = rot + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(t) * rIn, y = cy + Math.sin(t) * rIn;
    if (i === 0) { d += `M${f1(x)} ${f1(y)} `; continue; }
    const tm = rot + ((i - 0.5) / n) * Math.PI * 2;
    d += `Q${f1(cx + Math.cos(tm) * rOut)} ${f1(cy + Math.sin(tm) * rOut)} ${f1(x)} ${f1(y)} `;
  }
  return d + 'Z';
}

// A tail drawn as an outlined thick stroke.
const tailStroke = (p, d, w = 12, fill = p.F) => `<g class="c-tail">
  <path d="${d}" fill="none" stroke="${p.ol}" stroke-width="${w + 6}" stroke-linecap="round"/>
  <path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/></g>`;

// Sitting four-legged body: haunches, hind feet, chest, two front legs.
function sitBody(p, { hoof = null, chest = p.L, legFill = p.F, behind = '', front = '' } = {}) {
  const s = S(p);
  // Tapered leg with a rounded paw; open path so the shoulder has no hard top edge.
  const legD = (x) => `M${x - 8} 136 C ${x - 9} 158, ${x - 12} 174, ${x - 12} 186 Q${x - 12} 196 ${x} 196 Q${x + 12} 196 ${x + 12} 186 C ${x + 12} 174, ${x + 9} 158, ${x + 8} 136`;
  const leg = (x, cls) => `<g class="${cls}">
    <path d="${legD(x)}" fill="${legFill}" ${s}/>
    ${hoof
      ? `<path d="M${x - 12} 184 Q${x} 181 ${x + 12} 184 L${x + 12} 186 Q${x + 12} 196 ${x} 196 Q${x - 12} 196 ${x - 12} 186 Z" fill="${hoof}" ${s}/><path d="M${x} 186 V195" ${S(p, 2)}/>`
      : `<path d="M${x - 4} 195.5 v-5 M${x + 4} 195.5 v-5" ${S(p, 2)}/>`}
  </g>`;
  const foot = (x) => `<ellipse cx="${x}" cy="191" rx="18" ry="8.5" fill="${hoof || p.F}" ${s}/>`;
  return `${behind}
    ${foot(52)}${foot(148)}
    <ellipse cx="64" cy="168" rx="26" ry="25" fill="${p.F}" ${s}/>
    <ellipse cx="136" cy="168" rx="26" ry="25" fill="${p.F}" ${s}/>
    <path d="M100 96 C 74 96, 62 128, 62 158 C 62 184, 78 196, 100 196 C 122 196, 138 184, 138 158 C 138 128, 126 96, 100 96 Z" fill="${p.F}" ${s}/>
    ${chest ? `<path d="M100 100 C 82 106, 78 126, 86 142 Q93 136 100 146 Q107 136 114 142 C 122 126, 118 106, 100 100 Z" fill="${chest}"/>` : ''}
    ${front}
    ${leg(86, 'c-leg-l')}${leg(114, 'c-leg-r')}`;
}

// Teddy-style sitting body: round tummy, arms, legs stretched out front with paw pads.
function teddyBody(p, { arm = p.F, leg = p.F, pad = p.L, belly = p.L, longArms = false, behind = '', front = '' } = {}) {
  const s = S(p);
  const ry = longArms ? 34 : 24, cy = longArms ? 148 : 140;
  const beans = (x) => `<ellipse cx="${x}" cy="186" rx="9" ry="7.5" fill="${pad}"/>
    <circle cx="${x - 9}" cy="177" r="3.2" fill="${pad}"/><circle cx="${x}" cy="174" r="3.2" fill="${pad}"/><circle cx="${x + 9}" cy="177" r="3.2" fill="${pad}"/>`;
  return `${behind}
    <ellipse cx="100" cy="150" rx="44" ry="42" fill="${p.F}" ${s}/>
    ${belly ? `<ellipse cx="100" cy="158" rx="27" ry="27" fill="${belly}"/>` : ''}
    ${front}
    <ellipse class="c-arm-l" cx="58" cy="${cy}" rx="12" ry="${ry}" fill="${arm}" ${s} transform="rotate(14 58 ${cy})"/>
    <ellipse class="c-arm-r" cx="142" cy="${cy}" rx="12" ry="${ry}" fill="${arm}" ${s} transform="rotate(-14 142 ${cy})"/>
    <ellipse cx="68" cy="182" rx="23" ry="15" fill="${leg}" ${s}/><ellipse cx="132" cy="182" rx="23" ry="15" fill="${leg}" ${s}/>
    ${pad ? beans(66) + beans(134) : ''}`;
}

/* ---------- the animals ---------- */
const BUILD = {
  cat: (p) => {
    const s = S(p);
    const stripes = `<path d="M92 32 Q95 40 97 46 M100 30 V46 M108 32 Q105 40 103 46" fill="none" stroke="${p.D}" stroke-width="4.5" stroke-linecap="round"/>`;
    return `${sitBody(p, {
      behind: tailStroke(p, 'M134 186 C 172 192, 186 162, 172 140 C 166 130, 172 120, 180 126', 13),
      front: `<path d="M66 140 q8 2 10 8 M134 140 q-8 2 -10 8 M64 158 q8 2 10 8 M136 158 q-8 2 -10 8" fill="none" stroke="${p.D}" stroke-width="4" stroke-linecap="round"/>`,
    })}
    <g class="c-ears">
      <path d="M58 56 L56 12 Q58 6 64 10 L94 34 Z" fill="${p.F}" ${s}/><path d="M63 46 L62 20 L84 36 Z" fill="#FFB2C2"/>
      <path d="M142 56 L144 12 Q142 6 136 10 L106 34 Z" fill="${p.F}" ${s}/><path d="M137 46 L138 20 L116 36 Z" fill="#FFB2C2"/>
    </g>
    <path d="M54 70 C 54 40, 76 26, 100 26 C 124 26, 146 40, 146 70 C 146 82, 152 90, 150 98 L 141 99 L 145 106 C 132 116, 116 120, 100 120 C 84 120, 68 116, 55 106 L 59 99 L 50 98 C 48 90, 54 82, 54 70 Z" fill="${p.F}" ${s}/>
    ${stripes}
    <path d="M58 64 l8 2 M57 72 l9 1 M142 64 l-8 2 M143 72 l-9 1" fill="none" stroke="${p.D}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="90" cy="94" rx="13" ry="10" fill="${p.L}"/><ellipse cx="110" cy="94" rx="13" ry="10" fill="${p.L}"/><ellipse cx="100" cy="104" rx="9" ry="7" fill="${p.L}"/>
    ${eyes(p, 68, 21, 1.05)}${blush(88, 32)}
    <path d="M76 94 L50 90 M76 99 L52 102 M124 94 L150 90 M124 99 L148 102" stroke="${p.ol}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
    <path d="M93.5 84 Q100 80.5 106.5 84 Q104 90 100 91 Q96 90 93.5 84 Z" fill="#FF8FA6" ${S(p, 2)}/>
    ${wMouth(p, 97, 7)}`;
  },

  dog: (p) => {
    const s = S(p);
    return `${sitBody(p, {
      behind: tailStroke(p, 'M134 170 C 158 166, 168 148, 164 126', 11) ,
      front: `<path d="M72 112 Q100 126 128 112 L128 121 Q100 135 72 121 Z" fill="#FF5A5F" ${s}/><circle cx="100" cy="132" r="6.5" fill="#FFD43B" ${S(p, 2.4)}/>`,
    })}
    <circle cx="164" cy="124" r="6" fill="#fff" ${s}/>
    <circle cx="100" cy="62" r="40" fill="${p.F}" ${s}/>
    <path d="M96 26 Q100 22 104 26 L112 78 L88 78 Z" fill="${p.L}"/>
    <ellipse cx="100" cy="92" rx="25" ry="18" fill="${p.L}" ${s}/>
    <ellipse cx="78" cy="56" rx="12" ry="11" fill="${p.D}" opacity=".35"/>
    <g class="c-ears">
      <path d="M68 36 C 44 34, 36 68, 42 98 C 46 112, 62 110, 64 96 C 66 80, 72 58, 76 44 Z" fill="${p.D}" ${s}/>
      <path d="M132 36 C 156 34, 164 68, 158 98 C 154 112, 138 110, 136 96 C 134 80, 128 58, 124 44 Z" fill="${p.D}" ${s}/>
    </g>
    ${eyes(p, 60, 19)}${blush(84, 30, 7)}
    <ellipse cx="100" cy="82" rx="10.5" ry="7.5" fill="#2A1A12"/><ellipse cx="97" cy="79.5" rx="3.2" ry="2" fill="#fff" opacity=".8"/>
    <path class="c-smile" d="M96 96 Q100 110 106 98 Z" fill="#FF7E95" ${S(p, 2)}/>
    ${wMouth(p, 95, 8)}`;
  },

  bunny: (p) => {
    const s = S(p);
    return `${sitBody(p, {
      behind: `<circle cx="146" cy="178" r="15" fill="#fff" ${s}/>`,
      chest: '#FFFFFF',
    })}
    <ellipse cx="50" cy="191" rx="24" ry="9" fill="${p.F}" ${s}/><ellipse cx="150" cy="191" rx="24" ry="9" fill="${p.F}" ${s}/>
    <g class="c-ears">
      <path d="M80 42 C 66 12, 66 -16, 78 -18 C 92 -18, 96 10, 93 42 Z" fill="${p.F}" ${s}/>
      <path d="M81 34 C 74 10, 75 -8, 79 -10 C 85 -10, 88 10, 88 34 Z" fill="${p.D}"/>
      <path d="M108 42 C 114 12, 130 -6, 146 -2 C 158 2, 152 14, 142 20 C 128 30, 122 36, 118 44 Z" fill="${p.F}" ${s}/>
      <path d="M114 36 C 120 16, 132 4, 142 4 C 148 6, 144 12, 138 16 C 128 24, 122 30, 118 38 Z" fill="${p.D}"/>
    </g>
    <path d="M100 34 C 128 34, 144 52, 144 74 C 144 96, 126 112, 100 112 C 74 112, 56 96, 56 74 C 56 52, 72 34, 100 34 Z" fill="${p.F}" ${s}/>
    <ellipse cx="88" cy="94" rx="14" ry="10" fill="${p.L}"/><ellipse cx="112" cy="94" rx="14" ry="10" fill="${p.L}"/>
    ${eyes(p, 70, 20)}${blush(88, 32)}
    <circle cx="80" cy="96" r="1.6" fill="${p.ol}"/><circle cx="76" cy="91" r="1.6" fill="${p.ol}"/><circle cx="120" cy="96" r="1.6" fill="${p.ol}"/><circle cx="124" cy="91" r="1.6" fill="${p.ol}"/>
    <path class="c-smile" d="M95 97 h10 v7 q0 2 -2 2 h-6 q-2 0 -2 -2 Z M100 97 v9" fill="#fff" ${S(p, 2)}/>
    <path d="M95 85 Q100 82 105 85 Q103 90 100 90 Q97 90 95 85 Z" fill="#FF8FAB" ${S(p, 2)}/>
    ${wMouth(p, 96, 6)}`;
  },

  bear: (p) => {
    const s = S(p);
    return `${teddyBody(p)}
    <g class="c-ears">
      <circle cx="60" cy="32" r="17" fill="${p.F}" ${s}/><circle cx="60" cy="33" r="9" fill="${p.L}"/>
      <circle cx="140" cy="32" r="17" fill="${p.F}" ${s}/><circle cx="140" cy="33" r="9" fill="${p.L}"/>
    </g>
    <ellipse cx="100" cy="68" rx="48" ry="43" fill="${p.F}" ${s}/>
    <ellipse cx="100" cy="89" rx="22" ry="16" fill="${p.L}" ${S(p, 2.2)}/>
    ${eyes(p, 62, 21)}${blush(84, 34)}
    <path d="M90 80 Q100 74 110 80 Q108 89 100 90 Q92 89 90 80 Z" fill="#2E1A0E"/><ellipse cx="96" cy="79" rx="3" ry="1.8" fill="#fff" opacity=".7"/>
    ${wMouth(p, 98, 7)}`;
  },

  frog: (p) => {
    const s = S(p);
    const foot = (x, dir) => `<path d="M${x - 16} 194 Q${x - 12} 182 ${x} 184 Q${x + 12} 182 ${x + 16} 194 Q${x + 8} 190 ${x} 197 Q${x - 8} 190 ${x - 16} 194 Z" fill="${p.F}" ${s}/>`;
    return `
    <ellipse cx="50" cy="168" rx="30" ry="21" fill="${p.F}" ${s} transform="rotate(-24 50 168)"/>
    <ellipse cx="150" cy="168" rx="30" ry="21" fill="${p.F}" ${s} transform="rotate(24 150 168)"/>
    ${foot(36)}${foot(164)}
    <ellipse cx="100" cy="156" rx="44" ry="38" fill="${p.F}" ${s}/>
    <ellipse cx="100" cy="164" rx="28" ry="26" fill="${p.L}"/>
    <g class="c-leg-l"><path d="M82 150 Q76 172 80 188" fill="none" stroke="${p.ol}" stroke-width="15" stroke-linecap="round"/><path d="M82 150 Q76 172 80 188" fill="none" stroke="${p.F}" stroke-width="9" stroke-linecap="round"/>${foot(80)}</g>
    <g class="c-leg-r"><path d="M118 150 Q124 172 120 188" fill="none" stroke="${p.ol}" stroke-width="15" stroke-linecap="round"/><path d="M118 150 Q124 172 120 188" fill="none" stroke="${p.F}" stroke-width="9" stroke-linecap="round"/>${foot(120)}</g>
    <circle cx="68" cy="46" r="21" fill="${p.F}" ${s}/><circle cx="132" cy="46" r="21" fill="${p.F}" ${s}/>
    <path d="M40 84 C 40 58, 62 48, 100 48 C 138 48, 160 58, 160 84 C 160 106, 132 118, 100 118 C 68 118, 40 106, 40 84 Z" fill="${p.F}" ${s}/>
    <circle cx="68" cy="48" r="18" fill="${p.F}"/><circle cx="132" cy="48" r="18" fill="${p.F}"/>
    <ellipse cx="60" cy="96" rx="5" ry="4" fill="${p.D}" opacity=".5"/><ellipse cx="140" cy="94" rx="6" ry="4" fill="${p.D}" opacity=".5"/><ellipse cx="128" cy="108" rx="4" ry="3" fill="${p.D}" opacity=".5"/>
    ${eyes(p, 44, 32, 1.05)}${blush(92, 44, 10)}
    <circle cx="94" cy="76" r="2.2" fill="${p.ol}"/><circle cx="106" cy="76" r="2.2" fill="${p.ol}"/>
    <path class="c-smile" d="M66 90 Q100 112 134 90" fill="none" ${S(p, 3.2)}/>
    ${openMouth(p, 100, 92, 16)}`;
  },

  pig: (p) => {
    const s = S(p);
    return `${sitBody(p, {
      hoof: '#B5677C',
      behind: `<g class="c-tail"><path d="M136 176 c 14 -2 18 -14 10 -18 c -8 -4 -12 6 -4 9 c 8 3 14 -4 14 -12" fill="none" stroke="${p.ol}" stroke-width="4" stroke-linecap="round"/></g>`,
    })}
    <g class="c-ears">
      <path d="M64 40 L52 8 Q72 10 88 30 Z" fill="${p.F}" ${s}/><path d="M64 34 L58 16 Q70 18 80 30 Z" fill="${p.D}"/>
      <path d="M136 40 L148 8 Q128 10 112 30 Z" fill="${p.F}" ${s}/><path d="M136 34 L142 16 Q130 18 120 30 Z" fill="${p.D}"/>
    </g>
    <ellipse cx="100" cy="68" rx="47" ry="42" fill="${p.F}" ${s}/>
    ${eyes(p, 58, 22)}${blush(82, 36, 10)}
    <ellipse cx="100" cy="84" rx="21" ry="14.5" fill="${p.D}" ${s}/>
    <ellipse cx="93" cy="84" rx="3.6" ry="5.6" fill="${p.ol}"/><ellipse cx="107" cy="84" rx="3.6" ry="5.6" fill="${p.ol}"/>
    ${smile(p, 103, 7)}`;
  },

  chick: (p) => {
    const s = S(p);
    const toes = (x) => `<path d="M${x} 186 V194 M${x} 194 L${x - 8} 200 M${x} 194 V201 M${x} 194 L${x + 8} 200" fill="none" stroke="${p.ol}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${x} 186 V194 M${x} 194 L${x - 8} 200 M${x} 194 V201 M${x} 194 L${x + 8} 200" fill="none" stroke="#FF9A1F" stroke-width="4.5" stroke-linecap="round"/>`;
    return `${toes(84)}${toes(116)}
    <path d="M94 34 Q86 12 98 18 Q100 4 106 20 Q118 10 112 34 Z" fill="${p.F}" ${s}/>
    <path d="M100 30 C 134 30, 148 56, 144 84 C 162 104, 160 150, 140 174 C 126 190, 74 190, 60 174 C 40 150, 38 104, 56 84 C 52 56, 66 30, 100 30 Z" fill="${p.F}" ${s}/>
    <ellipse cx="100" cy="150" rx="32" ry="27" fill="${p.L}"/>
    <path class="c-arm-l" d="M54 116 C 30 120, 26 150, 48 158 L54 150 L50 146 L58 140 C 60 132, 60 124, 54 116 Z" fill="${p.F}" ${s}/>
    <path class="c-arm-r" d="M146 116 C 170 120, 174 150, 152 158 L146 150 L150 146 L142 140 C 140 132, 140 124, 146 116 Z" fill="${p.F}" ${s}/>
    ${eyes(p, 70, 20)}${blush(88, 32)}
    <path class="c-smile" d="M88 87 Q100 79 112 87 Q100 100 88 87 Z" fill="${p.D}" ${S(p, 2.4)}/>
    <g class="c-open"><path d="M88 85 Q100 77 112 85 Q100 91 88 85 Z" fill="${p.D}" ${S(p, 2.4)}/>
      <path d="M90 92 Q100 90 110 92 Q100 106 90 92 Z" fill="${p.D}" ${S(p, 2.4)}/></g>`;
  },

  lion: (p) => {
    const s = S(p);
    return `${sitBody(p, {
      behind: `${tailStroke(p, 'M134 180 C 170 184, 178 162, 172 142', 9)}<ellipse cx="172" cy="136" rx="9" ry="11" fill="${p.D}" ${s}/>`,
    })}
    <g class="c-ears">
      <path d="${bumpy(100, 70, 50, 74, 16)}" fill="${p.D}" ${s}/>
      <path d="${bumpy(100, 70, 42, 58, 16, 0.2)}" fill="#EE9A2E"/>
    </g>
    <circle cx="68" cy="38" r="11" fill="${p.F}" ${s}/><circle cx="68" cy="39" r="5.5" fill="${p.D}"/>
    <circle cx="132" cy="38" r="11" fill="${p.F}" ${s}/><circle cx="132" cy="39" r="5.5" fill="${p.D}"/>
    <path d="M100 32 C 124 32, 138 48, 138 70 C 138 94, 122 110, 100 110 C 78 110, 62 94, 62 70 C 62 48, 76 32, 100 32 Z" fill="${p.F}" ${s}/>
    <ellipse cx="91" cy="90" rx="12" ry="9" fill="${p.L}"/><ellipse cx="109" cy="90" rx="12" ry="9" fill="${p.L}"/><ellipse cx="100" cy="100" rx="8" ry="6" fill="${p.L}"/>
    ${eyes(p, 66, 18, 0.95)}${blush(86, 28, 7)}
    <circle cx="86" cy="92" r="1.5" fill="${p.ol}"/><circle cx="82" cy="88" r="1.5" fill="${p.ol}"/><circle cx="114" cy="92" r="1.5" fill="${p.ol}"/><circle cx="118" cy="88" r="1.5" fill="${p.ol}"/>
    <path d="M92 80 Q100 77 108 80 Q105 88 100 89 Q95 88 92 80 Z" fill="#7A4210"/>
    ${wMouth(p, 96, 7)}`;
  },

  cow: (p) => {
    const s = S(p);
    return `${sitBody(p, {
      hoof: '#4A4040', chest: null,
      behind: `${tailStroke(p, 'M134 182 C 160 184, 170 170, 168 148', 6)}<ellipse cx="168" cy="144" rx="6" ry="9" fill="${p.D}"/>`,
      front: `<path d="M70 130 C 80 126, 86 138, 80 146 C 72 152, 64 142, 70 130 Z M120 160 C 130 156, 136 168, 128 174 C 120 178, 114 168, 120 160 Z" fill="${p.D}"/>
        <path d="M74 112 Q100 124 126 112 L126 119 Q100 131 74 119 Z" fill="#9C5B2E" ${s}/>
        <path d="M92 124 h16 l3 14 h-22 Z" fill="#FFC531" ${S(p, 2.4)}/><circle cx="100" cy="140" r="3" fill="${p.ol}"/>`,
    })}
    <path d="M74 36 Q64 14 76 10 Q82 22 86 32 Z" fill="#FFF3C4" ${s}/><path d="M126 36 Q136 14 124 10 Q118 22 114 32 Z" fill="#FFF3C4" ${s}/>
    <g class="c-ears">
      <ellipse cx="50" cy="56" rx="20" ry="10" fill="${p.F}" ${s} transform="rotate(-22 50 56)"/><ellipse cx="51" cy="56" rx="11" ry="5" fill="#FFB3C6" transform="rotate(-22 51 56)"/>
      <ellipse cx="150" cy="56" rx="20" ry="10" fill="${p.F}" ${s} transform="rotate(22 150 56)"/><ellipse cx="149" cy="56" rx="11" ry="5" fill="#FFB3C6" transform="rotate(22 149 56)"/>
    </g>
    <path d="M100 26 C 130 26, 140 44, 140 66 C 140 82, 134 92, 134 100 L 66 100 C 66 92, 60 82, 60 66 C 60 44, 70 26, 100 26 Z" fill="${p.F}" ${s}/>
    <path d="M118 30 C 134 28, 140 44, 136 56 C 128 64, 114 54, 112 42 C 111 35, 113 31, 118 30 Z M78 30 C 86 30, 88 38, 82 42 C 76 44, 70 38, 78 30 Z" fill="${p.D}"/>
    ${eyes(p, 60, 20)}
    <ellipse cx="100" cy="99" rx="33" ry="20" fill="${p.L}" ${s}/>
    <ellipse cx="88" cy="96" rx="4" ry="5.5" fill="#C2255C"/><ellipse cx="112" cy="96" rx="4" ry="5.5" fill="#C2255C"/>
    ${smile(p, 108, 7)}`;
  },

  monkey: (p) => {
    const s = S(p);
    return `${teddyBody(p, {
      longArms: true, pad: null, belly: p.L,
      behind: tailStroke(p, 'M132 176 C 178 184, 190 150, 174 128 C 164 116, 150 124, 156 136 C 160 144, 170 140, 168 132', 9),
    })}
    <ellipse cx="66" cy="186" rx="10" ry="7" fill="${p.L}"/><ellipse cx="134" cy="186" rx="10" ry="7" fill="${p.L}"/>
    <g class="c-ears">
      <circle cx="50" cy="70" r="18" fill="${p.F}" ${s}/><circle cx="51" cy="70" r="10" fill="${p.L}"/>
      <circle cx="150" cy="70" r="18" fill="${p.F}" ${s}/><circle cx="149" cy="70" r="10" fill="${p.L}"/>
    </g>
    <circle cx="100" cy="66" r="42" fill="${p.F}" ${s}/>
    <path d="M92 26 Q96 16 102 24 Q106 14 110 26" fill="none" ${S(p, 3)}/>
    <path d="M100 52 C 86 38, 62 44, 64 68 C 64 76, 68 84, 72 90 C 74 106, 86 112, 100 112 C 114 112, 126 106, 128 90 C 132 84, 136 76, 136 68 C 138 44, 114 38, 100 52 Z" fill="${p.L}"/>
    ${eyes(p, 66, 16, 0.95)}${blush(86, 26, 7)}
    <circle cx="96" cy="86" r="2.4" fill="${p.ol}"/><circle cx="104" cy="86" r="2.4" fill="${p.ol}"/>
    ${smile(p, 95, 13)}`;
  },

  elephant: (p) => {
    const s = S(p);
    return `${teddyBody(p, { pad: p.L, belly: null })}
    <path d="M58 194 q4 -6 8 0 M68 194 q4 -6 8 0 M124 194 q4 -6 8 0 M134 194 q4 -6 8 0" fill="${p.L}" ${S(p, 2)}/>
    <g class="c-ears">
      <path d="M66 46 C 30 22, 4 50, 10 86 C 14 112, 40 126, 66 104 Z" fill="${p.F}" ${s}/>
      <path d="M62 54 C 34 38, 18 58, 22 84 C 26 102, 42 110, 58 98 Z" fill="${p.D}"/>
      <path d="M134 46 C 170 22, 196 50, 190 86 C 186 112, 160 126, 134 104 Z" fill="${p.F}" ${s}/>
      <path d="M138 54 C 166 38, 182 58, 178 84 C 174 102, 158 110, 142 98 Z" fill="${p.D}"/>
    </g>
    <ellipse cx="100" cy="64" rx="42" ry="39" fill="${p.F}" ${s}/>
    <path d="M94 26 Q96 16 100 24 Q104 14 106 26" fill="none" ${S(p, 3)}/>
    ${eyes(p, 58, 20)}${blush(78, 30)}
    ${smile(p, 90, 6, 122)}
    <g class="c-trunk">
      <path d="M100 74 C 98 108, 100 128, 114 132 C 124 134, 128 122, 120 118" fill="none" stroke="${p.ol}" stroke-width="23" stroke-linecap="round"/>
      <path d="M100 74 C 98 108, 100 128, 114 132 C 124 134, 128 122, 120 118" fill="none" stroke="${p.F}" stroke-width="16" stroke-linecap="round"/>
      <path d="M93 96 q7 3 14 0 M93 108 q7 3 14 0" fill="none" stroke="${p.ol}" stroke-width="2" stroke-linecap="round" opacity=".6"/>
    </g>`;
  },

  panda: (p) => {
    const s = S(p);
    return `${teddyBody(p, {
      arm: p.D, leg: p.D, pad: '#5A5560', belly: null,
      front: `<path d="M58 118 C 76 106, 124 106, 142 118 C 142 132, 128 132, 100 130 C 72 132, 58 132, 58 118 Z" fill="${p.D}"/>`,
    })}
    <g class="c-ears"><circle cx="60" cy="32" r="16" fill="${p.D}" ${s}/><circle cx="140" cy="32" r="16" fill="${p.D}" ${s}/></g>
    <ellipse cx="100" cy="68" rx="47" ry="42" fill="${p.F}" stroke="#4A4650" stroke-width="3.4"/>
    <ellipse cx="79" cy="66" rx="14" ry="18" fill="${p.D}" transform="rotate(32 79 66)"/>
    <ellipse cx="121" cy="66" rx="14" ry="18" fill="${p.D}" transform="rotate(-32 121 66)"/>
    ${eyes(p, 64, 21, 0.82)}${blush(86, 34)}
    <ellipse cx="100" cy="88" rx="18" ry="12" fill="#F2F0F4"/>
    <ellipse cx="100" cy="82" rx="8.5" ry="5.8" fill="${p.D}"/>
    ${wMouth(p, 94, 6)}`;
  },
};

export function animal(kind, cls = '') {
  const a = ANIMALS[kind];
  const p = paint(a);
  const d = (Math.random() * -5).toFixed(2);
  return `<svg class="char ${cls}" data-kind="${kind}" viewBox="0 -22 200 222" style="--d:${d}s" aria-label="${a.name}">${p.defs}
    <ellipse cx="100" cy="197" rx="60" ry="5.5" fill="#000" opacity=".1"/>
    <g class="c-bob">${BUILD[kind](p)}</g></svg>`;
}
