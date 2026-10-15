export const rnd = (a, b) => a + Math.random() * (b - a);
export const rint = (a, b) => Math.floor(rnd(a, b + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const sample = (arr, n) => shuffle(arr).slice(0, n);
export const cap = (s) => s[0].toUpperCase() + s.slice(1);

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

// Restartable one-shot CSS animation class.
export function flash(el, cls, ms = 700) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  clearTimeout(el['_t_' + cls]);
  el['_t_' + cls] = setTimeout(() => el.classList.remove(cls), ms);
}

export function inside(x, y, el, pad = 0) {
  const r = el.getBoundingClientRect();
  return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
}

export function center(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// Pointer-based drag that also reports a plain tap. Element moves with translate().
export function draggable(el, { onDrop, onTap, onStart } = {}) {
  let sx = 0, sy = 0, dx = 0, dy = 0, id = null, moved = false;
  el.style.touchAction = 'none';
  const down = (e) => {
    if (id !== null || el.classList.contains('locked')) return;
    id = e.pointerId; sx = e.clientX; sy = e.clientY; dx = dy = 0; moved = false;
    el.setPointerCapture(id);
    el.classList.add('dragging');
    el.style.transition = 'none';
    onStart?.(el);
  };
  const move = (e) => {
    if (e.pointerId !== id) return;
    dx = e.clientX - sx; dy = e.clientY - sy;
    if (Math.hypot(dx, dy) > 10) moved = true;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
  };
  const up = (e) => {
    if (e.pointerId !== id) return;
    id = null;
    el.classList.remove('dragging');
    const ok = moved ? onDrop?.(e.clientX, e.clientY, el) : onTap?.(el);
    if (!ok) back(el);
  };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
}
export function back(el) {
  el.style.transition = 'transform .35s cubic-bezier(.3,1.6,.5,1)';
  el.style.transform = '';
}

// Fly an element (visually) to the center of a target element.
export function flyTo(el, target, ms = 450, scale = 0.6) {
  const a = el.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const cur = new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2) + cur.m41;
  const dy = b.top + b.height / 2 - (a.top + a.height / 2) + cur.m42;
  el.style.transition = `transform ${ms}ms cubic-bezier(.5,-0.3,.6,1)`;
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  return new Promise((r) => setTimeout(r, ms));
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
