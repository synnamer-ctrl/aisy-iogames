import { blox, COLORS, COLOR_NAMES } from '../characters.js';
import { h, pick, sample, shuffle, flash, cap } from '../util.js';

export default {
  id: 'colors',
  title: 'Colors',
  color: '#FF6B6B',
  icon: () => `<div class="icon-colors">${blox('red')}${blox('blue')}${blox('yellow')}</div>`,
  start(stage, api) {
    const root = h(`<div class="g-colors">
        <div class="ask"><span class="paint-blob"></span><span class="ask-word"></span></div>
        <div class="blox-row"></div>
        <div class="dots"></div>
      </div>`);
    stage.appendChild(root);
    const row = root.querySelector('.blox-row');
    const blob = root.querySelector('.paint-blob');
    const word = root.querySelector('.ask-word');
    const dots = root.querySelector('.dots');
    let right = 0, last = null, busy = false;

    function round() {
      busy = false;
      const n = right < 5 ? 3 : 4;
      let target;
      do target = pick(COLOR_NAMES); while (target === last);
      last = target;
      const set = shuffle([target, ...sample(COLOR_NAMES.filter((c) => c !== target), n - 1)]);
      blob.style.background = COLORS[target].c;
      word.textContent = cap(target);
      word.style.color = COLORS[target].d;
      flash(root.querySelector('.ask'), 'pop-in', 600);
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < right % 5 ? 'on' : ''}"></i>`).join('');
      row.innerHTML = '';
      set.forEach((c, i) => {
        const b = h(`<button class="blox-btn" style="--i:${i}" aria-label="${c}">${blox(c)}</button>`);
        b.addEventListener('pointerdown', () => tap(b, c, target));
        row.appendChild(b);
      });
      api.say(`Find ${target}! Where is ${target}?`);
    }

    async function tap(b, c, target) {
      if (busy) return;
      if (c !== target) {
        api.sfx.wrong();
        flash(b, 'no', 600);
        api.say(`That's ${c}. Find ${target}!`);
        return;
      }
      busy = true;
      api.sfx.ding();
      b.classList.add('happy', 'talk', 'chosen');
      row.querySelectorAll('.blox-btn:not(.chosen)').forEach((o) => o.classList.add('fade'));
      right++;
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < (right % 5 || 5) ? 'on' : ''}"></i>`).join('');
      await api.say(`${cap(target)}! ${api.praise()}`);
      await api.wait(300);
      if (right % 5 === 0) await api.celebrate('You know your colors! Super!');
      round();
    }
    round();
  },
};
