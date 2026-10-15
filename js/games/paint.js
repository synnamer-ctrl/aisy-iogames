import { h, flash } from '../util.js';

const OL = 'stroke="#4A2E1F" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
const face = (x, y, s = 1) => `<g class="deco">
  <circle cx="${x - 10 * s}" cy="${y - 4 * s}" r="${4.5 * s}" fill="#4A2E1F"/><circle cx="${x + 10 * s}" cy="${y - 4 * s}" r="${4.5 * s}" fill="#4A2E1F"/>
  <path d="M${x - 9 * s} ${y + 6 * s} Q${x} ${y + 15 * s} ${x + 9 * s} ${y + 6 * s}" fill="none" stroke="#4A2E1F" stroke-width="${3.5 * s}" stroke-linecap="round"/></g>`;

const PAGES = [
  { name: 'fish', svg: `
    <rect class="rg" x="0" y="0" width="400" height="300"/>
    <path class="rg" d="M0 250 Q100 230 200 250 T400 245 V300 H0 Z" ${OL}/>
    <path class="rg" d="M30 262 Q8 222 30 190 Q52 158 32 128 Q66 160 48 196 Q32 226 54 262 Z" ${OL}/>
    <path class="rg" d="M150 86 Q205 26 262 88 Z" ${OL}/>
    <path class="rg" d="M290 150 L372 88 Q348 150 372 212 Z" ${OL}/>
    <ellipse class="rg" cx="200" cy="150" rx="110" ry="75" ${OL}/>
    <path class="rg" d="M218 78 Q244 150 218 222 L244 216 Q268 150 244 84 Z" ${OL}/>
    <path class="rg" d="M180 168 Q210 212 248 172 Q214 184 180 168 Z" ${OL}/>
    <circle class="rg" cx="138" cy="130" r="20" ${OL}/>
    <g class="deco"><circle cx="142" cy="133" r="9" fill="#4A2E1F"/><circle cx="146" cy="128" r="3" fill="#fff"/>
      <path d="M102 168 Q118 182 134 168" fill="none" stroke="#4A2E1F" stroke-width="5" stroke-linecap="round"/></g>
    <circle class="rg" cx="88" cy="78" r="13" ${OL}/><circle class="rg" cx="68" cy="44" r="9" ${OL}/><circle class="rg" cx="104" cy="26" r="7" ${OL}/>` },
  { name: 'butterfly', svg: `
    <rect class="rg" x="0" y="0" width="400" height="300"/>
    <ellipse class="rg" cx="140" cy="112" rx="82" ry="60" transform="rotate(-25 140 112)" ${OL}/>
    <ellipse class="rg" cx="260" cy="112" rx="82" ry="60" transform="rotate(25 260 112)" ${OL}/>
    <ellipse class="rg" cx="150" cy="206" rx="56" ry="44" transform="rotate(20 150 206)" ${OL}/>
    <ellipse class="rg" cx="250" cy="206" rx="56" ry="44" transform="rotate(-20 250 206)" ${OL}/>
    <circle class="rg" cx="122" cy="104" r="22" ${OL}/><circle class="rg" cx="278" cy="104" r="22" ${OL}/>
    <circle class="rg" cx="146" cy="210" r="15" ${OL}/><circle class="rg" cx="254" cy="210" r="15" ${OL}/>
    <path class="deco" d="M190 70 Q170 30 150 26 M210 70 Q230 30 250 26" fill="none" ${OL}/>
    <circle class="rg" cx="150" cy="26" r="10" ${OL}/><circle class="rg" cx="250" cy="26" r="10" ${OL}/>
    <ellipse class="rg" cx="200" cy="168" rx="17" ry="70" ${OL}/>
    <circle class="rg" cx="200" cy="86" r="26" ${OL}/>${face(200, 88, 0.9)}` },
  { name: 'house', svg: `
    <rect class="rg" x="0" y="0" width="400" height="300"/>
    <circle class="rg" cx="340" cy="56" r="30" ${OL}/>
    <rect class="rg" x="0" y="240" width="400" height="60" ${OL}/>
    <rect class="rg" x="248" y="58" width="28" height="56" ${OL}/>
    <path class="rg" d="M88 132 L200 50 L312 132 Z" ${OL}/>
    <rect class="rg" x="110" y="132" width="180" height="108" ${OL}/>
    <rect class="rg" x="180" y="174" width="42" height="66" rx="6" ${OL}/>
    <circle class="deco" cx="212" cy="210" r="4" fill="#4A2E1F"/>
    <rect class="rg" x="126" y="150" width="38" height="38" rx="4" ${OL}/>
    <rect class="rg" x="236" y="150" width="38" height="38" rx="4" ${OL}/>
    <path class="deco" d="M145 150 V188 M126 169 H164 M255 150 V188 M236 169 H274" ${OL}/>
    <rect class="rg" x="40" y="176" width="18" height="64" ${OL}/>
    <circle class="rg" cx="49" cy="158" r="34" ${OL}/>
    <circle class="rg" cx="360" cy="230" r="9" ${OL}/><circle class="rg" cx="330" cy="236" r="9" ${OL}/>` },
  { name: 'flower', svg: `
    <rect class="rg" x="0" y="0" width="400" height="300"/>
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
];

const PALETTE = ['#FF5A5F', '#FF922B', '#FFD43B', '#51CF66', '#3FA7F5', '#B57EDC', '#FF8FC7', '#8B5A2B', '#74C0FC', '#FFFFFF'];

export default {
  id: 'paint',
  title: 'Paint',
  color: '#FCC419',
  icon: () => `<div class="icon-paint"><svg viewBox="0 0 100 100">
      <path d="M50 8 C 20 8, 6 30, 8 52 C 10 76, 32 92, 52 90 C 62 89, 62 78, 56 72 C 50 66, 56 58, 66 60 C 84 64, 94 52, 92 40 C 88 20, 72 8, 50 8 Z" fill="#FFF3D6" stroke="#4A2E1F" stroke-width="4"/>
      <circle cx="30" cy="34" r="8" fill="#FF5A5F"/><circle cx="50" cy="24" r="8" fill="#FFD43B"/><circle cx="72" cy="32" r="8" fill="#3FA7F5"/><circle cx="26" cy="58" r="8" fill="#51CF66"/>
    </svg></div>`,
  start(stage, api) {
    const root = h(`<div class="g-paint">
        <div class="canvas-wrap">
          <button class="arrow prev" aria-label="Previous picture">◀</button>
          <div class="canvas"></div>
          <button class="arrow next" aria-label="Next picture">▶</button>
        </div>
        <div class="palette"></div>
      </div>`);
    stage.appendChild(root);
    const canvas = root.querySelector('.canvas');
    const pal = root.querySelector('.palette');
    let page = 0, color = PALETTE[0];

    PALETTE.forEach((c, i) => {
      const b = h(`<button class="blob ${i === 0 ? 'sel' : ''}" style="--c:${c}" aria-label="color"></button>`);
      b.addEventListener('pointerdown', () => {
        color = c;
        pal.querySelectorAll('.blob').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        api.sfx.tap();
      });
      pal.appendChild(b);
    });

    function load(p) {
      page = (p + PAGES.length) % PAGES.length;
      canvas.innerHTML = `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">${PAGES[page].svg}</svg>`;
      const regions = [...canvas.querySelectorAll('.rg')];
      regions.forEach((r) => r.setAttribute('fill', '#FFFFFF'));
      let celebrated = false;
      regions.forEach((r) => r.addEventListener('pointerdown', () => {
        r.setAttribute('fill', color);
        r.dataset.done = color === '#FFFFFF' ? '' : '1';
        api.sfx.splash();
        flash(r, 'painted', 400);
        if (!celebrated && regions.every((x) => x.dataset.done)) {
          celebrated = true;
          api.confetti(80);
          api.sfx.fanfare();
          api.say('Beautiful! What a lovely picture!');
        }
      }));
      flash(canvas, 'pop-in', 600);
      api.say(`Let's paint the ${PAGES[page].name}!`);
    }
    root.querySelector('.prev').addEventListener('click', () => { api.sfx.whoosh(); load(page - 1); });
    root.querySelector('.next').addEventListener('click', () => { api.sfx.whoosh(); load(page + 1); });
    load(0);
  },
};
