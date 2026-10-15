import { animal, ANIMALS, ANIMAL_KINDS } from '../characters.js';
import { h, flash, cap } from '../util.js';

export default {
  id: 'sounds',
  title: 'Animal Sounds',
  color: '#FF8787',
  icon: () => `<div class="icon-sounds">${animal('cow')}<span>🔊</span></div>`,
  start(stage, api) {
    const root = h(`<div class="g-sounds"><div class="snd-grid"></div></div>`);
    stage.appendChild(root);
    const grid = root.querySelector('.snd-grid');
    let token = 0;

    ANIMAL_KINDS.forEach((k, i) => {
      const b = h(`<button class="snd-pal" style="--i:${i}" aria-label="${ANIMALS[k].name}">${animal(k)}</button>`);
      b.addEventListener('pointerdown', async () => {
        const my = ++token;
        grid.querySelectorAll('.snd-pal').forEach((x) => x.classList.remove('talk', 'happy', 'on'));
        b.classList.add('talk', 'happy', 'on');
        flash(b, 'pop-in', 500);
        await api.sound(k);
        if (my !== token) return;
        b.classList.remove('talk');
        await api.say(cap(ANIMALS[k].name) + '!', { rate: 1 });
        if (my === token) b.classList.remove('happy', 'on');
      });
      grid.appendChild(b);
    });
    api.say('Tap an animal to hear what it says!');
  },
};
