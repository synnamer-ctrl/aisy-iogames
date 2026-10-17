import { h, flash } from '../util.js';
import { PAGES } from './paint-pages.js';

// Free-hand painting that never goes outside the lines: a stroke belongs to
// the paint area it started in and is clipped to that area's shape. Areas are
// stacked in page order (later ones cover earlier ones, like the drawing), each
// with its outline just above its paint; eyes and other details go on top.

const NS = 'http://www.w3.org/2000/svg';
const COLORS = ['#FF5A5F', '#FF922B', '#FFD43B', '#51CF66', '#3FA7F5', '#B57EDC', '#FF8FC7', '#8B5A2B', '#74C0FC', '#2B2B2B'];
const RAINBOW = 'rainbow';
const ERASER = '#FFFFFF';
const SIZES = [9, 18, 30];
const OUTLINE_ATTRS = ['stroke', 'stroke-width', 'stroke-linejoin', 'stroke-linecap'];

// Strokes per page survive switching pictures (and leaving the game) until reload.
const saved = new Map();
let lastPage = 0;

function strokePath(pts) {
  if (pts.length === 1) return `M${pts[0][0]} ${pts[0][1]} l0.01 0`;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i], [nx, ny] = pts[i + 1];
    d += ` Q${x} ${y} ${((x + nx) / 2).toFixed(1)} ${((y + ny) / 2).toFixed(1)}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx} ${ly}`;
}

