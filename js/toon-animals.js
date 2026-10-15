import { kit, eyes, nose, mouth } from './toon.js';

const r1 = (n) => Math.round(n * 10) / 10;

// Sitting baby-animal body, 3D-shaded: haunches, chubby front legs, chest.
function sitBody(K, F, C, { tail = '', paws = C, chest = true } = {}) {
  const leg = (x, cls, s) => `<g class="${cls}">
    <path d="M${x - 9 * s} 138 C ${x - 10 * s} 160, ${x - 11 * s} 178, ${x - 11 * s} 186 Q${x - 11 * s} 196 ${x} 196 Q${x + 11 * s} 196 ${x + 11 * s} 186 C ${x + 11 * s} 172, ${x + 9 * s} 154, ${x + 8 * s} 138 Z" fill="${F}"/>
    <ellipse cx="${x}" cy="190" rx="11.5" ry="6.5" fill="${paws}"/>
    <path d="M${x - 3.5} 196 v-4 M${x + 3.5} 196 v-4" stroke="#5A3018" stroke-opacity=".35" stroke-width="1.4" stroke-linecap="round"/></g>`;
  return `${tail}
    <ellipse cx="58" cy="191" rx="16" ry="7" fill="${paws}"/><ellipse cx="142" cy="191" rx="16" ry="7" fill="${paws}"/>
    <ellipse cx="66" cy="170" rx="26" ry="23" fill="${F}"/><ellipse cx="134" cy="170" rx="26" ry="23" fill="${F}"/>
    <path d="M100 98 C 74 98, 64 130, 64 160 C 64 186, 80 196, 100 196 C 120 196, 136 186, 136 160 C 136 130, 126 98, 100 98 Z" fill="${F}"/>
    ${chest ? `<path d="M100 104 C 82 108, 76 126, 82 142 C 88 154, 96 158, 100 160 C 104 158, 112 154, 118 142 C 124 126, 118 108, 100 104 Z" fill="${C}"/>` : ''}
    ${K.ao(100, 108, 42, 14, 0.45)}
    ${leg(88, 'c-leg-l', 1)}${leg(112, 'c-leg-r', 1)}
    ${K.ao(100, 196, 50, 5, 0.35)}`;
}


// Teddy-style sitter (bear, monkey, elephant, panda): round tummy, arms, legs stretched out front.
function teddyBody(K, F, { belly = null, arm = F, leg = F, pad = null, longArms = false, behind = '', front = '' } = {}) {
  const ay = longArms ? 150 : 142, ary = longArms ? 33 : 24;
  const beans = (x) => pad ? `<ellipse cx="${x}" cy="185" rx="9.5" ry="7.5" fill="${pad}"/>
    <circle cx="${x - 9}" cy="176" r="3.2" fill="${pad}"/><circle cx="${x - 3}" cy="173" r="3.2" fill="${pad}"/><circle cx="${x + 3}" cy="173" r="3.2" fill="${pad}"/><circle cx="${x + 9}" cy="176" r="3.2" fill="${pad}"/>` : '';
  return `${behind}
    <ellipse cx="100" cy="150" rx="44" ry="43" fill="${F}"/>
    ${belly ? `<ellipse cx="100" cy="158" rx="27" ry="27" fill="${belly}"/>` : ''}
    ${front}
    ${K.ao(100, 110, 44, 14, 0.45)}
    <g class="c-arm-l"><ellipse cx="58" cy="${ay}" rx="13" ry="${ary}" fill="${arm}" transform="rotate(14 58 ${ay})"/></g>
    <g class="c-arm-r"><ellipse cx="142" cy="${ay}" rx="13" ry="${ary}" fill="${arm}" transform="rotate(-14 142 ${ay})"/></g>
    <ellipse cx="68" cy="181" rx="24" ry="16" fill="${leg}"/><ellipse cx="132" cy="181" rx="24" ry="16" fill="${leg}"/>
    ${beans(66)}${beans(134)}
    ${K.ao(100, 197, 56, 5, 0.35)}
    <g transform="translate(0 9)"><!--H-->`;
}

