# Dhruv Singh — Portfolio

A dark, cinematic portfolio built around Dhruv’s resume and public projects: an interactive silver sculpture, floating holograms, dimensional typography, custom project interface studies, detailed case studies, and a scroll-driven visual journey.

## Run locally

Requires Node.js 22.12+ (this project was built with Node.js 24).

```powershell
cd C:\Users\2k22a\OneDrive\Desktop\my
npm install
npm run dev
```

Open **http://127.0.0.1:5173**. To serve the production build:

```powershell
npm run build
npm run preview
```

Open **http://127.0.0.1:4173**.

All authored files, dependencies, build output, and project-managed caches are inside this folder. `.npmrc` directs npm’s cache to `.cache/npm`; the script runner configures `TEMP`, `TMP`, and `TMPDIR` to `.cache/tmp` before loading build tools. No global packages are required. When installing packages yourself, you can also set `$env:TEMP` and `$env:TMP` to the absolute `.cache\tmp` path before `npm install`.

## What’s included

- React 19 + Vite 7, with Tailwind CSS 4 and an authored responsive design system.
- A procedural Three.js torus knot with polished metal, seamless vertex colors, neutral studio reflections, orbital rings, bloom, and a particle galaxy. No remote textures, models, or HDR downloads.
- Singularity Lab: drag to rotate, hold to separate the sculpture into real geometric fragments, switch between chrome/wireframe/particles, disassemble/reassemble, reset, and enter fullscreen.
- A three-chapter scroll sequence that moves from wireframe to fragmented metal to particles, with a lighter mobile treatment and a static reduced-motion version.
- Layered midnight, graphite, and silver atmospheres; floating code panels; a rotating CSS 3D monogram; raised glass controls; and pointer-responsive project previews.
- An interactive workspace with three code-native miniature worlds: an isometric office with department selection and desk allocation, an animated road with crossing counts and detection overlays, and a draggable task board with an accessible move menu and completion feedback. All use sample data and are explicitly labeled as illustrative demonstrations, with links to the real projects.
- The hero’s **Enter the workspace** button separates the sculpture, moves the camera through it, and transitions into the gallery. Reduced motion skips the flight and transfers focus directly to the active workspace tab.
- GSAP intro and scroll reveals, a scroll-linked timeline, animated figures, Lenis smooth scrolling, and Framer Motion magnetic buttons.
- Five projects: three detailed featured projects and two additional GitHub projects.
- Native accessible case-study dialogs, focus restoration, Escape dismissal, working mobile navigation, resume download, copy email, telephone, and verified repository/profile destinations.
- Two complete themes: charcoal-and-silver (default) and orange-and-black. The header switch updates surfaces, typography accents, sculpture materials, lights, rings, and particles. The choice is saved locally and restored before the initial paint. A custom desktop cursor, live India clock, and metallic chess knight complete the experience.
- Self-hosted, subsetted WOFF2 fonts, metadata, structured data, favicon, and an Open Graph image.

## Content and provenance

Edit **`src/data.js`** to update contact information, social URLs, project metrics, descriptions, source repositories, and demo URLs. The latest supplied resume is available at **`public/Dhruv_Resume.pdf`**. The previous download URL also serves this replacement PDF.

The earlier resume’s embedded PDF annotations supplied LinkedIn, GitHub, LeetCode, an earlier portfolio URL, and direct repository links for Seat Allocation System (the repository remains named Ethara-SAPSM), Taskflow, and Vehicle Detection. Project demo destinations came from those repositories. Chess.com came from the design brief. The extra Inventory System and Smart Recipe Generator entries came from the public GitHub repository list. The replacement PDF is served exactly as supplied; changing the download did not rewrite the portfolio’s existing factual content.

The source extraction is preserved in **`artifacts/resume-extracted.json`**, and the public repository list in **`artifacts/github-repositories.json`**. These artifacts are not part of the published website.

Resume figures are static, not live API counters. In particular, Ethara’s 5,000 figure refers to employee records, and the documented 342ms p95 is for the employee endpoint at 5 concurrent virtual users; it does not claim 5,000 simultaneous users. The computer vision demo is historical analytics; its real-time detector runs locally.

The three custom project previews are **illustrative interface studies**, labeled as such, rather than screenshots of deployed applications. They are authored in `src/components/ProjectArt.jsx`. Replace those components with your screenshots or videos if preferred; use local WebP/AVIF assets, dimensions, `loading="lazy"`, and descriptive alternative text. There is no invented client testimonial, fabricated experience, or dummy contact form.

GeeksforGeeks and HackerRank achievements are shown as resume text. No profile URLs were present, so none were guessed. The old portfolio URL is recorded in the extraction; the new site does not send visitors back to the older portfolio.

## Components

```text
src/
  App.jsx                 Smooth scrolling and scroll animation lifecycle
  data.js                 Profile, projects, and source destinations
  hooks.js                Responsive queries and India clock
  fonts.css               Three local Latin font faces
  styles.css              Layout, artwork, and responsive design system
  experience.css          Sculpture controls and scroll-sequence layouts
  maximalist.css          Chromatic lighting, dimensional surfaces, mobile art direction
  themes.css              Silver/orange theme switch and orange-and-black palette
  three/sculpture.js      Fragment geometry, color attributes, particle shaders
  components/
    Hero.jsx / Scene.jsx  Lazy 3D hero and graceful fallback
    SingularityLab.jsx    Sculpture interaction and fullscreen controls
    Experiment.jsx        Scroll-driven three-chapter visual sequence
    TiltButton.jsx        Pointer-responsive project preview surfaces
    Navbar.jsx            Navigation and accent control
    About.jsx             Bio, statistics, and marquee
    Projects.jsx          Project grid and archive
    ProjectWorlds.jsx     Interactive office, traffic simulation, and task board
    ProjectArt.jsx        Code-native interface studies
    ProjectDetail.jsx     On-demand case-study dialog
    Timeline.jsx          Experience and education
    Skills.jsx            Skills and certifications
    Contact.jsx           Contact, local time, and chess easter egg
    UI.jsx                Shared links and magnetic interactions
    BrandIcons.jsx        Local social icons
    Cursor.jsx            Decorative desktop cursor
    Loader.jsx            Font-readiness reveal
```

