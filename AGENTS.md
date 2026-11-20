<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Our Little World

Browser-only top-down RPG (Next.js 16 App Router, React 19, Zustand). Static and backend-free: no API routes, database, auth, or persistence. A refresh restarts the story.

## Commands

- `npm run dev` — dev server at http://localhost:3000.
- `npm run build` / `npm start` — production build/serve; the page is prerendered static.
- `npm run lint` — ESLint flat config (`eslint-config-next/core-web-vitals`). There is no Prettier or typecheck; the project is plain JS (no TypeScript).
- `node --test tests/` — run all tests. **There is no `npm test` script.** One file: `node --test tests/sheriden.test.mjs`.

## Tests

Tests use Node's built-in runner, not Jest/Vitest. They read `src/**/*.js` as text and import it through `data:` URLs, manually replacing `@/...` aliases (see the top of `tests/sheriden.test.mjs`). Adding an aliased import to a tested module (`src/game/maps.js`, `src/game/sheridenRender.js`) breaks the suite unless you extend that replacement chain.

`tests/sheriden.test.mjs` flood-fills each map from spawn using the player collision box (11 px half-width, 14 top / 6 bottom) and asserts that memories, exits, Sheriden entrances, and Tom's tour stops are reachable within their interaction radius. It also asserts concrete content: landmark prop types per memory, a caption substring, tour membership, and SVG image contents. Moving props/solids/coordinates or editing copy can fail tests — run them after data or map changes and update assertions only for intentional changes.

`tests/month-unlock.test.mjs` hardcodes Month 1 unlocking at local midnight on 2026-12-02.

## Where things live

- `src/data/stages.js` — all stage and memory copy, photo paths, coordinates, unlock dates. `UNLOCK_ALL_STAGES` (global) and per-stage `unlockedOverride` bypass dates for preview.
- `src/data/tours.js` — Month 1 tour order (memory ids or Sheriden rooms) and Tom's waiting spots.
- `src/game/maps.js` — map geometry for themes `greenfield`, `baguio`, `park`, `night`, plus the hub and the two Sheriden rooms. `mapForScene` accepts `"hub"`, `"sheriden-lobby"`, `"sheriden-roof"`, or a numeric stage id.
- `src/game/GameCanvas.jsx` (~1.3k lines) — imperative game loop and story state machine: movement, interaction, Tom's paths, prologue/Month 1 phases, auto-rides, Sheriden guides. Story changes generally require coordinated edits here and in `maps.js`, `tours.js`, and `render.js`.
- `src/store/gameStore.js` — Zustand store for scene/dialogue/modal/tour progress. Per-frame positions and path state live in `gameRef` inside `GameCanvas`; keep transient state there.
- `src/game/render.js`, `src/game/sheridenRender.js` — all art is procedural canvas 2D. There are no character or world sprites: add a prop type plus a `draw*` function rather than an image.
- `public/images/` — photos referenced by `imageUrl`; missing files fall back to a heart placeholder (several `month1-photo*`, `month2-*`, `month3-*` files are not present).
- `src/app/page.js` is the entire UI shell and is `"use client"`; it composes the canvas with overlays (`StartScreen`, `DialogueBox`, `MemoryModal`, `TouchControls`, etc.).

## Quirks

- Tailwind 4 is wired through a Turbopack rule in `next.config.mjs` (`@tailwindcss/turbopack`), not PostCSS. No `tailwind.config`; theme tokens are in `src/app/globals.css`.
- The world is a fixed 960×576 logical canvas scaled by devicePixelRatio (capped at 2); the hub is 1280 wide and uses a scrolling camera. The canvas is CSS-scaled into a 5:3 box.
- Audio is generated with Web Audio (`src/lib/music.js`, `src/lib/sfx.js`) and only starts after a user gesture (`unlockSfx` in `StartScreen`). Expect silence until the start button is clicked.
- `next.config.mjs` enables `cacheComponents` and `partialPrefetching`; keep pages statically prerenderable.
- Input is handled via module-level key state in `src/game/input.js`; touch controls call the same `setKey`/`pressInteract` functions, so both paths must keep working.
