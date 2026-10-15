// Realistic-style animal drawings (young animals, natural colours, fur
// texture, light and shadow), built procedurally as SVG so they can still
// blink, look around, talk and wag. Animation hooks (see css/style.css):
// c-bob, c-eyes, c-pupil, c-ears, c-tail, c-leg-*, c-arm-*, c-trunk,
// c-smile / c-open (mouth closed / open).

export const ANIMALS = {
  cat:      { name: 'kitty',    plural: 'kitties',   sound: 'Meow!' },
  dog:      { name: 'puppy',    plural: 'puppies',   sound: 'Woof woof!' },
  bunny:    { name: 'bunny',    plural: 'bunnies',   sound: 'Sniff sniff!' },
  bear:     { name: 'bear',     plural: 'bears',     sound: 'Grrr!' },
  frog:     { name: 'froggy',   plural: 'froggies',  sound: 'Ribbit ribbit!' },
  pig:      { name: 'piggy',    plural: 'piggies',   sound: 'Oink oink!' },
  chick:    { name: 'chick',    plural: 'chicks',    sound: 'Cheep cheep!' },
  lion:     { name: 'lion',     plural: 'lions',     sound: 'Roar!' },
  cow:      { name: 'cow',      plural: 'cows',      sound: 'Moooo!' },
  monkey:   { name: 'monkey',   plural: 'monkeys',   sound: 'Ooh ooh aah aah!' },
  elephant: { name: 'elephant', plural: 'elephants', sound: 'Toot toot!' },
  panda:    { name: 'panda',    plural: 'pandas',    sound: 'Munch munch!' },
};
export const ANIMAL_KINDS = Object.keys(ANIMALS);

/* ================= drawing kit ================= */
let UID = 0;
const r1 = (n) => Math.round(n * 10) / 10;
const TAU = Math.PI * 2;

function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mix(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  const tgt = t > 0 ? 255 : 0, k = Math.abs(t);
  const ch = (v) => Math.round(v + (tgt - v) * k);
  return '#' + ((1 << 24) | (ch(n >> 16) << 16) | (ch((n >> 8) & 255) << 8) | ch(n & 255)).toString(16).slice(1);
}

// One kit per drawing: unique ids for gradients/clips + a seeded random.
function kit(kind) {
  const id = 'r' + (UID++).toString(36);
  let seed = 0;
  for (const c of kind) seed = seed * 31 + c.charCodeAt(0);
  const rnd = mulberry(seed);
  const defs = [];
  let n = 0;
  const K = {
    rnd,
    defs,
    // light-from-top-left radial shading for a colour
    fur(c, { hi = 0.28, lo = -0.22, cx = '38%', cy = '28%', r = '78%' } = {}) {
      const g = `${id}g${n++}`;
      defs.push(`<radialGradient id="${g}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${mix(c, hi)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${mix(c, lo)}"/></radialGradient>`);
      return `url(#${g})`;
    },
    lin(stops, x2 = 0, y2 = 1) {
      const g = `${id}g${n++}`;
      defs.push(`<linearGradient id="${g}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`);
      return `url(#${g})`;
    },
    // soft, blur-free shadow / glow blob
    soft(cx, cy, rx, ry, color = '#000', op = 0.3, rot = 0) {
      const g = `${id}g${n++}`;
      defs.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g})"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;
    },
    clip(inner) {
      const c = `${id}c${n++}`;
      defs.push(`<clipPath id="${c}">${inner}</clipPath>`);
      return `url(#${c})`;
    },
  };
  return K;
}

// Closed outline around an ellipse, with optional soft fur tufts and shape tweaks.
function blob(K, cx, cy, rx, ry, { n: n0 = 30, tuft = 0, rot = 0, mul = null, lean = 0.2 } = {}) {
  const pt = (a, extra = 0) => {
    const c = Math.cos(a), s = Math.sin(a);
    let r = (rx * ry) / Math.sqrt((ry * c) ** 2 + (rx * s) ** 2);
    if (mul) r *= mul(a);
    r += extra;
    return [cx + Math.cos(a + rot) * r, cy + Math.sin(a + rot) * r];
  };
  const n = tuft ? Math.round(n0 * 1.5) : n0;
  const step = TAU / n;
  let [x, y] = pt(0);
  let d = `M${r1(x)} ${r1(y)}`;
  for (let k = 0; k < n; k++) {
    const a = k * step;
    if (tuft) {
      const t = tuft * 0.6 * (0.6 + K.rnd() * 0.8);
      const [c1x, c1y] = pt(a + step * 0.2, t * 0.25);
      const [tx, ty] = pt(a + step * (0.5 + lean), t);
      const [c2x, c2y] = pt(a + step * 0.9, -t * 0.1);
      const [nx, ny] = pt(a + step);
      d += ` Q${r1(c1x)} ${r1(c1y)} ${r1(tx)} ${r1(ty)} Q${r1(c2x)} ${r1(c2y)} ${r1(nx)} ${r1(ny)}`;
    } else {
      const [cx2, cy2] = pt(a + step / 2);
      const [nx, ny] = pt(a + step);
      d += ` Q${r1(2 * cx2 - (x + nx) / 2)} ${r1(2 * cy2 - (y + ny) / 2)} ${r1(nx)} ${r1(ny)}`;
      x = nx; y = ny;
    }
  }
  return d + 'Z';
}

// Fine hair strokes scattered inside an ellipse, flowing outward/downward.
function hair(K, cx, cy, rx, ry, count, color, { op = 0.35, len = 6, w = 1.1, down = 0.6 } = {}) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = K.rnd() * TAU, rr = Math.sqrt(K.rnd());
    const x = cx + Math.cos(a) * rx * rr, y = cy + Math.sin(a) * ry * rr;
    const out = Math.atan2(y - cy, x - cx);
    const dir = out * (1 - down) + (Math.PI / 2) * down + (K.rnd() - 0.5) * 0.6;
    const L = len * (0.6 + K.rnd() * 0.8);
    const ex = x + Math.cos(dir) * L, ey = y + Math.sin(dir) * L;
    const bend = (K.rnd() - 0.5) * L * 0.5;
    d += `M${r1(x)} ${r1(y)}Q${r1((x + ex) / 2 + bend)} ${r1((y + ey) / 2)} ${r1(ex)} ${r1(ey)}`;
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;
}

