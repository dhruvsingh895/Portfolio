# The Living Observatory

Open `public/universe.html` directly in a browser. The delivered HTML is self-contained: Three.js 0.160.1, GSAP 3.15.0, fonts, avatar, shaders, and the data snapshot are embedded. Viewing it requires no build step or network connection. External links navigate only when clicked.

## Refresh the data

The `DATA` constant near the top of the HTML contains the snapshot and its schema: user, repositories with language-byte maps, public events, daily contributions, featured repository names, computed insights, links, and limitations. Replace that object with a fresh snapshot from GitHub REST (`users/{username}`, `users/{username}/repos`, repository `languages`, and `users/{username}/events/public`) and the GraphQL `contributionCalendar`. Recompute the streak, month totals, event-sample weekday/hour, language count, and stars/repository ratio. Update the visible snapshot/date-range labels too. Never infer historical language trends from current byte counts.

For this workspace, the editable source is `overview/template.html` with `stage2.js`–`stage4.js`. `node overview/build.mjs` assembles it using the input snapshot and pinned libraries in `.cache/overview-rebuild`, plus the installed font and GSAP files. `overview/data-snapshot.json` preserves the public data used in this version.

## Retune the look

Edit the `CONFIG` constant for the WebGL palette, bloom strength, particle counts, pixel-ratio caps, and tour speed. Match the CSS `:root` variables for text and controls. Geometry is seeded from the username. Low quality uses 3,500 nebula particles; high uses 42,000. The composite uses a compact highlight-blur approximation, not a full cinematic multi-pass renderer.

## Controls

- Scroll through six chapters, or start/pause the guided tour.
- Ctrl/Cmd+K opens the searchable keyboard command palette.
- Select a language to filter projects; drag the city control or use arrow keys to orbit.
- Quality, theme, and optional sound controls are always available. Sound starts off.
- Reduced motion removes camera flight and animated particles; all data remains available as text/tables.
- Konami sequence triggers a short hyperspace accent. Five clicks on the DS mark reveal a seeded-universe note.

## Three design decisions

1. **One continuous observatory:** the camera connects real contributions, languages, projects, and activity instead of presenting unrelated decorative cards.
2. **Truth before spectacle:** dates, sampled events, and unavailable historical trends are explicit. Zero-star repositories do not receive invented moons or rankings.
3. **An offline artifact:** embedded assets make the result portable, with readable equivalents and a WebGL fallback.

## Verification and limits

`node overview/check.mjs` verifies all six chapters, language filtering, keyboard navigation, tour pause, audio, 360px layout, context loss/restoration, zero HTTP requests, zero console errors, and automated accessibility in both themes. Reports are in `artifacts/universe-*` locally. Browser automation is not a substitute for a manual screen-reader audit or a real mid-range-phone performance test; 60fps on that hardware is not claimed.

Fonts and embedded libraries retain their respective licenses (Space Grotesk/JetBrains Mono: OFL; Three.js/GSAP: bundled license terms).
