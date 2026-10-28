# Fabien Poirier — Personal website

React, TypeScript, and CSS Modules portfolio. The entire site lives in `app/`.

## Stack

- React 19 + TypeScript + Vite
- CSS Modules + CSS variables
- Light / dark theme with persistence
- FR / EN / ES
- No backend
- Medium and YouTube synced from their RSS feeds
- Static deployment on GitHub Pages

## Commands

```bash
cd app
npm install
npm run dev              # local server
npm run build            # typecheck + build into app/dist
npm run preview          # preview the build
npm run typecheck        # TypeScript check
npm run sync:medium      # update src/data/medium-posts.json
npm run sync:youtube     # update src/data/youtube-videos.json
```

## Structure

```txt
app/
├─ public/               # final files served as-is
│  ├─ images/            # final WebP / JPG / SVG assets
│  ├─ fonts/             # Inter + Space Grotesk
│  ├─ documents/         # EGC poster
│  └─ .nojekyll
├─ scripts/
│  ├─ sync-medium.mjs
│  └─ sync-youtube.mjs
└─ src/
   ├─ components/
   │  ├─ layout/         # Header, MobileMenu, Footer, SectionBar
   │  ├─ ui/             # reusable building blocks
   │  └─ sections/       # page sections
   ├─ data/              # structured content
   ├─ hooks/             # shared hooks
   ├─ i18n/              # providers, helpers, and locales
   ├─ styles/            # tokens, reset, global, fonts
   ├─ theme/             # theme provider and helpers
   ├─ pages/             # page assembly
   └─ types/             # shared types
```

Convention for important components:

```txt
Component/
├─ Component.tsx
├─ Component.module.css
├─ component.helpers.ts
└─ useComponent.ts
```

Helper and hook files are only created when they make sense.

## Editing content

- **UI text**: `src/i18n/locales/fr.json`, `en.json`, `es.json`.
- **Experience / education**: `src/data/experience.data.ts`, `education.data.ts`.
- **Projects**: `src/data/projects.data.ts` (public GitHub repositories only).
- **Skills**: `src/data/skills.data.ts`.
- **Publications**: `src/data/publications.data.ts`.
- **Teaching**: `src/data/teaching.data.ts`.
- **Awards / achievements**: `src/data/awards.data.ts`.
- **Supervisions**: `src/data/supervisions.data.ts` (4 supervisions shown in the Teaching tab).
- **Passions / badges**: `src/data/about.data.ts`.
- **Social links**: `src/data/socials.data.ts` and `src/data/profile.data.ts` (personal Medium in `socials`, Override community Medium in `community`).

## Images and documents

Images live only in `public/images/` and are final assets: WebP or JPG for
photos, SVG for icons, with transparency where needed.

- `profil/`: profile portrait and `og-image.jpg`
- `passions/`: passion illustrations
- `projects/`: project visuals
- `skills/`: skill icons
- `soft-skills/`: soft-skill badges in FR / EN / ES

There is no `source/` folder and no build-time image optimization. To add or
replace an image:

1. Export the final asset in the right format and size.
2. Put it in `public/images/<section>/`.
3. Reference `/images/...` in `src/data/`.

Keep a single copy: no duplicated images in `src/assets/` or elsewhere.

## Medium and YouTube

- `scripts/sync-medium.mjs` reads `https://medium.com/feed/@fab.16`, generates `src/data/medium-posts.json`, and filters posts by the active language.
- `scripts/sync-youtube.mjs` reads the channel feed and generates `src/data/youtube-videos.json`.
- If the network request fails, the existing JSON files are kept.

Both scripts run in the deployment workflow before the build. They can also be run manually.

## Privacy

- No CV is present in the repository.
- No email or phone number is published on the site. Contact goes through social links (LinkedIn, GitHub, Medium, Kaggle).
- The Contact section has been removed: the site is a personal presentation, not a commercial page.
- The thesis is linked to HAL; the EGC poster is hosted in `public/documents`.

## Deployment

The site is published to GitHub Pages via GitHub Actions:

- workflow: `.github/workflows/deploy.yml`;
- Pages source: **GitHub Actions** (Settings → Pages → Build and deployment → Source);
- published artifact: `app/dist`;
- URL: `https://fab16bsb.github.io/`;
- `base: '/'` in `vite.config.ts`, correct for a user site served at the root.

The workflow triggers on changes to `app/**` or the workflow itself, runs every day at 04:00 UTC, and can be started manually (`workflow_dispatch`). It runs `npm ci`, the Medium/YouTube syncs, the build, then publishes the artifact.

The site is a single page with anchors (`/#about`, `/#timeline`, `/#skills`, etc.): no SPA rewrite rule is needed.
