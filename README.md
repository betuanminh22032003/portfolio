# Be Tuan Minh — Portfolio

Dark-tech portfolio for a Backend / Distributed Systems engineer, built with
**Next.js (App Router) + Tailwind v4 + Motion**. Design discipline enforced by
the [taste-skill](https://www.tasteskill.dev/) anti-slop framework
(`.agents/skills/`).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

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
  globals.css            # design tokens (dark-tech, emerald accent)
components/
  nav, hero, impact, focus-areas, experience, projects,
  skills, education, contact, footer
  architecture-diagram   # the CQRS / event-driven hero visual
  reveal                 # scroll-reveal motion wrapper
public/BeTuanMinh_Resume.pdf   # served by the Download CV button
```

## Design notes

- **Dark theme, five-color accent palette** (cyan / pink / lime / orange / violet)
  defined in `lib/accents.ts`. Each metric, focus area, project, experience, and
  skill group carries an `accent` field in `content/resume.ts` that colors its
  icon / number / tag. The primary action color (buttons, links) is cyan via
  `--color-accent` in `app/globals.css`.
- **Icons** come from `@tabler/icons-react` (props: `stroke`, `size`, `className`).
- **Motion respects `prefers-reduced-motion`** and collapses to static.
- **Tech logos** load from Simple Icons (`cdn.simpleicons.org`) at runtime.

## Deploy

Easiest path is **Vercel**: push this folder to a Git repo, import it on
[vercel.com/new](https://vercel.com/new), and it deploys with zero config.
Any Node host that runs `npm run build && npm start` also works.