const line = (c, w = 1.6) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// Realistic eye: almond/round lid shape, gradient iris, species pupil, wet highlights.
function eye(K, x, y, { w = 10, h = 8, iris = '#8B6A2E', pupil = 'round', irisR = 0.95, rim = '#1E130C', tilt = 0, lid = null, white = '#F4EEE6' } = {}) {
  const shape = `M${x - w} ${y + h * 0.1} Q${x - w * 0.15} ${y - h * 1.85} ${x + w} ${y - h * 0.05} Q${x + w * 0.2} ${y + h * 1.75} ${x - w} ${y + h * 0.1} Z`;
  const tr = tilt ? ` transform="rotate(${tilt} ${x} ${y})"` : '';
  const clip = K.clip(`<path d="${shape}"${tr}/>`);
  const ir = h * irisR;
  const g = `${'i'}${UID++}`;
  K.defs.push(`<radialGradient id="${g}" cx="50%" cy="45%" r="55%"><stop offset="0" stop-color="${mix(iris, 0.35)}"/><stop offset=".6" stop-color="${iris}"/><stop offset="1" stop-color="${mix(iris, -0.55)}"/></radialGradient>`);
  const pup = pupil === 'slit' ? `<ellipse cx="${x}" cy="${y}" rx="${r1(ir * 0.22)}" ry="${r1(ir * 0.92)}" fill="#0B0705"/>`
    : pupil === 'bar' ? `<ellipse cx="${x}" cy="${y}" rx="${r1(ir * 0.6)}" ry="${r1(ir * 0.4)}" fill="#0B0705"/>`
      : `<circle cx="${x}" cy="${y}" r="${r1(ir * (pupil === 'big' ? 0.62 : 0.48))}" fill="#0B0705"/>`;
  return `<g clip-path="${clip}">
      <path d="${shape}" fill="${white}"${tr}/>
      <g class="c-pupil"><circle cx="${x}" cy="${y}" r="${r1(ir)}" fill="url(#${g})"/>${pup}
        <circle cx="${x}" cy="${y}" r="${r1(ir)}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${r1(ir * 0.16)}"/></g>
      <path d="${shape}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="${r1(h * 0.3)}"${tr}/>
    </g>
    <circle cx="${r1(x + ir * 0.38)}" cy="${r1(y - ir * 0.42)}" r="${r1(Math.max(1.2, ir * 0.26))}" fill="#fff" opacity=".95"/>
    <circle cx="${r1(x - ir * 0.35)}" cy="${r1(y + ir * 0.4)}" r="${r1(Math.max(0.6, ir * 0.1))}" fill="#fff" opacity=".7"/>
    <path d="${shape}" fill="none" ${line(rim, 1.7)}${tr}/>
    ${lid ? `<path d="M${x - w} ${y + h * 0.1} Q${x - w * 0.15} ${y - h * 1.85} ${x + w} ${y - h * 0.05}" fill="none" ${line(lid, 1.6)}${tr} opacity=".55"/>` : ''}`;
}
const eyes = (K, y, dx, o = {}) => `<g class="c-eyes">${eye(K, 100 - dx, y, { ...o, tilt: o.tilt || 0 })}${eye(K, 100 + dx, y, { ...o, tilt: -(o.tilt || 0) })}</g>`;

// Open mouth (talking / eating), hidden until .talk/.open/.sing.
const openMouth = (x, y, w, h = w) => `<g class="c-open">
  <path d="M${x - w} ${y} Q${x} ${y - h * 0.25} ${x + w} ${y} Q${x + w * 0.8} ${y + h * 1.2} ${x} ${y + h * 1.3} Q${x - w * 0.8} ${y + h * 1.2} ${x - w} ${y} Z" fill="#5A1A22" ${line('#2B0C10', 1.4)}/>
  <ellipse cx="${x}" cy="${r1(y + h * 0.95)}" rx="${r1(w * 0.55)}" ry="${r1(h * 0.35)}" fill="#E07A86"/></g>`;

