import { shape, hole, SHAPES, SHAPE_KINDS } from '../characters.js';
import { h, pick, sample, shuffle, draggable, inside, flyTo, flash } from '../util.js';

export default {
  id: 'shapes',
  title: 'Shapes',
  color: '#20C997',
  icon: () => `<div class="icon-shapes">${shape('diamond')}${shape('circle')}</div>`,
  start(stage, api) {
    const root = h(`<div class="g-shapes">
        <div class="sorter"><div class="holes"></div></div>
        <div class="piece-spot"></div>
        <div class="dots"></div>
      </div>`);
    stage.appendChild(root);
    const holes = root.querySelector('.holes');
    const spotEl = root.querySelector('.piece-spot');
    const dots = root.querySelector('.dots');
    let done = 0, last = null, busy = false;

    function round() {
      busy = false;
      let target;
      do target = pick(SHAPE_KINDS); while (target === last);
      last = target;
      const n = Math.min(done < 5 ? 3 : 4, SHAPE_KINDS.length);
      const set = shuffle([target, ...sample(SHAPE_KINDS.filter((s) => s !== target), n - 1)]);
      holes.innerHTML = '';
      dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < done % 5 ? 'on' : ''}"></i>`).join('');
      const holeEls = set.map((k) => {
        const el = h(`<button class="hole-btn" data-k="${k}" aria-label="${k} hole">${hole(k)}</button>`);
        el.addEventListener('pointerdown', () => { if (!busy) drop(k === target ? el : null, el); });
        holes.appendChild(el);
        return el;
      });
      spotEl.innerHTML = '';
      const piece = h(`<div class="piece">${shape(target)}</div>`);
      spotEl.appendChild(piece);
      flash(piece, 'pop-in', 600);
      draggable(piece, {
        onDrop: (x, y) => {
          const over = holeEls.find((el) => inside(x, y, el, 20));
          if (!over) return false;
          return drop(over.dataset.k === target ? over : null, over);
        },
        onTap: () => { flash(piece, 'wiggle', 500); api.sfx.boing(); return false; },
      });

      function drop(good, el) {
        if (busy) return false;
        if (!good) {
          api.sfx.wrong();
          flash(el, 'no', 600);
          return false;
        }
        busy = true;
        piece.classList.add('locked');
        flyTo(piece, good.querySelector('svg'), 400, good.getBoundingClientRect().width / piece.getBoundingClientRect().width * 0.85).then(async () => {
          api.sfx.thud(3);
          good.classList.add('filled');
          good.innerHTML = `${hole(target)}<div class="in-hole happy talk">${shape(target)}</div>`;
          piece.remove();
          done++;
          dots.innerHTML = Array.from({ length: 5 }, (_, i) => `<i class="${i < (done % 5 || 5) ? 'on' : ''}"></i>`).join('');
          api.sfx.success();
          await api.pause(`${SHAPES[target].name[0].toUpperCase() + SHAPES[target].name.slice(1)}! ${api.praise()}`);
          await api.wait(300);
          if (done % 5 === 0) await api.celebrate('Shape master! Hooray!');
          round();
        });
        return true;
      }
    }
    round();
  },
};
