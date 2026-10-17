// Flattens Openclipart cartoon SVGs: every visible shape in root coordinates,
// with its computed fill, opacity and stroke.
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url); // honours NODE_PATH or a local install
const { chromium } = require('playwright');
const [outDir, ...files] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage();
for (const f of files) {
  await p.setContent(`<html><body>${fs.readFileSync(f, 'utf8').replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, '')}</body></html>`);
  const res = await p.evaluate(() => {
    const svg = document.querySelector('svg');
    const stop0 = (id) => { const g = document.getElementById(id); if (!g) return null; let s = g.querySelector('stop');
      if (!s) { const h = g.getAttribute('xlink:href') || g.getAttribute('href'); const g2 = h && document.getElementById(h.slice(1)); s = g2 && g2.querySelector('stop'); }
      return s ? getComputedStyle(s).stopColor : null; };
    const rgb2hex = (c) => { const m = c && c.match(/\d+(\.\d+)?/g); return m ? '#' + m.slice(0, 3).map((v) => (+v | 0).toString(16).padStart(2, '0')).join('') : null; };
    const paint = (v) => { if (!v || v === 'none') return null; const u = v.match(/url\("?#([^")]+)"?\)/); return u ? rgb2hex(stop0(u[1])) : rgb2hex(v); };
    const rootM = svg.getScreenCTM().inverse();
    return [...svg.querySelectorAll('path,rect,circle,ellipse,polygon')].filter((e) => !e.closest('defs,clipPath,mask,pattern,symbol')).map((e) => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return null;
      let op = 1; for (let n = e; n && n !== svg; n = n.parentElement) op *= +getComputedStyle(n).opacity;
      const m = rootM.multiply(e.getScreenCTM());
      const bb = e.getBBox();
      const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y + bb.height], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
      const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
      const keep = ['d', 'x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'points'];
      const attrs = Object.fromEntries(keep.filter((k) => e.hasAttribute(k)).map((k) => [k, e.getAttribute(k)]));
      if (cs.fillRule === 'evenodd') attrs['fill-rule'] = 'evenodd';
      return { tag: e.tagName, attrs, m: [m.a, m.b, m.c, m.d, m.e, m.f],
        fill: paint(cs.fill), fop: +cs.fillOpacity * op, stroke: paint(cs.stroke), sop: +cs.strokeOpacity * op, sw: parseFloat(cs.strokeWidth) || 0,
        box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
    }).filter(Boolean);
  });
  fs.writeFileSync(`${outDir}/${f.split('/').pop().replace('.svg', '.json')}`, JSON.stringify(res));
}
await b.close();
console.log('done', files.length);
