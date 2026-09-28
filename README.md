# Kush Honkalse · Portfolio

My personal portfolio site, built with **Next.js 16 (App Router)**, **TypeScript (strict)**, **Tailwind CSS 4** and **GSAP**.
It's a fully static site with no backend or database, ready to deploy on Vercel.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other scripts:

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Start the dev server with hot reload          |
| `npm run build` | Create the production build (static output)   |
| `npm run start` | Serve the production build locally            |
| `npm run lint`  | Run ESLint                                    |

## Editing content: `src/data/profile.ts`

**All content lives in one typed file, `src/data/profile.ts`.** You never need to touch a component to update text.
TypeScript will flag a missing or misspelt field when you run `npm run dev` or `npm run build`.

| Field | What it controls |
| --- | --- |
| `name`, `headline`, `subtext`, `location` | Hero section |
| `siteUrl` | Your live URL, used for SEO tags, `sitemap.xml` and `robots.txt` (see [Deploy](#deploy-to-vercel)) |
| `seoDescription` | The description search engines and link previews show |
| `resumeUrl` | The "Download Resume" button (file lives in `public/`) |
| `photo`, `photoAlt` | Hero photo |
| `socials` | GitHub, LinkedIn and email icons (hero, contact and footer) |
| `about`, `quickFacts` | About section paragraphs and the four stat cards |
| `experience` | Experience timeline: one entry per job, with `projects` inside it |
| `projects` | Project cards and their detail dialogs |
| `skills` | Skill groups; set `featured: true` to give a group the large highlighted card |
| `achievements` | Achievements & Leadership cards |
| `contact` | Contact heading and call to action |

### Common edits

**Add a Live or GitHub button to a project.** Add `liveUrl` and/or `githubUrl` to that project. A button only appears
when its URL is set:

```ts
{
  slug: "thinkforge",
  // ...
  liveUrl: "https://thinkforge.example.com",
  githubUrl: "https://github.com/ShadowMonarch9099/thinkforge",
}
```

**Add a project.** Copy an existing object in `projects`, give it a unique `slug`, and fill in every field.
`highlights` (2–3 short lines) appear on the card; `bullets` appear in the detail dialog.

**Add an achievement.** Add `{ title: "...", detail: "..." }` to `achievements`.

**Update the resume.** Replace `public/Kush_Honkalse_Resume.pdf` with the new PDF, keeping the same file name.

## Adding images

The site currently uses placeholder images. To swap in real ones, **replace the files at these exact paths, keeping
the same names**, and no code changes are needed:

| File | What to put there | Recommended size |
| --- | --- | --- |
| `public/profile.jpg` | Headshot, square crop, plain background | 800×800 |
| `public/projects/meet.png` | Meet screenshot (dashboard or recording screen) | 1600×1000 (16:10) |
| `public/projects/thinkforge.png` | ThinkForge screenshot (daily question screen) | 1600×1000 (16:10) |
| `public/projects/kalasetu.png` | KalaSetu app screens (2–3 phone screenshots side by side) | 1600×1000 (16:10) |

Tips:

- Keep the 16:10 ratio for project images; other ratios get cropped to fit the card.
- PNG, JPG or WebP all work. If you change the extension, update the `image` (or `photo`) path in `profile.ts`.
- `next/image` resizes and compresses images automatically, so you can use full-size screenshots.
- After replacing an image, hard-refresh the browser (Ctrl+Shift+R) if the old one still shows.

**Favicon and social preview image.** These are generated in code (`src/app/icon.tsx`, `apple-icon.tsx` and
`opengraph-image.tsx`) from your initials and headline, so they stay in sync with `profile.ts`. To use your own social
preview image instead, delete `src/app/opengraph-image.tsx` and add a 1200×630 `src/app/opengraph-image.png`.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub and import the repository.
   Vercel detects Next.js automatically, so keep the default settings.
3. Click **Deploy**. You'll get a URL like `https://your-project.vercel.app`.
4. **Set your site URL** so SEO tags, the sitemap and robots.txt point at the right address. Either:
   - in Vercel: **Project → Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` with your URL
     (for example `https://kush-honkalse.vercel.app`, with no trailing slash), then redeploy; or
   - edit the fallback `siteUrl` in `src/data/profile.ts`.
5. Optional: add a custom domain under **Project → Settings → Domains**, then update `NEXT_PUBLIC_SITE_URL` to match.

Every push to the main branch redeploys automatically.

## Project structure

```text
src/
├── app/
│   ├── layout.tsx            # Fonts, SEO metadata, theme script
│   ├── page.tsx              # Assembles the sections
│   ├── globals.css           # Colour tokens (light/dark), base styles
│   ├── icon.tsx, apple-icon.tsx, opengraph-image.tsx
│   └── sitemap.ts, robots.ts
├── components/               # Hand-written components, one per section
│   ├── Nav.tsx, ThemeToggle.tsx, ThemeScript.tsx
│   ├── Hero.tsx, About.tsx, ExperienceTimeline.tsx
│   ├── Projects.tsx, ProjectCard.tsx, ProjectLinks.tsx
│   ├── SkillsGrid.tsx, Achievements.tsx, Contact.tsx, Footer.tsx
│   ├── Motion.tsx            # GSAP hero entrance and scroll reveals
│   └── Icons.tsx, Section.tsx, SocialLinks.tsx
└── data/
    └── profile.ts            # ← all content
```

## Design notes

- **Theme:** follows the system setting by default. The toggle saves the choice in `localStorage`, and a small inline
  script applies it before the first paint, so there is no flash of the wrong theme.
- **Colours:** defined once as CSS variables in `globals.css` (`:root` for light, `.dark` for dark). To change the
  accent colour, edit `--accent` (and its hover/soft variants) in both blocks, and keep text contrast at WCAG AA (4.5:1).
- **Motion:** GSAP animates elements marked `data-hero` (on load) and `data-reveal` (on scroll). With
  "reduce motion" turned on in the OS, or with JavaScript off, everything shows immediately with no animation.
  The hero name, headline and intro text are never hidden, so they show on first paint and keep page load fast.
- **Accessibility:** semantic landmarks, a skip link, visible focus rings, keyboard-operable menu and dialogs
  (Esc closes them and focus returns to where it was), and alt text on every image.
