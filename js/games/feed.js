import { animal, food, ANIMALS, FOOD_FOR } from '../characters.js';
import { h, pick, sample, shuffle, draggable, inside, flyTo, flash, cap } from '../util.js';

export default {
  id: 'feed',
  title: 'Feed Me',
  color: '#FFA94D',
  icon: () => `<div class="icon-feed">${animal('bunny')}<div class="icon-food">${food('carrot')}</div></div>`,
  start(stage, api) {
    const root = h(`<div class="g-feed">
        <div class="feed-animal"></div>
        <div class="tray"></div>
        <div class="dots"></div>
      </div>`);
    stage.appendChild(root);
    const spot = root.querySelector('.feed-animal');
    const tray = root.querySelector('.tray');
    const dots = root.querySelector('.dots');
    const eaters = Object.keys(FOOD_FOR);
    let fed = 0, last = null, busy = false;

    function round() {
      busy = false;
      let kind;
      do kind = pick(eaters); while (kind === last);
      last = kind;
      const want = FOOD_FOR[kind];
      const others = sample(Object.values(FOOD_FOR).filter((f) => f !== want), 2);
      spot.innerHTML = `<div class="eater open">${animal(kind)}</div><div class="thought">${food(want)}</div>`;
      const eater = spot.querySelector('.eater');
      flash(eater, 'pop-in', 600);
      tray.innerHTML = '';
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < fed % 5 ? 'on' : ''}"></i>`).join('');
      // the thought bubble hint shows after a moment, in case it's tricky
      setTimeout(() => spot.querySelector('.thought')?.classList.add('show'), 4500);

      shuffle([want, ...others]).forEach((f) => {
        const item = h(`<div class="food-item">${food(f)}</div>`);
        tray.appendChild(item);
        draggable(item, {
          onDrop: (x, y) => (inside(x, y, eater, 30) ? choose(item, f) : false),
          onTap: () => choose(item, f),
        });
      });
      api.say(`${cap(ANIMALS[kind].name)} is hungry! What does ${ANIMALS[kind].name} eat?`);

      function choose(item, f) {
        if (busy) return false;
        if (f !== want) {
          api.sfx.wrong();
          flash(eater, 'no', 600);
          api.say(pick(['No thank you!', 'Hmm, not that one!', 'Yucky! Try another one!']));
          return false;
        }
        busy = true;
        item.classList.add('locked');
        flyTo(item, eater.querySelector('svg'), 450, 0.3).then(async () => {
          item.style.opacity = '0';
          eater.classList.remove('open');
          eater.classList.add('chew');
          api.sfx.chomp();
          await api.wait(500);
          eater.classList.remove('chew');
          eater.classList.add('happy', 'talk');
          api.sfx.success();
          fed++;
          dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < (fed % 5 || 5) ? 'on' : ''}"></i>`).join('');
          await api.say(`Yum yum! ${ANIMALS[kind].sound}`);
          await api.wait(400);
          if (fed % 5 === 0) await api.celebrate('All the friends are full! Great job!');
          round();
        });
        return true;
      }
    }
    round();
  },
};
