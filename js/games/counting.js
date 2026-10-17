import { animal, ANIMALS, ANIMAL_KINDS } from '../characters.js';
import { h, pick, rint, rnd, flash } from '../util.js';

const WORDS = ['zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

export default {
  id: 'counting',
  title: 'Count 1-2-3',
  color: '#9775FA',
  icon: () => `<div class="icon-count">${animal('chick')}<b>123</b></div>`,
  start(stage, api) {
    const root = h(`<div class="g-count">
        <div class="tally"></div>
        <div class="field"></div>
        <div class="big-num"></div>
      </div>`);
    stage.appendChild(root);
    const field = root.querySelector('.field');
    const tally = root.querySelector('.tally');
    const bigNum = root.querySelector('.big-num');
    let rounds = 0, lastKind = null;

    function round() {
      let kind;
      do kind = pick(ANIMAL_KINDS); while (kind === lastKind);
      lastKind = kind;
      const max = rounds < 3 ? 3 : rounds < 6 ? 5 : 7;
      const n = rint(rounds < 3 ? 1 : 2, max);
      let counted = 0;
      field.innerHTML = '';
      tally.innerHTML = '';
      bigNum.className = 'big-num';
      const size = n <= 3 ? 30 : n <= 5 ? 24 : 20;
      for (let i = 0; i < n; i++) {
        const a = h(`<button class="counter-pal" style="--s:${size}vmin;--i:${i};--r:${rnd(-8, 8).toFixed(1)}deg" aria-label="${ANIMALS[kind].name}">
            ${animal(kind)}<span class="num-tag"></span></button>`);
        a.addEventListener('pointerdown', async () => {
          if (a.classList.contains('done')) { flash(a, 'wiggle', 500); api.sfx.boing(); return; }
          counted++;
          a.classList.add('done');
          a.querySelector('.num-tag').textContent = counted;
          flash(a, 'happy', 1500);
          api.sfx.note(260 * Math.pow(2, (counted - 1) * 2 / 12) * 1.5, 0.35);
          tally.appendChild(h(`<span class="tally-dot">${counted}</span>`));
          if (counted === n) {
            await api.pause(WORDS[counted]);
            bigNum.textContent = n;
            bigNum.classList.add('show');
            field.querySelectorAll('.counter-pal').forEach((p) => p.classList.add('happy', 'talk'));
            api.sfx.success();
            await api.sound(kind);
            await api.pause(`${WORDS[n]} ${n === 1 ? ANIMALS[kind].name : ANIMALS[kind].plural}! ${api.praise()}`);
            await api.wait(500);
            rounds++;
            if (rounds % 4 === 0) await api.celebrate('You are a counting star!');
            round();
          }
        });
        field.appendChild(a);
      }
    }
    round();
  },
};
