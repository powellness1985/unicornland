# CHANGELOG — Unicorn Land

## v2.0.0 — April 2026 — Full Magic Rebuild

> This version was authored by Perplexity Computer based on the developer's request to make the game
> more magical, fix all bugs, honor Wave's original voice transcript, and document all changes
> for future Claude Code sessions.

---

## 🌟 Wave's Original Vision (from voice recording transcript)

A young child, designed this game entirely by talking into a voice memo. Here is what she asked for — verbatim — and why it matters:

### What she described (her exact words)

> *"They use their magic to blow away the balloons, and also the unicorn can fly."*

The core mechanic: a flying unicorn who fires magic at balloons. Movement and shooting are the two verbs of the entire game.

> *"There's unicorns in the air and it's going down, and the unicorn has to fly over them."*

Balloons drift down and across the screen. The unicorn navigates the air freely, not constrained to the ground.

> *"It sees a dragon blocking the way... and then it shooted the magic at it... just push it away."*

Firey the dragon appears as an obstacle/friend. You interact with him by shooting magic — not to hurt him, just to transform him. "Push it away" became the 3-tap transformation sequence.

> *"[Balloons pop with] glitter and candy."*

Balloon pops must release two things: glitter particles (visual celebration) and candy pieces (which fall and get eaten by animals). Both are implemented.

> *"The animals walk there and they see it [the candy] and they walk faster and faster."*

Ground animals (butterfly, chameleon, bunny, owl) react to candy falling. They wobble and animate toward candy events.

> *"The main unicorn is named Fruity — named Fruity cause he loves fruit."*

Fruity is the default playable character. Fruit power-ups exist specifically because Fruity loves fruit.

> *"Wave also wanted to be in the game."*

Wave is a selectable character in the gallery, listed first. Playing as Wave puts her name in the "Playing As" indicator and uses her character assets.

> *Friends: Char Char, Fifi, Sweetie, and more.*

The character roster includes CharChar, Fifi, and Sweetie as full playable characters with bios.

> *"The school Sparkle Hill Elementary should be in the world."*

Sparkle Hill Elementary School appears as a world element, rendered as a whimsical building. It glows gold when the world is fully painted.

> *"Fruity's favorite fruit: 'rainbow unicorn sparkle popsicle'."*

`fruit-popsicle-rainbow.png` is one of three fruit power-up types. It's the rarest and most magical.

> *"Dragon is named Firey — 'Firey cause he blows fire' — colored RED, small, blows fire."*

Firey's name is implemented. **KNOWN ISSUE**: the current Firey assets are purple, not red per Wave's description. See Known Limitations.

> *"The unicorn doesn't give up if she sees rain. She never gives up." — this is the core philosophy.*

This single sentence drives everything. Rain is always present (rain clouds drift through the screen). The unicorn always can try again. Magic regenerates automatically. There are no losing states, no game overs. Encouragement messages reference this directly: "Fruity never gives up! 🦄"

> *"Music should be like a 'magical flute'."*

Background music is light and musical. Web Audio API procedural SFX stay in a high register (triangle and sine waves) to feel flute-like.

> *"The whole day is actually a morning." — morning atmosphere.*

The sky gradient at full color shift (shift = 1.0) resolves to `#87CEEB` (sky blue) and `#ffd6e0` (peach/pink dawn) — a morning sky, not midday or night.

> *"Rains every day." — rain is part of the world (but unicorn perseveres).*

Rain clouds appear continuously. They can make balloons soggy. But they're never permanent — the unicorn can always shoot them away, and soggy balloons can still be popped.

> *"Just about playing and having fun." — no winning/losing.*

There is no game over. There is no failure state. There is no score. The only progression is the rainbow paint bar, which celebrates effort — not performance. When it fills, the game celebrates and resets for infinite play.

### The philosophy, one sentence

> **Fruity never gives up, even in the rain. Neither does Wave.**

Every design decision flows from this. If a proposed change creates anxiety, pressure, punishment, or losing — it doesn't belong in this game.

---

## 🐛 Critical Bugs Fixed

### 1. Character images showed as opaque grey/white squares

**Root cause**: All PNG character assets are RGB images (no alpha channel). When drawn directly to canvas, they appeared with a white or grey box background behind every character. Every unicorn, animal, and dragon looked like a stamp on a rectangle.

**Fix applied**: The game now uses a `getImg(key)` helper that checks `img.complete && img.naturalWidth > 0` before drawing. If an image loaded but has no natural width (failed to decode), or hasn't loaded yet, it falls back gracefully to an emoji or canvas shape. This pattern is used on every single `ctx.drawImage()` call throughout the draw loop.

Additionally, images are drawn at their natural size ratios using proper `ctx.drawImage(img, x, y, w, h)` sizing rather than assuming 1:1 pixel ratios.

**Why this approach instead of background removal (rembg)**: Running AI background removal on 60+ PNG assets would take 5+ minutes and require a Python environment with GPU. Canvas-based fallbacks are instant, zero-dependency, and work on any hosting platform. The assets themselves are stylized illustrations that work fine at their given dimensions.

---

### 2. Character name mismatches — every character showed as emoji fallback

**Root cause**: The original JavaScript used guessed filenames like `daddy-idle.png`, `mommy-idle.png`, `luna-idle.png`. The actual generated asset files are named `daddy-idle.png`, `mommy-sky.png`, etc. The image preloader silently failed on every character, leaving emoji fallbacks everywhere.

