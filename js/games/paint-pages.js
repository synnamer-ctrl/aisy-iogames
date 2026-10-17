// Colouring pages (viewBox 0 0 400 300). Every element with class "rg" is a
// paint area: free-hand strokes started inside it are clipped to its shape, so
// colour never crosses the line. Later areas sit on top of earlier ones.
// Elements with class "deco" (eyes, mouths, details) are drawn over the paint.

const OL = 'stroke="#4A2E1F" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
const OL3 = 'stroke="#4A2E1F" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const LN = 'fill="none" stroke="#4A2E1F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
const BG = '<rect class="rg" x="0" y="0" width="400" height="300"/>';
const eyes = (x1, x2, y, r = 6) => `<g class="deco"><circle cx="${x1}" cy="${y}" r="${r}" fill="#4A2E1F"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#4A2E1F"/>
  <circle cx="${x1 + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/><circle cx="${x2 + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#fff"/></g>`;
const smile = (x, y, w = 10) => `<path class="deco" d="M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}" ${LN}/>`;
const face = (x, y, s = 1) => `${eyes(x - 10 * s, x + 10 * s, y - 4 * s, 4.5 * s)}${smile(x, y + 6 * s, 9 * s)}`;
const sun = (x, y, r = 28) => `<circle class="rg" cx="${x}" cy="${y}" r="${r}" ${OL}/>`;
const cloud = (x, y, s = 1) => `<path class="rg" d="M${x - 40 * s} ${y + 14 * s} Q${x - 52 * s} ${y - 6 * s} ${x - 30 * s} ${y - 12 * s} Q${x - 20 * s} ${y - 34 * s} ${x} ${y - 24 * s} Q${x + 22 * s} ${y - 38 * s} ${x + 32 * s} ${y - 12 * s} Q${x + 54 * s} ${y - 6 * s} ${x + 42 * s} ${y + 14 * s} Z" ${OL}/>`;
const ground = (y = 240) => `<path class="rg" d="M0 ${y} Q100 ${y - 14} 200 ${y} T400 ${y} V300 H0 Z" ${OL}/>`;
const band = (r1, r2, cx = 200, cy = 250) => `<path class="rg" d="M${cx - r1} ${cy} A${r1} ${r1} 0 0 1 ${cx + r1} ${cy} L${cx + r2} ${cy} A${r2} ${r2} 0 0 0 ${cx - r2} ${cy} Z" ${OL}/>`;

