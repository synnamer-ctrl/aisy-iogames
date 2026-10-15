import { animal, bush, ANIMALS, ANIMAL_KINDS } from '../characters.js';
import { h, pick, sample, flash } from '../util.js';

export default {
  id: 'peekaboo',
  title: 'Peekaboo',
  color: '#94D82D',
  icon: () => `<div class="icon-peek"><div class="ip-a">${animal('panda')}</div><div class="ip-b">${bush()}</div></div>`,
  start(stage, api) {
    const root = h(`<div class="g-peek">
        <div class="cloud c1"></div><div class="cloud c2"></div>
        <div class="who"></div>
        <div class="bushes"></div>
        <div class="dots"></div>
      </div>`);
    stage.appendChild(root);
    const row = root.querySelector('.bushes');
    const who = root.querySelector('.who');
    const dots = root.querySelector('.dots');
    let found = 0, ready = false;
    who.addEventListener('pointerdown', () => { const k = who.querySelector('svg')?.dataset.kind; if (k) { flash(who, 'wiggle', 500); api.sound(k); } });

    async function round() {
      ready = false;
      const n = found < 3 ? 3 : 4;
      const kinds = sample(ANIMAL_KINDS, n);
      const target = pick(kinds);
      who.innerHTML = '';
      who.classList.remove('show');
      dots.innerHTML = Array.from({ length: 4 }, (_, i) => `<i class="${i < found % 4 ? 'on' : ''}"></i>`).join('');
      row.innerHTML = '';
      const spots = kinds.map((k) => {
        const s = h(`<button class="hide-spot up" aria-label="bush"><div class="hider">${animal(k)}</div>${bush()}</button>`);
        s.addEventListener('pointerdown', () => tap(s, k));
        row.appendChild(s);
        return s;
      });
      await api.say('Look at all my friends!');
      await api.wait(900);
      api.sfx.whoosh();
      spots.forEach((s) => s.classList.remove('up'));
      await api.say('They are hiding!');
      who.innerHTML = animal(target);
      who.classList.add('show');
      ready = true;
      api.say(`Where is the ${ANIMALS[target].name}?`);

      async function tap(s, k) {
        if (!ready || s.classList.contains('up')) return;
        flash(s, 'rustle', 500);
        api.sfx.boing();
        s.classList.add('up');
        if (k !== target) {
          s.querySelector('.hider').classList.add('talk');
          await api.sound(k);
          await api.say(`Hi! I'm the ${ANIMALS[k].name}!`, { pitch: 1.5 });
          await api.wait(300);
          s.classList.remove('up');
          s.querySelector('.hider').classList.remove('talk');
          return;
        }
        ready = false;
        s.querySelector('.hider').classList.add('happy', 'talk');
        api.sfx.success();
        api.confetti(30);
        found++;
        dots.innerHTML = Array.from({ length: 4 }, (_, i) => `<i class="${i < (found % 4 || 4) ? 'on' : ''}"></i>`).join('');
        await api.say(`Peekaboo! You found the ${ANIMALS[k].name}!`);
        await api.sound(k);
        await api.wait(500);
        if (found % 4 === 0) await api.celebrate('You found everybody! Hooray!');
        round();
      }
    }
    round();
  },
};