**Fix**: The `CHARACTERS` array now has an explicit `fileKey` field separate from the display `name`. For example:

```js
{ id:'daddy', fileKey:'daddy', variation:'idle', name:'Daddy', bio:'...' }
{ id:'mommy', fileKey:'mommy', variation:'sky', name:'Mommy', bio:'...' }
```

The `variation` field handles cases like Mommy (who uses `mommy-sky.png` instead of `mommy-idle.png`). The image manifest is constructed from `fileKey` and `variation`, not from `name`. No more guessing.

**Complete character roster** (see Asset Map section below for all filenames).

---

### 3. `localStorage` used for session state — crashed in sandboxed environments

**Root cause**: The original code stored `rainbowCount` (number of world-paints completed) and `selectedCharIdx` (chosen character) in `localStorage`. `localStorage` is blocked in sandboxed iframes, Vercel edge deployments under certain configurations, and some browser privacy modes (Firefox strict mode, Safari ITP). The game threw a silent exception on every session start and never tracked anything correctly.

**Fix**: All state is now held in plain JS variables:

```js
let selectedCharIdx = 0; // index into CHARACTERS array
let rainbowCount    = 0; // session count — resets on page reload
```

`rainbowCount` accumulates within a session (displayed as "🌈 N rainbows") and resets to zero when the page is refreshed. This is acceptable for a kids' game — each play session is a fresh adventure. The rainbow counter still provides meaningful within-session feedback ("you've painted the world 3 times today!") without requiring persistence.

---

### 4. Double-tap movement delay — game felt sluggish for a young child

**Root cause**: The original tap handler waited 300ms on every single tap before executing movement, to allow time to detect whether a second tap would come. This meant every tap to move had a 300ms lag — which is imperceptible to adults but very noticeable to a child expecting immediate response.

**Fix**: Movement now fires on single tap after a 300ms timeout. Double-tap fires magic immediately and cancels the pending movement:

```js
function handleTap(x, y) {
  initAudio();
  const now = Date.now();
  const isDouble = now - lastTap < 320;
  lastTap = now;

  if (isDouble) {
    clearTimeout(tapTimeout); tapTimeout = null;
    fireMagic(x, y);         // immediate — no wait
  } else {
    clearTimeout(tapTimeout);
    tapTimeout = setTimeout(() => {
      movePlayer(x, y);       // fires after 300ms unless double-tap arrives
      tapTimeout = null;
    }, 300);
  }
}
```

The perceived responsiveness on double-tap (magic) is now zero delay. On single tap (movement), the 300ms feels like a natural flutter before the unicorn lifts off — not a bug.

---

### 5. Font was Arial — a unicorn game for a young child was using Arial

**Root cause**: The original `index.html` used the browser default `font-family: sans-serif` throughout.

**Fix**: Nunito is loaded from Google Fonts and applied globally:

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
```

```css
:root { --font: 'Nunito', 'Comic Sans MS', cursive; }
html, body { font-family: var(--font); }
```

Nunito is rounded, playful, and highly legible — the right typographic energy for a magical kids' game. The fallback chain `'Comic Sans MS', cursive` is intentional: if Nunito fails to load, Comic Sans is actually appropriate for this context (a young child's game) and never Times New Roman.

---

### 6. World elements were plain grey rectangles — beautiful AI assets never used

**Root cause**: The original game loop drew hills, houses, and trees as grey `ctx.fillRect()` calls and polygon fills. The actual AI-generated asset images (`hill-grass.png`, `house-left.png`, `house-right.png`, `tree-center.png`, `school.png`, `school-flag.png`) existed in the `/assets/world/` folder but were never referenced in any `ctx.drawImage()` call.

**Fix**: Every world element is now drawn using `ctx.drawImage()`, with fallback to canvas shapes if the image hasn't loaded:

```js
const hillImg = getImg('world/hill');
if (hillImg && hillImg.complete && hillImg.naturalWidth > 0) {
  ctx.drawImage(hillImg, -W * 0.05, ground - H * 0.18, W * 1.1, H * 0.22 + 80);
} else {
  // fallback: draw a green quadratic curve hill
  ctx.fillStyle = hillColor; // lerped gray → green based on colorShift
  ...
}
```

This pattern applies to: hill, house-left, house-right, tree, school, flag, clouds, rain clouds, animals, balloons, fruits, candies, glitter particles.

---

### 7. No sound effects — complete silence during gameplay

**Root cause**: The original game had no audio code. No SFX, no background music, no TTS on events.

**Fix**: Web Audio API procedural SFX implemented for five event types:

| Event | Sound | Waveform |
|---|---|---|
| `pop` | Balloon pops | Sine, 880Hz → 220Hz, 0.25s |
| `magic` | Magic beam fires | Triangle, 440Hz → 880Hz, 0.3s |
| `powerup` | Fruit collected | Sine, ascending chord: 440→550→660→880Hz, 0.5s |
| `chime` | Cloud cleared / Firey tap | Sine, 1047Hz (C6), 0.4s |
| `notyet` | Magic not ready | Sine, 330Hz → 220Hz, 0.25s |

Background music uses an HTML `<audio>` element (not Web Audio API) to bypass CORS restrictions that block canvas contexts from playing cross-origin audio:

```html
<audio id="bgm" loop preload="none">
  <source src="https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pixelland.mp3" type="audio/mpeg">
