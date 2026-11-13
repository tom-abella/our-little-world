# Our Little World

A tiny top-down RPG built as a monthsary gift. Play as Micah and meet Tom, your guide, in the hub, walk through
the gates for each month you've shared, and collect the memories inside.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Static and backend-free — deploy to Vercel or Netlify
with `npm run build`.

## Controls

- **Move:** WASD / arrow keys, or the on-screen D-pad on touch devices
- **Interact:** E / Space / Enter, or the heart button on touch devices

## Make it yours

Everything personal lives in two places:

1. **`src/data/stages.js`** — month titles, `unlockDate`, memory captions, dates,
   locations and coordinates. Set `UNLOCK_ALL_STAGES = true` to preview locked
   months early.
2. **`public/images/`** — drop your photos here using the filenames referenced by
   `imageUrl` (e.g. `month1-photo1.jpg`). Missing files show a heart placeholder.

Music is generated in the browser with the Web Audio API (no audio file needed).
