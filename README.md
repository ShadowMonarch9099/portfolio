# Kush Honkalse · Portfolio

A scroll-driven 3D portfolio. As you scroll, the camera travels across a spacetime grid, and each chapter of the
page is a celestial body whose gravity bends the grid. The cursor bends it too. Each project has its own case-study
page, where the camera flies in to that project's planet.

Built with **Next.js 16 (App Router)**, **TypeScript (strict)**, **Tailwind CSS 4**, **React Three Fiber / Three.js**,
**GSAP** (ScrollTrigger, SplitText) and **Lenis**. Fully static; deploys to Vercel with no backend.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Command         | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Dev server with hot reload                  |
| `npm run build` | Production build (all pages are static)     |
| `npm run start` | Serve the production build                  |
| `npm run lint`  | ESLint                                      |

## Editing content: `src/data/profile.ts`

**All text lives in `src/data/profile.ts`.** You never need to touch a component to change wording.

| Field | What it controls |
| --- | --- |
| `hero` | The big headline (`lead` + highlighted `emphasis`) and intro |
| `origin` | Chapter 01: your story, plus the three facts under it |
| `values` | Chapter 02: the three principles and the "What pulls me in" quote |
| `experience` | Chapter 04: internship and education |
| `skills` | Chapter 05 "Loadout"; the group with `primary: true` gets the large type |
| `offClock`, `achievements`, `now` | Chapter 06: gaming, anime and friends, achievements, what you're exploring now |
| `closing`, `contact` | Chapter 07: closing line, email, phone, LinkedIn |
| `resumeUrl` | Résumé download (file in `public/`) |
| `photo` | Your portrait (`public/kush.jpg`) |
| `siteUrl` | Your live URL, used for SEO tags, `sitemap.xml` and `robots.txt` |

### Case studies (`work` array)

Each project in `work` becomes a stop on the journey **and** a page at `/work/<slug>`.

- `summary` appears on the home page; `overview`, `built`, `challenge` and `decision` appear on the case-study page.
  Leave out `challenge` or `decision` if a project doesn't have one.
- `liveUrl` adds a "Visit live site" link. Leave it out to hide the link.
- `planet` sets the colour and type of the project's body in the 3D scene (`planet`, `ringed` or `blackhole`).

## Adding screenshots and videos

Case-study pages show designed "Coming soon" frames until you add media.

1. Put files in `public/work/<slug>/`, e.g. `public/work/meet/cover.jpg`.
2. Reference them in that project's entry in `profile.ts`:

```ts
cover: { src: "/work/meet/cover.jpg", alt: "Meet organisation dashboard" },
gallery: [
  { src: "/work/meet/recording.jpg", alt: "Recording a meeting in the browser" },
  { src: "/work/meet/demo.mp4", alt: "Meet walkthrough", kind: "video" },
],
```

Once `gallery` has items, it replaces the placeholders listed in `galleryPlaceholders`.

| Where | Recommended size |
| --- | --- |
| `cover` | 1600×1000 (16:10) |
| First gallery item | 1600×900 (16:9, shown full width) |
| Other gallery items | 1200×900 (4:3) |
| Videos | MP4 (H.264), under ~8 MB, no audio needed (they play muted) |

Images are resized and compressed automatically by `next/image`. Videos are served as-is, so keep them short.

## How it works

```text
src/
├── app/
│   ├── layout.tsx              # Fonts, metadata, header/footer, 3D background, smooth scroll
│   ├── page.tsx                # The journey (home)
│   ├── work/[slug]/page.tsx    # Case-study pages (statically generated)
│   ├── not-found.tsx           # "Lost in space" 404
│   ├── globals.css             # Colour tokens (paper / space themes), type, motion helpers
│   └── icon, apple-icon, opengraph-image, sitemap, robots
├── components/
│   ├── home/                   # One component per chapter (Hero, Origin, Principles, WorkStops, …)
│   ├── work/                   # Case-study helpers (FocusPlanet, MediaFrame)
│   ├── scene/                  # WebGL scene
│   │   ├── world.ts            # Where each body sits, its size, colour and gravity well
│   │   ├── Grid.tsx            # The spacetime grid (bent on the GPU by every well + the cursor)
│   │   ├── Bodies.tsx          # Stars, planets, rings, black hole, moons, binary, belt, comet
│   │   ├── CameraRig.tsx       # Camera path between stops, and case-study close-ups
│   │   ├── SceneRoot.tsx       # Loads WebGL lazily, CSS fallback, pointer + theme sync
│   │   └── store.ts            # Shared numbers between DOM and scene (no React re-renders)
│   ├── Motion.tsx              # GSAP: split-line headings, reveals, scrubbed principles, magnetic buttons
│   ├── SmoothScroll.tsx        # Lenis smooth scrolling
│   ├── JourneyTracker.tsx      # Maps scroll position to the camera's journey
│   ├── Header.tsx, HUD.tsx, Footer.tsx, ThemeToggle.tsx, …
└── data/profile.ts             # ← all content
```

- **Scroll → camera.** Each home-page section has `data-stop="<id>"` matching a body in `scene/world.ts`. When the
  centre of the screen passes a section's centre, the camera arrives at that body. To add a chapter, add a body to
  `BODIES` (in order) and a section with the same `data-stop`, then add its label to `components/chapters.ts`.
- **Performance.** The page paints as plain HTML first. On desktop the WebGL scene loads once the browser is idle; on
  phones it loads on the first touch or scroll. GSAP and Lenis also load after first paint. Until the scene arrives,
  a CSS grid floor fills the background, and it stays if WebGL isn't available.
- **Accessibility.** Semantic landmarks, skip link, visible focus rings, keyboard-operable menu (Esc closes it),
  WCAG AA contrast in both themes. With "reduce motion" on, smooth scrolling and text animations are off, and the
  camera cuts between stops instead of flying.
- **Themes.** "Space" (dark) and "Paper" (light). Follows the system setting until the visitor picks one, then
  remembers it. Scene colours live in `scene/palette.ts`, next to the CSS tokens in `globals.css`.

## Deploy to Vercel

1. Push to GitHub (the repo can stay private).
2. Import it at [vercel.com/new](https://vercel.com/new). Defaults work as-is.
3. Under **Settings → Environment Variables**, set `NEXT_PUBLIC_SITE_URL` to your live URL (no trailing slash),
   then redeploy.

Every push to `main` redeploys automatically.