const BUILD = {
  dog(K) {
    const F = K.vol('#D9A066'), C = K.vol('#FFF1DC', { hi: 0.3, lo: -0.2 }), E = K.vol('#8A5530', { hi: 0.32, lo: -0.4 });
    const tail = `<g class="c-tail"><path d="M130 170 C 156 162, 168 142, 162 122 C 160 114, 152 114, 152 121 C 155 138, 146 152, 126 160 Z" fill="${F}"/></g>`;
    return `${sitBody(K, F, C, { tail })}
    <ellipse cx="100" cy="60" rx="50" ry="44" fill="${F}"/>
    <path d="M94 20 Q100 15 106 20 L113 70 L87 70 Z" fill="${C}" opacity=".95"/>
    ${K.spec(78, 32, 24, 13, 0.55)}${K.rim(148, 66, 6, 26, 0.35)}
    <ellipse cx="100" cy="86" rx="27" ry="19" fill="${C}"/>
    ${K.ao(100, 70, 26, 6, 0.18)}
    <g class="c-ears">
      <path d="M66 26 C 40 22, 26 50, 30 84 C 32 106, 50 110, 58 98 C 66 84, 68 60, 74 38 Z" fill="${E}"/>
      <path d="M134 26 C 160 22, 174 50, 170 84 C 168 106, 150 110, 142 98 C 134 84, 132 60, 126 38 Z" fill="${E}"/>
      ${K.spec(44, 52, 7, 16, 0.35, 10)}${K.spec(156, 52, 7, 16, 0.25, -10)}
    </g>
    ${eyes(K, 58, 22, { rx: 12.5, ry: 14.5, iris: '#8A5426', ir: 0.95 })}
    <path d="M66 40 Q76 34 86 39 M114 39 Q124 34 134 40" fill="none" stroke="#7A4A22" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    ${K.glow(66, 80, 11, 7, '#FF6F82', 0.4)}${K.glow(134, 80, 11, 7, '#FF6F82', 0.4)}
    ${nose(K, 100, 78, 11, 7.5)}
    ${mouth(K, 100, 92, 9)}`;
  },

  cat(K) {
    const F = K.vol('#F3A65A'), C = K.vol('#FFF4E6', { hi: 0.3, lo: -0.18 }), S = '#D9772E';
    const P = K.vol('#FFB0BC', { hi: 0.3, lo: -0.25 });
    const tail = `<g class="c-tail"><path d="M132 188 C 166 192, 182 172, 174 146 C 170 134, 178 124, 186 128 C 192 132, 186 140, 182 140 C 188 162, 176 196, 130 196 Z" fill="${F}"/></g>`;
    return `${sitBody(K, F, C, { tail })}
    <path d="M70 134 q8 2 11 8 M130 134 q-8 2 -11 8 M68 154 q9 2 13 8 M132 154 q-9 2 -13 8" fill="none" stroke="${S}" stroke-opacity=".55" stroke-width="3.5" stroke-linecap="round"/>
    <g class="c-ears">
      <path d="M58 46 C 54 26, 56 10, 62 6 C 70 6, 84 18, 94 30 Z" fill="${F}"/><path d="M64 38 C 62 26, 63 16, 66 14 C 72 16, 80 24, 86 31 Z" fill="${P}"/>
      <path d="M142 46 C 146 26, 144 10, 138 6 C 130 6, 116 18, 106 30 Z" fill="${F}"/><path d="M136 38 C 138 26, 137 16, 134 14 C 128 16, 120 24, 114 31 Z" fill="${P}"/>
    </g>
    <path d="M100 18 C 132 18, 152 38, 152 62 C 152 74, 156 82, 150 90 C 146 96, 140 96, 140 98 C 130 108, 116 112, 100 112 C 84 112, 70 108, 60 98 C 60 96, 54 96, 50 90 C 44 82, 48 74, 48 62 C 48 38, 68 18, 100 18 Z" fill="${F}"/>
    <path d="M91 22 Q94 32 93 40 M100 20 V38 M109 22 Q106 32 107 40" fill="none" stroke="${S}" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/>
    <path d="M56 62 q7 1 11 -2 M55 70 q8 1 12 -2 M144 62 q-7 1 -11 -2 M145 70 q-8 1 -12 -2" fill="none" stroke="${S}" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
    ${K.spec(78, 32, 24, 12, 0.55)}${K.rim(150, 70, 5, 22, 0.35)}
    <ellipse cx="90" cy="86" rx="15" ry="11" fill="${C}"/><ellipse cx="110" cy="86" rx="15" ry="11" fill="${C}"/><ellipse cx="100" cy="96" rx="11" ry="7" fill="${C}"/>
    ${eyes(K, 62, 23, { rx: 13.5, ry: 15, iris: '#8CC63F', ir: 0.95, pupil: 0.42 })}
    ${K.glow(64, 80, 10, 6, '#FF6F82', 0.38)}${K.glow(136, 80, 10, 6, '#FF6F82', 0.38)}
    ${nose(K, 100, 79, 6.5, 4.5, '#F28A9A')}
    ${mouth(K, 100, 87, 7)}
    <path d="M78 86 L46 80 M78 91 L48 94 M122 86 L154 80 M122 91 L152 94" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>`;
  },

  lion(K) {
    const F = K.vol('#E9B45E'), C = K.vol('#FFF0D2', { hi: 0.3, lo: -0.18 }), M = '#C4692A';
    const tail = `<g class="c-tail"><path d="M130 190 C 164 196, 182 178, 178 150" fill="none" stroke="${F}" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="178" cy="142" rx="9" ry="12" fill="${K.vol(M)}"/></g>`;
    let mane = '';
    for (let i = 0; i < 14; i++) {
      const t = (i / 14) * Math.PI * 2 - Math.PI / 2;
      const x = r1(100 + Math.cos(t) * 50), y = r1(64 + Math.sin(t) * 48);
      mane += `<ellipse cx="${x}" cy="${y}" rx="19" ry="23" transform="rotate(${r1((t * 180) / Math.PI + 90)} ${x} ${y})" fill="${K.vol(M, { hi: 0.35, lo: -0.35 })}"/>`;
    }
    return `${sitBody(K, F, C, { tail })}
    <g class="c-ears">${mane}<ellipse cx="100" cy="64" rx="52" ry="50" fill="${K.vol(M, { hi: 0.2, lo: -0.3 })}"/></g>
    <circle cx="66" cy="30" r="11" fill="${F}"/><circle cx="66" cy="31" r="6" fill="${K.vol('#B5651D')}"/>
    <circle cx="134" cy="30" r="11" fill="${F}"/><circle cx="134" cy="31" r="6" fill="${K.vol('#B5651D')}"/>
    <ellipse cx="100" cy="64" rx="40" ry="40" fill="${F}"/>
    ${K.spec(82, 40, 18, 10, 0.5)}
    <ellipse cx="91" cy="86" rx="13" ry="10" fill="${C}"/><ellipse cx="109" cy="86" rx="13" ry="10" fill="${C}"/><ellipse cx="100" cy="96" rx="9" ry="6" fill="${C}"/>
    ${eyes(K, 62, 18, { rx: 11, ry: 12.5, iris: '#C88A2A', ir: 0.95 })}
    <path d="M74 48 Q82 43 90 47 M110 47 Q118 43 126 48" fill="none" stroke="#9A5A1A" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    ${K.glow(72, 80, 9, 6, '#FF6F82', 0.35)}${K.glow(128, 80, 9, 6, '#FF6F82', 0.35)}
    ${nose(K, 100, 77, 8, 5.5, '#9A5A4A')}
    ${mouth(K, 100, 86, 7)}`;
  },
  bunny(K) {
    const F = K.vol('#E6D8CA'), C = K.vol('#FFFFFF', { hi: 0, lo: -0.14 }), P = K.vol('#FFB3C4', { hi: 0.3, lo: -0.25 });
    return `${sitBody(K, F, C, { tail: `<circle cx="146" cy="180" r="14" fill="${C}"/>` })}
    <ellipse cx="52" cy="191" rx="22" ry="8" fill="${C}"/><ellipse cx="148" cy="191" rx="22" ry="8" fill="${C}"/>
    <g class="c-ears">
      <ellipse cx="80" cy="8" rx="13" ry="36" fill="${F}" transform="rotate(-12 80 8)"/><ellipse cx="80" cy="12" rx="7" ry="27" fill="${P}" transform="rotate(-12 80 12)"/>
      <ellipse cx="120" cy="8" rx="13" ry="36" fill="${F}" transform="rotate(12 120 8)"/><ellipse cx="120" cy="12" rx="7" ry="27" fill="${P}" transform="rotate(12 120 12)"/>
    </g>
    <ellipse cx="100" cy="66" rx="44" ry="39" fill="${F}"/>
    ${K.spec(80, 42, 20, 11, 0.55)}${K.rim(142, 72, 5, 20, 0.3)}
    <ellipse cx="86" cy="88" rx="17" ry="13" fill="${C}"/><ellipse cx="114" cy="88" rx="17" ry="13" fill="${C}"/>
    ${eyes(K, 64, 20, { rx: 12.5, ry: 14, iris: '#5A3A2A', ir: 0.95 })}
    ${K.glow(66, 84, 10, 6, '#FF6F82', 0.4)}${K.glow(134, 84, 10, 6, '#FF6F82', 0.4)}
    ${nose(K, 100, 80, 6, 4.2, '#F58AA0')}
    <path class="c-smile" d="M96 92 h8 v6 q0 2 -2 2 h-4 q-2 0 -2 -2 Z M100 92 v8" fill="#fff" stroke="#C9B8A8" stroke-width=".8"/>
    ${mouth(K, 100, 88, 6, { tongue: false })}
    <path d="M82 86 L54 82 M82 90 L56 94 M118 86 L146 82 M118 90 L144 94" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/>`;
  },

  bear(K) {
    const F = K.vol('#9C6B43'), C = K.vol('#E9CFA9', { hi: 0.3, lo: -0.2 }), D = K.vol('#5E3A22');
    return `${teddyBody(K, F, { belly: C, pad: D })}
    <g class="c-ears">
      <circle cx="62" cy="26" r="16" fill="${F}"/><circle cx="62" cy="27" r="8.5" fill="${C}"/>
      <circle cx="138" cy="26" r="16" fill="${F}"/><circle cx="138" cy="27" r="8.5" fill="${C}"/>
    </g>
    <ellipse cx="100" cy="62" rx="47" ry="43" fill="${F}"/>
    ${K.spec(80, 36, 22, 12, 0.5)}${K.rim(146, 70, 5, 22, 0.3)}
    <ellipse cx="100" cy="84" rx="23" ry="17" fill="${C}"/>
    ${eyes(K, 58, 20, { rx: 11.5, ry: 12.5, iris: '#6A3C1A', ir: 0.95 })}
    <path d="M70 42 Q79 37 88 41 M112 41 Q121 37 130 42" fill="none" stroke="#5E3A22" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    ${K.glow(68, 78, 10, 6, '#FF6F82', 0.35)}${K.glow(132, 78, 10, 6, '#FF6F82', 0.35)}
    ${nose(K, 100, 77, 10, 7)}
    ${mouth(K, 100, 90, 8)}`;
  },

  frog(K) {
    const F = K.vol('#7BC74D', { hi: 0.45 }), C = K.vol('#EEF7CF', { hi: 0.2, lo: -0.15 }), D = '#4E9A2C';
    const foot = (x) => `<ellipse cx="${x - 8}" cy="193" rx="5" ry="4" fill="${F}"/><ellipse cx="${x}" cy="195" rx="5" ry="4" fill="${F}"/><ellipse cx="${x + 8}" cy="193" rx="5" ry="4" fill="${F}"/>`;
    return `
    <ellipse cx="54" cy="170" rx="30" ry="21" fill="${F}" transform="rotate(-22 54 170)"/><ellipse cx="146" cy="170" rx="30" ry="21" fill="${F}" transform="rotate(22 146 170)"/>
    ${foot(36)}${foot(164)}
    <g class="c-leg-l"><path d="M74 140 C 68 160, 72 178, 80 190" fill="none" stroke="#6DB842" stroke-width="13" stroke-linecap="round"/>${foot(80)}</g>
    <g class="c-leg-r"><path d="M126 140 C 132 160, 128 178, 120 190" fill="none" stroke="#6DB842" stroke-width="13" stroke-linecap="round"/>${foot(120)}</g>
    <ellipse cx="100" cy="150" rx="40" ry="38" fill="${F}"/>
    <ellipse cx="100" cy="158" rx="25" ry="25" fill="${C}"/>
    ${K.ao(100, 112, 46, 14, 0.4)}
    <circle cx="68" cy="44" r="23" fill="${F}"/><circle cx="132" cy="44" r="23" fill="${F}"/>
    <ellipse cx="100" cy="80" rx="60" ry="40" fill="${F}"/>
    <circle cx="68" cy="46" r="20" fill="${F}"/><circle cx="132" cy="46" r="20" fill="${F}"/>
    ${K.spec(78, 56, 26, 10, 0.55)}${K.spec(60, 30, 9, 6, 0.6)}${K.spec(124, 30, 9, 6, 0.5)}
    <ellipse cx="62" cy="98" rx="6" ry="4" fill="${D}" opacity=".45"/><ellipse cx="138" cy="96" rx="7" ry="4.5" fill="${D}" opacity=".45"/><ellipse cx="128" cy="140" rx="7" ry="5" fill="${D}" opacity=".4"/><ellipse cx="70" cy="146" rx="6" ry="4" fill="${D}" opacity=".4"/>
    ${eyes(K, 44, 32, { rx: 14, ry: 15, iris: '#D9A43A', ir: 0.9 })}
    ${K.glow(56, 90, 11, 7, '#FF6F82', 0.4)}${K.glow(144, 90, 11, 7, '#FF6F82', 0.4)}
    <circle cx="94" cy="70" r="2" fill="#2E5A18"/><circle cx="106" cy="70" r="2" fill="#2E5A18"/>
    <path class="c-smile" d="M64 86 Q100 110 136 86" fill="none" stroke="#2E5A18" stroke-width="3" stroke-linecap="round"/>
    ${mouth(K, 100, 92, 15, { tongue: false }).replace(/<path class="c-smile"[^>]*>/, '')}`;
  },

  pig(K) {
    const F = K.vol('#FFB6C4'), C = K.vol('#FFD3DC', { hi: 0.3, lo: -0.15 }), S = K.vol('#FF97AD', { hi: 0.3, lo: -0.3 });
    const tail = `<g class="c-tail"><path d="M134 176 c 14 -2 18 -14 10 -18 c -8 -4 -12 6 -4 9 c 8 3 14 -4 14 -12" fill="none" stroke="#F08BA0" stroke-width="4" stroke-linecap="round"/></g>`;
    return `${sitBody(K, F, C, { tail, paws: K.vol('#B5677C'), chest: false })}
    <g class="c-ears">
      <path d="M64 40 C 56 24, 52 12, 54 6 C 66 8, 80 18, 90 30 Z" fill="${F}"/><path d="M64 34 C 60 24, 58 16, 60 12 C 68 14, 76 22, 82 30 Z" fill="${S}" opacity=".7"/>
      <path d="M136 40 C 144 24, 148 12, 146 6 C 134 8, 120 18, 110 30 Z" fill="${F}"/><path d="M136 34 C 140 24, 142 16, 140 12 C 132 14, 124 22, 118 30 Z" fill="${S}" opacity=".7"/>
    </g>
    <ellipse cx="100" cy="64" rx="47" ry="43" fill="${F}"/>
    ${K.spec(80, 38, 22, 12, 0.55)}${K.rim(146, 70, 5, 22, 0.3)}
    ${eyes(K, 56, 21, { rx: 11, ry: 12, iris: '#6E5A8C', ir: 0.95 })}
    <path d="M72 41 l-3 -4 M76 39 l-2 -5 M128 41 l3 -4 M124 39 l2 -5" stroke="#5A2A3A" stroke-width="1.6" stroke-linecap="round"/>
    ${K.glow(68, 80, 11, 7, '#FF5A7A', 0.35)}${K.glow(132, 80, 11, 7, '#FF5A7A', 0.35)}
    <ellipse cx="100" cy="80" rx="20" ry="14" fill="${S}"/>
    ${K.spec(94, 74, 9, 4, 0.5, 0)}
    <ellipse cx="93" cy="81" rx="3.6" ry="5.5" fill="#A8445E"/><ellipse cx="107" cy="81" rx="3.6" ry="5.5" fill="#A8445E"/>
    ${mouth(K, 100, 99, 8)}`;
  },

  chick(K) {
    const F = K.vol('#FFD84D', { hi: 0.5, lo: -0.25 }), O = K.vol('#FF9F2E', { hi: 0.4, lo: -0.3 });
    const toes = (x) => `<path d="M${x} 176 V190 M${x} 190 l-8 6 M${x} 190 v8 M${x} 190 l8 6" fill="none" stroke="#F28A1E" stroke-width="4.5" stroke-linecap="round"/>`;
    return `${toes(86)}${toes(114)}
    <ellipse cx="100" cy="142" rx="46" ry="44" fill="${F}"/>
    <g class="c-arm-l"><path d="M58 122 C 36 128, 34 152, 50 162 C 52 156, 56 156, 56 150 C 60 140, 62 130, 58 122 Z" fill="${F}"/></g>
    <g class="c-arm-r"><path d="M142 122 C 164 128, 166 152, 150 162 C 148 156, 144 156, 144 150 C 140 140, 138 130, 142 122 Z" fill="${F}"/></g>
    ${K.ao(100, 108, 36, 10, 0.3)}
    <circle cx="100" cy="68" r="40" fill="${F}"/>
    <path d="M96 30 C 90 16, 98 12, 100 22 C 102 8, 112 12, 106 30 Z" fill="${F}"/>
    ${K.spec(82, 46, 18, 10, 0.6)}${K.spec(80, 120, 14, 18, 0.35)}
    ${eyes(K, 64, 17, { rx: 11, ry: 12.5, iris: '#3A2414', ir: 0.95 })}
    ${K.glow(70, 82, 9, 6, '#FF6F82', 0.4)}${K.glow(130, 82, 9, 6, '#FF6F82', 0.4)}
    <path class="c-smile" d="M90 80 Q100 74 110 80 Q103 90 100 92 Q97 90 90 80 Z" fill="${O}"/>
    <g class="c-open"><path d="M90 78 Q100 72 110 78 Q104 83 100 84 Q96 83 90 78 Z" fill="${O}"/>
      <path d="M91 86 Q100 84 109 86 Q103 95 100 96 Q97 95 91 86 Z" fill="${O}"/><path d="M93 84 Q100 86 107 84" fill="#7A2A22"/></g>`;
  },

  cow(K) {
    const F = K.vol('#FAF7F2', { hi: 0.2, lo: -0.2 }), B = K.vol('#2E2A2A', { hi: 0.25, lo: -0.3 }), P = K.vol('#FFB7C3', { hi: 0.3, lo: -0.22 });
    const tail = `<g class="c-tail"><path d="M132 188 C 160 190, 170 172, 168 150" fill="none" stroke="#EDE6DC" stroke-width="5" stroke-linecap="round"/><ellipse cx="168" cy="146" rx="5" ry="8" fill="${B}"/></g>`;
    const spots = `<path d="M70 130 C 80 124, 88 138, 82 148 C 74 156, 62 144, 70 130 Z M122 158 C 132 154, 140 168, 130 176 C 120 180, 114 168, 122 158 Z M56 162 C 64 160, 70 172, 62 178 C 54 180, 50 168, 56 162 Z" fill="${B}"/>`;
    return `${sitBody(K, F, F, { tail, paws: B, chest: false })}
    ${spots}
    <path d="M76 112 Q100 124 124 112 L124 119 Q100 131 76 119 Z" fill="${K.vol('#A0522D')}"/>
    <path d="M92 122 h16 l3 14 h-22 Z" fill="${K.vol('#FFC531', { hi: 0.5 })}"/>
    <path d="M78 30 C 72 18, 74 10, 80 10 C 84 16, 86 24, 86 30 Z M122 30 C 128 18, 126 10, 120 10 C 116 16, 114 24, 114 30 Z" fill="${K.vol('#F2E2C0')}"/>
    <g class="c-ears">
      <ellipse cx="52" cy="50" rx="20" ry="10" fill="${F}" transform="rotate(-22 52 50)"/><ellipse cx="53" cy="50" rx="12" ry="5.5" fill="${P}" transform="rotate(-22 53 50)"/>
      <ellipse cx="148" cy="50" rx="20" ry="10" fill="${B}" transform="rotate(22 148 50)"/><ellipse cx="147" cy="50" rx="12" ry="5.5" fill="${P}" transform="rotate(22 147 50)"/>
    </g>
    <ellipse cx="100" cy="60" rx="42" ry="42" fill="${F}"/>
    <path d="M112 22 C 132 22, 144 40, 140 58 C 128 62, 116 50, 112 38 Z" fill="${B}"/>
    ${K.spec(80, 36, 20, 11, 0.6)}
    ${eyes(K, 58, 19, { rx: 12, ry: 13, iris: '#4A2A18', ir: 0.95 })}
    <path d="M72 44 l-3 -4 M76 42 l-2 -5 M128 44 l3 -4 M124 42 l2 -5" stroke="#2E2A2A" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="100" cy="90" rx="33" ry="21" fill="${P}"/>
    ${K.spec(90, 82, 14, 5, 0.5, 0)}
    <ellipse cx="87" cy="88" rx="4.5" ry="6" fill="#B04A5E"/><ellipse cx="113" cy="88" rx="4.5" ry="6" fill="#B04A5E"/>
    ${mouth(K, 100, 101, 8)}`;
  },

  monkey(K) {
    const F = K.vol('#8E5B3A'), C = K.vol('#F3D5B5', { hi: 0.3, lo: -0.2 });
    const tail = `<g class="c-tail"><path d="M134 176 C 178 184, 190 150, 174 128 C 164 116, 150 124, 156 136 C 160 144, 170 140, 168 132" fill="none" stroke="#7A4A2C" stroke-width="9" stroke-linecap="round"/></g>`;
    return `${teddyBody(K, F, { belly: C, longArms: true, behind: tail })}
    <ellipse cx="66" cy="186" rx="10" ry="7" fill="${C}"/><ellipse cx="134" cy="186" rx="10" ry="7" fill="${C}"/>
    <g class="c-ears">
      <circle cx="54" cy="66" r="18" fill="${F}"/><circle cx="55" cy="66" r="10" fill="${C}"/>
      <circle cx="146" cy="66" r="18" fill="${F}"/><circle cx="145" cy="66" r="10" fill="${C}"/>
    </g>
    <circle cx="100" cy="62" r="44" fill="${F}"/>
    <path d="M94 20 Q98 10 104 18" fill="none" stroke="#6A3E22" stroke-width="4" stroke-linecap="round"/>
    <path d="M100 48 C 86 32, 62 38, 64 62 C 64 72, 68 80, 72 86 C 74 102, 86 108, 100 108 C 114 108, 126 102, 128 86 C 132 80, 136 72, 136 62 C 138 38, 114 32, 100 48 Z" fill="${C}"/>
    ${K.spec(78, 34, 18, 9, 0.45)}
    ${eyes(K, 62, 17, { rx: 11, ry: 12.5, iris: '#6A3C1A', ir: 0.95 })}
    ${K.glow(72, 82, 9, 6, '#FF6F82', 0.35)}${K.glow(128, 82, 9, 6, '#FF6F82', 0.35)}
    <ellipse cx="96" cy="80" rx="2.4" ry="1.8" fill="#6A3E22"/><ellipse cx="104" cy="80" rx="2.4" ry="1.8" fill="#6A3E22"/>
    ${mouth(K, 100, 91, 12)}`;
  },

  elephant(K) {
    const F = K.vol('#A9B7C6'), P = K.vol('#FFC2D1', { hi: 0.3, lo: -0.25 }), N = K.vol('#E9EEF3', { hi: 0.2 });
    return `${teddyBody(K, F, { pad: null })}
    <path d="M56 192 q4 -7 8 0 M66 192 q4 -7 8 0 M126 192 q4 -7 8 0 M136 192 q4 -7 8 0" fill="${N}"/>
    <g class="c-ears">
      <path d="M68 38 C 32 16, 6 42, 12 78 C 16 104, 42 116, 66 98 Z" fill="${F}"/><path d="M62 50 C 38 36, 22 56, 24 78 C 28 96, 44 102, 58 92 Z" fill="${P}"/>
      <path d="M132 38 C 168 16, 194 42, 188 78 C 184 104, 158 116, 134 98 Z" fill="${F}"/><path d="M138 50 C 162 36, 178 56, 176 78 C 172 96, 156 102, 142 92 Z" fill="${P}"/>
    </g>
    <ellipse cx="100" cy="60" rx="43" ry="41" fill="${F}"/>
    ${K.spec(80, 34, 20, 11, 0.5)}
    <path d="M94 20 Q96 12 99 19 M101 19 Q104 10 107 20" fill="none" stroke="#7A8798" stroke-width="2" stroke-linecap="round"/>
    ${eyes(K, 56, 20, { rx: 11, ry: 12.5, iris: '#4A3A30', ir: 0.95 })}
    ${K.glow(70, 76, 9, 6, '#FF6F82', 0.35)}${K.glow(130, 76, 9, 6, '#FF6F82', 0.35)}
    ${mouth(K, 122, 88, 6, { tongue: false })}
    <g class="c-trunk">
      <path d="M90 70 C 88 102, 90 122, 104 130 C 116 136, 128 128, 124 118 C 122 112, 114 113, 114 118 C 104 114, 108 96, 110 70 Z" fill="${F}"/>
      <path d="M92 88 q8 3 16 0 M92 98 q8 3 16 0 M93 108 q7 3 14 0" fill="none" stroke="#7A8798" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round"/>
      ${K.spec(96, 86, 4, 12, 0.35, 0)}
    </g>`;
  },

  panda(K) {
    const W = K.vol('#F8F6F1', { hi: 0.2, lo: -0.18 }), B = K.vol('#2E2B2D', { hi: 0.28, lo: -0.3 });
    return `${teddyBody(K, W, { arm: B, leg: B, pad: K.vol('#555056'),
      front: `<path d="M56 118 C 76 104, 124 104, 144 118 C 144 132, 128 134, 100 132 C 72 134, 56 132, 56 118 Z" fill="${B}"/>` })}
    <g class="c-ears"><circle cx="60" cy="26" r="16" fill="${B}"/><circle cx="140" cy="26" r="16" fill="${B}"/></g>
    <ellipse cx="100" cy="62" rx="47" ry="43" fill="${W}"/>
    ${K.spec(80, 36, 22, 12, 0.6)}
    <ellipse cx="80" cy="62" rx="15" ry="19" fill="${B}" transform="rotate(32 80 62)"/>
    <ellipse cx="120" cy="62" rx="15" ry="19" fill="${B}" transform="rotate(-32 120 62)"/>
    ${eyes(K, 60, 19, { rx: 9.5, ry: 10.5, iris: '#4A2E1C', ir: 0.95 })}
    ${K.glow(66, 82, 9, 6, '#FF6F82', 0.35)}${K.glow(134, 82, 9, 6, '#FF6F82', 0.35)}
    <ellipse cx="100" cy="84" rx="18" ry="12" fill="${W}"/>
    ${nose(K, 100, 78, 8, 5.5)}
    ${mouth(K, 100, 89, 7)}`;
  },
};

export function toonAnimal(kind, cls = '') {
  const K = kit();
  let art = BUILD[kind](K);
  if (art.includes('<!--H-->')) art += '</g>';
  const d = (Math.random() * -5).toFixed(2);
  return `<svg class="char toon ${cls}" data-kind="${kind}" viewBox="0 -22 200 222" style="--d:${d}s"><defs>${K.defs.join('')}</defs>
    ${K.glow(100, 197, 64, 7, '#000', 0.28)}
    <g class="c-bob">${art}</g></svg>`;
}
