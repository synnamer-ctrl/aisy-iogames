import { blox, COLOR_NAMES } from '../characters.js';
import { h, pick, flash } from '../util.js';

const WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export default {
  id: 'tower',
  title: 'Blox Tower',
  color: '#4DABF7',
  icon: () => `<div class="icon-tower"><div>${blox('yellow')}</div><div>${blox('green')}</div><div>${blox('red')}</div></div>`,
  start(stage, api) {
    const root = h(`<div class="g-tower">
        <div class="cloud c1"></div><div class="cloud c2"></div>
        <div class="tower"></div>
        <div class="ground"></div>
        <div class="tap-hint">👆</div>
      </div>`);
    stage.appendChild(root);
    const tower = root.querySelector('.tower');
    const hint = root.querySelector('.tap-hint');
    let W, H, bs, bh, groundY, topY, maxBlocks;
    let stack = [], mover = null, moverX = 0, dropping = false, raf = 0, lastColor = null, builds = 0;

    function layout() {
      W = root.clientWidth; H = root.clientHeight;
      groundY = root.querySelector('.ground').offsetTop;
      bs = Math.min(W * 0.24, H * 0.13);
      bh = (bs * 210) / 200;
      topY = Math.max(84, H * 0.1);
      maxBlocks = Math.max(4, Math.min(9, Math.floor((groundY - topY - bh * 1.6) / (bs * 0.88))));
    }
    const yFor = (i) => groundY - bh + 0.06 * bs - i * 0.88 * bs;

    function newMover() {
      let c;
      do c = pick(COLOR_NAMES); while (c === lastColor);
      lastColor = c;
      mover = h(`<div class="tblock" style="width:${bs}px;height:${bh}px">${blox(c)}</div>`);
      root.appendChild(mover);
      flash(mover, 'pop-in', 500);
      dropping = false;
    }

    const t0 = performance.now();
    function loop(now) {
      if (mover && !dropping) {
        const amp = Math.min(W / 2 - bs * 0.6, bs * 2.2);
        moverX = W / 2 + amp * Math.sin((now - t0) / 750);
        mover.style.transform = `translate(${moverX - bs / 2}px, ${topY}px)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    api.onExit(() => cancelAnimationFrame(raf));

    function drop() {
      if (!mover || dropping) return;
      dropping = true;
      hint.classList.add('gone');
      const prev = stack[stack.length - 1];
      const base = prev ? prev.x : W / 2;
      const spread = prev ? bs * 0.4 : bs * 1.2;
      const x = Math.max(base - spread, Math.min(base + spread, moverX)); // forgiving: always lands
      const i = stack.length;
      const y = yFor(i);
      const el = mover;
      mover = null;
      api.sfx.whoosh();
      const fall = el.animate(
        [{ transform: `translate(${moverX - bs / 2}px, ${topY}px)` }, { transform: `translate(${x - bs / 2}px, ${y}px)` }],
        { duration: 260 + (y - topY) * 0.6, easing: 'cubic-bezier(.55,0,1,.6)', fill: 'forwards' },
      );
      fall.onfinish = async () => {
        el.style.transform = `translate(${x - bs / 2}px, ${y}px)`;
        fall.cancel();
        tower.appendChild(el);
        flash(el, 'squish', 400);
        api.sfx.thud(i);
        stack.push({ el, x });
        stack.forEach((b) => flash(b.el, 'happy', 900));
        if (stack.length >= maxBlocks) {
          await api.say(WORDS[i] || '', { rate: 1.1 });
          topple();
        } else {
          api.say(WORDS[i] || '', { rate: 1.1 });
          await api.wait(250);
          newMover();
        }
      };
    }

    async function topple() {
      await api.say('Wow! So tall!');
      tower.style.transformOrigin = `${stack[0].x}px ${groundY}px`;
      tower.classList.add('wobble');
      await api.wait(1100);
      tower.classList.remove('wobble');
      api.sfx.crash();
      api.say('Crash! Whee!', { pitch: 1.5 });
      stack.forEach((b, j) => {
        const dir = Math.random() < 0.5 ? -1 : 1;
        b.el.classList.add('talk');
        b.el.animate(
          [
            { transform: b.el.style.transform },
            { transform: `translate(${b.x - bs / 2 + dir * (80 + j * 30)}px, ${groundY - bh * 0.9}px) rotate(${dir * (180 + j * 40)}deg)` },
          ],
          { duration: 800 + j * 60, easing: 'cubic-bezier(.4,-0.4,.7,1)', fill: 'forwards' },
        );
      });
      await api.wait(1400);
      builds++;
      await api.celebrate(builds === 1 ? 'What a great tower! Build it again!' : api.praise());
      tower.innerHTML = '';
      stack = [];
      layout();
      newMover();
    }

    root.addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) drop(); });
    layout();
    newMover();
    api.say('Tap to drop the blocks! Build a big tower!');
  },
};