function el(tag, attrs = {}) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

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
        <div class="paint-main"><div class="canvas"></div></div>
        <div class="paint-tools">
          <div class="palette"></div>
          <div class="paint-btns">
            <button class="pbtn size" aria-label="Brush size"><i></i></button>
            <button class="pbtn pics" aria-label="Pictures">🖼️</button>
            <button class="pbtn fresh" aria-label="New paper (tap twice)">🧽</button>
          </div>
        </div>
        <div class="gallery" hidden><div class="gallery-grid"></div></div>
      </div>`);
    stage.appendChild(root);
    const canvas = root.querySelector('.canvas');
    const pal = root.querySelector('.palette');
    const sizeBtn = root.querySelector('.size');
    const gallery = root.querySelector('.gallery');
    const grid = root.querySelector('.gallery-grid');
    let page = lastPage, color = COLORS[0], size = 1, hue = 0;
    let svg = null, layers = [], painted = new Set(), regionCount = 0, cheered = false;
    const live = new Map(); // pointerId -> stroke in progress

    /* ---------- tools ---------- */
    [...COLORS, RAINBOW, ERASER].forEach((c, i) => {
      const b = h(`<button class="blob ${i === 0 ? 'sel' : ''} ${c === RAINBOW ? 'rainbow' : ''} ${c === ERASER ? 'eraser' : ''}" style="--c:${c}" aria-label="${c === ERASER ? 'eraser' : 'color'}"></button>`);
      b.addEventListener('pointerdown', () => {
        color = c;
        pal.querySelectorAll('.blob').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
        api.sfx.tap();
      });
      pal.appendChild(b);
    });
    const showSize = () => sizeBtn.style.setProperty('--s', `${8 + size * 9}px`);
    showSize();
    sizeBtn.addEventListener('click', () => { size = (size + 1) % SIZES.length; showSize(); api.sfx.tap(); });

    // Wiping needs two taps so a stray tap never erases a drawing.
    const fresh = root.querySelector('.fresh');
    let armed = 0;
    fresh.addEventListener('click', () => {
      if (Date.now() - armed < 2000) {
        armed = 0;
        fresh.classList.remove('armed');
        saved.delete(page);
        api.sfx.whoosh();
        load(page);
      } else {
        armed = Date.now();
        fresh.classList.add('armed');
        flash(fresh, 'wiggle', 500);
        setTimeout(() => fresh.classList.remove('armed'), 2000);
      }
    });

    /* ---------- picture gallery ---------- */
    root.querySelector('.pics').addEventListener('click', () => {
      api.sfx.whoosh();
      grid.innerHTML = '';
      PAGES.forEach((p, i) => {
        const t = h(`<button class="thumb ${i === page ? 'cur' : ''}" aria-label="${p.name}">
            <svg viewBox="0 0 400 300">${p.svg}</svg>${saved.get(i)?.length ? '<span class="done">⭐</span>' : ''}</button>`);
        t.querySelectorAll('.rg').forEach((r) => r.setAttribute('fill', '#fff'));
        t.addEventListener('click', () => { gallery.hidden = true; api.sfx.tap(); load(i); });
        grid.appendChild(t);
      });
      gallery.hidden = false;
    });
    gallery.addEventListener('click', (e) => { if (e.target === gallery) gallery.hidden = true; });

    /* ---------- build a page ---------- */
    function load(p) {
      page = lastPage = p;
      live.clear();
      painted = new Set();
      cheered = false;
      const src = new DOMParser().parseFromString(`<svg xmlns="${NS}">${PAGES[p].svg}</svg>`, 'image/svg+xml').documentElement;
      svg = el('svg', { viewBox: '0 0 400 300', preserveAspectRatio: 'xMidYMid meet' });
      const defs = el('defs');
      const art = el('g');
      const top = el('g', { 'pointer-events': 'none' });
      svg.append(defs, art, top);
      layers = [];
      const decos = [];
      let n = 0;
      for (const node of [...src.children]) {
        if (!node.classList.contains('rg')) { decos.push(node); continue; }
        const shape = document.importNode(node, true);
        const hasLine = shape.hasAttribute('stroke');
        OUTLINE_ATTRS.forEach((a) => shape.removeAttribute(a));
        shape.removeAttribute('class');
        const clipId = `pc${p}-${n}`;
        const clip = el('clipPath', { id: clipId });
        clip.appendChild(shape.cloneNode(true));
        defs.appendChild(clip);
        const area = shape.cloneNode(true);
        area.setAttribute('fill', '#fff');
        area.setAttribute('data-r', n);
        area.classList.add('area');
        const paint = el('g', { 'clip-path': `url(#${clipId})`, 'pointer-events': 'none' });
        art.append(area, paint);
        layers.push(paint);
        // Each outline sits right above its own paint, so things in front
        // (an animal) cover the lines of things behind (a hill).
        if (hasLine) {
          const line = document.importNode(node, true);
          line.removeAttribute('class');
          line.setAttribute('fill', 'none');
          line.setAttribute('pointer-events', 'none');
          art.appendChild(line);
        }
        n++;
      }
      decos.forEach((d) => top.appendChild(document.importNode(d, true)));
      regionCount = n;
      canvas.innerHTML = '';
      canvas.appendChild(svg);
      (saved.get(p) || []).forEach((s) => { addPath(s); if (s.c !== ERASER) painted.add(s.r); });
      flash(canvas, 'pop-in', 500);

      svg.addEventListener('pointerdown', down);
      svg.addEventListener('pointermove', move);
      svg.addEventListener('pointerup', up);
      svg.addEventListener('pointercancel', up);
    }

    function addPath(s) {
      const path = el('path', { d: s.d, fill: 'none', stroke: s.c, 'stroke-width': s.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      layers[s.r].appendChild(path);
      return path;
    }

    const toSvg = (e) => {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      return [Math.round(q.x * 10) / 10, Math.round(q.y * 10) / 10];
    };
    const nextColor = () => {
      if (color !== RAINBOW) return color;
      hue = (hue + 28) % 360;
      return `hsl(${hue} 90% 58%)`;
    };

    /* ---------- drawing ---------- */
    function begin(r, pts) {
      const s = { r, c: nextColor(), w: SIZES[size], d: strokePath(pts) };
      return { s, pts, path: addPath(s) };
    }
    function down(e) {
      const area = e.target.closest?.('[data-r]');
      if (!area) return;
      e.preventDefault();
      svg.setPointerCapture(e.pointerId);
      live.set(e.pointerId, begin(+area.dataset.r, [toSvg(e)]));
      api.sfx.brush();
    }
    function move(e) {
      const cur = live.get(e.pointerId);
      if (!cur) return;
      const p = toSvg(e);
      const [lx, ly] = cur.pts[cur.pts.length - 1];
      if (Math.hypot(p[0] - lx, p[1] - ly) < 1.5) return;
      cur.pts.push(p);
      // The rainbow brush changes colour as it goes: start a new segment every few points.
      if (color === RAINBOW && cur.pts.length > 7) {
        finish(cur);
        live.set(e.pointerId, begin(cur.s.r, cur.pts.slice(-2)));
        return;
      }
      cur.s.d = strokePath(cur.pts);
      cur.path.setAttribute('d', cur.s.d);
    }
    function up(e) {
      const cur = live.get(e.pointerId);
      if (!cur) return;
      live.delete(e.pointerId);
      finish(cur);
    }
    function finish(cur) {
      cur.s.d = strokePath(cur.pts);
      cur.path.setAttribute('d', cur.s.d);
      if (!saved.has(page)) saved.set(page, []);
      saved.get(page).push(cur.s);
      if (cur.s.c !== ERASER) painted.add(cur.s.r);
      // A cheer once most of the picture has colour in it.
      if (!cheered && painted.size >= Math.ceil(regionCount * 0.7)) {
        cheered = true;
        api.sfx.fanfare();
        api.confetti(70);
      }
    }

    load(page);
  },
};
