import { animal } from '../characters.js';
import { NOTE } from '../audio.js';
import { h, flash } from '../util.js';

const KEYS = [
  { n: 'C4', color: '#FF5A5F', kind: 'cat' },
  { n: 'D4', color: '#FF922B', kind: 'dog' },
  { n: 'E4', color: '#FFD43B', kind: 'chick' },
  { n: 'F4', color: '#51CF66', kind: 'frog' },
  { n: 'G4', color: '#22B8CF', kind: 'elephant' },
  { n: 'A4', color: '#3FA7F5', kind: 'bunny' },
  { n: 'B4', color: '#B57EDC', kind: 'monkey' },
  { n: 'C5', color: '#FF8FC7', kind: 'pig' },
];
// [key index, beats]
const SONGS = {
  star: [[0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2],
         [4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],[4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],
         [0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2]],
  lamb: [[2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,2],[1,1],[1,1],[1,2],[2,1],[4,1],[4,2],
         [2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,1],[2,1],[1,1],[1,1],[2,1],[1,1],[0,3]],
  bells: [[2,1],[2,1],[2,2],[2,1],[2,1],[2,2],[2,1],[4,1],[0,1.5],[1,0.5],[2,3],
          [3,1],[3,1],[3,1.5],[3,0.5],[3,1],[2,1],[2,1],[2,0.5],[2,0.5],[4,1],[4,1],[3,1],[1,1],[0,3]],
};

export default {
  id: 'piano',
  title: 'Animal Piano',
  color: '#845EF7',
  icon: () => `<div class="icon-piano">${animal('elephant')}<span>♪</span></div>`,
  start(stage, api) {
    const root = h(`<div class="g-piano">
        <div class="songs">
          <button class="song-btn" data-song="star" aria-label="Twinkle twinkle">⭐</button>
          <button class="song-btn" data-song="lamb" aria-label="Mary had a little lamb">🐑</button>
          <button class="song-btn" data-song="bells" aria-label="Jingle bells">🔔</button>
        </div>
        <div class="notes-sky"></div>
        <div class="keys"></div>
      </div>`);
    stage.appendChild(root);
    const keysEl = root.querySelector('.keys');
    const sky = root.querySelector('.notes-sky');
    let playingSong = null;

    const keyEls = KEYS.map((k, i) => {
      const el = h(`<button class="pkey" style="--k:${k.color};--i:${i}" aria-label="${k.n}">
          <div class="pkey-pal">${animal(k.kind)}</div><div class="pkey-face"></div></button>`);
      el.addEventListener('pointerdown', () => { stopSong(); play(i); });
      keysEl.appendChild(el);
      return el;
    });

    function play(i, dur = 0.7) {
      api.sfx.note(NOTE[KEYS[i].n], dur);
      const el = keyEls[i];
      flash(el, 'down', 220);
      flash(el.querySelector('.pkey-pal'), 'sing', 500);
      const note = h(`<span class="float-note" style="--c:${KEYS[i].color}">${Math.random() < 0.5 ? '♪' : '♫'}</span>`);
      const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect();
      note.style.left = r.left - rr.left + r.width / 2 + 'px';
      sky.appendChild(note);
      setTimeout(() => note.remove(), 1600);
    }

    function stopSong() {
      if (playingSong) { playingSong.stop = true; playingSong = null; }
      root.querySelectorAll('.song-btn').forEach((b) => b.classList.remove('on'));
    }

    root.querySelectorAll('.song-btn').forEach((b) => b.addEventListener('pointerdown', async () => {
      const name = b.dataset.song;
      const wasThis = playingSong?.name === name;
      stopSong();
      if (wasThis) return;
      const token = { name, stop: false };
      playingSong = token;
      b.classList.add('on');
      const beat = 420;
      for (const [k, beats] of SONGS[name]) {
        if (token.stop) return;
        play(k, Math.min(1.2, beats * 0.45));
        await api.wait(beat * beats);
      }
      if (!token.stop) { b.classList.remove('on'); playingSong = null; api.sfx.success(); api.confetti(30); }
    }));
    api.onExit(stopSong);
    api.say('Tap the animals to make music!');
  },
};