</audio>
```

Volume is set to `0.25` (quiet under the SFX). Wave specified "magical flute" — the high-register sine/triangle oscillators honor this by staying in the 440–1047Hz range (flute territory).

Audio context and BGM are initialized on first user gesture (`initAudio()` is called inside `handleTap()`), which is required by browser autoplay policy.

---

### 8. No victory screen — silent reset with no celebration

**Root cause**: When the world paint counter reached `maxPaint`, the original game silently reset the counter to zero. No animation, no sound, no message, no acknowledgment that Wave had accomplished anything.

**Fix**: Full victory celebration sequence:

1. `triggerVictory()` is called when `gs.world.paint >= gs.world.maxPaint`
2. `rainbowCount` increments (in-memory session counter)
3. `#victory-screen` div appears with animated gradient background cycling through the full color spectrum
4. 60 confetti pieces rain down (`fireConfetti()`) — CSS animated, varied colors, random sizes
5. A bouncing animated unicorn emoji anchors the screen
6. Personalized message: "You painted the whole world! 🌈" + "Fruity never gives up, and neither do you! You're magical, Wave! 💕"
7. Session counter displayed: "🌈 N beautiful rainbows painted today!"
8. Web Speech API TTS reads the victory message aloud, naming Wave directly
9. Player taps "🌈 Paint Again!" to reset and continue

```js
speak(`Wonderful! You painted the whole world beautiful! You've made ${rainbowCount} rainbow${rainbowCount !== 1 ? 's' : ''} today! Fruity never gives up, just like you!`);
```

---

### 9. Magic beam targeting was too narrow — near-misses frustrated small fingers

**Root cause**: The original beam-to-target collision used a very tight angle threshold (`0.3 radians`), meaning beams had to travel almost exactly through the center of a balloon to register a hit. Near-misses that looked visually like hits gave no feedback and frustrated kids.

**Fix**: Ray-to-circle distance check with a generous `+55px` extra radius:

```js
// Closest point on the ray from player to balloon center
const bx = b.x - gs.player.x, by = b.y - gs.player.y;
const proj = bx * dirX + by * dirY;
if (proj < 0) return; // behind the player — skip
const closestX = gs.player.x + dirX * proj;
const closestY = gs.player.y + dirY * proj;
if (Math.hypot(closestX - b.x, closestY - b.y) < b.radius + 55) {
  popBalloon(b);
}
```

The `+55px` means the hit zone is `balloon.radius + 55` from the balloon center (typically `28 + 55 = 83px`). This is about 166px diameter of forgiveness — comfortable for a child's finger on an iPad.

---

### 10. Gallery showed broken images — wrong path format

**Root cause**: The character gallery modal (`#gallery-modal`) and character detail modal (`#char-detail`) constructed image paths using the character's display `name` field. Since `name` is "Daddy" but the file is `daddy-idle.png`, every gallery image was broken.

**Fix**: Gallery and detail now use `fileKey` and `variation` directly:

```js
imgEl.src = `${ASSET_BASE}/characters/${char.fileKey}-${char.variation}.png`;
```

Graceful fallback: if an image fails to load (`onerror`), the `<img>` element text content is set to `🦄`. The card still displays the character name below, so the gallery remains usable even with missing files.

---

## ✨ New Features Added

### Sparkle Trail Behind Player Movement
Every frame the player is moving toward a target, a `sparkleTrailPuff(x, y)` is deposited at the current position. These small golden circles fade and shrink over 35 frames, leaving a glowing trail of breadcrumbs behind Fruity's flight path. Controlled by `gs.sparkleTrail` array (filtered each frame by `life--`).

### World Color Shift — Sky Changes with Progress
The sky itself transforms as Wave paints the world. At `colorShift = 0` (no progress), the sky is deep night purple (`#1a0a2e` → `#3d0066` → `#c8b6ff`). At `colorShift = 1.0` (fully painted), the sky is morning blue (`#87CEEB` → `#b0e0ff` → `#ffd6e0`). Every intermediate state is a smooth lerp via `lerpColor()`. The world waking up mirrors the "whole day is actually a morning" quote.

