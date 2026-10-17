# Aisy's Play Land 🐻🧱🎈

A toddler game box (made for ages 3–4): **12 mini-games in one installable, offline PWA.**
No ads, no reading and no talking voice: just real animal sounds and playful sound effects. The animals are soft 3D-style
cartoon baby animals (smooth shading, glossy eyes, no outlines) that blink, look around, talk and wag,
and they make **real recorded animal sounds** (see `sounds/CREDITS.md`).

| # | Game | What your child practices |
|---|------|---------------------------|
| ★ | **Animal Sounds** – tap any of 12 animals to hear its real sound | animal sounds & names |
| ★ | **Who Says That?** – a real sound plays, tap the animal that made it | listening, matching |
| 1 | **Bubble Pop** – tap rising bubbles to free the animals inside | tapping, animal names |
| 2 | **Feed Me** – drag (or tap) the right food to the hungry animal | matching, fine motor drag |
| 3 | **Colors** – "Find red!" with smiling Blox buddies | color names |
| 4 | **Count 1-2-3** – tap each animal and count out loud | counting 1–7 |
| 5 | **Shapes** – put the shape in its hole on the sorter box | shapes, drag & drop |
| 6 | **Peekaboo** – friends hide behind bushes, find the one asked for | memory, object permanence |
| 7 | **Blox Tower** – tap to drop blocks, build tall, then CRASH! | timing, cause & effect |
| 8 | **Match Pairs** – flip cards to find two the same (2 → 4 pairs) | memory |
| 9 | **Animal Piano** – 8 singing animal keys: tap them or slide a finger across; 8 songs to play along | music, cause & effect |
| 10 | **Paint** – draw free-hand with a finger on 20 colouring pictures; paint never goes outside the lines | colours, creativity, fine motor |

Toddler-friendly by design: huge touch targets, no failure states (wrong answers just get a gentle
wiggle), a celebration with confetti every few successes, no long-press menus or pinch zoom,
and a big orange 🏠 button to go home. 🔊 toggles all sound.

## Tech

- Plain HTML/CSS/JS ES modules, no build step and no dependencies.
- Every character is a hand-drawn SVG (`js/characters.js`) animated with CSS (`css/style.css`).
- Animals are SVG in a 3D-render cartoon style (`js/toon.js` shading kit, `js/toon-animals.js` drawings).
- Real animal recordings live in `sounds/` (CC0 / public domain / CC BY, credited in-app via the ⓘ button).
- Other sound effects (pops, dings, piano notes) are synthesized with WebAudio. There is no text-to-speech.
- `sw.js` caches everything so it works fully offline once opened.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Put it on a phone / tablet

1. Host the folder on any HTTPS static host, e.g. **GitHub Pages**
   (Settings → Pages → Deploy from branch → `main` / root), Netlify or Cloudflare Pages.
2. Open the URL on the device:
   - **iPhone/iPad (Safari):** Share → *Add to Home Screen*
   - **Android (Chrome):** ⋮ → *Install app*
3. Launch it from the home-screen icon. It opens full screen and works offline.

Tip for parents: use iOS **Guided Access** or Android **App pinning** to keep little
fingers inside the app.

When you change files, bump `VERSION` in `sw.js` so installed copies update.
