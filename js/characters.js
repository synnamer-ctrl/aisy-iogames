// Cartoon character library: every character is a hand-built SVG with
// CSS-driven "alive" animations (breathing bob, blinking, ear wiggle,
// talking mouth, happy hop). See css/style.css for the keyframes.

const OL = '#4A2E1F';
const st = (w = 4.5) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const delay = () => (Math.random() * -5).toFixed(2);

export const ANIMALS = {
  cat:      { name: 'kitty',    plural: 'kitties',   sound: 'Meow!',            c: '#FFA94D', light: '#FFE8CC', dark: '#E8590C' },
  dog:      { name: 'puppy',    plural: 'puppies',   sound: 'Woof woof!',       c: '#D9A066', light: '#FBEBD5', dark: '#8B5A2B' },
  bunny:    { name: 'bunny',    plural: 'bunnies',   sound: 'Hop hop hop!',     c: '#F8F4FF', light: '#FFFFFF', dark: '#E3D7F5' },
  bear:     { name: 'bear',     plural: 'bears',     sound: 'Grrr!',            c: '#B07A52', light: '#EBCBA8', dark: '#6F4428' },
  frog:     { name: 'froggy',   plural: 'froggies',  sound: 'Ribbit ribbit!',   c: '#69DB7C', light: '#D3F9D8', dark: '#2F9E44' },
  pig:      { name: 'piggy',    plural: 'piggies',   sound: 'Oink oink!',       c: '#FFB3C6', light: '#FFE0EA', dark: '#F06595' },
  chick:    { name: 'chick',    plural: 'chicks',    sound: 'Cheep cheep!',     c: '#FFE066', light: '#FFF3BF', dark: '#FF922B' },
  lion:     { name: 'lion',     plural: 'lions',     sound: 'Roar!',            c: '#FFD43B', light: '#FFF3BF', dark: '#E67700' },
  cow:      { name: 'cow',      plural: 'cows',      sound: 'Moooo!',           c: '#FFFFFF', light: '#F1F3F5', dark: '#343A40' },
  monkey:   { name: 'monkey',   plural: 'monkeys',   sound: 'Ooh ooh aah aah!', c: '#B07D4F', light: '#F3D9B1', dark: '#7A4E2A' },
  elephant: { name: 'elephant', plural: 'elephants', sound: 'Toot toot!',       c: '#A5B4C8', light: '#D6DEE9', dark: '#7B8BA3' },
  panda:    { name: 'panda',    plural: 'pandas',    sound: 'Munch munch!',     c: '#FFFFFF', light: '#FFFFFF', dark: '#2B2B2B', arm: '#2B2B2B' },
};
export const ANIMAL_KINDS = Object.keys(ANIMALS);

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
function body(a, behind = '', front = '') {
  const arm = a.arm || a.c;
  return `${behind}
    <ellipse cx="72" cy="188" rx="16" ry="9" fill="${a.dark}" ${st()}/>
    <ellipse cx="128" cy="188" rx="16" ry="9" fill="${a.dark}" ${st()}/>
    <ellipse cx="100" cy="160" rx="42" ry="32" fill="${a.c}" ${st()}/>
    <ellipse cx="100" cy="166" rx="24" ry="19" fill="${a.light}"/>
    ${front}
    <ellipse class="c-arm-l" cx="60" cy="152" rx="11" ry="17" fill="${arm}" ${st()} transform="rotate(25 60 152)"/>
    <ellipse class="c-arm-r" cx="140" cy="152" rx="11" ry="17" fill="${arm}" ${st()} transform="rotate(-25 140 152)"/>`;
}
const head = (a, r = 52) => `<circle cx="100" cy="86" r="${r}" fill="${a.c}" ${st()}/>`;

