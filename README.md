# Dhruv Singh — Personal Portfolio

An immersive, cinematic single-page experience built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, blending **Three.js / React Three Fiber**, **GSAP + ScrollTrigger**, **Framer Motion** and **Lenis smooth scroll**.

Not a portfolio — a film. The visitor flies through a neural tunnel, watches the camera zoom from space to Kanpur, India, and then scrolls through a living product narrative: storytelling chapters, a Netflix-style project modal with animated architecture flows, 3D glass skill cubes, live GitHub data, an AI concierge, and an EmailJS-powered contact terminal.

## Requirements

- Node.js 20+
- npm

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # eslint
```

## Environment variables

Copy `.env.example` → `.env.local` and fill in real values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (used for metadata / sitemap / robots). |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub username streamed by the live GitHub section. Without it the section shows a setup hint. |
| `NEXT_PUBLIC_RESUME_URL` | Direct link to your hosted resume PDF. Falls back to an in-page link. |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service ID (contact form). |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template ID. |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key. |

Without EmailJS keys, the contact form gracefully falls back to a `mailto:` link.

> Note: GitHub's public API is unauthenticated (rate-limited to 60 req/hr/IP). For heavier usage pass a token via a server route or `next.config.ts` rewrites.

## Architecture

```
src/
├─ app/
│  ├─ globals.css          # design tokens, glass, aurora, utilities (Tailwind v4 @theme)
│  ├─ layout.tsx           # fonts, SEO metadata, viewport
│  ├─ page.tsx             # renders <HomeContent/>
│  ├─ sitemap.ts / robots.ts
├─ components/
│  ├─ core/                # Preloader, Navbar, Footer, Cursor, ScrollProgress, BinaryRain
│  ├─ three/               # ExperienceScene (tunnel → Earth → fly-to-India → hero globe)
│  ├─ sections/            # Hero, About, Experience, Projects + ProjectModal, Skills,
│  │                       # Achievements, GitHubSection, Certificates, Timeline, Testimonials, Contact
│  ├─ ai/                  # AIChat floating orb concierge
│  └─ ui/                  # MagneticButton, AnimatedText, SectionHeading, TiltCard
├─ hooks/                  # useSmoothScroll (Lenis), useMousePosition, useTyping, useCountUp
├─ lib/
│  ├─ data/                # ALL content lives here (profile, projects, skills, achievements,
│  │                       # experience, ai-knowledge …)
│  ├─ animations.ts        # shared motion variants / easings
│  ├─ sceneBus.ts          # tiny pub-sub that coordinates Preloader ↔ 3D scene
│  └─ site.ts, utils.ts
└─ providers/              # TanStack Query provider
```

### Design tokens

Edit `src/app/globals.css` `@theme` block for colors (`--color-aurora-*`, `--color-void`, `--color-neon`), fonts and keyframes. Reusable component classes: `.glass`, `.glass-strong`, `.text-gradient`, `.text-gradient-aurora`, `.edge-glow`, `.noise`, `.grid-bg`, `.shimmer-line`, `.font-outline`.

### Content

Every piece of copy — resume summary, education, Infosys Springboard experience, projects, skills, achievements, certificates, timeline, testimonials and the AI assistant's knowledge base — lives in `src/lib/data/` as strongly-typed modules. Edit the data, not the components.

### Animation system

- **Boot choreography**: `sceneBus` publishes progress from `Preloader`; `Director` in `ExperienceScene.tsx` scrubs a camera path (tunnel → Earth → India) and settles to the hero framing. Reduced-motion users skip straight to the globe.
- **Scroll**: Lenis drives smooth scroll and feeds GSAP ScrollTrigger.
- **Reveals**: shared variants in `lib/animations.ts` (`fadeUp`, `blurIn`, `letterVariant`, …).

## Performance decisions

- The **entire 3D layer is a dynamic import** (`ssr: false`) — zero three.js cost on first paint.
- Earth/cloud **textures are generated procedurally on the client** (no network assets).
- `dpr` clamped, tunnel particle counts reduced on touch devices, animations gated on `prefers-reduced-motion`.
- Images use `next/image`; GitHub section streams data instead of screenshots.
- Static (SSG) output → fast TTFB and cacheable edge delivery on Vercel.

## Deploy

```bash
vercel      # or push to GitHub → import in Vercel dashboard
```

Set the `NEXT_PUBLIC_*` environment variables in the Vercel project settings. Add `@vercel/analytics` via `npm i @vercel/analytics` and mount `<Analytics/>` in `layout.tsx` if you want product analytics.

## Notes

- Replace the placeholder GitHub/LeetCode/LinkedIn URLs, email and resume link in `src/lib/data/profile.ts`.
- The cert and project `*/case-study` links are placeholder URLs — point them at real resources.
- OG image is generated at `public/og.png` (safe to swap for a designed social card).