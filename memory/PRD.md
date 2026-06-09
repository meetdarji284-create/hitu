# Hitu's Little World ❤️ — PRD

## Original Problem
A cute, emotional, cozy, romantic, feminine, playful comfort web game built for the user's girlfriend "Hitanshi ❤️" (Hitu), to play during her periods or free time. Aesthetic: black + white + silver + sunflower yellow. Mobile-first. Personal love game made by her Batak with floating sunflowers, hearts, sparkles, and emotional lines.

## User Persona
- Hitanshi ("Hitu"), DOB 01/03/07, loves sunflowers, KitKat, coffee, faluda, pani puri (medium mix), Joe Keery, Mini Cooper, RCB & Virat Kohli, silver jewelry, jhumkas, kurtis, bodycon dresses, lac bangles. Hates capsicum, olives, misal pav. Period 4th of month, cravings: chocolate/brownie/ice-cream.

## Architecture
- Pure React SPA (no backend). Single-screen state machine. localStorage for persistence.
- Floating particles via canvas, glassmorphism cards, Caveat + Quicksand fonts.
- Music: Spotify embed iframe for "Darkhaast".

## Implemented (2026-02)
- ✅ Loading → Intro ("Hii Hitu ❤️") → Hub (10 tiles)
- ✅ Period Comfort, Hitu Quiz, Dress Up, Virtual Café, Open When, Love Meter, Memory Wall, RCB section, Surprise popups, Music toggle, Particles, Easter eggs

## Implemented / Refined (2026-06)
### Bouquet Builder 💐 (Games Room)
- 6 flower types (sunflower, rose, daisy, tulip, lavender, peony) — multi-pick & mix
- Per-flower style (bloom/bud/full), stem (short/med/tall), leaves (simple/lush/none), leaf color (green/dark/autumn)
- Live SVG bouquet preview (sticky on lg screens — right side; top on mobile)
- Wrap-it toggle + 4 wrap variants (kraft/pink/white lace/lavender) with ribbon
- Save bouquet by name → "My Bouquets" shelf (localStorage `hitu_bouquets_v1`, max 12)
- Load / delete saved bouquets, undo last / clear all

### Flower Garden 🌷 (Games Room)
- 3×3 plot grid; planting **shows full flower image at 50% scale immediately** (no seed/sprout placeholder)
- 3 growth stages (0.5 → 0.75 → 1.0) with 1.5s CSS spring transition between stages
- 7 species (sunflower free, others unlock with petals: 20–250)
- Bees 🐝 + butterflies 🦋 visit mature plots; tapping mature flower shows ✦ confetti burst
- Double-click mature flower to harvest (+10 petals); localStorage `hitu_garden_v2`

### Doodle Board 🎨 (Games Room)
- Drawing canvas with 10 colors, 4 brush sizes, eraser
- Save → name prompt → thumbnail saved to "My Drawings" dashboard (localStorage `hitu_drawings_v1`, max 30)
- Gallery modal with Load + Delete on each item; New Drawing confirms before clearing; .png download
- **8 Surprise effects** — Rainbow Spiral, Confetti Explosion, Starry Night, Watercolor Wash, Flower Burst, Magic Glitter, Mirror Flip, Vintage Filter
- Each click never repeats last effect; toast confirms which effect was applied

### Open When... 💌 (Hub)
- **13 letters**: sad, angry, missing, periods, overthink, laugh, home, proud, motivation, sleep, birthday, dance, hardself
- Each envelope has unique color + pattern (stripes/dots/stars/hearts/spiral/flames) + wax seal
- Flip-open animation on tap; modal has decorative ✦ corner stars + "yours forever" signature

## Testing
- iteration_1.json — initial hub/sections pass (100% frontend)
- iteration_2.json — Bouquet Builder, Flower Garden, Doodle Board, Open When all pass (100%)

## P1 Backlog
- "Daily Sunflower" — one fresh love note unlocks per day + streak counter
- Real audio playback (currently Spotify iframe)
- Custom photo uploads to Memory Wall
- Period tracker calendar (4th-of-month)
- Share-as-image for any letter

## P2 Backlog
- Light/dark theme toggle, Hindi/Marathi phrases
- Tap-to-feed virtual pet section
- Drag-drop cafe/pani puri mini-prep games
- Shelf-full toast when bouquet/drawing limit reached
- In-app modal for save-name prompt (replace window.prompt)
- Sticky close button on Open-When modal for long letters