/* ---------- per-animal builders ---------- */
const BUILD = {
  cat: (a) => `
    ${body(a, `<path d="M136 172 Q182 164 170 122" fill="none" stroke="${OL}" stroke-width="17" stroke-linecap="round"/>
               <path d="M136 172 Q182 164 170 122" fill="none" stroke="${a.c}" stroke-width="9" stroke-linecap="round"/>`)}
    <g class="c-ears">
      <path d="M56 70 L60 22 L96 46 Z" fill="${a.c}" ${st()}/><path d="M64 58 L66 34 L86 48 Z" fill="#FFB3C1"/>
      <path d="M144 70 L140 22 L104 46 Z" fill="${a.c}" ${st()}/><path d="M136 58 L134 34 L114 48 Z" fill="#FFB3C1"/>
    </g>
    ${head(a)}
    <path d="M92 38 L95 52 M100 35 L100 52 M108 38 L105 52" stroke="${a.dark}" stroke-width="4.5" stroke-linecap="round"/>
    <ellipse cx="100" cy="110" rx="22" ry="15" fill="${a.light}"/>
    ${eyes(82)}${cheeks(104, 36)}
    <path d="M70 106 L44 101 M70 113 L44 117 M130 106 L156 101 M130 113 L156 117" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M94 100 L106 100 L100 107 Z" fill="#FF6B8B" ${st(2.5)}/>
    ${mouth(111, 8)}`,

  dog: (a) => `
    ${body(a, `<path d="M136 168 Q170 150 160 128" fill="none" stroke="${OL}" stroke-width="15" stroke-linecap="round"/>
               <path d="M136 168 Q170 150 160 128" fill="none" stroke="${a.c}" stroke-width="7" stroke-linecap="round"/>`)}
    ${head(a)}
    <ellipse cx="122" cy="78" rx="18" ry="16" fill="${a.dark}" opacity=".45"/>
    <g class="c-ears">
      <path d="M60 50 Q28 48 32 98 Q36 122 56 106 Q66 82 72 56 Z" fill="${a.dark}" ${st()}/>
      <path d="M140 50 Q172 48 168 98 Q164 122 144 106 Q134 82 128 56 Z" fill="${a.dark}" ${st()}/>
    </g>
    <ellipse cx="100" cy="110" rx="26" ry="18" fill="${a.light}"/>
    ${eyes(80)}${cheeks(106, 38)}
    <ellipse cx="100" cy="100" rx="10" ry="7" fill="#2B1B12"/><ellipse cx="97" cy="98" rx="3" ry="2" fill="#fff" opacity=".8"/>
    ${mouth(113, 9)}`,

  bunny: (a) => `
    ${body(a, `<circle cx="140" cy="176" r="13" fill="#fff" ${st()}/>`)}
    <g class="c-ears">
      <ellipse cx="76" cy="20" rx="14" ry="40" fill="${a.c}" ${st()} transform="rotate(-12 76 20)"/>
      <ellipse cx="76" cy="24" rx="7" ry="29" fill="#FFB3C7" transform="rotate(-12 76 24)"/>
      <ellipse cx="124" cy="20" rx="14" ry="40" fill="${a.c}" ${st()} transform="rotate(12 124 20)"/>
      <ellipse cx="124" cy="24" rx="7" ry="29" fill="#FFB3C7" transform="rotate(12 124 24)"/>
    </g>
    ${head(a)}
    ${eyes(84)}${cheeks(106, 34)}
    <rect x="95" y="112" width="10" height="10" rx="2" fill="#fff" ${st(2.5)}/>
    <ellipse cx="100" cy="102" rx="7" ry="5" fill="#FF8FAB" ${st(2.5)}/>
    ${mouth(110, 8)}`,

  bear: (a) => `
    ${body(a)}
    <g class="c-ears">
      <circle cx="56" cy="44" r="18" fill="${a.c}" ${st()}/><circle cx="56" cy="44" r="9" fill="${a.light}"/>
      <circle cx="144" cy="44" r="18" fill="${a.c}" ${st()}/><circle cx="144" cy="44" r="9" fill="${a.light}"/>
    </g>
    ${head(a)}
    <ellipse cx="100" cy="110" rx="24" ry="17" fill="${a.light}"/>
    ${eyes(82)}${cheeks(104, 38)}
    <ellipse cx="100" cy="101" rx="10" ry="7" fill="#2B1B12"/><ellipse cx="97" cy="99" rx="3" ry="2" fill="#fff" opacity=".8"/>
    ${mouth(113, 9)}`,

  frog: (a) => `
    ${body(a)}
    <circle cx="66" cy="56" r="23" fill="${a.c}" ${st()}/><circle cx="134" cy="56" r="23" fill="${a.c}" ${st()}/>
    <ellipse cx="100" cy="98" rx="64" ry="44" fill="${a.c}" ${st()}/>
    <circle cx="66" cy="58" r="20" fill="${a.c}"/><circle cx="134" cy="58" r="20" fill="${a.c}"/>
    ${eyes(56, 34, 1.05)}${cheeks(106, 42)}
    <circle cx="94" cy="92" r="2.5" fill="${a.dark}"/><circle cx="106" cy="92" r="2.5" fill="${a.dark}"/>
    ${mouth(106, 20)}`,

  pig: (a) => `
    ${body(a, `<path d="M138 166 q14 -4 12 -14 q-2 -8 -9 -4 q-6 6 4 10 q10 2 14 -8" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`)}
    <g class="c-ears">
      <path d="M58 54 L58 22 L90 40 Z" fill="${a.c}" ${st()}/><path d="M64 46 L64 32 L80 41 Z" fill="${a.dark}" opacity=".5"/>
      <path d="M142 54 L142 22 L110 40 Z" fill="${a.c}" ${st()}/><path d="M136 46 L136 32 L120 41 Z" fill="${a.dark}" opacity=".5"/>
    </g>
    ${head(a)}
    ${eyes(78)}${cheeks(104, 38)}
    <ellipse cx="100" cy="104" rx="21" ry="15" fill="#FF8FAB" ${st()}/>
    <ellipse cx="93" cy="104" rx="3.5" ry="5.5" fill="#B83260"/><ellipse cx="107" cy="104" rx="3.5" ry="5.5" fill="#B83260"/>
    ${mouth(124, 8)}`,

  chick: (a) => `
    ${body(a)}
    <path d="M94 38 Q88 16 99 22 Q103 8 108 24 Q118 14 112 38 Z" fill="${a.c}" ${st()}/>
    ${head(a)}
    ${eyes(82)}${cheeks(104, 36)}
    <path class="c-smile" d="M86 100 L114 100 L100 116 Z" fill="${a.dark}" ${st(3.5)}/>
    <g class="c-open"><path d="M86 98 L114 98 L100 106 Z" fill="${a.dark}" ${st(3.5)}/>
      <path d="M89 110 L111 110 L100 122 Z" fill="${a.dark}" ${st(3.5)}/></g>`,

  lion: (a) => {
    let mane = '';
    for (let i = 0; i < 14; i++) {
      const t = (i / 14) * Math.PI * 2;
      mane += `<circle cx="${(100 + Math.cos(t) * 58).toFixed(1)}" cy="${(86 + Math.sin(t) * 58).toFixed(1)}" r="20" fill="#F08C00" ${st()}/>`;
    }
    return `
    ${body(a, `<path d="M136 172 Q176 170 172 140" fill="none" stroke="${OL}" stroke-width="12" stroke-linecap="round"/>
               <path d="M136 172 Q176 170 172 140" fill="none" stroke="${a.c}" stroke-width="5" stroke-linecap="round"/>
               <circle cx="172" cy="136" r="10" fill="#F08C00" ${st()}/>`)}
    <g class="c-ears">${mane}<circle cx="100" cy="86" r="62" fill="#F08C00"/></g>
    <circle cx="64" cy="46" r="13" fill="${a.c}" ${st()}/><circle cx="136" cy="46" r="13" fill="${a.c}" ${st()}/>
    ${head(a, 50)}
    <ellipse cx="100" cy="110" rx="24" ry="16" fill="${a.light}"/>
    ${eyes(82)}${cheeks(104, 36)}
    <path d="M91 99 L109 99 L100 108 Z" fill="#7A4E2A" ${st(2.5)}/>
    ${mouth(113, 9)}`;
  },

  cow: (a) => `
    ${body(a, '', `<ellipse cx="80" cy="150" rx="12" ry="9" fill="${a.dark}"/><ellipse cx="122" cy="172" rx="10" ry="7" fill="${a.dark}"/>`)}
    <path d="M66 46 Q52 16 70 20 Q74 34 82 40 Z" fill="#FFF3BF" ${st()}/>
    <path d="M134 46 Q148 16 130 20 Q126 34 118 40 Z" fill="#FFF3BF" ${st()}/>
    <g class="c-ears">
      <ellipse cx="44" cy="76" rx="20" ry="10" fill="#fff" ${st()} transform="rotate(-20 44 76)"/>
      <ellipse cx="44" cy="76" rx="11" ry="5" fill="#FFB3C6" transform="rotate(-20 44 76)"/>
      <ellipse cx="156" cy="76" rx="20" ry="10" fill="#fff" ${st()} transform="rotate(20 156 76)"/>
      <ellipse cx="156" cy="76" rx="11" ry="5" fill="#FFB3C6" transform="rotate(20 156 76)"/>
    </g>
    ${head(a)}
    <ellipse cx="76" cy="60" rx="14" ry="11" fill="${a.dark}"/><ellipse cx="130" cy="68" rx="9" ry="12" fill="${a.dark}"/>
    ${eyes(78)}
    <ellipse cx="100" cy="114" rx="32" ry="20" fill="#FFB3C6" ${st()}/>
    <ellipse cx="87" cy="110" rx="4" ry="5.5" fill="#C2255C"/><ellipse cx="113" cy="110" rx="4" ry="5.5" fill="#C2255C"/>
    ${mouth(120, 8)}`,

  monkey: (a) => `
    ${body(a, `<path d="M134 172 Q180 178 176 140 Q172 118 156 128" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round"/>
               <path d="M134 172 Q180 178 176 140 Q172 118 156 128" fill="none" stroke="${a.c}" stroke-width="6" stroke-linecap="round"/>`)}
    <g class="c-ears">
      <circle cx="46" cy="88" r="18" fill="${a.c}" ${st()}/><circle cx="46" cy="88" r="10" fill="${a.light}"/>
      <circle cx="154" cy="88" r="18" fill="${a.c}" ${st()}/><circle cx="154" cy="88" r="10" fill="${a.light}"/>
    </g>
    ${head(a)}
    <path d="M100 72 C 80 52, 56 62, 62 90 C 64 110, 78 130, 100 131 C 122 130, 136 110, 138 90 C 144 62, 120 52, 100 72 Z" fill="${a.light}"/>
    ${eyes(88, 19)}${cheeks(110, 30)}
    <circle cx="96" cy="106" r="2.6" fill="${OL}"/><circle cx="104" cy="106" r="2.6" fill="${OL}"/>
    ${mouth(115, 10)}`,

  elephant: (a) => `
    ${body(a)}
    <g class="c-ears">
      <ellipse cx="44" cy="88" rx="32" ry="40" fill="${a.c}" ${st()}/><ellipse cx="46" cy="88" rx="19" ry="27" fill="#FFC9D6"/>
      <ellipse cx="156" cy="88" rx="32" ry="40" fill="${a.c}" ${st()}/><ellipse cx="154" cy="88" rx="19" ry="27" fill="#FFC9D6"/>
    </g>
    ${head(a, 50)}
    ${eyes(80)}${cheeks(104, 36)}
    ${mouth(118, 7, 128)}
    <path class="c-trunk" d="M90 96 C 88 124, 92 140, 104 146 C 114 150, 122 140, 113 136 C 105 132, 108 118, 110 96 Z" fill="${a.c}" ${st()}/>
    <path d="M92 114 h14 M92 124 h14" stroke="${a.dark}" stroke-width="2.5" stroke-linecap="round"/>`,

  panda: (a) => `
    ${body(a)}
    <g class="c-ears">
      <circle cx="58" cy="42" r="17" fill="${a.dark}" ${st()}/><circle cx="142" cy="42" r="17" fill="${a.dark}" ${st()}/>
    </g>
    ${head(a)}
    <ellipse cx="78" cy="88" rx="15" ry="19" fill="${a.dark}" transform="rotate(-25 78 88)"/>
    <ellipse cx="122" cy="88" rx="15" ry="19" fill="${a.dark}" transform="rotate(25 122 88)"/>
    ${eyes(86, 22, 0.8)}${cheeks(108, 38)}
    <ellipse cx="100" cy="104" rx="8" ry="6" fill="${a.dark}"/>
    ${mouth(113, 8)}`,
};

