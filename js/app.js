import { GAMES } from './games/index.js';
import { sfx, unlockAudio, isMuted, setMuted, animalSound, stopAnimalSound } from './audio.js';
import { animal, blox, sun } from './characters.js';
import { h, pick, rnd, sleep } from './util.js';

const app = document.getElementById('app');
const PRAISE = ['Yay! Great job!', 'Hooray! You did it!', 'Wow! Super star!', 'Amazing!', 'Woo hoo! Well done!', 'You are so clever!'];

let current = null; // { game, session }

/* ---------- a game session: everything stops when it ends ---------- */
function makeSession(stage) {
  const s = {
    alive: true,
    stage,
    timers: new Set(),
    cleanups: [],
    sfx,
    // No spoken voice: a short silent beat where a prompt would go, so the
    // game still breathes between steps. The text only sizes the pause.
    pause: (text = '') => s.wait(Math.min(1200, 200 + text.length * 25)),
    // Real animal recording (silently skipped if it can't play).
    sound: async (kind) => { if (s.alive) await animalSound(kind); },
    // Promise that simply never resolves once the player has left the game,
    // so `await api.wait()` chains stop on their own.
    wait: (ms) => new Promise((r) => {
      const t = setTimeout(() => { s.timers.delete(t); if (s.alive) r(); }, ms);
      s.timers.add(t);
    }),
    every: (ms, fn) => { const t = setInterval(() => s.alive && fn(), ms); s.timers.add(t); return t; },
    onExit: (fn) => s.cleanups.push(fn),
    praise: () => pick(PRAISE),
    celebrate: (text) => (s.alive ? celebrate(text || pick(PRAISE)).then(() => s.alive ? undefined : new Promise(() => {})) : new Promise(() => {})),
    confetti: (n) => confetti(n),
    end() {
      s.alive = false;
      s.timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
      s.cleanups.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    },
  };
  return s;
}

/* ---------- celebration overlay ---------- */
function confetti(n = 70) {
  const layer = h('<div class="confetti"></div>');
  document.body.appendChild(layer);
  const colors = ['#FF5A5F', '#FFD43B', '#51CF66', '#3FA7F5', '#B57EDC', '#FF922B', '#FF8FC7'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.left = rnd(0, 100) + 'vw';
    p.style.background = pick(colors);
    p.style.width = p.style.height = rnd(8, 16) + 'px';
    if (Math.random() < 0.4) p.style.borderRadius = '50%';
    p.animate(
      [{ transform: `translate(0,-10vh) rotate(0)` }, { transform: `translate(${rnd(-20, 20)}vw, 110vh) rotate(${rnd(360, 1080)}deg)` }],
      { duration: rnd(1600, 3000), delay: rnd(0, 500), easing: 'cubic-bezier(.3,.4,.6,1)', fill: 'both' },
    );
    layer.appendChild(p);
  }
  setTimeout(() => layer.remove(), 3700);
}

async function celebrate(text) {
  const kinds = ['bear', 'bunny', 'cat', 'dog', 'panda', 'frog', 'squirrel', 'lion', 'monkey', 'chick', 'elephant', 'cow'];
  const ov = h(`<div class="celebrate">
      <div class="cel-star">${starSvg()}</div>
      <div class="cel-friends">${[0, 1, 2].map(() => `<div class="cel-friend happy talk">${animal(pick(kinds))}</div>`).join('')}</div>
    </div>`);
  document.body.appendChild(ov);
  sfx.fanfare();
  confetti(90);
  await sleep(2300);
  ov.classList.add('out');
  await sleep(350);
  ov.remove();
}
function starSvg() {
  return `<svg viewBox="0 0 100 100"><path d="M50 4 L62 36 L96 37 L69 58 L79 92 L50 72 L21 92 L31 58 L4 37 L38 36 Z" fill="#FFD43B" stroke="#4A2E1F" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="41" cy="48" r="4" fill="#4A2E1F"/><circle cx="59" cy="48" r="4" fill="#4A2E1F"/>
    <path d="M42 58 Q50 66 58 58" fill="none" stroke="#4A2E1F" stroke-width="3.5" stroke-linecap="round"/></svg>`;
}

/* ---------- screens ---------- */
function muteBtn() {
  const b = h(`<button class="round-btn mute" aria-label="Sound on or off">${isMuted() ? '🔇' : '🔊'}</button>`);
  b.addEventListener('click', () => {
    setMuted(!isMuted());
    b.textContent = isMuted() ? '🔇' : '🔊';
    if (!isMuted()) sfx.ding();
  });
  return b;
}

