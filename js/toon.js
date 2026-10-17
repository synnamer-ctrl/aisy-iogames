// "3D cartoon" animals (Pixar-style baby animals): smooth volumes lit from the
// top-left, soft ambient-occlusion shadows, rim light, big glossy eyes and no
// hard outlines. Same animation hooks as before: c-bob, c-eyes, c-pupil,
// c-ears, c-tail, c-leg-*, c-arm-*, c-trunk, c-smile / c-open.

let UID = 0;
const r1 = (n) => Math.round(n * 10) / 10;
export function mix(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  const tgt = t > 0 ? 255 : 0, k = Math.abs(t);
  const ch = (v) => Math.round(v + (tgt - v) * k);
  return '#' + ((1 << 24) | (ch(n >> 16) << 16) | (ch((n >> 8) & 255) << 8) | ch(n & 255)).toString(16).slice(1);
}

export function kit() {
  const id = 't' + (UID++).toString(36);
  const defs = [];
  let n = 0;
  const K = {
    defs,
    // Volume shading: bright highlight top-left, base, warm-dark core shadow at the rim.
    vol(c, { hi = 0.42, lo = -0.32, fx = 0.34, fy = 0.26, r = 0.78 } = {}) {
      const g = `${id}v${n++}`;
      defs.push(`<radialGradient id="${g}" cx="${fx + 0.08}" cy="${fy + 0.08}" fx="${fx}" fy="${fy}" r="${r}">
        <stop offset="0" stop-color="${mix(c, hi)}"/><stop offset=".45" stop-color="${c}"/>
        <stop offset=".85" stop-color="${mix(c, lo * 0.7)}"/><stop offset="1" stop-color="${mix(c, lo)}"/></radialGradient>`);
      return `url(#${g})`;
    },
    // Soft blob of light or shadow (no blur filter needed).
    glow(cx, cy, rx, ry, color, op, rot = 0) {
      const g = `${id}g${n++}`;
      defs.push(`<radialGradient id="${g}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset=".6" stop-color="${color}" stop-opacity="${op * 0.45}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`);
      return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${g})"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''} pointer-events="none"/>`;
    },
    lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) {
      const g = `${id}l${n++}`;
      defs.push(`<linearGradient id="${g}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`);
      return `url(#${g})`;
    },
    clip(inner) {
      const c = `${id}c${n++}`;
      defs.push(`<clipPath id="${c}">${inner}</clipPath>`);
      return `url(#${c})`;
    },
  };
  // Highlight on top-left + ambient shadow bottom: the "rendered" look.
  K.spec = (cx, cy, rx, ry, op = 0.55, rot = -20) => K.glow(cx, cy, rx, ry, '#FFFFFF', op, rot);
  K.ao = (cx, cy, rx, ry, op = 0.35, rot = 0) => K.glow(cx, cy, rx, ry, '#2A1206', op, rot);
  K.rim = (cx, cy, rx, ry, op = 0.35, rot = 0) => K.glow(cx, cy, rx, ry, '#FFF4E0', op, rot);
  return K;
}

// Big glossy cartoon eye: shaded sclera, layered iris, pupil, two catchlights, lid shadow.
export function eye(K, x, y, { rx = 13, ry = 14, iris = '#6B3F1C', ir = 0.92, pupil = 0.5, slit = false, look = 0 } = {}) {
  const shape = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
  const clip = K.clip(shape);
  const R = Math.min(rx, ry) * ir;
  const ix = x + look, iy = y + ry * 0.08;
  const irisG = K.vol(iris, { hi: 0.55, lo: -0.6, fx: 0.5, fy: 0.75, r: 0.6 });
  const sclera = K.vol('#FFFFFF', { hi: 0, lo: -0.16, fx: 0.4, fy: 0.3 });
  const pup = slit ? `<ellipse cx="${ix}" cy="${iy}" rx="${r1(R * 0.2)}" ry="${r1(R * 0.85)}" fill="#080402"/>`
    : `<circle cx="${ix}" cy="${iy}" r="${r1(R * pupil)}" fill="#080402"/>`;
  return `<g clip-path="${clip}">
      <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${sclera}"/>
      <g class="c-pupil">
        <circle cx="${ix}" cy="${iy}" r="${r1(R)}" fill="${irisG}"/>
        <circle cx="${ix}" cy="${iy}" r="${r1(R)}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${r1(R * 0.12)}"/>
        ${pup}
        <circle cx="${r1(ix + R * 0.38)}" cy="${r1(iy - R * 0.42)}" r="${r1(R * 0.3)}" fill="#fff"/>
        <circle cx="${r1(ix - R * 0.35)}" cy="${r1(iy + R * 0.38)}" r="${r1(R * 0.13)}" fill="#fff" opacity=".85"/>
      </g>
      ${K.glow(x, y - ry * 0.95, rx * 1.2, ry * 0.55, '#3A1A08', 0.45)}
    </g>
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#3A1E0E" stroke-opacity=".22" stroke-width="1"/>`;
}
export const eyes = (K, y, dx, o = {}) => `<g class="c-eyes">${eye(K, 100 - dx, y, { ...o, look: o.look || 0.8 })}${eye(K, 100 + dx, y, { ...o, look: -(o.look || 0.8) })}</g>`;

// Glossy nose.
export const nose = (K, x, y, rx, ry, c = '#2A1A14') => `
  <path d="M${x - rx} ${y - ry * 0.35} Q${x} ${y - ry * 1.3} ${x + rx} ${y - ry * 0.35} Q${x + rx * 0.7} ${y + ry} ${x} ${y + ry} Q${x - rx * 0.7} ${y + ry} ${x - rx} ${y - ry * 0.35} Z" fill="${K.vol(c, { hi: 0.4, lo: -0.4 })}"/>
  <ellipse cx="${r1(x - rx * 0.25)}" cy="${r1(y - ry * 0.35)}" rx="${r1(rx * 0.38)}" ry="${r1(ry * 0.22)}" fill="#fff" opacity=".7"/>`;

// Smile + open mouth for talking.
export function mouth(K, x, y, w = 9, { tongue = true } = {}) {
  return `<path class="c-smile" d="M${x - w} ${y - 1} Q${x - w / 2} ${y + w * 0.55} ${x} ${y} Q${x + w / 2} ${y + w * 0.55} ${x + w} ${y - 1}" fill="none" stroke="#3A1A10" stroke-width="2.4" stroke-linecap="round"/>
  ${tongue ? `<path class="c-smile" d="M${x - w * 0.35} ${y + 1.5} Q${x} ${y + w * 0.9} ${x + w * 0.35} ${y + 1.5} Q${x} ${y + 3.5} ${x - w * 0.35} ${y + 1.5} Z" fill="${K.vol('#F07A8A')}"/>` : ''}
  <g class="c-open">
    <path d="M${x - w} ${y - 1} Q${x} ${y - 4} ${x + w} ${y - 1} Q${x + w * 0.85} ${y + w * 1.4} ${x} ${y + w * 1.5} Q${x - w * 0.85} ${y + w * 1.4} ${x - w} ${y - 1} Z" fill="${K.vol('#6A1E28', { hi: 0.1, lo: -0.4, fy: 0.8 })}"/>
    <ellipse cx="${x}" cy="${r1(y + w * 1.05)}" rx="${r1(w * 0.6)}" ry="${r1(w * 0.38)}" fill="${K.vol('#F07A8A')}"/>
  </g>`;
}