## Accessibility and performance

`prefers-reduced-motion` disables WebGL, smooth scrolling, the custom cursor, animated reveals, and decorative motion. A local WebP rendered from the actual sculpture remains visible. Mobile starts with this optimized rendering and offers an **Interact in 3D** button. Once activated, mobile uses lower geometry detail, DPR 1, compact environment reflections, and no postprocessing. The desktop canvas starts automatically and pauses when the hero is outside the viewport. The sequence canvas mounts only near its section. There are no recurring network calls for social statistics or third-party fonts. Core content is HTML; the 3D scene and project dialogs load separately. Offscreen section animations initialize when they approach the viewport.

The shader is deliberately focused on the sculpture. Heavy depth of field, volumetric fog, and chromatic aberration were omitted because they make text-adjacent art less clear and cost GPU time. The CSS grain is subtle. There is no audio or autoplay video.

Run the meaningful browser checks against a production preview:

```powershell
npm run build
npm run preview
# In a second terminal, in this same directory:
npm run check
node scripts/check-experience.mjs
node scripts/check-worlds.mjs
```

The check script uses the existing Google Chrome installation, with an isolated profile inside `.cache/qa-browser`. Override `CHROME_PATH` if needed. It checks project dialogs, navigation, links, the PDF, accent persistence, copy email, reduced motion, responsive overflow, and WCAG A/AA rules with axe. Screenshots and reports go to `artifacts/`. Browser screenshots also generate `public/og-cover.png`; rebuild after generating the cover to include it in `dist/`.

The interaction suite covers sculpture modes, disassembly, drag/hold/reset, fullscreen, all three scroll chapters, project tilt, mobile controls, and dynamic reduced-motion changes. Its report is saved as `artifacts/experience-report.json`. `scripts/capture-sculpture.mjs` regenerates the local WebP from the live scene, using the mobile renderer for clean transparency.

The workspace suite covers entrance focus management, department and seat allocation, traffic animation and counting, pause/reset/detection controls, native drag-and-drop, keyboard tabs, mobile task movement, reduced motion, and accessibility across all three worlds. Reports and screenshots are saved under `artifacts/world*`. Demo changes remain in memory and reset when switching worlds or reloading. They never alter a real project. Traffic animation pauses when the workspace leaves the viewport; reduced motion offers explicit two-second simulation steps.

The final local audit on September 20, 2026 measured **78 desktop / 89 mobile performance**, with **100 accessibility, best practices, and SEO** on both profiles. The 15 general browser checks and 8 interaction checks passed with zero browser errors and zero automated WCAG A/AA violations. Startup optimizations pause offscreen decorative animations, defer the cinematic sequence until it approaches the viewport, and reduce reflection-map and desktop rendering resolution. WebGL initialization remains the largest startup cost. Reports are saved under `artifacts/`; local lab results vary with the device and deployment.

To repeat the Lighthouse measurements while the production preview is running, use `node scripts/lighthouse.mjs`. It keeps its separate audit browser profile in `.cache/lighthouse-browser`.

## Deploy to Vercel

1. Put this folder in a Git repository, excluding `.cache/`, `node_modules/`, and `artifacts/` (already in `.gitignore`).
2. Import the repository into Vercel and choose **Vite**.
3. Build command: `npm run build`. Output directory: `dist`.
4. No backend or secret environment variables are required.

`vercel.json` supplies the build and sensible cache/security headers. This project has **not** been deployed automatically.

Before publishing, set the final domain in `index.html`:

- `[REPLACE: FINAL_PUBLIC_DOMAIN]` — use it for an absolute `og:image` and `twitter:image` URL, and add canonical / `og:url` tags.
- `[REPLACE: OPTIONAL_GEEKSFORGEEKS_PROFILE]` and `[REPLACE: OPTIONAL_HACKERRANK_PROFILE]` — only add links after you provide the actual profile URLs.

These instructions are the only placeholders; the visible portfolio uses your supplied information.

## Interactive Story Mode

The hero’s **Enter Story Mode** button opens a soundless, optional cinematic journey. Visitors choose intelligence or engineering to change the order of the vision tunnel, data city, and floating software workspace. A particle name reveal opens the film; a sculpture and contact invitation close it. The sequence has about 70 seconds of content, with unlimited time to choose a route or explore the finale. Pause, previous, next, skip, replay, and Escape controls are available. Reduced motion uses manual chapters. Both portfolio themes apply, and the 3D scene loads only when opened.

Run `node scripts/check-story.mjs` against the production preview to check branching, autoplay, pause, links, focus restoration, contact handoff, mobile sizing, reduced motion, and automated accessibility. Its browser profile stays in `.cache/story-browser` and screenshots/reports in `artifacts/story-*`.

## Fonts and libraries

Space Grotesk, Inter, and IBM Plex Mono are self-hosted through Fontsource and distributed under their bundled open font licenses. Lucide supplies interface icons. React, Vite, Three.js, React Three Fiber, Drei, GSAP, Framer Motion, Lenis, and Tailwind remain under their respective package licenses.
