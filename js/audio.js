// Sound effects are synthesized with WebAudio (no files to download, works
// offline). Animals use real recordings from sounds/. There is no spoken voice.

let ctx = null;
let master = null;
let muted = false;
try { muted = localStorage.getItem('aisy-muted') === '1'; } catch { /* storage blocked */ }

export function isMuted() { return muted; }
export function setMuted(v) {
  muted = v;
  try { localStorage.setItem('aisy-muted', v ? '1' : '0'); } catch { /* ignore */ }
  if (v) stopAnimalSound();
}

// iOS suspends/interrupts audio when the app goes to the background; wake it on the next touch.
document.addEventListener('pointerdown', () => {
  if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
}, { capture: true });

export function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  preloadAnimalSounds();
}

function tone({ type = 'sine', from, to = from, dur = 0.2, vol = 0.5, at = 0, attack = 0.01 }) {
  if (muted || !ctx) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  if (to !== from) o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise({ dur = 0.15, vol = 0.3, at = 0, freq = 1200, q = 1 }) {
  if (muted || !ctx) return;
  const t = ctx.currentTime + at;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(master);
  src.start(t);
}

export const NOTE = { C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25 };

export const sfx = {
  pop() { tone({ type: 'sine', from: 900, to: 250, dur: 0.12, vol: 0.6 }); noise({ dur: 0.06, vol: 0.25, freq: 3000 }); },
  tap() { tone({ type: 'triangle', from: 660, to: 880, dur: 0.08, vol: 0.35 }); },
  ding() { tone({ type: 'sine', from: 1046, dur: 0.5, vol: 0.4 }); tone({ type: 'sine', from: 1568, dur: 0.6, vol: 0.2, at: 0.05 }); },
  boing() { tone({ type: 'triangle', from: 180, to: 520, dur: 0.25, vol: 0.5 }); tone({ type: 'sine', from: 520, to: 260, dur: 0.2, vol: 0.3, at: 0.2 }); },
  wrong() { tone({ type: 'triangle', from: 330, to: 220, dur: 0.18, vol: 0.35 }); tone({ type: 'triangle', from: 260, to: 180, dur: 0.22, vol: 0.3, at: 0.16 }); },
  chomp() { for (let i = 0; i < 3; i++) noise({ dur: 0.08, vol: 0.5, freq: 600, q: 0.8, at: i * 0.16 }); },
  whoosh() { noise({ dur: 0.35, vol: 0.35, freq: 900, q: 0.5 }); },
  thud(step = 0) { tone({ type: 'sine', from: 160 + step * 25, to: 70, dur: 0.18, vol: 0.7 }); tone({ type: 'triangle', from: 400 + step * 60, dur: 0.12, vol: 0.2, at: 0.02 }); },
  flip() { tone({ type: 'triangle', from: 500, to: 900, dur: 0.1, vol: 0.25 }); },
  splash() { noise({ dur: 0.25, vol: 0.35, freq: 1800, q: 0.7 }); tone({ type: 'sine', from: 700, to: 1200, dur: 0.15, vol: 0.2 }); },
  crash() { for (let i = 0; i < 6; i++) { noise({ dur: 0.15, vol: 0.4, freq: 300 + i * 120, at: i * 0.07 }); tone({ type: 'sine', from: 200 - i * 15, to: 60, dur: 0.2, vol: 0.4, at: i * 0.07 }); } },
  success() { [523, 659, 784, 1046].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.3, vol: 0.35, at: i * 0.11 })); },
  fanfare() {
    [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone({ type: 'square', from: f, dur: 0.22, vol: 0.12, at: i * 0.13 }));
    [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone({ type: 'triangle', from: f, dur: 0.3, vol: 0.3, at: i * 0.13 }));
  },
  note(freq, dur = 0.6) {
    tone({ type: 'triangle', from: freq, dur, vol: 0.45 });
    tone({ type: 'sine', from: freq * 2, dur: dur * 0.7, vol: 0.12 });
    tone({ type: 'sine', from: freq * 3, dur: dur * 0.4, vol: 0.05 });
  },
};

/* ---------- real animal recordings (sounds/*.mp3) ---------- */
export const SOUND_KINDS = ['cat', 'dog', 'bunny', 'bear', 'frog', 'squirrel', 'chick', 'lion', 'cow', 'monkey', 'elephant', 'panda'];
const buffers = {};
let loading = null;
let playing = null;

export function preloadAnimalSounds() {
  if (loading || !ctx) return loading;
  loading = Promise.all(SOUND_KINDS.map(async (k) => {
    try {
      const res = await fetch(`sounds/${k}.mp3`);
      if (!res.ok) return;
      const data = await res.arrayBuffer();
      buffers[k] = await new Promise((ok, bad) => ctx.decodeAudioData(data, ok, bad));
    } catch { /* missing or undecodable: that animal stays quiet */ }
  }));
  return loading;
}

export function stopAnimalSound() {
  try { playing?.stop(); } catch { /* already stopped */ }
  playing = null;
}

// Plays the real recording; resolves true when it finishes, false if unavailable.
export async function animalSound(kind) {
  if (muted || !ctx) return false;
  if (!buffers[kind] && loading) await loading;
  const buf = buffers[kind];
  if (!buf) return false;
  try { playing?.stop(); } catch { /* already stopped */ }
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  src.buffer = buf;
  g.gain.value = 1.4;
  src.connect(g).connect(master);
  playing = src;
  src.start();
  return new Promise((r) => { src.onended = () => r(true); setTimeout(() => r(true), buf.duration * 1000 + 300); });
}