// Whiskers, light and fine.
function whiskers(x, y, spread = 30, color = '#FFFFFF', op = 0.85) {
  let d = '';
  for (const s of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      const sy = y + i * 3, ex = x + s * spread, ey = sy - 6 + i * 6;
      d += `M${x + s * 8} ${sy}Q${x + s * spread * 0.6} ${sy - 2 + i * 2} ${ex} ${ey}`;
    }
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width=".9" stroke-linecap="round" opacity="${op}"/>`;
}

/* ---------- shared bodies ---------- */
// Sitting four-legged animal seen from the front (cat, dog, lion, pig, cow, bunny).
function sitQuad(K, c, { neck = true, headShift = 0, tail = '', chest = true, socks = null, hoof = null, furTuft = 2.2, legW = 15, hindFoot = 17, front = '' } = {}) {
  const F = K.fur(c.base), L = K.fur(c.light, { hi: 0.4, lo: -0.12 });
  const ol = c.ol;
  const tuft = furTuft;
  const leg = (x, cls) => {
    const top = 134, bot = 193, hw = legW / 2;
    const d = `M${x - hw} ${top} C ${x - hw - 1} ${top + 30}, ${x - hw - 2} ${bot - 18}, ${x - hw - 2} ${bot - 6} Q${x - hw - 2} ${bot + 2} ${x} ${bot + 2} Q${x + hw + 2} ${bot + 2} ${x + hw + 2} ${bot - 6} C ${x + hw + 2} ${bot - 18}, ${x + hw + 1} ${top + 30}, ${x + hw} ${top}`;
    const lower = socks ? `<path d="M${x - hw - 2} ${bot - 22} Q${x} ${bot - 26} ${x + hw + 2} ${bot - 22} L${x + hw + 2} ${bot - 6} Q${x + hw + 2} ${bot + 2} ${x} ${bot + 2} Q${x - hw - 2} ${bot + 2} ${x - hw - 2} ${bot - 6} Z" fill="${socks}"/>` : '';
    const hf = hoof ? `<path d="M${x - hw - 2} ${bot - 7} Q${x} ${bot - 10} ${x + hw + 2} ${bot - 7} Q${x + hw + 2} ${bot + 2} ${x} ${bot + 2} Q${x - hw - 2} ${bot + 2} ${x - hw - 2} ${bot - 7} Z" fill="${hoof}" ${line(ol, 1.2)}/><path d="M${x} ${bot - 8} V${bot + 1.5}" ${line('#000', 1.2)} opacity=".6"/>`
      : `<path d="M${x - 3} ${bot + 1.5} v-4 M${x + 3} ${bot + 1.5} v-4" ${line(ol, 1.1)} opacity=".7"/>`;
    return `<g class="${cls}"><path d="${d}" fill="${F}" ${line(ol, 1.2)} stroke-opacity=".45"/>${lower}${hf}
</g>`;
  };
  const foot = (x) => `<path d="${blob(K, x, 190, hindFoot, 7, { n: 14, tuft: hoof ? 0 : 1 })}" fill="${hoof || F}" ${line(ol, 1.3)}/>`;
  return `${tail}
    ${foot(54)}${foot(146)}
    <path d="${blob(K, 66, 165, 30, 28, { n: 26, tuft })}" fill="${F}" ${line(ol, 1.4)}/>
    <path d="${blob(K, 134, 165, 30, 28, { n: 26, tuft })}" fill="${F}" ${line(ol, 1.4)}/>
    ${hair(K, 66, 165, 24, 22, 26, c.dark, { op: 0.3 })}${hair(K, 134, 165, 24, 22, 26, c.dark, { op: 0.3 })}
    <path d="${blob(K, 100, 140, 38, 56, { n: 34, tuft, mul: (a) => 1 - 0.2 * Math.max(0, -Math.sin(a)) })}" fill="${F}" ${line(ol, 1.4)}/>
    ${hair(K, 100, 140, 30, 44, 40, c.dark, { op: 0.28 })}
    ${leg(88, 'c-leg-l')}${leg(112, 'c-leg-r')}
    ${neck ? `<path d="${blob(K, 100, 100, 28, 22, { n: 26, tuft })}" fill="${c.base}"/>` : ''}
    ${chest ? `<path d="${blob(K, 100, 122, 21, 34, { n: 24, tuft: tuft + 1, mul: (a) => 1 - 0.25 * Math.max(0, -Math.sin(a)) })}" fill="${L}"/>` : ''}
    ${front}
    ${K.soft(100, 96, 30, 10, '#000', neck ? 0.28 : 0.15)}
    ${headShift ? `<g transform="translate(0 ${headShift})"><!--H-->` : ''}`;
}

// Sitting bear-like animal: round tummy, arms down, legs out front with pads.
function sitTeddy(K, c, { arm = null, legC = null, pad = '#3A2A22', belly = true, tuft = 2.4, longArms = false, behind = '', front = '' } = {}) {
  const F = K.fur(c.base), A = arm ? K.fur(arm) : F, Lg = legC ? K.fur(legC) : F;
  const ol = c.ol;
  const ay = longArms ? 150 : 142, ary = longArms ? 34 : 25;
  const pads = (x) => pad ? `<ellipse cx="${x}" cy="186" rx="9" ry="7" fill="${pad}"/>
    <circle cx="${x - 9}" cy="177" r="3" fill="${pad}"/><circle cx="${x - 3}" cy="174" r="3" fill="${pad}"/><circle cx="${x + 3}" cy="174" r="3" fill="${pad}"/><circle cx="${x + 9}" cy="177" r="3" fill="${pad}"/>` : '';
  return `${behind}
    <path d="${blob(K, 100, 150, 44, 44, { n: 36, tuft })}" fill="${F}" ${line(ol, 1.4)}/>
    ${belly ? `<path d="${blob(K, 100, 158, 26, 26, { n: 24, tuft: tuft * 0.8 })}" fill="${K.fur(c.light)}" opacity=".9"/>` : ''}
    ${hair(K, 100, 150, 38, 38, 50, c.dark, { op: 0.3 })}
    <path d="${blob(K, 100, 104, 30, 18, { n: 26, tuft })}" fill="${arm && !legC ? F : c.base}"/>
    ${front}
    ${K.soft(100, 100, 34, 10, '#000', 0.22)}
    <g class="c-arm-l"><path d="${blob(K, 60, ay, 12, ary, { n: 18, tuft: tuft * 0.8, rot: 0.22 })}" fill="${A}" ${line(ol, 1.4)}/></g>
    <g class="c-arm-r"><path d="${blob(K, 140, ay, 12, ary, { n: 18, tuft: tuft * 0.8, rot: -0.22 })}" fill="${A}" ${line(ol, 1.4)}/></g>
    <path d="${blob(K, 68, 181, 23, 15, { n: 20, tuft: tuft * 0.7 })}" fill="${Lg}" ${line(ol, 1.4)}/>
    <path d="${blob(K, 132, 181, 23, 15, { n: 20, tuft: tuft * 0.7 })}" fill="${Lg}" ${line(ol, 1.4)}/>
    ${pads(66)}${pads(134)}
    <g transform="translate(0 7)"><!--H-->`;
}

/* ================= the animals ================= */
const BUILD = {
  // Orange tabby kitten
  cat(K) {
    const c = { base: '#D98A45', light: '#F7E6D2', dark: '#9A5226', ol: '#5E3216' };
    const F = K.fur(c.base), W = K.fur(c.light, { hi: 0.5, lo: -0.08 });
    const tail = `<g class="c-tail"><path d="M136 186 C 168 192, 182 176, 176 150 C 172 136, 178 126, 186 128" fill="none" stroke="${c.ol}" stroke-width="15.5" stroke-linecap="round"/>
      <path d="M136 186 C 168 192, 182 176, 176 150 C 172 136, 178 126, 186 128" fill="none" stroke="${F}" stroke-width="13" stroke-linecap="round"/>
      <path d="M150 186 l3 -11 M164 184 l1 -12 M174 170 l-11 -2 M176 155 l-11 1 M175 141 l-10 -3" ${line(c.dark, 3.5)} opacity=".75"/></g>`;
    const stripes = `<path d="M70 132 q9 3 13 10 M66 150 q10 2 15 9 M130 132 q-9 3 -13 10 M134 150 q-10 2 -15 9 M60 168 q8 -2 14 2 M140 168 q-8 -2 -14 2" fill="none" ${line(c.dark, 3.2)} opacity=".6"/>`;
    const head = blob(K, 100, 58, 37, 31, { n: 40, tuft: 2.6, mul: (a) => 1 + 0.26 * Math.max(0, Math.sin(a)) * Math.abs(Math.cos(a)) });
    return `${sitQuad(K, c, { tail, socks: W, front: stripes })}
    <g class="c-ears">
      <path d="M64 44 Q58 20 62 6 Q80 14 92 30 Z" fill="${F}" ${line(c.ol, 1.4)}/>
      <path d="M68 38 Q65 22 66 13 Q78 20 86 31 Z" fill="${K.fur('#E9A49A', { hi: 0.2 })}"/>
      ${hair(K, 74, 30, 6, 8, 10, '#FFFFFF', { op: 0.75, len: 6, down: -0.3 })}
      <path d="M136 44 Q142 20 138 6 Q120 14 108 30 Z" fill="${F}" ${line(c.ol, 1.4)}/>
      <path d="M132 38 Q135 22 134 13 Q122 20 114 31 Z" fill="${K.fur('#E9A49A', { hi: 0.2 })}"/>
      ${hair(K, 126, 30, 6, 8, 10, '#FFFFFF', { op: 0.75, len: 6, down: -0.3 })}
    </g>
    <path d="${head}" fill="${F}" ${line(c.ol, 1.4)}/>
    ${hair(K, 100, 54, 30, 22, 50, c.dark, { op: 0.3, len: 5 })}
    <path d="M90 30 Q93 38 92 44 M100 28 V43 M110 30 Q107 38 108 44 M82 34 Q86 40 86 46 M118 34 Q114 40 114 46" fill="none" ${line(c.dark, 2.6)} opacity=".8"/>
    <path d="M70 60 q6 1 10 -1 M69 66 q7 1 11 -2 M130 60 q-6 1 -10 -1 M131 66 q-7 1 -11 -2" fill="none" ${line(c.dark, 2.2)} opacity=".7"/>
    <path d="${blob(K, 100, 76, 17, 11, { n: 20, tuft: 1.6 })}" fill="${W}"/>
    <path d="M100 56 C 94 60, 92 66, 94 70 L106 70 C 108 66, 106 60, 100 56 Z" fill="${W}" opacity=".7"/>
    ${eyes(K, 56, 15, { w: 10, h: 9.5, iris: '#9BB43C', pupil: 'slit', irisR: 1.05, tilt: 10, lid: '#3A2010' })}
    <path d="M95.5 68 Q100 66 104.5 68 Q103 72.5 100 73 Q97 72.5 95.5 68 Z" fill="${K.fur('#D98880', { hi: 0.3 })}" ${line('#7A3A30', 0.9)}/>
    <path class="c-smile" d="M100 73 V77 M100 77 Q96 81 92 79 M100 77 Q104 81 108 79" fill="none" ${line('#5E3216', 1.3)}/>
    ${openMouth(100, 77, 6, 5)}
    <circle cx="90" cy="76" r=".8" fill="#5E3216"/><circle cx="87" cy="73" r=".8" fill="#5E3216"/><circle cx="110" cy="76" r=".8" fill="#5E3216"/><circle cx="113" cy="73" r=".8" fill="#5E3216"/>
    ${whiskers(100, 75, 36)}`;
  },

  // Golden retriever puppy
  dog(K) {
    const c = { base: '#DDAA66', light: '#F4DDB6', dark: '#A4733A', ol: '#5C3C18' };
    const F = K.fur(c.base), Lt = K.fur(c.light, { hi: 0.4 }), E = K.fur('#C98E4E');
    const tail = `<g class="c-tail"><path d="${blob(K, 156, 148, 9, 30, { n: 22, tuft: 4.5, rot: 0.55 })}" fill="${F}" ${line(c.ol, 1.3)}/></g>`;
    return `${sitQuad(K, c, { tail, furTuft: 2.6, front: `<path d="M74 110 Q100 122 126 110 L126 116 Q100 129 74 116 Z" fill="#C0392B" ${line('#6E1F18', 1.2)}/><circle cx="100" cy="126" r="5" fill="${K.fur('#E2B93B')}" ${line('#7A5A10', 1)}/>` })}
    <path d="${blob(K, 100, 54, 33, 31, { n: 36, tuft: 2.2 })}" fill="${F}" ${line(c.ol, 1.4)}/>
    ${hair(K, 100, 50, 26, 22, 40, c.dark, { op: 0.28, len: 5 })}
    <path d="${blob(K, 100, 74, 19, 14, { n: 24, tuft: 1.2 })}" fill="${Lt}" ${line(c.ol, 1.1)}/>
    ${K.soft(100, 64, 18, 6, '#000', 0.18)}
    <g class="c-ears">
      <path d="${blob(K, 66, 68, 12, 26, { n: 22, tuft: 3, rot: 0.28 })}" fill="${E}" ${line(c.ol, 1.3)}/>
      <path d="${blob(K, 134, 68, 12, 26, { n: 22, tuft: 3, rot: -0.28 })}" fill="${E}" ${line(c.ol, 1.3)}/>
      ${hair(K, 66, 70, 8, 20, 14, c.ol, { op: 0.35, len: 7, down: 0.9 })}${hair(K, 134, 70, 8, 20, 14, c.ol, { op: 0.35, len: 7, down: 0.9 })}
    </g>
    <path d="M80 44 q6 -4 12 -1 M120 44 q-6 -4 -12 -1" fill="none" ${line(c.light, 2.4)} opacity=".8"/>
    ${eyes(K, 52, 14, { w: 8.5, h: 8.5, iris: '#6B3F1C', pupil: 'big', irisR: 1.15, lid: '#2A1708' })}
    <path d="M91 66 Q100 61 109 66 Q108 73 100 74 Q92 73 91 66 Z" fill="${K.fur('#2A2220', { hi: 0.25 })}"/>
    <ellipse cx="96" cy="65" rx="3" ry="1.5" fill="#fff" opacity=".55"/>
    <path d="M95 70 q2 1 3 0 M102 70 q2 1 3 0" ${line('#000', 1)} opacity=".6"/>
    <path class="c-smile" d="M100 74 V79 M100 79 Q95 84 89 81 M100 79 Q105 84 111 81" fill="none" ${line('#4A2E14', 1.4)}/>
    <path class="c-smile" d="M96 82 Q100 92 104 82 Z" fill="#E77B8A" ${line('#9A3A48', 0.9)}/>
    ${openMouth(100, 79, 7, 6)}
    <circle cx="90" cy="76" r=".8" fill="#5C3C18"/><circle cx="110" cy="76" r=".8" fill="#5C3C18"/>`;
  },

  // Wild-coloured brown bunny
  bunny(K) {
    const c = { base: '#A9876A', light: '#F1E8DE', dark: '#6E5440', ol: '#4A3626' };
    const F = K.fur(c.base), W = K.fur(c.light, { hi: 0.5 }), P = K.fur('#E6B1A3', { hi: 0.2 });
    const ear = (x, rot) => `<path d="${blob(K, x, 12, 10, 36, { n: 26, tuft: 1.3, rot })}" fill="${F}" ${line(c.ol, 1.3)}/>
      <path d="${blob(K, x, 14, 5.5, 28, { n: 18, rot })}" fill="${P}"/>`;
    return `${sitQuad(K, c, { chest: true, legW: 12, hindFoot: 24, furTuft: 1.8 })}
    <g class="c-ears">${ear(86, -0.16)}${ear(114, 0.16)}</g>
    <path d="${blob(K, 100, 60, 31, 28, { n: 36, tuft: 1.6, mul: (a) => 1 + 0.12 * Math.max(0, Math.sin(a)) })}" fill="${F}" ${line(c.ol, 1.4)}/>
    ${hair(K, 100, 56, 25, 20, 40, c.dark, { op: 0.3, len: 4 })}
    <path d="${blob(K, 93, 76, 10, 8, { n: 14, tuft: 1 })}" fill="${W}"/><path d="${blob(K, 107, 76, 10, 8, { n: 14, tuft: 1 })}" fill="${W}"/>
    <ellipse cx="100" cy="86" rx="8" ry="5" fill="${W}"/>
    ${eyes(K, 56, 17, { w: 8.5, h: 8, iris: '#3A2214', pupil: 'big', irisR: 1.2, lid: '#20140C', white: '#3A2214' })}
    <ellipse cx="83" cy="56" rx="10.5" ry="10" fill="none" stroke="${c.light}" stroke-width="1.6" opacity=".7"/><ellipse cx="117" cy="56" rx="10.5" ry="10" fill="none" stroke="${c.light}" stroke-width="1.6" opacity=".7"/>
    <path d="M96 71 Q100 69 104 71 Q102 75 100 75 Q98 75 96 71 Z" fill="${P}" ${line('#7A4A40', 0.9)}/>
    <path class="c-smile" d="M100 75 V79 M100 79 Q97 82 94 81 M100 79 Q103 82 106 81" fill="none" ${line(c.ol, 1.1)}/>
    <path class="c-smile" d="M97.5 81 h5 v4 q0 1 -1 1 h-3 q-1 0 -1 -1 Z" fill="#FBF7F0" ${line('#9A8A7A', 0.7)}/>
    ${openMouth(100, 79, 4.5, 4)}
    ${whiskers(100, 76, 30, '#EDE6DD', 0.8)}`;
  },

  // Brown bear cub
  bear(K) {
    const c = { base: '#7B5233', light: '#A98258', dark: '#3E2614', ol: '#2E1C0E' };
    const F = K.fur(c.base), M = K.fur('#B89068', { hi: 0.3 });
    return `${sitTeddy(K, c, { pad: '#3A2A22', tuft: 2.8 })}
    <g class="c-ears">
      <path d="${blob(K, 68, 28, 12, 11, { n: 18, tuft: 2 })}" fill="${F}" ${line(c.ol, 1.3)}/><ellipse cx="68" cy="29" rx="6" ry="5.5" fill="#3A2416"/>
      <path d="${blob(K, 132, 28, 12, 11, { n: 18, tuft: 2 })}" fill="${F}" ${line(c.ol, 1.3)}/><ellipse cx="132" cy="29" rx="6" ry="5.5" fill="#3A2416"/>
    </g>
    <path d="${blob(K, 100, 58, 37, 33, { n: 40, tuft: 2.8 })}" fill="${F}" ${line(c.ol, 1.4)}/>
    ${hair(K, 100, 54, 30, 24, 55, c.dark, { op: 0.32, len: 5 })}
    <path d="${blob(K, 100, 74, 17, 13, { n: 22, tuft: 1.2 })}" fill="${M}" ${line(c.ol, 1)}/>
    ${K.soft(100, 62, 16, 5, '#000', 0.2)}
    ${eyes(K, 54, 15, { w: 6.8, h: 6.8, iris: '#3A2010', pupil: 'big', irisR: 1.2, lid: '#160C04' })}
    <path d="M91 67 Q100 62 109 67 Q108 73 100 74 Q92 73 91 67 Z" fill="${K.fur('#231915', { hi: 0.25 })}"/>
    <ellipse cx="96" cy="66" rx="3" ry="1.4" fill="#fff" opacity=".5"/>
    <path class="c-smile" d="M100 74 V78 M100 78 Q95 82 90 80 M100 78 Q105 82 110 80" fill="none" ${line('#2E1C0E', 1.4)}/>
    ${openMouth(100, 78, 7, 6)}`;
  },

  // Green frog with golden eyes
  frog(K) {
    const c = { base: '#6FA63C', light: '#EEE9B8', dark: '#3E6B22', ol: '#28461A' };
    const S = K.fur(c.base, { hi: 0.35 }), T = K.fur(c.light, { hi: 0.3 });
    const toe = (x, y, s) => `<path d="M${x} ${y} l${-9 * s} 8 M${x} ${y} l${-2 * s} 10 M${x} ${y} l${6 * s} 9" ${line(c.ol, 4.2)}/><path d="M${x} ${y} l${-9 * s} 8 M${x} ${y} l${-2 * s} 10 M${x} ${y} l${6 * s} 9" ${line(c.base, 2.6)}/>
      <circle cx="${x - 9 * s}" cy="${y + 8}" r="2.2" fill="${c.base}" ${line(c.ol, 0.8)}/><circle cx="${x - 2 * s}" cy="${y + 10}" r="2.2" fill="${c.base}" ${line(c.ol, 0.8)}/><circle cx="${x + 6 * s}" cy="${y + 9}" r="2.2" fill="${c.base}" ${line(c.ol, 0.8)}/>`;
    const spots = [[70, 150, 6, 4], [128, 146, 7, 5], [52, 168, 5, 4], [148, 170, 6, 4], [84, 40, 4, 3], [118, 38, 3.5, 3], [100, 30, 3, 2.5]]
      .map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c.dark}" opacity=".7"/>`).join('');
    return `
    <path d="M60 150 C 30 150, 22 176, 34 188 C 44 196, 64 190, 70 178 Z" fill="${S}" ${line(c.ol, 1.4)}/>
    <path d="M140 150 C 170 150, 178 176, 166 188 C 156 196, 136 190, 130 178 Z" fill="${S}" ${line(c.ol, 1.4)}/>
    ${toe(40, 186, 1)}${toe(160, 186, -1)}
    <path d="${blob(K, 100, 150, 46, 40)}" fill="${S}" ${line(c.ol, 1.4)}/>
    <path d="${blob(K, 100, 162, 28, 26)}" fill="${T}"/>
    <g class="c-leg-l"><path d="M80 140 Q72 166 80 186" fill="none" ${line(c.ol, 13)}/><path d="M80 140 Q72 166 80 186" fill="none" stroke="${c.base}" stroke-width="10.5" stroke-linecap="round"/>${toe(80, 186, 0.7)}</g>
    <g class="c-leg-r"><path d="M120 140 Q128 166 120 186" fill="none" ${line(c.ol, 13)}/><path d="M120 140 Q128 166 120 186" fill="none" stroke="${c.base}" stroke-width="10.5" stroke-linecap="round"/>${toe(120, 186, -0.7)}</g>
    <circle cx="70" cy="44" r="19" fill="${S}" ${line(c.ol, 1.4)}/><circle cx="130" cy="44" r="19" fill="${S}" ${line(c.ol, 1.4)}/>
    <path d="M44 80 C 44 54, 66 44, 100 44 C 134 44, 156 54, 156 80 C 156 102, 132 116, 100 116 C 68 116, 44 102, 44 80 Z" fill="${S}" ${line(c.ol, 1.4)}/>
    <circle cx="70" cy="46" r="16.5" fill="${S}"/><circle cx="130" cy="46" r="16.5" fill="${S}"/>
    <path d="M48 92 Q100 124 152 92 Q140 112 100 116 Q60 112 48 92 Z" fill="${T}" opacity=".85"/>
    ${spots}
    <circle cx="56" cy="64" r="6" fill="${c.dark}" opacity=".45"/><circle cx="144" cy="64" r="6" fill="${c.dark}" opacity=".45"/>
    ${eyes(K, 42, 30, { w: 12, h: 12.5, iris: '#C9A13A', pupil: 'bar', irisR: 1.3, white: '#B8902E' })}
    ${K.soft(80, 58, 16, 6, '#fff', 0.45, -10)}${K.soft(118, 140, 14, 6, '#fff', 0.35)}
    <circle cx="94" cy="66" r="1.8" fill="${c.ol}"/><circle cx="106" cy="66" r="1.8" fill="${c.ol}"/>
    <path class="c-smile" d="M58 86 Q100 104 142 86" fill="none" ${line(c.ol, 2)}/>
    ${openMouth(100, 90, 16, 9)}`;
  },

  // Pink piglet
  pig(K) {
    const c = { base: '#F1B4AA', light: '#F8CFC6', dark: '#C9877E', ol: '#8A4E46' };
    const S = K.fur(c.base, { hi: 0.3 }), N = K.fur('#E8968C', { hi: 0.25 });
    const tail = `<g class="c-tail"><path d="M136 176 c 14 -2 18 -14 10 -18 c -8 -4 -12 6 -4 9 c 8 3 14 -4 14 -12" fill="none" ${line(c.ol, 3.2)}/><path d="M136 176 c 14 -2 18 -14 10 -18 c -8 -4 -12 6 -4 9 c 8 3 14 -4 14 -12" fill="none" ${line(c.base, 1.8)}/></g>`;
    return `${sitQuad(K, c, { tail, chest: false, hoof: '#7A5A50', furTuft: 0, legW: 14, neck: false, headShift: 10 })}
    <g class="c-ears">
      <path d="M68 40 Q56 18 54 8 Q74 10 92 28 Z" fill="${S}" ${line(c.ol, 1.3)}/><path d="M68 34 Q60 20 60 14 Q72 16 84 28 Z" fill="${c.dark}" opacity=".5"/>
      <path d="M132 40 Q144 18 146 8 Q126 10 108 28 Z" fill="${S}" ${line(c.ol, 1.3)}/><path d="M132 34 Q140 20 140 14 Q128 16 116 28 Z" fill="${c.dark}" opacity=".5"/>
    </g>
    <path d="${blob(K, 100, 58, 37, 32, { n: 30 })}" fill="${S}" ${line(c.ol, 1.4)}/>
    ${hair(K, 100, 50, 30, 22, 30, '#FFFFFF', { op: 0.45, len: 3, w: 0.7 })}
    ${eyes(K, 50, 17, { w: 7, h: 6.8, iris: '#5B6C7A', pupil: 'round', irisR: 1.1, lid: '#3A1E1A' })}
    <path d="M77 46 l-3 -3 M80 44 l-2 -4 M120 44 l2 -4 M123 46 l3 -3" ${line('#3A1E1A', 0.9)}/>
    ${K.soft(78, 66, 9, 6, '#E05A6A', 0.3)}${K.soft(122, 66, 9, 6, '#E05A6A', 0.3)}
    <ellipse cx="100" cy="70" rx="17" ry="12" fill="${N}" ${line(c.ol, 1.3)}/>
    <ellipse cx="100" cy="67" rx="12" ry="5" fill="#fff" opacity=".18"/>
    <ellipse cx="94" cy="71" rx="3" ry="4.5" fill="#6A2F2A"/><ellipse cx="106" cy="71" rx="3" ry="4.5" fill="#6A2F2A"/>
    <path class="c-smile" d="M91 87 Q100 92 109 87" fill="none" ${line(c.ol, 1.4)}/>
    ${openMouth(100, 86, 6, 5)}`;
  },

  // Fluffy chick
  chick(K) {
    const c = { base: '#F6D24A', light: '#FFF0A8', dark: '#D9A62A', ol: '#9A7414' };
    const F = K.fur(c.base, { hi: 0.4 }), B = '#F29A38';
    const leg = (x) => `<path d="M${x} 170 V188 M${x} 188 l-8 7 M${x} 188 v9 M${x} 188 l8 7" fill="none" ${line('#B4651A', 4.4)}/>
      <path d="M${x} 170 V188 M${x} 188 l-8 7 M${x} 188 v9 M${x} 188 l8 7" fill="none" ${line(B, 2.8)}/>`;
    return `${leg(88)}${leg(112)}
    <path d="${blob(K, 100, 136, 44, 44, { n: 60, tuft: 3.2 })}" fill="${F}" ${line(c.ol, 1.1)}/>
    ${hair(K, 100, 136, 38, 38, 70, '#FFFFFF', { op: 0.35, len: 4, down: 0.2 })}${hair(K, 100, 140, 38, 36, 40, c.dark, { op: 0.3, len: 4, down: 0.4 })}
    <path class="c-arm-l" d="${blob(K, 60, 134, 11, 22, { n: 22, tuft: 2.4, rot: 0.35 })}" fill="${F}" ${line(c.ol, 1.1)}/>
    <path class="c-arm-r" d="${blob(K, 140, 134, 11, 22, { n: 22, tuft: 2.4, rot: -0.35 })}" fill="${F}" ${line(c.ol, 1.1)}/>
    ${K.soft(100, 96, 30, 9, '#8A6A00', 0.3)}
    <path d="${blob(K, 100, 64, 32, 30, { n: 50, tuft: 3 })}" fill="${F}" ${line(c.ol, 1.1)}/>
    ${hair(K, 100, 62, 26, 24, 50, '#FFFFFF', { op: 0.4, len: 3.5, down: 0.1 })}
    <path d="M96 36 Q92 24 98 26 Q100 18 104 27 Q110 22 106 36" fill="${F}" ${line(c.ol, 1)}/>
    ${eyes(K, 60, 15, { w: 6.5, h: 7, iris: '#1A120C', pupil: 'big', irisR: 1.25, lid: '#140C04', white: '#1A120C' })}
    <path class="c-smile" d="M92 72 Q100 68 108 72 Q102 82 100 84 Q98 82 92 72 Z" fill="${K.fur('#F7A64A')}" ${line('#B4651A', 1)}/>
    <g class="c-open"><path d="M92 70 Q100 66 108 70 Q103 75 100 76 Q97 75 92 70 Z" fill="${K.fur('#F7A64A')}" ${line('#B4651A', 1)}/>
      <path d="M93 78 Q100 76 107 78 Q102 86 100 87 Q98 86 93 78 Z" fill="${K.fur('#F7A64A')}" ${line('#B4651A', 1)}/><path d="M94 76 Q100 78 106 76" fill="#7A2A22"/></g>`;
  },

  // Male lion with a full mane
  lion(K) {
    const c = { base: '#D7A55C', light: '#F2DDB4', dark: '#9C6A2C', ol: '#5A3A14' };
    const F = K.fur(c.base), W = K.fur(c.light, { hi: 0.45 });
    const M1 = K.fur('#8A5524', { hi: 0.25 }), M2 = K.fur('#B07436', { hi: 0.3 });
    const tail = `<g class="c-tail"><path d="M134 186 C 168 192, 182 176, 178 150" fill="none" ${line(c.ol, 9)}/><path d="M134 186 C 168 192, 182 176, 178 150" fill="none" stroke="${F}" stroke-width="6.5" stroke-linecap="round"/>
      <path d="${blob(K, 178, 144, 7, 10, { n: 14, tuft: 3 })}" fill="${M1}" ${line(c.ol, 1)}/></g>`;
    return `${sitQuad(K, c, { tail, front: `<path d="${blob(K, 100, 108, 30, 22, { n: 28, tuft: 4.5 })}" fill="${M2}"/>` })}
    <g class="c-ears">
      <path d="${blob(K, 100, 64, 56, 58, { n: 34, tuft: 9, lean: 0.4 })}" fill="${M1}" ${line(c.ol, 1.2)}/>
      <path d="${blob(K, 100, 64, 46, 48, { n: 30, tuft: 7, lean: 0.4 })}" fill="${M2}"/>
      ${hair(K, 100, 64, 50, 52, 80, '#4A2A0C', { op: 0.35, len: 8, down: 0 })}
    </g>
    <path d="${blob(K, 70, 32, 9, 8, { n: 12, tuft: 1.2 })}" fill="${F}" ${line(c.ol, 1)}/><path d="${blob(K, 130, 32, 9, 8, { n: 12, tuft: 1.2 })}" fill="${F}" ${line(c.ol, 1)}/>
    <path d="${blob(K, 100, 62, 30, 32, { n: 32, tuft: 1.6, mul: (a) => 1 - 0.12 * Math.max(0, Math.sin(a)) })}" fill="${F}" ${line(c.ol, 1.3)}/>
    ${hair(K, 100, 56, 24, 22, 40, c.dark, { op: 0.28, len: 4 })}
    <path d="M100 48 C 94 54, 92 64, 93 72 L107 72 C 108 64, 106 54, 100 48 Z" fill="${c.dark}" opacity=".25"/>
    <path d="${blob(K, 93, 80, 9, 7, { n: 14, tuft: 1 })}" fill="${W}"/><path d="${blob(K, 107, 80, 9, 7, { n: 14, tuft: 1 })}" fill="${W}"/><ellipse cx="100" cy="88" rx="7" ry="5" fill="${W}"/>
    <path d="M78 62 q5 3 10 2 M122 62 q-5 3 -10 2" fill="none" stroke="${c.light}" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
    ${eyes(K, 56, 13, { w: 8, h: 7.5, iris: '#C08A2A', pupil: 'round', irisR: 1.05, tilt: 6, lid: '#2A1406' })}
    <path d="M93 71 Q100 68 107 71 Q105 77 100 78 Q95 77 93 71 Z" fill="${K.fur('#9A5A4A', { hi: 0.2 })}" ${line('#3A1A10', 1)}/>
    <path class="c-smile" d="M100 78 V82 M100 82 Q96 85 92 84 M100 82 Q104 85 108 84" fill="none" ${line('#3A1A10', 1.3)}/>
    ${openMouth(100, 82, 6, 5)}
    <circle cx="91" cy="80" r=".8" fill="#3A1A10"/><circle cx="88" cy="83" r=".8" fill="#3A1A10"/><circle cx="109" cy="80" r=".8" fill="#3A1A10"/><circle cx="112" cy="83" r=".8" fill="#3A1A10"/>
    ${whiskers(100, 81, 30, '#FFFFFF', 0.7)}`;
  },

  // Black-and-white calf
  cow(K) {
    const c = { base: '#F5F2EC', light: '#FFFFFF', dark: '#C9C2B8', ol: '#4A443E' };
    const S = K.fur(c.base, { hi: 0.4, lo: -0.12 }), N = K.fur('#E6A9A4', { hi: 0.25 }), Bk = K.fur('#2A2626', { hi: 0.12 });
    const tail = `<g class="c-tail"><path d="M136 186 C 160 188, 170 172, 168 150" fill="none" ${line(c.ol, 4.5)}/><path d="M136 186 C 160 188, 170 172, 168 150" fill="none" ${line(c.base, 2.5)}/><path d="${blob(K, 168, 146, 4, 8, { n: 12, tuft: 2.5 })}" fill="#2A2626"/></g>`;
    const spots = `<path d="M70 128 C 80 124, 86 138, 80 148 C 72 154, 62 142, 70 128 Z M118 156 C 130 152, 138 168, 128 176 C 118 180, 112 166, 118 156 Z M56 160 C 64 158, 70 170, 62 176 C 54 178, 50 166, 56 160 Z" fill="${Bk}"/>`;
    return `${sitQuad(K, c, { tail, chest: false, hoof: '#3A3330', furTuft: 0.8, front: spots })}
    <path d="M78 26 Q74 16 80 14 Q84 20 86 26 Z M122 26 Q126 16 120 14 Q116 20 114 26 Z" fill="${K.fur('#E8DCC0')}" ${line(c.ol, 1)}/>
    <g class="c-ears">
      <path d="${blob(K, 56, 42, 17, 8, { n: 18, tuft: 1, rot: -0.35 })}" fill="${Bk}" ${line(c.ol, 1)}/><path d="${blob(K, 56, 42, 10, 4.5, { n: 12, rot: -0.35 })}" fill="#C98A86"/>
      <path d="${blob(K, 144, 42, 17, 8, { n: 18, tuft: 1, rot: 0.35 })}" fill="${S}" ${line(c.ol, 1)}/><path d="${blob(K, 144, 42, 10, 4.5, { n: 12, rot: 0.35 })}" fill="#E6A9A4"/>
    </g>
    <path d="M100 22 C 124 22, 132 38, 131 56 C 130 70, 126 80, 126 88 L 74 88 C 74 80, 70 70, 69 56 C 68 38, 76 22, 100 22 Z" fill="${S}" ${line(c.ol, 1.4)}/>
    <path d="M70 46 C 70 30, 82 22, 94 23 C 92 34, 84 44, 74 56 Z" fill="${Bk}"/><path d="M118 26 C 128 28, 132 40, 130 50 C 122 50, 114 40, 114 30 Z" fill="${Bk}"/>
    ${hair(K, 100, 30, 14, 6, 14, '#FFFFFF', { op: 0.6, len: 4, down: -0.5 })}
    ${eyes(K, 52, 18, { w: 9, h: 9, iris: '#2E1A10', pupil: 'big', irisR: 1.15, lid: '#120804' })}
    <path d="M74 47 l-3 -3 M77 45 l-2 -4 M126 47 l3 -3 M123 45 l2 -4" ${line('#120804', 1)}/>
    <path d="${blob(K, 100, 88, 30, 17)}" fill="${N}" ${line(c.ol, 1.3)}/>
    <ellipse cx="100" cy="82" rx="20" ry="5" fill="#fff" opacity=".22"/>
    <path d="M84 86 q4 -4 8 1 q-3 4 -8 -1 Z M116 86 q-4 -4 -8 1 q3 4 8 -1 Z" fill="#7A3A3A"/>
    <path class="c-smile" d="M90 98 Q100 102 110 98" fill="none" ${line('#7A3A3A', 1.4)}/>
    ${openMouth(100, 97, 7, 5)}`;
  },

  // Young chimpanzee
  monkey(K) {
    const c = { base: '#3E2E24', light: '#5A4436', dark: '#1C140E', ol: '#140C08' };
    const F = K.fur(c.base, { hi: 0.22 }), Sk = K.fur('#D8AE8A', { hi: 0.3, lo: -0.18 });
    const tail = '';
    return `${sitTeddy(K, c, { longArms: true, pad: '#B98D6C', belly: false, tuft: 3, behind: tail })}
    <ellipse cx="66" cy="186" rx="10" ry="7" fill="${Sk}"/><ellipse cx="134" cy="186" rx="10" ry="7" fill="${Sk}"/>
    <g class="c-ears">
      <ellipse cx="58" cy="60" rx="13" ry="15" fill="${Sk}" ${line(c.ol, 1.2)}/><ellipse cx="59" cy="61" rx="7" ry="9" fill="#B98266" opacity=".6"/>
      <ellipse cx="142" cy="60" rx="13" ry="15" fill="${Sk}" ${line(c.ol, 1.2)}/><ellipse cx="141" cy="61" rx="7" ry="9" fill="#B98266" opacity=".6"/>
    </g>
    <path d="${blob(K, 100, 56, 37, 35, { n: 40, tuft: 3 })}" fill="${F}" ${line(c.ol, 1.3)}/>
    ${hair(K, 100, 48, 30, 26, 50, '#7A5E4A', { op: 0.4, len: 6 })}
    <path d="M100 40 C 84 34, 66 42, 68 58 C 68 70, 74 78, 76 84 C 80 98, 90 102, 100 102 C 110 102, 120 98, 124 84 C 126 78, 132 70, 132 58 C 134 42, 116 34, 100 40 Z" fill="${Sk}" ${line('#7A5040', 1)}/>
    <path d="M74 50 Q87 42 100 50 Q113 42 126 50" fill="none" ${line('#9A6A50', 2.4)} opacity=".8"/>
    ${eyes(K, 57, 13, { w: 7.5, h: 7.2, iris: '#5A3418', pupil: 'big', irisR: 1.1, lid: '#3A2010' })}
    ${K.soft(100, 66, 10, 6, '#7A4030', 0.25)}
    <ellipse cx="96" cy="72" rx="2" ry="1.4" fill="#4A2A1C"/><ellipse cx="104" cy="72" rx="2" ry="1.4" fill="#4A2A1C"/>
    <path d="${blob(K, 100, 86, 17, 12)}" fill="${K.fur('#E2BC9A', { hi: 0.3 })}" ${line('#8A5A44', 1)}/>
    <path class="c-smile" d="M88 86 Q100 94 112 86" fill="none" ${line('#5A3020', 1.6)}/>
    ${openMouth(100, 86, 9, 7)}`;
  },

  // Baby elephant
  elephant(K) {
    const c = { base: '#9A9590', light: '#B8B3AD', dark: '#6E6964', ol: '#46413C' };
    const S = K.fur(c.base, { hi: 0.25 }), Ear = K.fur('#8F8A85', { hi: 0.2 });
    const wr = (x1, y1, x2, y2, curve = 3) => `M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + curve} ${x2} ${y2}`;
    const wrinkles = [wr(70, 130, 84, 132), wr(118, 132, 132, 130), wr(66, 150, 80, 152), wr(122, 150, 136, 148), wr(88, 165, 112, 165, 2)].join('');
    return `${sitTeddy(K, c, { pad: '#D8D2C8', belly: false, tuft: 0, front: `<path d="${wrinkles}" fill="none" ${line(c.dark, 1)} opacity=".6"/>` })}
    <g class="c-ears">
      <path d="M68 40 C 34 18, 8 40, 12 76 C 16 104, 40 118, 64 100 C 72 92, 74 60, 68 40 Z" fill="${Ear}" ${line(c.ol, 1.4)}/>
      <path d="M62 52 C 38 38, 22 56, 24 78 C 28 98, 44 104, 58 94" fill="none" ${line('#B07A78', 6)} opacity=".25"/>
      <path d="M30 60 q8 6 6 16 M40 50 q6 10 2 22 M28 84 q10 2 16 -6" fill="none" ${line(c.dark, 0.9)} opacity=".6"/>
      <path d="M132 40 C 166 18, 192 40, 188 76 C 184 104, 160 118, 136 100 C 128 92, 126 60, 132 40 Z" fill="${Ear}" ${line(c.ol, 1.4)}/>
      <path d="M138 52 C 162 38, 178 56, 176 78 C 172 98, 156 104, 142 94" fill="none" ${line('#B07A78', 6)} opacity=".25"/>
      <path d="M170 60 q-8 6 -6 16 M160 50 q-6 10 -2 22 M172 84 q-10 2 -16 -6" fill="none" ${line(c.dark, 0.9)} opacity=".6"/>
    </g>
    <path d="${blob(K, 100, 56, 36, 36, { n: 30 })}" fill="${S}" ${line(c.ol, 1.4)}/>
    <path d="M92 22 q2 -8 4 -1 M100 21 q1 -9 3 -1 M107 22 q3 -7 3 1" fill="none" ${line('#3A3530', 1)}/>
    <path d="M80 40 q20 -6 40 0 M84 34 q16 -4 32 0" fill="none" ${line(c.dark, 0.9)} opacity=".5"/>
    ${eyes(K, 56, 18, { w: 6.5, h: 6.2, iris: '#3A2618', pupil: 'big', irisR: 1.1, lid: '#1E1612' })}
    <path d="M76 52 l-3 -2 M78 50 l-2 -3 M124 52 l3 -2 M122 50 l2 -3" ${line('#1E1612', 0.8)}/>
    ${K.soft(80, 70, 8, 5, '#D07A86', 0.25)}${K.soft(120, 70, 8, 5, '#D07A86', 0.25)}
    <path class="c-smile" d="M112 86 Q118 90 124 86" fill="none" ${line(c.ol, 1.3)}/>
    ${openMouth(118, 86, 5, 4)}
    <g class="c-trunk">
      <path d="M100 66 C 98 100, 100 126, 114 130 C 124 132, 128 120, 121 116" fill="none" ${line(c.ol, 21)}/>
      <path d="M100 66 C 98 100, 100 126, 114 130 C 124 132, 128 120, 121 116" fill="none" stroke="${S}" stroke-width="18.5" stroke-linecap="round"/>
      <path d="M92 82 q8 3 16 0 M92 90 q8 3 16 0 M92 98 q8 3 16 0 M93 106 q7 3 14 0 M95 114 q6 3 12 0" fill="none" ${line(c.dark, 0.9)} opacity=".7"/>
    </g>`;
  },

  // Giant panda cub
  panda(K) {
    const c = { base: '#F2EFE8', light: '#FFFFFF', dark: '#C9C2B6', ol: '#4A4640' };
    const W = K.fur(c.base, { hi: 0.4, lo: -0.14 }), Bk = K.fur('#262325', { hi: 0.15 });
    return `${sitTeddy(K, c, { arm: '#262325', legC: '#262325', pad: '#4A4448', belly: false, tuft: 2.6,
      front: `<path d="${blob(K, 100, 120, 46, 13, { n: 28, tuft: 2 })}" fill="${Bk}"/>` })}
    <g class="c-ears">
      <path d="${blob(K, 66, 26, 12.5, 11.5, { n: 18, tuft: 2 })}" fill="${Bk}" ${line('#000', 1)}/>
      <path d="${blob(K, 134, 26, 12.5, 11.5, { n: 18, tuft: 2 })}" fill="${Bk}" ${line('#000', 1)}/>
    </g>
    <path d="${blob(K, 100, 58, 38, 33, { n: 40, tuft: 2.6, mul: (a) => 1 + 0.08 * Math.max(0, Math.sin(a)) })}" fill="${W}" ${line(c.ol, 1.3)}/>
    ${hair(K, 100, 54, 32, 26, 40, '#A69E92', { op: 0.35, len: 4 })}
    <path d="${blob(K, 84, 58, 10, 13, { n: 18, tuft: 1.2, rot: 0.55 })}" fill="${Bk}"/>
    <path d="${blob(K, 116, 58, 10, 13, { n: 18, tuft: 1.2, rot: -0.55 })}" fill="${Bk}"/>
    ${eyes(K, 57, 16, { w: 6, h: 6, iris: '#2A1A10', pupil: 'big', irisR: 1.15, lid: '#000', white: '#2A1A10' })}
    <path d="${blob(K, 100, 74, 14, 10, { n: 18, tuft: 1 })}" fill="${K.fur('#FFFFFF', { lo: -0.08 })}"/>
    <path d="M93 68 Q100 64 107 68 Q105 73 100 74 Q95 73 93 68 Z" fill="${K.fur('#1E1B1C', { hi: 0.25 })}"/>
    <ellipse cx="97" cy="67" rx="2.5" ry="1.2" fill="#fff" opacity=".5"/>
    <path class="c-smile" d="M100 74 V77 M100 77 Q96 80 92 79 M100 77 Q104 80 108 79" fill="none" ${line('#2A2624', 1.3)}/>
    ${openMouth(100, 77, 6, 5)}`;
  },
};

export function animal(kind, cls = '') {
  const a = ANIMALS[kind];
  const K = kit(kind);
  let art = BUILD[kind](K);
  if (art.includes('<!--H-->')) art += '</g>';
  const d = (Math.random() * -5).toFixed(2);
  return `<svg class="char real ${cls}" data-kind="${kind}" viewBox="0 -22 200 222" style="--d:${d}s" aria-label="${a.name}"><defs>${K.defs.join('')}</defs>
    <ellipse cx="100" cy="197" rx="58" ry="5" fill="#000" opacity=".12"/>
    <g class="c-bob">${art}</g></svg>`;
}