export const PAGES = [
  { name: 'fish', svg: `${BG}
    <path class="rg" d="M0 250 Q100 230 200 250 T400 245 V300 H0 Z" ${OL}/>
    <path class="rg" d="M30 262 Q8 222 30 190 Q52 158 32 128 Q66 160 48 196 Q32 226 54 262 Z" ${OL}/>
    <path class="rg" d="M150 86 Q205 26 262 88 Z" ${OL}/>
    <path class="rg" d="M290 150 L372 88 Q348 150 372 212 Z" ${OL}/>
    <ellipse class="rg" cx="200" cy="150" rx="110" ry="75" ${OL}/>
    <path class="rg" d="M218 78 Q244 150 218 222 L244 216 Q268 150 244 84 Z" ${OL}/>
    <path class="rg" d="M180 168 Q210 212 248 172 Q214 184 180 168 Z" ${OL}/>
    <circle class="rg" cx="138" cy="130" r="20" ${OL}/>
    <g class="deco"><circle cx="142" cy="133" r="9" fill="#4A2E1F"/><circle cx="146" cy="128" r="3" fill="#fff"/></g>
    ${smile(118, 168, 16)}
    <circle class="rg" cx="88" cy="78" r="13" ${OL}/><circle class="rg" cx="68" cy="44" r="9" ${OL}/><circle class="rg" cx="104" cy="26" r="7" ${OL}/>` },

  { name: 'butterfly', svg: `${BG}
    <ellipse class="rg" cx="140" cy="112" rx="82" ry="60" transform="rotate(-25 140 112)" ${OL}/>
    <ellipse class="rg" cx="260" cy="112" rx="82" ry="60" transform="rotate(25 260 112)" ${OL}/>
    <ellipse class="rg" cx="150" cy="206" rx="56" ry="44" transform="rotate(20 150 206)" ${OL}/>
    <ellipse class="rg" cx="250" cy="206" rx="56" ry="44" transform="rotate(-20 250 206)" ${OL}/>
    <circle class="rg" cx="122" cy="104" r="22" ${OL}/><circle class="rg" cx="278" cy="104" r="22" ${OL}/>
    <circle class="rg" cx="146" cy="210" r="15" ${OL}/><circle class="rg" cx="254" cy="210" r="15" ${OL}/>
    <path class="deco" d="M190 70 Q170 30 150 26 M210 70 Q230 30 250 26" ${LN}/>
    <circle class="rg" cx="150" cy="26" r="10" ${OL}/><circle class="rg" cx="250" cy="26" r="10" ${OL}/>
    <ellipse class="rg" cx="200" cy="168" rx="17" ry="70" ${OL}/>
    <circle class="rg" cx="200" cy="86" r="26" ${OL}/>${face(200, 88, 0.9)}` },

  { name: 'house', svg: `${BG}
    ${sun(340, 56, 30)}
    <rect class="rg" x="0" y="240" width="400" height="60" ${OL}/>
    <rect class="rg" x="248" y="58" width="28" height="56" ${OL}/>
    <path class="rg" d="M88 132 L200 50 L312 132 Z" ${OL}/>
    <rect class="rg" x="110" y="132" width="180" height="108" ${OL}/>
    <rect class="rg" x="180" y="174" width="42" height="66" rx="6" ${OL}/>
    <circle class="deco" cx="212" cy="210" r="4" fill="#4A2E1F"/>
    <rect class="rg" x="126" y="150" width="38" height="38" rx="4" ${OL}/>
    <rect class="rg" x="236" y="150" width="38" height="38" rx="4" ${OL}/>
    <path class="deco" d="M145 150 V188 M126 169 H164 M255 150 V188 M236 169 H274" ${LN}/>
    <rect class="rg" x="40" y="176" width="18" height="64" ${OL}/>
    <circle class="rg" cx="49" cy="158" r="34" ${OL}/>
    <circle class="rg" cx="360" cy="230" r="9" ${OL}/><circle class="rg" cx="330" cy="236" r="9" ${OL}/>` },

  { name: 'flower', svg: `${BG}
    <rect class="rg" x="194" y="118" width="12" height="96" ${OL}/>
    <path class="rg" d="M198 182 Q150 150 128 172 Q160 200 198 186 Z" ${OL}/>
    <path class="rg" d="M202 166 Q250 134 272 156 Q240 184 202 170 Z" ${OL}/>
    ${[0, 1, 2, 3, 4, 5].map((i) => {
      const t = (i / 6) * Math.PI * 2 - Math.PI / 2;
      return `<circle class="rg" cx="${(200 + Math.cos(t) * 40).toFixed(1)}" cy="${(96 + Math.sin(t) * 40).toFixed(1)}" r="27" ${OL}/>`;
    }).join('')}
    <circle class="rg" cx="200" cy="96" r="28" ${OL}/>${face(200, 98, 0.95)}
    <path class="rg" d="M150 222 L250 222 L238 292 L162 292 Z" ${OL}/>
    <rect class="rg" x="138" y="206" width="124" height="24" rx="8" ${OL}/>
    <circle class="rg" cx="60" cy="60" r="12" ${OL}/><circle class="rg" cx="340" cy="230" r="14" ${OL}/>` },

  { name: 'car', svg: `${BG}
    ${sun(56, 54, 26)}${cloud(300, 60, 0.9)}
    <rect class="rg" x="0" y="232" width="400" height="68" ${OL}/>
    <path class="rg" d="M54 214 L54 168 Q54 154 70 152 L118 148 L150 104 Q156 96 170 96 L262 96 Q276 96 284 106 L316 148 L342 152 Q356 156 356 170 L356 214 Z" ${OL}/>
    <path class="rg" d="M162 110 L202 110 L202 146 L132 146 Z" ${OL}/>
    <path class="rg" d="M214 110 L258 110 Q266 110 272 118 L296 146 L214 146 Z" ${OL}/>
    <circle class="rg" cx="344" cy="176" r="9" ${OL}/>
    <rect class="rg" x="54" y="190" width="36" height="14" rx="4" ${OL}/>
    <circle class="rg" cx="120" cy="214" r="32" ${OL}/><circle class="rg" cx="290" cy="214" r="32" ${OL}/>
    <circle class="rg" cx="120" cy="214" r="13" ${OL}/><circle class="rg" cx="290" cy="214" r="13" ${OL}/>
    <path class="deco" d="M208 150 V196 M220 168 h16" ${LN}/>` },

  { name: 'rocket', svg: `${BG}
    ${[[50, 50, 7], [340, 40, 9], [360, 150, 6], [40, 170, 8], [90, 260, 6], [320, 250, 8]].map(([x, y, r]) => `<circle class="rg" cx="${x}" cy="${y}" r="${r}" ${OL}/>`).join('')}
    <path class="rg" d="M172 222 Q200 300 228 222 Z" ${OL}/>
    <path class="rg" d="M184 222 Q200 268 216 222 Z" ${OL}/>
    <path class="rg" d="M162 176 L114 236 L164 228 Z" ${OL}/>
    <path class="rg" d="M238 176 L286 236 L236 228 Z" ${OL}/>
    <path class="rg" d="M200 24 C 244 66, 254 140, 242 226 L158 226 C 146 140, 156 66, 200 24 Z" ${OL}/>
    <path class="rg" d="M200 24 C 222 44, 234 66, 239 90 L161 90 C 166 66, 178 44, 200 24 Z" ${OL}/>
    <circle class="rg" cx="200" cy="140" r="26" ${OL}/>
    <circle class="rg" cx="200" cy="140" r="15" ${OL}/>
    <rect class="rg" x="168" y="196" width="64" height="16" rx="6" ${OL}/>` },

  { name: 'boat', svg: `${BG}
    ${sun(64, 60, 28)}${cloud(320, 54, 0.8)}
    <path class="rg" d="M204 70 L204 182 L300 182 Z" ${OL}/>
    <path class="rg" d="M196 84 L196 182 L118 182 Z" ${OL}/>
    <path class="rg" d="M204 40 L236 52 L204 64 Z" ${OL}/>
    <rect class="rg" x="196" y="40" width="8" height="150" ${OL}/>
    <path class="rg" d="M80 190 L320 190 L290 238 L110 238 Z" ${OL}/>
    <circle class="rg" cx="150" cy="212" r="9" ${OL}/><circle class="rg" cx="200" cy="212" r="9" ${OL}/><circle class="rg" cx="250" cy="212" r="9" ${OL}/>
    <path class="rg" d="M0 230 Q25 216 50 230 T100 230 T150 230 T200 230 T250 230 T300 230 T350 230 T400 230 V300 H0 Z" ${OL}/>
    <path class="deco" d="M300 110 q8 -8 16 0 q8 -8 16 0 M60 140 q7 -7 14 0 q7 -7 14 0" ${LN}/>` },

  { name: 'apple tree', svg: `${BG}
    ${sun(350, 50, 26)}
    ${ground(246)}
    <path class="rg" d="M180 250 L184 168 L216 168 L220 250 Z" ${OL}/>
    <circle class="rg" cx="150" cy="128" r="54" ${OL}/><circle class="rg" cx="250" cy="128" r="54" ${OL}/>
    <circle class="rg" cx="200" cy="88" r="64" ${OL}/>
    ${[[150, 120], [240, 100], [196, 70], [264, 146], [128, 150], [210, 132]].map(([x, y]) => `<circle class="rg" cx="${x}" cy="${y}" r="11" ${OL}/>`).join('')}
    <circle class="rg" cx="300" cy="244" r="11" ${OL}/>
    <path class="deco" d="M60 250 l6 -14 l6 14 M84 254 l6 -14 l6 14 M330 256 l6 -14 l6 14" ${LN}/>` },

  { name: 'kitty', svg: `${BG}
    <path class="rg" d="M110 110 L104 26 L176 76 Z" ${OL}/><path class="rg" d="M290 110 L296 26 L224 76 Z" ${OL}/>
    <path class="rg" d="M122 92 L118 50 L156 78 Z" ${OL}/><path class="rg" d="M278 92 L282 50 L244 78 Z" ${OL}/>
    <ellipse class="rg" cx="200" cy="164" rx="118" ry="100" ${OL}/>
    <ellipse class="rg" cx="150" cy="140" rx="26" ry="30" ${OL}/><ellipse class="rg" cx="250" cy="140" rx="26" ry="30" ${OL}/>
    <ellipse class="rg" cx="178" cy="206" rx="28" ry="22" ${OL}/><ellipse class="rg" cx="222" cy="206" rx="28" ry="22" ${OL}/>
    <path class="rg" d="M186 182 L214 182 L200 198 Z" ${OL}/>
    <g class="deco"><circle cx="154" cy="144" r="12" fill="#4A2E1F"/><circle cx="254" cy="144" r="12" fill="#4A2E1F"/><circle cx="158" cy="139" r="4" fill="#fff"/><circle cx="258" cy="139" r="4" fill="#fff"/></g>
    <path class="deco" d="M150 200 L90 190 M150 212 L92 222 M250 200 L310 190 M250 212 L308 222" ${LN}/>` },

  { name: 'duck', svg: `${BG}
    ${sun(60, 54, 26)}
    <path class="rg" d="M0 220 Q50 206 100 220 T200 220 T300 220 T400 220 V300 H0 Z" ${OL}/>
    <path class="rg" d="M86 196 Q60 150 96 160 Q120 120 180 140 L250 150 Q320 150 316 200 Q300 250 180 250 Q90 248 86 196 Z" ${OL}/>
    <path class="rg" d="M150 178 Q190 150 240 176 Q206 214 150 178 Z" ${OL}/>
    <circle class="rg" cx="282" cy="112" r="48" ${OL}/>
    <path class="rg" d="M322 112 Q366 106 372 124 Q352 140 322 132 Z" ${OL}/>
    ${eyes(292, 292, 98, 7)}
    <path class="deco" d="M40 240 V170 M30 244 V186 M370 244 V176" ${LN}/>` },

  { name: 'turtle', svg: `${BG}
    ${sun(340, 50, 26)}
    ${ground(240)}
    <ellipse class="rg" cx="120" cy="226" rx="22" ry="16" ${OL}/><ellipse class="rg" cx="280" cy="226" rx="22" ry="16" ${OL}/>
    <path class="rg" d="M76 196 L52 206 L72 214 Z" ${OL}/>
    <circle class="rg" cx="332" cy="176" r="34" ${OL}/>
    <path class="rg" d="M80 214 Q80 90 200 90 Q320 90 320 214 Z" ${OL}/>
    <path class="rg" d="M170 124 L230 124 L248 164 L230 204 L170 204 L152 164 Z" ${OL}/>
    <path class="rg" d="M110 170 Q120 120 156 112 L152 164 Z" ${OL}/><path class="rg" d="M290 170 Q280 120 244 112 L248 164 Z" ${OL}/>
    <rect class="rg" x="74" y="204" width="252" height="18" rx="9" ${OL}/>
    ${eyes(330, 350, 166, 5)}${smile(338, 186, 9)}` },

  { name: 'snail', svg: `${BG}
    ${sun(60, 54, 26)}
    ${ground(246)}
    <path class="rg" d="M40 238 Q40 210 80 208 L300 208 Q330 208 334 180 L338 120 Q350 104 362 120 L366 206 Q366 240 330 240 Z" ${OL}/>
    <path class="deco" d="M344 124 L330 76 M358 122 L372 76" ${LN}/>
    <circle class="rg" cx="330" cy="72" r="10" ${OL}/><circle class="rg" cx="374" cy="72" r="10" ${OL}/>
    <circle class="rg" cx="196" cy="140" r="78" ${OL}/>
    <circle class="rg" cx="196" cy="140" r="52" ${OL}/>
    <circle class="rg" cx="196" cy="140" r="26" ${OL}/>
    ${eyes(344, 358, 160, 4.5)}${smile(352, 182, 8)}` },

  { name: 'ladybug', svg: `${BG}
    <ellipse class="rg" cx="200" cy="170" rx="180" ry="120" ${OL}/>
    <path class="deco" d="M180 74 Q160 30 140 30 M220 74 Q240 30 260 30" ${LN}/>
    <circle class="rg" cx="140" cy="30" r="9" ${OL}/><circle class="rg" cx="260" cy="30" r="9" ${OL}/>
    <circle class="rg" cx="200" cy="96" r="36" ${OL}/>
    <path class="rg" d="M200 112 Q120 112 110 180 Q112 250 200 254 Z" ${OL}/>
    <path class="rg" d="M200 112 Q280 112 290 180 Q288 250 200 254 Z" ${OL}/>
    ${[[160, 150, 14], [146, 206, 12], [180, 226, 10], [240, 150, 14], [254, 206, 12], [220, 226, 10]].map(([x, y, r]) => `<circle class="rg" cx="${x}" cy="${y}" r="${r}" ${OL}/>`).join('')}
    ${eyes(186, 214, 90, 6)}${smile(200, 106, 8)}` },

  { name: 'owl', svg: `${BG}
    <circle class="rg" cx="340" cy="50" r="30" ${OL}/>
    <rect class="rg" x="0" y="252" width="400" height="22" rx="10" ${OL}/>
    <path class="rg" d="M130 70 L118 22 L168 52 Z" ${OL}/><path class="rg" d="M270 70 L282 22 L232 52 Z" ${OL}/>
    <ellipse class="rg" cx="200" cy="160" rx="96" ry="112" ${OL}/>
    <ellipse class="rg" cx="200" cy="200" rx="58" ry="62" ${OL}/>
    <ellipse class="rg" cx="112" cy="176" rx="22" ry="54" ${OL}/><ellipse class="rg" cx="288" cy="176" rx="22" ry="54" ${OL}/>
    <circle class="rg" cx="160" cy="108" r="34" ${OL}/><circle class="rg" cx="240" cy="108" r="34" ${OL}/>
    <circle class="rg" cx="160" cy="108" r="16" ${OL}/><circle class="rg" cx="240" cy="108" r="16" ${OL}/>
    <path class="rg" d="M188 136 L212 136 L200 158 Z" ${OL}/>
    <path class="rg" d="M170 262 l-8 -10 l16 0 Z M230 262 l-8 -10 l16 0 Z" ${OL}/>
    <g class="deco"><circle cx="164" cy="104" r="5" fill="#fff"/><circle cx="244" cy="104" r="5" fill="#fff"/></g>
    <path class="deco" d="M180 196 q10 8 20 0 q10 8 20 0 M180 222 q10 8 20 0 q10 8 20 0" ${LN}/>` },

  { name: 'ice cream', svg: `${BG}
    <path class="rg" d="M146 172 L254 172 L200 292 Z" ${OL}/>
    <path class="deco" d="M162 190 L232 232 M174 220 L222 248 M238 190 L168 232 M226 220 L178 248" ${LN} opacity=".7"/>
    <circle class="rg" cx="200" cy="140" r="58" ${OL}/>
    <path class="rg" d="M146 160 Q160 186 170 168 Q182 194 196 172 Q212 196 222 170 Q238 190 254 160 Q250 180 200 182 Q150 180 146 160 Z" ${OL}/>
    <circle class="rg" cx="200" cy="80" r="46" ${OL}/>
    <circle class="rg" cx="206" cy="30" r="13" ${OL}/>
    <path class="deco" d="M206 18 Q214 4 226 4" ${LN}/>
    ${[[176, 120, 20], [214, 110, -30], [234, 138, 40], [170, 70, -20], [214, 64, 30], [190, 96, 10]].map(([x, y, a]) => `<rect class="rg" x="${x - 9}" y="${y - 3.5}" width="18" height="7" rx="3.5" transform="rotate(${a} ${x} ${y})" ${OL3}/>`).join('')}
    ${face(200, 140, 1.1)}` },

  { name: 'cupcake', svg: `${BG}
    <path class="rg" d="M116 170 L284 170 L262 274 L138 274 Z" ${OL}/>
    ${[150, 180, 210, 240].map((x, i) => `<path class="rg" d="M${x} 170 L${x + 18} 170 L${x + 14 - i * 2} 274 L${x + 2 - i * 2} 274 Z" ${OL}/>`).join('')}
    <ellipse class="rg" cx="200" cy="158" rx="100" ry="34" ${OL}/>
    <ellipse class="rg" cx="200" cy="122" rx="74" ry="30" ${OL}/>
    <ellipse class="rg" cx="200" cy="90" rx="48" ry="26" ${OL}/>
    <circle class="rg" cx="200" cy="56" r="16" ${OL}/>
    <path class="deco" d="M200 40 Q206 22 222 18" ${LN}/>
    ${face(200, 214, 1.4)}` },

  { name: 'rainbow', svg: `${BG}
    ${sun(340, 50, 28)}
    ${band(178, 160)}${band(160, 142)}${band(142, 124)}${band(124, 106)}${band(106, 88)}${band(88, 70)}
    ${cloud(40, 252, 1)}${cloud(360, 252, 1)}
    <path class="rg" d="M130 250 Q200 236 270 250 V300 H130 Z" ${OL}/>` },

  { name: 'train', svg: `${BG}
    ${cloud(300, 50, 0.8)}
    <circle class="rg" cx="96" cy="70" r="14" ${OL}/><circle class="rg" cx="116" cy="44" r="18" ${OL}/><circle class="rg" cx="146" cy="24" r="14" ${OL}/>
    <rect class="rg" x="0" y="248" width="400" height="52" ${OL}/>
    <rect class="rg" x="84" y="92" width="28" height="52" rx="4" ${OL}/>
    <rect class="rg" x="134" y="96" width="78" height="120" rx="8" ${OL}/>
    <rect class="rg" x="148" y="110" width="50" height="40" rx="6" ${OL}/>
    <rect class="rg" x="48" y="140" width="164" height="76" rx="10" ${OL}/>
    <path class="rg" d="M48 196 L24 230 L60 230 Z" ${OL}/>
    <rect class="rg" x="226" y="140" width="76" height="76" rx="8" ${OL}/>
    <rect class="rg" x="314" y="140" width="76" height="76" rx="8" ${OL}/>
    <circle class="rg" cx="90" cy="228" r="22" ${OL}/><circle class="rg" cx="170" cy="228" r="22" ${OL}/>
    <circle class="rg" cx="246" cy="230" r="16" ${OL}/><circle class="rg" cx="282" cy="230" r="16" ${OL}/>
    <circle class="rg" cx="334" cy="230" r="16" ${OL}/><circle class="rg" cx="370" cy="230" r="16" ${OL}/>
    <path class="deco" d="M212 186 H226 M302 186 H314" ${LN}/>` },

  { name: 'whale', svg: `${BG}
    <path class="rg" d="M0 224 Q50 210 100 224 T200 224 T300 224 T400 224 V300 H0 Z" ${OL}/>
    <path class="rg" d="M82 182 L28 136 Q40 170 32 200 Q50 192 84 200 Z" ${OL}/>
    <path class="rg" d="M70 188 C 70 116, 152 86, 232 96 C 306 106, 340 160, 330 200 C 310 244, 120 252, 70 188 Z" ${OL}/>
    <path class="rg" d="M88 204 C 140 242, 286 238, 326 206 C 290 226, 140 230, 88 204 Z" ${OL}/>
    <path class="rg" d="M180 200 Q198 244 232 214 Z" ${OL}/>
    <path class="deco" d="M240 92 Q236 64 226 52 M240 92 Q246 62 262 52" ${LN}/>
    <circle class="rg" cx="222" cy="44" r="10" ${OL}/><circle class="rg" cx="264" cy="44" r="10" ${OL}/><circle class="rg" cx="243" cy="30" r="10" ${OL}/>
    ${eyes(284, 284, 150, 7)}${smile(300, 180, 12)}` },

  { name: 'balloons', svg: `${BG}
    ${cloud(64, 60, 0.8)}${cloud(340, 250, 0.8)}
    <path class="deco" d="M128 172 Q120 220 196 286 M222 160 Q210 220 198 286 M304 196 Q280 240 200 286" ${LN}/>
    <ellipse class="rg" cx="128" cy="112" rx="50" ry="62" ${OL}/>
    <ellipse class="rg" cx="222" cy="96" rx="52" ry="64" ${OL}/>
    <ellipse class="rg" cx="304" cy="136" rx="48" ry="60" ${OL}/>
    <path class="rg" d="M120 172 L136 172 L128 182 Z" ${OL}/><path class="rg" d="M214 158 L230 158 L222 168 Z" ${OL}/><path class="rg" d="M296 194 L312 194 L304 204 Z" ${OL}/>
    <path class="rg" d="M180 286 L220 286 L214 300 L186 300 Z" ${OL}/>
    <ellipse class="deco" cx="110" cy="92" rx="10" ry="18" fill="#fff" opacity=".6"/>
    <ellipse class="deco" cx="204" cy="74" rx="10" ry="18" fill="#fff" opacity=".6"/>
    <ellipse class="deco" cx="288" cy="116" rx="10" ry="18" fill="#fff" opacity=".6"/>` },
];