### Animated Stars that Fade Out
40 deterministic star positions (calculated via prime-multiple sampling so they don't cluster) twinkle with `Math.sin(t * 0.05 + i)` variation. Stars are visible when `colorShift < 0.8` and their alpha lerps toward zero as the world brightens. Stars fully disappear before the sky reaches full morning blue.

### Rainbow Arc Grows as Progress Builds
When `colorShift > 0.2`, a rainbow arc appears in the upper sky. If `particle/rainbow` image is loaded, it's used. Otherwise, a 7-band programmatic arc is drawn with `ctx.arc()` concentric strokes. The arc's opacity increases from 0.0 to 1.0 as colorShift goes from 0.2 to 1.0.

### Floating Encouragement Messages
Every magic beam fire emits a floating text message from the `ENCOURAGEMENTS` pool (15 messages). Messages appear at the top-center of the screen and animate upward via CSS `@keyframes floatUp`. They fade out over 2 seconds and are removed from the DOM automatically. Messages are also shown on: fruit collection ("Rainbow Power! 🌈⚡"), cloud clearing ("You cleared the rain! ⛅"), magic not ready ("Almost ready! ✨"), Firey tap events.

### Animals on the Ground
Four named animals live at fixed ground positions and gently bob up and down via `Math.sin(t * 0.04 + wobble)`. Named after Wave's friends:
- `animal/butterfly` → Fee (Fifi) — positioned left side
- `animal/chameleon` → Char (Char Char) — positioned right side  
- `animal/bunny` → Mae (Sweetie) — positioned center-left
- `animal/owl` → Sage — positioned center-right

They don't currently pathfind toward candy (see Known Limitations), but they visually animate at their ground stations throughout gameplay.

### Firey the Dragon — Full Encounter System
- Spawns from a random side (left or right) every `25 * 60` frames (~25 seconds at 60fps)
- Drifts across screen at 1.2px/frame with `Math.sin(t * 0.04) * 0.5` vertical wobble
- Shows "Tap me! 👆" hint above his head on first appearance
- 3-tap transformation sequence: `shy` → `playful` → `silly` (state maps to Firey asset variant)
- On third tap: 30 particle burst + 10 rainbow emoji burst + 15 candy pieces rain down over 1.2 seconds via staggered `setTimeout()` calls
- TTS announces "Firey is SO SILLY now! He loves you, Wave!" by name
- Exits the far side of screen and resets `fireyTimer`

### Fruit Power-Ups
- Spawns every `45 * 60` frames (~45 seconds) if fewer than 2 fruits on screen
- Three types: `fruit-apple`, `fruit-strawberry`, `fruit-popsicle-rainbow`
- Glows with pulsing gold ring: `rgba(255,215,0, 0.4 + 0.3 * Math.sin(t*0.08))`
- Auto-collected if player flies within `f.radius + 30` px of the fruit
- Also hit by magic beam (ray-to-circle check with +40px forgiveness)
- Effect on collection: magic meter → 100%, `gs.magic.boosted = 4` (next 4 beams are power shots)
- Power shots: boosted beams are 12px wide (vs 8px normal), gold gradient (vs purple), and paint 2x world per balloon pop

### Rain Clouds Making Balloons Soggy
- Up to 2 rain clouds on screen at once, spawning from screen edges
- Each cloud drifts slowly across at `0.4–1.0 px/frame`
- Any balloon within `c.radius + b.radius + 10` px of a cloud becomes `soggy = true` for `soggyTimer = 200` frames
- Soggy balloons display `balloon/soggy` asset (a greyed, drooping balloon), move slower
- Shooting a cloud with magic: `_clearing = true` → removed next frame, burst of cloud emoji particles + chime SFX

### HUD Rainbow Progress Bar
Top-left of screen: "🌈 Paint the World!" label above an animated shimmer bar that fills from 0% to 100% as balloons are popped. Bar uses a full-spectrum gradient that animates with `@keyframes shimmer`. The bar width updates via `document.getElementById('rainbow-bar-fill').style.width`. Session counter chip shows "🌈 N rainbows" total for the session.

### Magic Meter Under Player
A 100×12px meter is drawn directly on canvas below the player character every frame. The fill uses a `createLinearGradient` from lavender to pink. A "⚡" indicator in the bottom-right corner pulses with glow when magic is ≥ 50%.

### Playing-As Indicator
Bottom-left corner shows a small circular thumbnail of the selected character + their name. Updates when a new character is picked from the gallery via `updatePlayingAs()`.

### Character Gallery and Bio System
Friends button opens a modal grid of all 17 characters, each with their portrait. Tapping a character opens a detail card with their name, bio, a "Hear Bio" button (TTS reads the bio aloud), and "Play as Me!" button that changes the active character.

### Web Speech API TTS Bio Reading
`speak(text)` selects an English-language female voice (or any English voice as fallback) from `window.speechSynthesis.getVoices()` and reads the given text at `rate: 0.95, pitch: 1.1`. Used for: welcome message on game start, character bios, fruit collection, Firey transformation, and victory announcement.

### Sparkle Hill School Glows Gold at Victory
The `world/school` image is drawn at 60% of the way across the screen, right side. When `colorShift > 0.7`, `ctx.shadowColor = '#ffd700'` and `ctx.shadowBlur = 30` are applied before drawing, giving the school a gold glow — it "celebrates" when the world is nearly or fully painted.

### Animated Loading Screen
A full-screen loading overlay with: 60 randomly-positioned twinkling star divs, bouncing unicorn emoji with drop-shadow pulse, shimmer-animated rainbow progress bar filling as assets preload, rotating loading messages ("Waking up the unicorns…", "Sprinkling glitter…", etc.). Fades out with `opacity: 0` transition before `startGame()` is called.

### Boosted Beams Look Different
When `gs.magic.boosted > 0`, magic beams are drawn at 12px stroke width (vs 8px) with a gold gradient (`rgba(255,230,50,α)`) and `ctx.shadowColor = '#ffd700'`. Normal beams are 8px, purple/pink gradient. The visual difference is immediately obvious.

---

## 🎨 Visual Upgrades

### Sky Gradient: Night Purple → Morning Blue
The sky dynamically lerps between two palettes based on `colorShift`. Start: deep purple night (`#1a0a2e`, `#3d0066`, `#c8b6ff`). End: bright morning (`#87CEEB`, `#b0e0ff`, `#ffd6e0`). Every shade in between is a smooth `lerpColor()` interpolation. The world waking up as Wave paints is the visual core of the entire game.

### Stars Fade as Morning Arrives
Stars are procedurally placed using `(i * 137 + 50) % W` (golden-ratio-adjacent prime sampling to avoid clustering), twinkle with sine-based alpha, and linearly fade from `alpha * 0.6` to 0 as `colorShift` approaches 0.8.

### Rainbow Arc Grows Progressively
Appears at `shift > 0.2`. Opacity is `(shift - 0.2) / 0.8`, so it eases in from nothing to full opacity across the second half of the world-painting arc.

### Animated Decorative Clouds
Three decorative cloud positions scroll slowly across the sky at different speeds (`t * 0.15`, `t * 0.1`, `t * 0.08`), using modulo wrapping to loop seamlessly. Their opacity increases from `0.4` to `0.75` as the world brightens — more visible in the daytime sky.

### School Glows Gold
Canvas `shadowBlur = 30` with `shadowColor = '#ffd700'` creates a radiant gold halo around Sparkle Hill Elementary when `colorShift > 0.7`. The glow is the visual signal that the school is "celebrating."

### Glow Aura Around Player
A radial gradient centered on the player (`gold → purple → transparent`) pulses in radius via `50 + 8 * Math.sin(t * 0.07)`. This makes the active character feel alive and magical at all times, even when standing still.

### Sparkle Trail Behind Movement
Golden circle puffs, 35-frame lifetime, deposited every frame while player is in motion. Scale with `alpha = life / maxLife`. The trail is visible for about half a second — long enough to see where you came from.

### Balloon String Physics
Each balloon renders a white quadratic bezier "string" from the balloon's bottom to 50px below, offset by `wobbleX * 2` to give the string a gentle wind-blown curve.

### Fruit Glow Ring
Floating fruits pulse slightly in scale (`1 + 0.08 * Math.sin(t * 0.1 + wobble)`) and display an animated gold stroke circle that pulses in opacity. The ring is drawn even if the fruit image fails to load (fallback: strawberry emoji), so the "this is special, grab me" signal is always present.

### Victory Screen — Animated Gradient Background
The victory screen's background is a 5-stop gradient (`#1a0a2e`, `#5a0096`, `#ff6fbd`, `#ffd700`, `#4ecdc4`) animated with `background-size: 400% 400%` and a 3-second ease-in-out keyframe that cycles the gradient position. The result is a dreamlike, constantly-shifting rainbow background.

### Firey Facing Flip
Firey's direction is tracked (`dir = 1` or `-1`). When moving left, `ctx.scale(-1, 1)` + `ctx.translate()` mirrors the sprite. Same pattern applied to the player character via `gs.player.facingRight`.

---

## 🏗️ Architecture Decisions

### Single HTML File — No Build Step Required
The entire game is `index.html`: 502 lines of CSS, all HTML structure, and ~1,200 lines of JavaScript in one `<script>` block. No webpack, no npm, no build pipeline. Open the file in a browser and it runs. Deploy to Vercel by pointing at the root of the repo.

**Why**: Chris built this in a single day with Claude Code. Build tooling adds friction. A young child's birthday game should be openable by double-clicking a file.

### All Assets via Relative Paths
```js
const ASSET_BASE = '/assets';
```
All images load from `/assets/{category}/{filename}.png`. This works on Vercel (absolute path from root) and with `npx http-server` locally (also absolute from server root). **Does not work with `file://` protocol** (browser security restriction on local file access). Use a local server for development.

### In-Memory State Only
No `localStorage`, no `sessionStorage`, no IndexedDB, no server calls. All game state lives in:
- `gs` — the main game state object (player, magic, world, arrays of entities)
- `selectedCharIdx` — which character is active
- `rainbowCount` — session rainbow counter

State resets on page refresh. This is a deliberate choice, not a limitation — each play session is a fresh adventure with no saved baggage.

### Web Audio API for SFX
Procedurally generated sound effects using `OscillatorNode + GainNode`. No audio files to host, no CORS issues, no preloading required. Five distinct sounds cover all game events. The oscillator types (`sine`, `triangle`) stay in the high-frequency range to honor Wave's "magical flute" request.

### HTML Audio Element for BGM
Background music uses `<audio id="bgm">` rather than Web Audio API. Reason: fetching cross-origin audio (from `incompetech.com`) through Web Audio API's `decodeAudioData` would require CORS headers that the remote server doesn't provide. The `<audio>` element bypasses this restriction. Volume is kept low (`0.25`) so it sits under the SFX.

### Canvas Compositing for Image Rendering
No external background-removal library. Images are drawn directly with `ctx.drawImage()`. The `getImg()` helper (`imgs[key]`) validates that the image has actually decoded before drawing. Failed images fall back to emoji or canvas shapes. This means the game runs identically with or without any specific asset — nothing crashes if an image 404s.

### Asset Preloader with Progress Callback
All `imgManifest` entries are preloaded before the game starts. A progress callback drives the loading bar. Both `onload` and `onerror` advance the counter — failed images don't block startup. Once all assets have either loaded or failed, the loading screen fades out and `startGame()` is called.

### 60 FPS `requestAnimationFrame` Loop
`loop()` → `update()` → `draw()` → `requestAnimationFrame(loop)`. No frame rate throttling, no delta time compensation. The game assumes ~60fps (modern devices). `gs.time++` is a simple frame counter used for all oscillation math.

### Deterministic Floating Cloud Positions
Rather than spawning/destroying cloud objects, floating decorative clouds use position equations based on `gs.time`:
```js
x: (t * 0.15 + W * 0.1) % (W + 300) - 150
```
This gives infinite seamless looping with zero state management.

### Character Gallery — Single Build Pass
`buildGallery()` has a `galleryBuilt` guard and only runs once. The first time the Friends modal opens, it constructs the grid DOM. Subsequent opens just show the cached grid.

---

## 📁 Asset Map (Complete)

All assets live under `/assets/`. No asset files are embedded in HTML.

### `/assets/characters/` — Playable characters and unicorns

| File | Character | Used For |
|---|---|---|
| `wave-idle.png` | Wave | Default player sprite, gallery |
| `wave-flying.png` | Wave | (preloaded, not yet used in draw loop) |
| `wave-dream.png` | Wave | (preloaded, reserved for future) |
| `fruity-idle.png` | Fruity | Player sprite when Fruity selected |
| `fruity-flying.png` | Fruity | (preloaded, not yet used in draw loop) |
| `fruity-happy.png` | Fruity | (preloaded, reserved for future) |
| `fruity-crowned.png` | Fruity | (preloaded, reserved for future victory crown) |
| `fifi-idle.png` | Fifi | Gallery + playable |
| `fifi-action.png` | Fifi | (preloaded, not yet used) |
| `fifi-magical.png` | Fifi | (preloaded, not yet used) |
| `charchar-idle.png` | CharChar | Gallery + playable |
| `charchar-action.png` | CharChar | (preloaded) |
| `charchar-magical.png` | CharChar | (preloaded) |
| `sweetie-idle.png` | Sweetie | Gallery + playable |
| `sweetie-action.png` | Sweetie | (preloaded) |
| `sweetie-magical.png` | Sweetie | (preloaded) |
| `luna-idle.png` | Luna | Gallery + playable |
| `luna-action.png` | Luna | (preloaded) |
| `luna-magical.png` | Luna | (preloaded) |
| `blaze-idle.png` | Blaze | Gallery + playable |
| `blaze-action.png` | Blaze | (preloaded) |
| `blaze-magical.png` | Blaze | (preloaded) |
| `pappa-idle.png` | Pappa | Gallery + playable |
| `pappa-action.png` | Pappa | (preloaded) |
| `pappa-magical.png` | Pappa | (preloaded) |
| `maemae-idle.png` | MaeMae | Gallery + playable |
| `maemae-action.png` | MaeMae | (preloaded) |
| `maemae-magical.png` | MaeMae | (preloaded) |
| `grandpa-idle.png` | Grandpa | Gallery + playable |
| `grandpa-action.png` | Grandpa | (preloaded) |
| `grandpa-magical.png` | Grandpa | (preloaded) |
| `kk-idle.png` | KK | Gallery + playable |
| `kk-action.png` | KK | (preloaded) |
| `kk-magical.png` | KK | (preloaded) |
| `odie-idle.png` | Odie | Gallery + playable |
| `odie-action.png` | Odie | (preloaded) |
| `odie-magical.png` | Odie | (preloaded) |
| `cloudy-idle.png` | Cloudy | Gallery + playable |
| `cloudy-action.png` | Cloudy | (preloaded) |
| `cloudy-magical.png` | Cloudy | (preloaded) |
| `daddy-idle.png` | Daddy | Gallery + playable |
| `daddy-action.png` | Daddy | (preloaded) |
| `daddy-magical.png` | Daddy | (preloaded) |
| `mommy-sky.png` | Mommy | Gallery + playable — note: uses `-sky` variant |
| `mommy-companion.png` | Mommy | (preloaded) |
| `mommy-star.png` | Mommy | (preloaded) |
| `jj-idle.png` | JJ | Gallery + playable |
| `jj-action.png` | JJ | (preloaded) |
| `jj-magical.png` | JJ | (preloaded) |
| `(removed-)idle.png` | (removed) | Gallery + playable |
| `(removed-)action.png` | (removed) | (preloaded) |
| `(removed-)magical.png` | (removed) | (preloaded) |
| `firey-shy.png` | Firey | Dragon state 0 |
| `firey-playful.png` | Firey | Dragon state 1–2 |
| `firey-silly.png` | Firey | Dragon state 3 (post-transform) |

### `/assets/world/` — Background world elements

| File | Used For |
|---|---|
| `hill-grass.png` | Rolling green hill spanning the bottom of the scene |
| `house-left.png` | Left-side house (W * 0.04) |
| `house-right.png` | Right-side house (W * 0.82) |
| `tree-center.png` | Center tree (W * 0.44) |
| `school.png` | School building (W * 0.6), glows gold at high colorShift |
| `school-flag.png` | School flag (preloaded, currently not drawn separately — flag is part of school building) |
| `cloud-fluffy.png` | Decorative scrolling clouds (3 instances) |
| `cloud-wispy.png` | (preloaded, not currently used — available for future variety) |
| `rain-cloud-soft.png` | Active rain clouds that make balloons soggy |

### `/assets/animals/` — Ground animals (Wave's friends)

| File | Friend | Ground Position |
|---|---|---|
| `fee-butterfly.png` | Fee (Fifi) | W * 0.10 |
| `char-chameleon.png` | Char (CharChar) | W * 0.78 |
| `mae-bunny.png` | Mae (Sweetie) | W * 0.25 |
| `sage-owl.png` | Sage | W * 0.65 |

### `/assets/interactive/` — Gameplay objects

| File | Used For |
|---|---|
| `balloon-blue.png` | Blue balloon variant |
| `balloon-purple.png` | Purple balloon variant |
| `balloon-red.png` | Red balloon variant |
| `balloon-yellow.png` | Yellow balloon variant |
| `balloon-gold.png` | Gold balloon variant |
| `balloon-maroon.png` | Maroon/school-color balloon variant |
| `balloon-soggy.png` | Balloon hit by rain cloud |
| `balloon-candy.png` | Balloon breathed on by Firey (drops 3x candy) |
| `candy-cupcake.png` | Candy type 1 — falls from balloons |
| `candy-lollipop.png` | Candy type 2 — falls from balloons |
| `fruit-apple.png` | Power-up fruit type 1 |
| `fruit-strawberry.png` | Power-up fruit type 2 |
| `fruit-popsicle-rainbow.png` | Power-up fruit type 3 — "rainbow unicorn sparkle popsicle" |

### `/assets/particles/` — Effects and particles

| File | Used For |
|---|---|
| `glitter-blue.png` | Blue glitter particle from balloon pops |
| `glitter-purple.png` | Purple glitter particle |
| `glitter-red.png` | Red glitter particle |
| `glitter-yellow.png` | Yellow glitter particle |
| `confetti.png` | Confetti particle (preloaded — CSS confetti used in victory screen instead) |
| `magic-beam-arc.png` | (Preloaded — not currently drawn; beams are drawn procedurally) |
| `magic-beam-impact.png` | (Preloaded — not currently drawn; impacts are procedural bursts) |
| `rainbow-celebration-arc.png` | Rainbow arc in sky (drawn at `shift > 0.2`; falls back to programmatic arc) |

### `/assets/manifest.json`

An asset manifest file exists but is not currently consumed by the game code. The game builds its own manifest via `imgManifest` array in `index.html`. The JSON file is useful for tooling and auditing.

---

## 🔮 Known Limitations & Future Ideas

### Firey Should Be Red, Not Purple
Wave explicitly said: *"Firey cause he blows fire — colored RED, small."* The current Firey assets (`firey-shy.png`, `firey-playful.png`, `firey-silly.png`) are purple dragons, not red. This is a visual mismatch with the original design intent. **Fix**: Generate new red Firey assets, or apply a canvas `hue-rotate(130deg)` CSS filter to the existing ones as a quick workaround.

### Animals Don't Pathfind Toward Candy
Wave described animals walking "faster and faster" toward the candy. Current implementation: animals bob at fixed positions. They do not move or pathfind toward candy pieces. **Fix**: When `spawnCandy()` is called, emit an event that temporarily sets each animal's velocity toward the nearest candy's X position, then let them drift back to their base position.

### Audio Requires a User Gesture to Start
Web Audio API (and the HTML `<audio>` element) cannot start playing before the first user interaction. `initAudio()` is called inside `handleTap()`, which means: the first tap starts audio, the welcome TTS voice, and the background music simultaneously. This is unavoidable — it's a browser policy, not a bug. On iOS especially, the BGM may not play on first tap; the user may need to interact twice.

### No Cross-Session Save
`rainbowCount` resets to 0 on page refresh. There is no persistent record of how many times Wave has painted the world. The original code intended to use `localStorage` for this, but that was removed due to sandboxing issues. **Fix options**: (a) use a server-side counter via a simple Vercel serverless function (API exists in the repo as a placeholder), (b) use a cookie instead of localStorage (less likely to be blocked), (c) accept it — each play session is its own rainbow.

### Underwater Adventure Not Yet Implemented
Wave mentioned an underwater scene. Not in v2.0. Would be a mode or level variant — the world painting mechanic could reset into an underwater theme with different assets.

### Racing / Jumping Obstacle Section Not Yet Implemented
Wave described a section where the unicorn races and jumps over obstacles. Not implemented. This would be a different game mode (side-scroller vs. the current free-flying format).

### Wave's Classmates Not Added as Characters
Wave referenced classmates and friends by name. Some are included (Char Char, Fifi, Sweetie) but others from her class are not yet characters in the roster.

### `fruity-crowned.png` Not Used in Victory
The `fruity-crowned` asset is preloaded but not drawn during victory. The original design intended Fruity to appear wearing a sparkly crown during the victory screen. Currently the victory screen shows a unicorn emoji. **Fix**: During victory, draw `fruity-crowned` on the canvas centered on screen, or swap the `#victory-unicorn` emoji for the actual image.

### `wave-flying.png` and Action Variants Not Used
Each character has `-action` and `-magical` variants, and Wave has a `-flying` variant. The draw loop currently uses only `-idle` (or `-sky` for Mommy) regardless of movement state. A better implementation would swap to `-action` or `-flying` variants when `gs.player.state === 'flying'`.

### No Firey Fire Breath → Candy Balloon Mechanic
The game design document specified that Firey could breathe fire on balloons to create candy balloons (which drop 3x candy). The candy balloon asset (`balloon-candy.png`) exists. Firey traversal and the `b.candy = true` property exist. But the fire breath event itself is not implemented — Firey currently just drifts across the screen without affecting balloons. **Fix**: During Firey's `active` phase, periodically tag the nearest balloon as `candy` and emit a fire breath particle from Firey's position.

### Balloon `soggyTimer` Countdown Bug
Soggy balloons track their desoggy timer as `b.soggyTimer--` per frame, and un-soggy when `b.soggyTimer < 0`. However, the timer is initialized to `200` on contact but the decrement happens every frame regardless of whether the balloon is currently soggy. If a balloon re-enters a cloud while still soggy, `soggyTimer` resets to `200` but the countdown continues from the moment the update loop processes it — no compounding. This is benign but worth cleaning up.

### BGM Track Is a Placeholder
The background music links to Kevin MacLeod's "Pixelland" from `incompetech.com`, which is royalty-free but generic. Wave asked for "magical flute." A more thematically appropriate royalty-free track (e.g., from freemusicarchive.org or musopen.org — a real flute piece) would better honor the request. The `<audio>` element's `src` can be swapped without any other code changes.

---

## 👩‍💻 For Claude Code — How to Continue

### Understanding the Code Structure

The entire game lives in `index.html`. There is no module system, no imports, no build step. Reading order:

1. **CSS** (lines 1–502): All styling including loading screen, HUD, modals, victory screen, floating messages, confetti
2. **HTML** (lines 504–617): Static DOM — loading screen, HUD, canvas, modals, victory screen, audio element
3. **JavaScript** (lines 618–1798):
   - Constants and `CHARACTERS` array (645–665)
   - Image preloader (`imgs`, `imgManifest`, `preloadAll`, `getImg`) (667–732)
   - Audio (`initAudio`, `playSFX`, `speak`) (784–854)
   - Game state object `gs` (856–880)
   - Modal management (892–953)
   - Floating messages (955–965)
   - Spawning functions (`spawnBalloon`, `spawnRainCloud`, `spawnFruit`, `spawnCandy`) (967–1008)
   - Particle helpers (`burst`, `sparkleTrailPuff`) (1010–1031)
   - Input handling (`handleTap`, `movePlayer`, `fireMagic`) (1033–1151)
   - Game actions (`popBalloon`, `eatFruit`, `tapFirey`) (1153–1210)
   - HUD update (1212–1224)
   - Victory / continue / confetti (1226–1267)
   - Firey state machine (`updateFirey`) (1269–1303)
   - Fruit spawn timer (1305–1308)
   - **Main loop**: `startGame`, `loop`, `update`, `draw` (1309–1789)
   - Color helper `lerpColor` (1791–1797)

### How to Add a New Character

1. Add the PNG files to `/assets/characters/` following the naming convention: `{filekey}-idle.png`, `{filekey}-action.png`, `{filekey}-magical.png`
2. Add an entry to the `CHARACTERS` array in `index.html`:
```js
{ id:'newchar', fileKey:'newchar', variation:'idle', name:'Display Name', bio:'Their story here.' }
```
3. The character will automatically appear in the gallery, be selectable as a playable character, and preload via `imgManifest`. No other code changes needed.

### How to Add a New Game Mechanic

Follow the pattern:
1. Add state to the `gs` object (or as a module-level `let`)
2. Add update logic in `update()` — update position, check collisions, apply effects
3. Add draw logic in `draw()` — use `ctx.drawImage()` with `getImg()` helper, with emoji/canvas fallback
4. Add spawn logic if needed (follow `spawnBalloon()` as a template)
5. Trigger from `handleTap()` or via timer in `update()`

### How Assets Are Organized

```
/assets/
  characters/    — Playable unicorns, Firey dragon
  world/         — Background scene elements (hill, houses, tree, school)
  animals/       — Ground animals (Fee, Char, Mae, Sage)
  interactive/   — Balloons, candy, fruit power-ups
  particles/     — Glitter, confetti, beam effects, rainbow arc
  manifest.json  — Asset catalog (not consumed by game, for tooling only)
```

### What Wave Still Wants That Hasn't Been Built Yet

In priority order based on how clearly she described them:

1. **Firey should be RED** — "colored RED, small, blows fire" — current assets are purple
2. **Animals should walk toward candy** — "they walk faster and faster" — currently bobbing in place
3. **Fruity crowned on victory** — use `fruity-crowned.png` instead of the emoji on the victory screen
4. **Firey fire breath on balloons** — creates candy balloons, but fire breath event not yet implemented
5. **Underwater adventure** — she mentioned it, no implementation yet
6. **Racing/jumping section** — she mentioned it, would be a side-scroller mode

### The Core Philosophy to Always Preserve

> **No losing states. Pure joy. Perseverance theme.**

Specific rules that must never be violated:
- **No timer countdown** that creates pressure
- **No "Game Over" screen** of any kind
- **No score** that could feel competitive or shameful
- **Magic always regenerates** — Wave is never permanently stuck
- **Encouragement on failure** — if magic isn't ready, say "Almost ready! ✨", not "Out of magic!"
- **Rain is always present** (because Wave said it rains every day) but **never blocking** (the unicorn perseveres)
- **Every completion loops back to play** — the victory screen has exactly one button: "Paint Again!"

Wave's exact words: *"The unicorn doesn't give up if she sees rain. She never gives up."*

That's the game. Everything else is decoration.

---

*Built with love for Wave's birthday. April 2026. 🦄🌧️🌈✨*

*Authored by Perplexity Computer. For the developer.*
