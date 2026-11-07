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
npm run knowledge:similarity # rebuild semantic neighbors
npm run knowledge:graph      # similarity + taxonomy + graph JSON + report + /graph/ page
npm run knowledge:check      # validate taxonomy, graph and theme guardrails
npm run knowledge:taxonomy   # check taxonomy and write a coverage report
npm run knowledge:viewer     # generate the public /graph/ page (local)
npm run knowledge:viewer:prod # same page with portfolio prerender (production)
npm run knowledge:themes     # check expected theme attachments
npm run knowledge:refresh    # sync Medium + YouTube then rebuild the graph
npm run sync:medium          # update src/data/medium-posts.json
npm run sync:youtube         # update src/data/youtube-videos.json
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
   ├─ boot-splash/      # diffusion loader shown before React mounts
   ├─ components/
   │  ├─ layout/         # Header, MobileMenu, Footer, SectionBar
   │  ├─ ui/             # reusable building blocks
   │  └─ sections/       # page sections
   ├─ data/              # structured content
   ├─ hooks/             # shared hooks
   ├─ i18n/              # providers, helpers, and locales
   ├─ lib/               # transversal, non-React utilities
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
- **Public essentials**: `src/data/publication-summaries.data.ts` (context, problem and proposed solution plus keywords per scientific publication, in FR / EN / ES; they follow the FR / EN version toggled on each card, and Medium posts are excluded).
- **Abstracts**: each `PublicationVersion` in `src/data/publications.data.ts` carries its original abstract (FR / EN), shown in the "Abstract" tab of the card.
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

## Knowledge graph

A client-side knowledge graph links every content source: projects, scientific
publications, Medium articles, skills, teaching, experience, education, awards,
supervisions and videos. It powers the related-content blocks in the project
modal and skill details, and requires no backend.

Ranking is semantic-first:

- **precomputed semantic neighbors** — the same multilingual e5 model as the
  search encodes all contents in FR / EN / ES, then only the best neighbors are
  stored. No model is loaded in the browser for recommendations;
- **explicit links** — context links (`educationIds` / `experienceIds` on
  projects and skills), direct skill matches and the suggestion-weight matrix
  complete or prioritize the semantic results.

Themes and technologies remain useful for graph pivots and human-readable
reasons, but they no longer decide whether a content is recommended.

- Engine: `src/lib/knowledge-index.ts` (cache and graph access),
  `knowledge-recommendations.ts` (public recommendation API),
  `knowledge-signals.ts`, `knowledge-context.ts`, `knowledge-fallback.ts`,
  `knowledge-extract.ts`, `knowledge-graph.ts`, `knowledge-rank.ts`,
  `knowledge-similarity.ts`, `knowledge-normalize.ts` and `knowledge.config.ts`.
- Taxonomy: `src/data/knowledge-taxonomy.data.ts` - 15 themes, skill concepts
  generated from `skills.data.ts`, domain-level concepts attached to
  `knowledge-domains.data.ts`, and manual aliases in
  `knowledge-concept-overrides.data.ts`. `npm run knowledge:taxonomy` writes
  `.cache/knowledge/knowledge-taxonomy.report.md` with unused concepts, unknown
  tags and unused theme terms.
- Semantic index: `src/data/knowledge-similarity.json` — committed neighbors for
  every content, generated by `npm run knowledge:similarity`.
- Types: `src/types/knowledge.types.ts`.

```ts
import { getSimilarProjects } from '@/lib/knowledge-recommendations';

const projects = getSimilarProjects('these'); // semantically close projects
```

Each recommendation carries its score, shared themes, shared technologies, a
`samePeriod` flag and a `context` flag for explicit formation/experience links.
Skills also receive direct links to the projects, publications, courses and jobs
that list their technology, even when the semantic score is low. Suggestion
eligibility is configured by `KNOWLEDGE_SUGGESTION_WEIGHTS`: a weight of 0
excludes a target kind, and a missing entry uses
`KNOWLEDGE_SUGGESTION_DEFAULT_WEIGHT`. This is how projects avoid recommending
skills and formations while experiences remain, and how skills recommend
projects, formations and experiences.
Projects and skills declare their context with `educationIds` / `experienceIds`;
the graph creates explicit `context` edges, while experiences keep their single
`educationId`. The graph is built once, on first import, and memoised.

### Generated files

`npm run knowledge:graph` writes git-ignored files under `app/.cache/knowledge/`:

- `knowledge-graph.json` — nodes, edges and precomputed recommendations.
- `knowledge-graph.md` — human-readable report per project and per theme.
- `knowledge-taxonomy.report.md` — taxonomy coverage report.

The standalone viewer is written only once, to `app/public/graph/index.html`
(the `/graph/` page). It is self-contained: open it directly in a browser, or run
`npm run dev` and visit `/graph/`.

The viewer source lives in `scripts/graph-viewer/`:

- `template.html` — skeleton with placeholders.
- `html/` — head, header and workspace partials.
- `styles/` — CSS split by responsibility (tokens, header, filters, stage, panel, responsive).
- `scripts/` — JavaScript split by responsibility (data, state, layout, render, panel, filters, preferences, startup).

`export-knowledge-graph.ts` concatenates these partials and injects the graph
data into the standalone viewer.

Every export writes `public/graph/index.html`, the `/graph/` page linked from
the site header (noindex, nofollow). The deployment workflow regenerates it with
`npm run knowledge:viewer:prod` before the build, which adds the portfolio
prerender; it is git-ignored. The local commands omit the prerender so Vite HMR
and the browser back/forward cache do not produce WebSocket warnings during
development.

`src/data/knowledge-similarity.json` is committed so the site and the viewer work
without re-running the model. Regenerate it after any content change:

```bash
npm run knowledge:similarity   # model already cached in app/.cache/transformers
```

`npm run knowledge:check` validates the taxonomy, rebuilds the graph in memory,
checks the theme guardrails, and fails on inconsistent recommendations: orphan
edge, self-recommendation, non-deterministic build, or **any node without a
single connection**. It also warns when the semantic index is absent, stale or
computed with another model, and when a project has no close project (the block
then shows a fallback message). The taxonomy report lists unused concepts,
unknown tags and unused theme terms. The deployment workflow runs the similarity
build, then the check, after the Medium and YouTube syncs. A content without a
theme stays unthemed; it remains connected through its concepts or its best
semantic neighbors.

### Test viewer

Open `app/public/graph/index.html` directly in a browser: data is embedded, so
no server is needed. The same page is served at `/graph/` in development and
production.

The deployment also publishes the `/graph/` page from
`public/graph/index.html`, linked from the header graph icon and the mobile menu.
It opens in the same tab and keeps the portfolio theme and language. Its header
mirrors the portfolio: identity on the left, view links in the centre, language,
theme and a “Portfolio” button on the right. Search and filters sit in a bar
below, and the search stays visible when filters are collapsed. It carries
`noindex,nofollow` and stays out of search engines.

- Filter by content kind, search a title, toggle technical concepts and labels.
- In a theme panel, see the linked skills/technologies and filter its attached contents by content kind.
- Click a node to see its themes, technologies and “see also” recommendations.
- Drag a node to pin it, double-click to release it; wheel to zoom.
- Deep link: `/graph/?select=project:these`, optionally with `&concepts=1`; use
  `public/graph/index.html?select=project:these` when opening the file directly.

Tune detection in `knowledge-taxonomy.data.ts` (themes, aliases) and scoring in
`src/lib/knowledge.config.ts` (weights, thresholds and suggestion weights).

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
