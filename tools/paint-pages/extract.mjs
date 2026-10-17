// Flattens a Kenney SVG: inlines <use>, then lists every top-level object with
// its paths transformed into root coordinates.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url); // honours NODE_PATH or a local install
const { chromium } = require('playwright');
const [src, out, mode] = process.argv.slice(2);
const svgText = fs.readFileSync(src, 'utf8');
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(`<html><body>${svgText}</body></html>`);
const res = await p.evaluate((mode) => {
  const svg = document.querySelector('svg');
  // inline <use> repeatedly
  for (let k = 0; k < 6; k++) {
    const uses = [...svg.querySelectorAll('use')];
    if (!uses.length) break;
    for (const u of uses) {
      const id = (u.getAttribute('xlink:href') || u.getAttribute('href') || '').slice(1);
      const ref = svg.querySelector('#' + CSS.escape(id));
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (u.getAttribute('transform')) g.setAttribute('transform', u.getAttribute('transform'));
      if (ref) { const c = ref.cloneNode(true); c.removeAttribute('id'); if (c.tagName === 'symbol') { while (c.firstChild) g.appendChild(c.firstChild); } else g.appendChild(c); }
      u.replaceWith(g);
    }
  }
  const grads = {};
  svg.querySelectorAll('linearGradient,radialGradient').forEach((gr) => { const s = gr.querySelector('stop'); if (s) grads[gr.id] = s.getAttribute('stop-color'); });
  const rootM = svg.getScreenCTM().inverse();
  const shapeEls = (root) => [...root.querySelectorAll('path,rect,circle,ellipse,polygon')].filter((e) => !e.closest('defs'));
  // top-level objects: direct children of the main content (outside defs)
  const content = [...svg.children].filter((c) => c.tagName !== 'defs');
  let objs = [];
  if (mode === 'flat') objs = shapeEls(svg).map((e) => [e]);
  else for (const c of content) {
    const kids = c.tagName === 'g' && !c.getAttribute('transform') && c.children.length > 1 ? [...c.children] : [c];
    for (const k of kids) objs.push(shapeEls(k).length ? shapeEls(k) : (k.tagName === 'path' ? [k] : []));
  }
  return objs.filter((o) => o.length).map((els) => els.map((e) => {
    const m = rootM.multiply(e.getScreenCTM());
    let fill = e.getAttribute('fill') || e.closest('[fill]')?.getAttribute('fill') || '#000';
    const g = fill.match(/url\(#(.+)\)/); if (g) fill = grads[g[1]] || '#888';
    const bb = e.getBBox();
    const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y + bb.height], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
    const clone = e.cloneNode(); clone.removeAttribute('fill'); clone.removeAttribute('stroke'); clone.removeAttribute('class'); clone.removeAttribute('id');
    return { tag: e.tagName, attrs: Object.fromEntries([...clone.attributes].map((a) => [a.name, a.value]).filter(([k]) => k !== 'transform' && k !== 'style')),
      m: [m.a, m.b, m.c, m.d, m.e, m.f], fill, op: +(e.getAttribute('fill-opacity') || e.getAttribute('opacity') || 1),
      box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
  }));
}, mode);
fs.writeFileSync(out, JSON.stringify(res));
console.log(src.split('/').pop(), 'objects', res.length, 'shapes', res.flat().length);
await b.close();