export function animal(kind, cls = '') {
  const a = ANIMALS[kind];
  return `<svg class="char ${cls}" data-kind="${kind}" viewBox="0 -22 200 222" style="--d:${delay()}s" aria-label="${a.name}"><g class="c-bob">${BUILD[kind](a)}</g></svg>`;
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

export function blox(color, cls = '') {
  const k = COLORS[color] || { c: color, d: color };
  return `<svg class="char blox ${cls}" viewBox="0 -10 200 210" style="--d:${delay()}s"><g class="c-bob">
    <rect x="40" y="-4" width="36" height="22" rx="7" fill="${k.c}" ${st()}/>
    <rect x="124" y="-4" width="36" height="22" rx="7" fill="${k.c}" ${st()}/>
    <rect x="14" y="12" width="172" height="176" rx="30" fill="${k.d}"/>
    <rect x="14" y="12" width="172" height="158" rx="30" fill="${k.c}"/>
    <rect x="14" y="12" width="172" height="176" rx="30" fill="none" ${st(5)}/>
    <path d="M38 64 Q38 36 66 36 L96 36" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55" fill="none"/>
    ${eyes(88, 32, 1.3)}${cheeks(124, 54)}
    ${mouth(126, 16)}
  </g></svg>`;
}

/* ---------- Foods ---------- */
export const FOOD_FOR = { bunny: 'carrot', dog: 'bone', monkey: 'banana', cat: 'fish', bear: 'honey', chick: 'corn', pig: 'apple', panda: 'bamboo' };
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
