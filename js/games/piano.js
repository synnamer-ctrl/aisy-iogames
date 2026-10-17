import { animal } from '../characters.js';
import { NOTE } from '../audio.js';
import { h, flash } from '../util.js';

const KEYS = [
  { n: 'C4', color: '#DE5A72', kind: 'parrot' },
  { n: 'D4', color: '#FF922B', kind: 'monkey' },
  { n: 'E4', color: '#FDC249', kind: 'giraffe' },
  { n: 'F4', color: '#6BC785', kind: 'snake' },
  { n: 'G4', color: '#22B8CF', kind: 'elephant' },
  { n: 'A4', color: '#779CEA', kind: 'hippo' },
  { n: 'B4', color: '#9C68E7', kind: 'penguin' },
  { n: 'C5', color: '#FF8FD7', kind: 'pig' },
];
// Songs as [key index, beats]. Keys: 0=C 1=D 2=E 3=F 4=G 5=A 6=B 7=high C.
const T = 1 / 3;
const SONGS = [
  { id: 'star', icon: '⭐', name: 'Twinkle Twinkle Little Star', notes: [[0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2],
    [4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],[4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],
    [0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2]] },
  { id: 'lamb', icon: '🐑', name: 'Mary Had a Little Lamb', notes: [[2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,2],[1,1],[1,1],[1,2],[2,1],[4,1],[4,2],
    [2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,1],[2,1],[1,1],[1,1],[2,1],[1,1],[0,3]] },
  { id: 'bells', icon: '🔔', name: 'Jingle Bells', notes: [[2,1],[2,1],[2,2],[2,1],[2,1],[2,2],[2,1],[4,1],[0,1.5],[1,0.5],[2,3],
    [3,1],[3,1],[3,1.5],[3,0.5],[3,1],[2,1],[2,1],[2,0.5],[2,0.5],[4,1],[4,1],[3,1],[1,1],[0,3]] },
  { id: 'boat', icon: '🚣', name: 'Row Row Row Your Boat', notes: [[0,1],[0,1],[0,0.75],[1,0.25],[2,1],[2,0.75],[1,0.25],[2,0.75],[3,0.25],[4,2],
    [7,T],[7,T],[7,T],[4,T],[4,T],[4,T],[2,T],[2,T],[2,T],[0,T],[0,T],[0,T],[4,0.75],[3,0.25],[2,0.75],[1,0.25],[0,2]] },
  { id: 'farm', icon: '🐮', name: 'Old MacDonald', notes: [[3,1],[3,1],[3,1],[0,1],[1,1],[1,1],[0,2],[5,1],[5,1],[4,1],[4,1],[3,3],
    [0,1],[3,1],[3,1],[3,1],[0,1],[1,1],[1,1],[0,2],[5,1],[5,1],[4,1],[4,1],[3,3]] },
  { id: 'bridge', icon: '🌉', name: 'London Bridge', notes: [[4,1.5],[5,0.5],[4,1],[3,1],[2,1],[3,1],[4,2],[1,1],[2,1],[3,2],[2,1],[3,1],[4,2],
    [4,1.5],[5,0.5],[4,1],[3,1],[2,1],[3,1],[4,2],[1,2],[4,2],[2,1],[0,3]] },
  { id: 'buns', icon: '🥐', name: 'Hot Cross Buns', notes: [[2,1],[1,1],[0,2],[2,1],[1,1],[0,2],[0,0.5],[0,0.5],[0,0.5],[0,0.5],[1,0.5],[1,0.5],[1,0.5],[1,0.5],[2,1],[1,1],[0,2]] },
  { id: 'joy', icon: '🎶', name: 'Ode to Joy', notes: [[2,1],[2,1],[3,1],[4,1],[4,1],[3,1],[2,1],[1,1],[0,1],[0,1],[1,1],[2,1],[2,1.5],[1,0.5],[1,2],
    [2,1],[2,1],[3,1],[4,1],[4,1],[3,1],[2,1],[1,1],[0,1],[0,1],[1,1],[2,1],[1,1.5],[0,0.5],[0,2]] },
];

export default {
  id: 'piano',
  title: 'Animal Piano',
  color: '#845EF7',
  icon: () => `<div class="icon-piano">${animal('elephant')}<span>♪</span></div>`,
  start(stage, api) {
    const root = h(`<div class="g-piano">
        <div class="songs">${SONGS.map((s) => `<button class="song-btn" data-song="${s.id}" aria-label="${s.name}">${s.icon}</button>`).join('')}</div>
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
      el.dataset.k = i;
      keysEl.appendChild(el);
      return el;
    });

    // Tap a key, or slide a finger (or several) across the keys like a real
    // piano glissando: each key plays as a finger moves onto it.
    const fingers = new Map(); // pointerId -> key index under that finger
    const keyAt = (e) => {
      const k = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.pkey');
      return k && keysEl.contains(k) ? +k.dataset.k : -1;
    };
    keysEl.addEventListener('pointerdown', (e) => {
      const i = keyAt(e);
      if (i < 0) return;
      e.preventDefault();
      keysEl.setPointerCapture(e.pointerId);
      fingers.set(e.pointerId, i);
      stopSong();
      play(i);
    });
    keysEl.addEventListener('pointermove', (e) => {
      if (!fingers.has(e.pointerId)) return;
      const i = keyAt(e);
      if (i >= 0 && i !== fingers.get(e.pointerId)) {
        fingers.set(e.pointerId, i);
        play(i, 0.5);
      }
    });
    const lift = (e) => fingers.delete(e.pointerId);
    keysEl.addEventListener('pointerup', lift);
    keysEl.addEventListener('pointercancel', lift);

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
      const song = SONGS.find((x) => x.id === name);
      const wasThis = playingSong?.name === name;
      stopSong();
      if (wasThis) return;
      const token = { name, stop: false };
      playingSong = token;
      b.classList.add('on');
      const beat = 420;
      for (const [k, beats] of song.notes) {
        if (token.stop) return;
        play(k, Math.min(1.2, beats * 0.45));
        await api.wait(beat * beats);
      }
      if (!token.stop) { b.classList.remove('on'); playingSong = null; api.sfx.success(); api.confetti(30); }
    }));
    api.onExit(stopSong);
  },
};
