import { animal, ANIMALS, ANIMAL_KINDS } from '../characters.js';
import { h, sample, shuffle, flash, cap } from '../util.js';

export default {
  id: 'memory',
  title: 'Match Pairs',
  color: '#F783AC',
  icon: () => `<div class="icon-memory"><div class="mc back">★</div><div class="mc">${animal('pig')}</div></div>`,
  start(stage, api) {
    const root = h(`<div class="g-memory"><div class="cards"></div></div>`);
    stage.appendChild(root);
    const grid = root.querySelector('.cards');
    let level = 0;

    async function round() {
      const pairs = [2, 3, 3, 4][Math.min(level, 3)];
      const kinds = sample(ANIMAL_KINDS, pairs);
      const deck = shuffle([...kinds, ...kinds]);
      const n = deck.length;
      const landscape = root.clientWidth > root.clientHeight;
      const cols = landscape ? n / 2 : 2;
      grid.style.setProperty('--cols', cols);
      grid.style.setProperty('--rows', n / cols);
      grid.innerHTML = '';
      let open = [], matched = 0, lock = true;

      const cards = deck.map((k, i) => {
        const c = h(`<button class="card flipped" style="--i:${i}" aria-label="card">
            <div class="card-in">
              <div class="card-back"><svg viewBox="0 0 100 100"><path d="M50 10 L61 38 L91 39 L67 57 L76 88 L50 70 L24 88 L33 57 L9 39 L39 38 Z" fill="#FFD43B" stroke="#4A2E1F" stroke-width="4" stroke-linejoin="round"/></svg></div>
              <div class="card-face">${animal(k)}</div>
            </div></button>`);
        c.addEventListener('pointerdown', () => flip(c, k));
        grid.appendChild(c);
        return c;
      });

      await api.say('Look! Remember the friends!');
      await api.wait(1200);
      api.sfx.flip();
      cards.forEach((c) => c.classList.remove('flipped'));
      await api.wait(400);
      lock = false;
      api.say('Find two the same!');

      async function flip(c, k) {
        if (lock || c.classList.contains('flipped')) return;
        api.sfx.flip();
        c.classList.add('flipped');
        open.push({ c, k });
        if (open.length < 2) return;
        lock = true;
        const [a, b] = open;
        open = [];
        if (a.k === b.k) {
          await api.wait(350);
          api.sfx.ding();
          [a.c, b.c].forEach((x) => x.classList.add('matched', 'happy', 'talk'));
          matched++;
          if (matched === pairs) {
            await api.say(`Two ${ANIMALS[a.k].plural}!`);
            level++;
            await api.celebrate('You found all the pairs!');
            round();
            return;
          }
          api.say(`${cap(ANIMALS[a.k].name)}! ${cap(ANIMALS[a.k].name)}! A match!`);
          lock = false;
        } else {
          await api.wait(900);
          api.sfx.wrong();
          flash(a.c, 'no', 500); flash(b.c, 'no', 500);
          await api.wait(400);
          a.c.classList.remove('flipped');
          b.c.classList.remove('flipped');
          lock = false;
        }
      }
    }
    round();
  },
};
