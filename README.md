# Be Tuan Minh — Portfolio

Interactive portfolio for a Senior Backend / Distributed Systems engineer,
built with **Next.js (App Router) + Tailwind v4 + Motion + Three.js**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production static export into out/
npx tsc --noEmit # TypeScript verification
python3 -m http.server 3000 --directory out # serve the static export
```

For the workflow explorer checks (build with the Pages subpath first):

```bash
PAGES_BASE_PATH=/portfolio npm run build
node --test tests/system-explorer.test.cjs
```

The Node tests exercise the actual canvas lifecycle with a renderer test double,
graph integrity, public-content references and static-export links. They do not
replace a browser check of pixels, WebGL availability or CSS interactions.

## Update your content (the only file you normally touch)

All text on the site comes from a single source of truth:

```
content/resume.ts
```

Edit that file to change your name, intro, metrics, highlights, focus areas,
experience, projects, skills, education, and awards. Every section reads from
it, so you never need to touch the components.

When your CV changes:

1. Edit `content/resume.ts`.
2. Replace `public/BeTuanMinh_Resume.pdf` with your new PDF (keep the same
   filename, or update `cvFile` in `resume.ts` if you rename it) so the
   **Download CV** button serves the latest version.

### Add your links

In `content/resume.ts`, fill in `links.github` and `links.linkedin`. The social
icons in the contact section appear automatically once a link is set.

## Project structure

```
content/resume.ts        # ← your CV data (edit here)
app/
  layout.tsx             # fonts, metadata / SEO
  page.tsx               # section composition
  globals.css            # graphite surfaces and intentional category accents
components/
  nav, hero, impact, focus-areas, experience, projects,
  skills, education, contact, footer
  network-visual         # native workflow/step controls and accessible diagrams
  service-mesh-canvas    # lazy Three.js architecture board
  reveal                 # scroll-reveal motion wrapper
public/BeTuanMinh_Resume.pdf   # served by the Download CV button
```

## Design notes

- **Graphite theme, five-color accent palette** (cyan / coral / lime / orange / violet)
  defined in `lib/accents.ts`. Each metric, focus area, project, experience, and
  skill group carries an `accent` field in `content/resume.ts` that colors its
  icon / number / tag. The primary action color (buttons, links) is cyan via
  `--color-accent` in `app/globals.css`.
- **Icons** come from `@tabler/icons-react` (props: `stroke`, `size`, `className`).
- **Motion respects `prefers-reduced-motion`** and collapses to static.
- **Three.js is lazy-loaded**, DPR-capped, paused offscreen/in hidden tabs, and
  replaced by a static fallback for reduced-motion, save-data, or no WebGL.
- The hero explains SSO, ranking, and event-driven workflows with directed
  paths, named components and step-by-step descriptions. `content/system-stories.ts`
  shares the data between the SVG fallback, HTML controls and Three.js board.
  Career contributions are read directly from `resume.ts`; the walkthroughs are
  conceptual examples, not an employer's exact infrastructure.
- Native radio controls and CSS keep workflow and step selection usable without
  JavaScript. Keyboard users can select steps; pointer users can also inspect
  labeled models. Animation has an explicit pause/resume control.
- All content is visible in server-rendered HTML. Scroll reveals progressively
  enhance it after hydration; the mobile menu uses native `details` / `summary`.
- **Tech logos** load from Simple Icons (`cdn.simpleicons.org`) at runtime.

## Deploy

### GitHub Pages

This repository includes a Pages workflow at `.github/workflows/deploy-pages.yml`.
It builds the Next.js application as static HTML into `out/` and deploys that
artifact; GitHub Pages must **not** be configured to publish the repository root.

1. Push the project to GitHub. If your default branch is not `main`, change the
   branch in the workflow's `on.push.branches` setting.
2. Open **Settings → Pages → Build and deployment** in the GitHub repository.
3. Set **Source** to **GitHub Actions**. Do not choose “Deploy from a branch”.
4. Open the **Actions** tab and run **Deploy portfolio to GitHub Pages**, or push
   a commit to `main`.

The workflow automatically supplies the repository base path, so both
`username.github.io` repositories and project sites such as
`username.github.io/portfolio/` work without manual path changes.

### Other hosts

For Vercel, import the repository at [vercel.com/new](https://vercel.com/new).
The project is configured as a static export, so any static host can publish the
generated `out/` directory after running `npm run build`.
