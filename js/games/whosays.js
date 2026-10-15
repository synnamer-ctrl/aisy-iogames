import { animal, ANIMALS, ANIMAL_KINDS } from '../characters.js';
import { h, pick, sample, shuffle, flash } from '../util.js';

export default {
  id: 'whosays',
  title: 'Who Says That?',
  color: '#38D9A9',
  icon: () => `<div class="icon-whosays">${animal('lion')}<span>?</span></div>`,
  start(stage, api) {
    const root = h(`<div class="g-whosays">
        <button class="listen" aria-label="Play the sound again">🔊</button>
        <div class="who-row"></div>
        <div class="dots"></div>
      </div>`);
    stage.appendChild(root);
    const row = root.querySelector('.who-row');
    const listen = root.querySelector('.listen');
    const dots = root.querySelector('.dots');
    let right = 0, last = null, target = null, busy = true;

    async function play() {
      flash(listen, 'pop-in', 500);
      listen.classList.add('on');
      await api.sound(target);
      listen.classList.remove('on');
    }
    listen.addEventListener('pointerdown', () => { if (target) play(); });

    async function round() {
      busy = true;
      do target = pick(ANIMAL_KINDS); while (target === last);
      last = target;
      const n = right < 5 ? 3 : 4;
      const set = shuffle([target, ...sample(ANIMAL_KINDS.filter((k) => k !== target), n - 1)]);
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < right % 5 ? 'on' : ''}"></i>`).join('');
      row.innerHTML = '';
      set.forEach((k, i) => {
        const b = h(`<button class="who-pal" style="--i:${i}" aria-label="${ANIMALS[k].name}">${animal(k)}</button>`);
        b.addEventListener('pointerdown', () => choose(b, k));
        row.appendChild(b);
      });
      await api.say('Listen! Who says this?');
      await play();
      busy = false;
    }

    async function choose(b, k) {
      if (busy) return;
      if (k !== target) {
        busy = true;
        api.sfx.wrong();
        flash(b, 'no', 600);
        await api.say(`That's the ${ANIMALS[k].name}. Listen again!`);
        await play();
        busy = false;
        return;
      }
      busy = true;
      api.sfx.ding();
      b.classList.add('happy', 'talk', 'chosen');
      row.querySelectorAll('.who-pal:not(.chosen)').forEach((o) => o.classList.add('fade'));
      right++;
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < (right % 5 || 5) ? 'on' : ''}"></i>`).join('');
      await api.say(`Yes! The ${ANIMALS[k].name}!`);
      await api.sound(k);
      await api.wait(300);
      if (right % 5 === 0) await api.celebrate('You know all the animal sounds!');
      round();
    }
    round();
  },
};