function showSplash() {
  app.innerHTML = '';
  const el = h(`<section class="screen splash">
      <div class="splash-sun">${sun()}</div>
      <h1 class="logo"><span>Aisy's</span> Play Land</h1>
      <div class="splash-friends">
        <div class="sf">${animal('bunny')}</div><div class="sf">${animal('bear')}</div>
        <div class="sf">${blox('red')}</div><div class="sf">${animal('cat')}</div><div class="sf">${animal('frog')}</div>
      </div>
      <button class="play-big" aria-label="Play">
        <svg viewBox="0 0 100 100"><path d="M36 24 L78 50 L36 76 Z" fill="#fff" stroke="#fff" stroke-width="10" stroke-linejoin="round"/></svg>
      </button>
    </section>`);
  app.appendChild(el);
  el.addEventListener('pointerup', () => {
    unlockAudio();
    sfx.success();
    showHome();
  }, { once: true });
}

function showHome() {
  endCurrent();
  app.innerHTML = '';
  const el = h(`<section class="screen home">
      <header class="home-top">
        <h1 class="logo small"><span>Aisy's</span> Play Land</h1>
      </header>
      <div class="tiles"></div>
    </section>`);
  const tools = h('<div class="home-tools"></div>');
  const info = h('<button class="round-btn" aria-label="Credits for grown-ups">ⓘ</button>');
  info.addEventListener('click', showCredits);
  tools.append(info, muteBtn());
  el.querySelector('.home-top').appendChild(tools);
  const tiles = el.querySelector('.tiles');
  GAMES.forEach((g, i) => {
    const t = h(`<button class="tile" style="--bg:${g.color};--i:${i}" aria-label="${g.title}">
        <div class="tile-icon">${g.icon()}</div>
        <div class="tile-title">${g.title}</div>
      </button>`);
    t.addEventListener('click', () => {
      sfx.tap();
      t.classList.add('pressed');
      setTimeout(() => openGame(g), 160);
    });
    tiles.appendChild(t);
  });
  app.appendChild(el);
}

// Grown-up page: where the real animal recordings come from (some licences require credit).
function showCredits() {
  const ov = h(`<div class="credits"><div class="credits-card">
      <h2>Animal sound credits</h2>
      <ul>
        <li>Kitten, cow, chick: BigSoundBank.com by Joseph Sardin (CC0)</li>
        <li>Puppy: "Labrador Barking Dog" by Daniel Simion, SoundBible.com (CC BY 3.0)</li>
        <li>Frog: "Frog Croaking" by snottyboy, SoundBible.com (CC BY 3.0)</li>
        <li>Lion, elephant, chimpanzee: Mike Koenig, SoundBible.com (CC BY 3.0)</li>
        <li>Bear: U.S. Fish &amp; Wildlife Service via SoundBible.com (public domain)</li>
        <li>Squirrel: U.S. National Park Service via SoundBible.com (public domain)</li>
        <li>Panda: "Giant panda twittering", Wikimedia Commons (public domain)</li>
        <li>Rabbit: "Rabbit oinks and squeaks" by kessir, Wikimedia Commons (CC0)</li>
      </ul>
      <p>Clips were trimmed and volume-levelled. Licences: CC0 and public domain need no credit; CC BY 3.0 = creativecommons.org/licenses/by/3.0</p>
      <button>OK</button></div></div>`);
  ov.addEventListener('click', (e) => { if (e.target === ov || e.target.tagName === 'BUTTON') ov.remove(); });
  document.body.appendChild(ov);
}

function openGame(game) {
  endCurrent();
  app.innerHTML = '';
  const el = h(`<section class="screen game game-${game.id}" style="--bg:${game.color}">
      <div class="stage"></div>
      <div class="game-top">
        <button class="round-btn home-btn" aria-label="Home">
          <svg viewBox="0 0 100 100"><path d="M50 14 L90 48 H78 V86 H22 V48 H10 Z" fill="#fff" stroke="#4A2E1F" stroke-width="6" stroke-linejoin="round"/>
          <rect x="41" y="60" width="18" height="26" rx="4" fill="#FF922B" stroke="#4A2E1F" stroke-width="5"/></svg>
        </button>
      </div>
    </section>`);
  el.querySelector('.game-top').appendChild(muteBtn());
  el.querySelector('.home-btn').addEventListener('click', () => {
    sfx.tap();
    if (history.state?.game) history.back();
    else showHome();
  });
  app.appendChild(el);
  const session = makeSession(el.querySelector('.stage'));
  current = { game, session };
  if (!history.state?.game) history.pushState({ game: game.id }, '');
  game.start(session.stage, session);
}

function endCurrent() {
  if (current) {
    current.session.end();
    current = null;
    stopAnimalSound();
    document.querySelectorAll('.celebrate, .confetti').forEach((el) => el.remove());
  }
}

// Quiet everything when the app is put in the background.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAnimalSound();
});

window.addEventListener('popstate', () => {
  if (current) showHome();
});

// Toddler-proofing: no long-press menus, no pinch zoom, no double-tap zoom.
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

history.replaceState(null, '');
showSplash();
