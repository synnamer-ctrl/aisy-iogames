// Offline-first service worker. Bump VERSION when files change.
const VERSION = 'aisy-v14';
const ANIMALS = ['elephant', 'giraffe', 'hippo', 'monkey', 'panda', 'parrot', 'penguin', 'pig', 'bunny', 'snake'];
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/app.js', 'js/audio.js', 'js/animals.js', 'js/characters.js', 'js/util.js',
  'js/games/index.js', 'js/games/bubbles.js', 'js/games/feed.js', 'js/games/colors.js',
  'js/games/counting.js', 'js/games/shapes.js', 'js/games/peekaboo.js', 'js/games/tower.js',
  'js/games/memory.js', 'js/games/piano.js', 'js/games/paint.js', 'js/games/paint-pages.js', 'js/games/sounds.js', 'js/games/whosays.js',
  ...['elephant', 'monkey', 'panda', 'parrot', 'pig', 'bunny', 'snake'].map((k) => `sounds/${k}.mp3`),
  ...ANIMALS.map((k) => `img/kenney/animals/${k}.png`),
  ...['red', 'blue', 'yellow', 'green', 'purple', 'pink'].flatMap((c) => ['square', 'circle', 'rhombus', 'squircle'].map((b) => `img/kenney/shapes/${c}_${b}.png`)),
  'img/kenney/shapes/red_triangle.png', 'img/kenney/faces/face_a.png',
  ...['bubble.png', 'bush.png', 'star-coin.png', 'cloud1.png', 'moon_half.png', 'symbol_01.png', 'symbol_02.png', 'star_06.png', 'star_07.png',
    'castle.webp', 'talltrees.webp', 'forest.webp', 'sky.webp'].map((f) => `img/kenney/scene/${f}`),
  ...['carrot', 'banana', 'bamboo', 'fish', 'apple', 'corn'].map((k) => `img/food/${k}.webp`),
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => {})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Google Fonts: cache at runtime so the font works offline after first visit.
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; } catch { return Response.error(); }
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match('index.html'))),
  );
});
