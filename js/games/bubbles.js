import { animal, ANIMAL_KINDS } from '../characters.js';
import { h, pick, rnd } from '../util.js';

export default {
  id: 'bubbles',
  title: 'Bubble Pop',
  color: '#5BC0EB',
  icon: () => `<div class="icon-bubble">${animal('penguin')}</div>`,
  start(stage, api) {
    const root = h(`<div class="g-bubbles">
        <div class="pop-count"></div>
      </div>`);
    stage.appendChild(root);
    const counter = root.querySelector('.pop-count');
    let pops = 0;

    function spawn() {
      if (root.querySelectorAll('.bubble:not(.popped)').length >= 7) return;
      const W = root.clientWidth, H = root.clientHeight;
      const s = Math.min(W, H) * rnd(0.2, 0.28);
      const kind = pick(ANIMAL_KINDS);
      const b = h(`<button class="bubble" aria-label="bubble">${animal(kind)}</button>`);
      b.style.width = b.style.height = s + 'px';
      b.style.left = rnd(0, W - s) + 'px';
      root.appendChild(b);
      const sway = rnd(-60, 60);
      const anim = b.animate(
        [
          { transform: `translate(0, ${H}px)` },
          { transform: `translate(${sway}px, ${H * 0.5}px)`, offset: 0.5 },
          { transform: `translate(${-sway / 2}px, ${-s * 1.2}px)` },
        ],
        { duration: rnd(6500, 9500), easing: 'linear', fill: 'forwards' },
      );
      anim.onfinish = () => b.remove();
      b.addEventListener('pointerdown', () => pop(b, anim, kind), { once: true });
    }

    function pop(b, anim, kind) {
      const r = b.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      anim.cancel();
      b.remove();
      api.sfx.pop();
      // the friend jumps out of the bubble and tumbles away
      const f = h(`<div class="freed happy talk">${animal(kind)}</div>`);
      f.style.width = f.style.height = r.width * 0.9 + 'px';
      f.style.left = r.left - rr.left + r.width * 0.05 + 'px';
      f.style.top = r.top - rr.top + 'px';
      root.appendChild(f);
      const dir = Math.random() < 0.5 ? -1 : 1;
      f.animate(
        [
          { transform: 'translate(0,0) rotate(0) scale(1)' },
          { transform: `translate(${dir * 40}px,-80px) rotate(${dir * 20}deg) scale(1.15)`, offset: 0.35 },
          { transform: `translate(${dir * 120}px, ${rr.height}px) rotate(${dir * 200}deg) scale(.9)` },
        ],
        { duration: 1500, easing: 'cubic-bezier(.3,.1,.7,1)', fill: 'forwards' },
      ).onfinish = () => f.remove();
      // little splash ring
      const ring = h('<div class="pop-ring"></div>');
      ring.style.left = r.left - rr.left + r.width / 2 + 'px';
      ring.style.top = r.top - rr.top + r.height / 2 + 'px';
      ring.style.width = ring.style.height = r.width + 'px';
      root.appendChild(ring);
      setTimeout(() => ring.remove(), 500);

      pops++;
      counter.textContent = '⭐'.repeat(pops % 10 || 10);
      if (pops % 10 === 0) {
        api.celebrate('Wow! Ten bubbles! You are a super bubble popper!');
      } else {
        api.sound(kind);
      }
    }

    spawn();
    api.every(850, spawn);
  },
};
