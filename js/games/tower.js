import { blox, crown, COLOR_NAMES, BLOX_SHAPES, BLOX_PAD, BLOX_STUD } from '../characters.js';
import { h, pick, flash } from '../util.js';

// Tap to drop toy blocks and build a tower. Each level asks for a taller
// tower (the view scrolls up as it grows); finishing one lands a golden star
// on top, then the tower tumbles and the next level starts under a new sky.
const GOALS = [5, 8, 10, 12, 15];
const THEMES = ['day', 'sunset', 'night', 'space'];
const BAG = ['cube', 'cube', 'brick', 'tall', 'round'];

export default {
  id: 'tower',
  title: 'Blox Tower',
  color: '#4DABF7',
  icon: () => `<div class="icon-tower"><div>${blox('yellow')}</div><div>${blox('green')}</div><div>${blox('red')}</div></div>`,
  start(stage, api) {
    const root = h(`<div class="g-tower">
        <div class="sky-deco"><div class="cloud c1"></div><div class="cloud c2"></div><div class="stars"></div><div class="planet"></div></div>
        <div class="world"><div class="ground"></div><div class="tower"></div></div>
        <div class="tw-goal"></div>
        <div class="tap-hint">👆</div>
      </div>`);
    stage.appendChild(root);
    const world = root.querySelector('.world');
    const tower = root.querySelector('.tower');
    const goalEl = root.querySelector('.tw-goal');
    const hint = root.querySelector('.tap-hint');
    let W, H, u, groundY, topY, cam = 0;
    let level = 0, stack = [], mover = null, moverX = 0, busy = false, raf = 0, lastColor = null;

    const goal = () => GOALS[Math.min(level, GOALS.length - 1)];
    const dims = (shape) => {
      const S = BLOX_SHAPES[shape];
      return { S, w: (S.w + BLOX_PAD * 2) * u, h: (S.h + BLOX_STUD) * u, bodyW: S.w * u, bodyH: S.h * u };
    };
    const baseY = () => (stack.length ? stack[stack.length - 1].top : groundY);
    const tallest = () => (BLOX_SHAPES.tall.h + BLOX_STUD) * u;

    function layout() {
      W = root.clientWidth; H = root.clientHeight;
      groundY = H * 0.88;
      u = Math.min(W * 0.24, H * 0.15) / 200;
      topY = Math.max(96, H * 0.11);
    }

    function setCam(c) {
      cam = Math.max(0, c);
      world.style.transform = `translateY(${cam}px)`;
    }
    // Keep the top of the tower comfortably below the block that is swinging.
    const followTower = () => setCam(Math.max(cam, topY + tallest() + 24 - baseY()));

    function showGoal() {
      goalEl.innerHTML = Array.from({ length: goal() }, (_, i) => `<i class="${i < stack.length ? 'on' : ''}"></i>`).join('');
    }

    function newLevel() {
      root.dataset.theme = THEMES[level % THEMES.length];
      tower.innerHTML = '';
      stack = [];
      setCam(0);
      showGoal();
      newMover();
    }

    function newMover() {
      let c;
      do c = pick(COLOR_NAMES); while (c === lastColor);
      lastColor = c;
      const shape = stack.length === 0 ? pick(['cube', 'brick']) : pick(BAG);
      const d = dims(shape);
      mover = h(`<div class="tblock" style="width:${d.w}px;height:${d.h}px">${blox(c, '', shape)}</div>`);
      mover._shape = shape;
      root.appendChild(mover);
      flash(mover, 'pop-in', 500);
      busy = false;
      if (resizeLater) onResize();
    }

    const t0 = performance.now();
    function loop(now) {
      if (mover && !busy) {
        const d = dims(mover._shape);
        const amp = Math.max(0, Math.min(W / 2 - d.w / 2 - 8, Math.max(W * 0.3, 2.2 * 200 * u)));
        moverX = W / 2 + amp * Math.sin((now - t0) / 800);
        mover.style.transform = `translate(${moverX - d.w / 2}px, ${topY}px)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    api.onExit(() => cancelAnimationFrame(raf));

    function place(item) {
      const d = dims(item.shape);
      item.el.style.width = d.w + 'px';
      item.el.style.height = d.h + 'px';
      item.el.style.transform = `translate(${item.x - d.w / 2}px, ${item.base - d.h}px)`;
    }

    function drop() {
      if (!mover || busy) return;
      busy = true;
      hint.classList.add('gone');
      const el = mover;
      mover = null;
      const shape = el._shape, d = dims(shape);
      const prev = stack[stack.length - 1];
      // Forgiving: the block always lands on the tower, just a little offset.
      const reach = prev ? Math.min(dims(prev.shape).bodyW, d.bodyW) * 0.42 : W * 0.18;
      const center = prev ? prev.x : W / 2;
      const x = Math.max(center - reach, Math.min(center + reach, moverX));
      const base = baseY();
      const item = { el, x, shape, base, top: base - d.bodyH };
      api.sfx.whoosh();
      const fromY = topY, toY = base + cam - d.h;
      const fall = el.animate(
        [{ transform: `translate(${moverX - d.w / 2}px, ${fromY}px)` }, { transform: `translate(${x - d.w / 2}px, ${toY}px)` }],
        { duration: 240 + Math.max(0, toY - fromY) * 0.55, easing: 'cubic-bezier(.55,0,1,.6)', fill: 'forwards' },
      );
      fall.onfinish = async () => {
        place(item);
        fall.cancel();
        tower.appendChild(el);
        flash(el, 'squish', 400);
        api.sfx.thud(Math.min(stack.length, 12));
        stack.push(item);
        showGoal();
        stack.slice(-4).forEach((b) => flash(b.el, 'happy', 900));
        followTower();
        if (stack.length >= goal()) { win(); return; }
        await api.wait(300);
        newMover();
      };
    }

    async function win() {
      // A golden star lands on top of the finished tower.
      const top = stack[stack.length - 1];
      const cw = 210 * u, chh = cw * 0.95;
      const star = h(`<div class="tblock tcrown" style="width:${cw}px;height:${chh}px">${crown()}</div>`);
      tower.appendChild(star);
      const endY = top.top - chh * 0.9;
      star.animate(
        [{ transform: `translate(${top.x - cw / 2}px, ${endY - H}px) rotate(-30deg)` }, { transform: `translate(${top.x - cw / 2}px, ${endY}px) rotate(0)` }],
        { duration: 700, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' },
      );
      setCam(Math.max(cam, topY + 10 - endY));
      await api.wait(700);
      api.sfx.fanfare();
      api.confetti(80);
      stack.forEach((b) => flash(b.el, 'happy', 1600));
      await api.wait(1400);
      // Wobble... then CRASH: every block tumbles down and lands in a heap on the ground.
      tower.style.transformOrigin = `${stack[0].x}px ${groundY}px`;
      tower.classList.add('wobble');
      await api.wait(900);
      tower.classList.remove('wobble');
      api.sfx.crash();
      setCam(0); // glide back down so the landing is in view
      const pieces = [...stack.map((b) => ({ el: b.el, x: b.x, ...dims(b.shape) })), { el: star, x: top.x, w: cw, h: chh }];
      let longest = 0;
      pieces.forEach((p, j) => {
        const dir = Math.random() < 0.5 ? -1 : 1;
        const turns = [90, 180, 270, 360][Math.floor(Math.random() * 4)];
        // A block turned on its side rests on its long edge.
        const half = turns % 180 ? p.w / 2 : p.h / 2;
        const cx = Math.max(p.w / 2, Math.min(W - p.w / 2, p.x + dir * (40 + Math.random() * W * 0.28)));
        const tx = cx - p.w / 2, ty = groundY - half - p.h / 2 + p.h * 0.06;
        const rot = dir * turns;
        const delay = (pieces.length - 1 - j) * 60; // the top tumbles first
        const dur = 850 + Math.random() * 250;
        longest = Math.max(longest, delay + dur);
        p.el.classList.add('talk');
        p.el.animate(
          [
            { transform: getComputedStyle(p.el).transform },
            { transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`, offset: 0.78, easing: 'cubic-bezier(.3,0,.6,1)' },
            { transform: `translate(${tx + dir * 10}px, ${ty - p.h * 0.18}px) rotate(${rot + dir * 8}deg)`, offset: 0.89 },
            { transform: `translate(${tx + dir * 14}px, ${ty}px) rotate(${rot}deg)` },
          ],
          { duration: dur, delay, easing: 'cubic-bezier(.45,0,.9,.6)', fill: 'forwards' },
        );
        api.wait(delay + dur * 0.78).then(() => api.sfx.thud(Math.max(0, 6 - (j % 6))));
      });
      await api.wait(longest + 300);
      await api.wait(1200); // let him enjoy the mess
      await api.celebrate();
      level++;
      newLevel();
    }

    // Rotating the device: rebuild sizes and re-stack the tower in place.
    let lastW = 0, resizeLater = false;
    const onResize = () => {
      if (!root.isConnected || root.clientWidth === lastW) return;
      resizeLater = busy; // mid-drop or mid-win: redo it when the next block appears
      if (busy) return;
      const oldW = W;
      layout();
      lastW = W;
      let base = groundY;
      stack.forEach((b) => {
        b.x = (b.x / oldW) * W;
        b.base = base;
        b.top = base - dims(b.shape).bodyH;
        base = b.top;
        place(b);
      });
      cam = 0;
      followTower();
      if (mover) { const d = dims(mover._shape); mover.style.width = d.w + 'px'; mover.style.height = d.h + 'px'; }
    };
    window.addEventListener('resize', onResize);
    api.onExit(() => window.removeEventListener('resize', onResize));

    root.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) drop(); });
    layout();
    lastW = W;
    newLevel();
  },
};
