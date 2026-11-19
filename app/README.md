# Fabien Poirier — Personal website

React, TypeScript, and CSS Modules portfolio. The entire site lives in `app/`.

## Contents

- [Stack](#stack)
- [Commands](#commands)
- [Structure](#structure)
- [Editing content](#editing-content)
- [Visit planner](#visit-planner)
- [Images and documents](#images-and-documents)
- [Medium and YouTube](#medium-and-youtube)
- [Knowledge graph](#knowledge-graph)
  - [Recommendation blocks](#recommendation-blocks)
  - [Generated files](#generated-files)
  - [Test viewer](#test-viewer)
- [Privacy](#privacy)
- [Deployment](#deployment)

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
npm run visit:check      # validate route invariants
npm run visit:test       # plan, offers and mode invariants
npm run visit:blind      # 20 control requests (routing regressions)
npm run visit:dataset    # synthetic routing dataset (504 offers)
npm run visit:report     # write app/.cache/visit/visit-questions.report.md
npm run embed:search     # rebuild the semantic search indexes
npm run knowledge:similarity # rebuild semantic neighbors
npm run knowledge:graph      # similarity + taxonomy + theme checks + graph JSON + report + /graph/ page
npm run knowledge:check      # validate taxonomy, graph and theme guardrails
npm run knowledge:taxonomy   # check taxonomy and write a coverage report
npm run knowledge:viewer     # generate the public /graph/ page (local)
npm run knowledge:viewer:prod # same page with portfolio prerender (production)
npm run knowledge:themes     # check expected theme attachments
npm run knowledge:refresh    # sync Medium + YouTube then rebuild the graph
npm run sync:medium          # update src/data/feeds/medium-posts.json
npm run sync:youtube         # update src/data/feeds/youtube-videos.json
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
│  ├─ fixtures/          # visit test datasets
│  ├─ graph-viewer/      # standalone /graph/ page sources
│  ├─ check-*.ts         # visit and knowledge checks
│  ├─ embed-search.ts    # semantic search indexes
│  ├─ export-knowledge-graph.ts
│  ├─ sync-medium.mjs
│  └─ sync-youtube.mjs
└─ src/
   ├─ boot-splash/      # diffusion loader shown before React mounts
   ├─ components/
   │  ├─ layout/         # Header, SectionTimeline, MobileMenu, Footer
   │  ├─ ui/             # reusable building blocks
   │  └─ sections/       # page sections
   ├─ data/              # structured content
   │  ├─ career/         # education, experience, skills
   │  ├─ content/        # projects, publications, teaching, awards
   │  ├─ feeds/          # generated Medium and YouTube JSON
   │  ├─ knowledge/      # taxonomy and semantic neighbors
   │  ├─ profile/        # profile, social links, languages
   │  ├─ search/         # generated embedding indexes
   │  ├─ site/           # navigation, SEO, site metadata
   │  └─ visit/          # visit personas and sections
   ├─ hooks/             # shared hooks
   ├─ i18n/              # providers, helpers, and locales
   ├─ lib/               # transversal, non-React utilities
   │  ├─ knowledge/      # knowledge graph engine
   │  ├─ search/         # lexical search, embeddings, vectors
   │  └─ visit/          # visit planner and evidence
   ├─ pages/             # page assembly
   ├─ search/            # semantic search provider and embeddings worker
   ├─ styles/            # tokens, reset, global, fonts
   ├─ theme/             # theme provider and helpers
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
- **Experience / education**: `src/data/career/experience.data.ts`, `education.data.ts`.
- **Projects**: `src/data/content/projects.data.ts` (public GitHub repositories and Kaggle notebooks; notebooks use `category: 'notebook'` and a Kaggle `extraLinks` entry).
- **Skills**: `src/data/career/skills.data.ts`.
- **Publications**: `src/data/content/publications.data.ts`.
- **Public essentials**: `src/data/content/publication-summaries.data.ts` (context, problem and proposed solution plus keywords per scientific publication, in FR / EN / ES; they follow the FR / EN version toggled on each card, and Medium posts are excluded).
- **Abstracts**: each `PublicationVersion` in `src/data/content/publications.data.ts` carries its original abstract (FR / EN), shown in the "Abstract" tab of the card.
- **Teaching**: `src/data/content/teaching.data.ts`.
- **Awards / achievements**: `src/data/content/awards.data.ts`.
- **Supervisions**: `src/data/content/supervisions.data.ts` (4 supervisions shown in the Teaching tab).
- **Passions / badges**: `src/data/content/about.data.ts`.
- **Social links**: `src/data/profile/socials.data.ts` and `src/data/profile/profile.data.ts` (personal Medium in `socials`, Override community Medium in `community`).
- **Availability**: `src/data/profile/profile.data.ts`. `availability.status` accepts `available`, `unavailable` or `hidden`; the About tag next to the location follows it, and the visit planner uses the matching localized text.

## Visit planner

The header search opens a client-side visit planner: a recruiter describes a
role, a technology or a need and gets an ordered route through the profile with
concrete items to open.

- **Ranking.** A MiniSearch index (IDF/BM25, stop words, FR/EN/ES stemmers)
  matches exact stems, so `AWS` does not match `award`. Every item is indexed and
  each section has a descriptor built from its own labels and tags; a descriptor
  can name a section but never becomes evidence. A second pass checks theme and
  concept coherence against the knowledge graph. No backend, no model download;
  the separate semantic search is not used here.
- **Profiles and modes.** `visit-personas.data.ts` defines four visible profiles
  (Data & AI, Industry, Research, Teaching), each with its own section order and
  domain themes. A profile and a query are exclusive; a query runs with the
  generalist profile. *Essential* keeps at most four content sections with two to
  five items, and opens contextual sections (teaching, publications, videos,
  awards) only when named. *Full* keeps the same route, fills each section up to
  ten items and adds every contextual section with a real match. Industry skips
  teaching, videos and awards; Research skips teaching and keeps research
  projects and awards; Teaching keeps courses first, pedagogical videos, teaching
  awards, one `Tutorat` supervision and excludes `Responsable de stage` roles.
- **Verdict.** A colored banner shows a strong (green), partial (amber) or weak
  (red) match, with up to three evidence pills and two gaps. It uses only items
  above the score and graph thresholds in `src/lib/visit/visit.config.ts`. A weak
  request shows no steps and invites the visitor to reformulate. A named section
  without a precise item is complementary; with no content at all it becomes a
  gap. Availability keeps About and the timeline, plus any named section.
- **Evidence.** Items are ranked by theme and query match, recency, usage traces
  and skill tenure, never by source order. Descriptors give the broad vocabulary;
  precise terms such as `churn` or `RAG` come from the real content. Teaching-only
  offers fill missing evidence from skills before the timeline. Skill
  `conceptIds` expand generic terms (visualisation to Matplotlib/Seaborn, MLOps
  to Docker, MLflow and API REST).
- **Guided visit.** The palette starts a step-by-step tour over items tagged with
  `data-visit-target`, with a right-side drawer (or a mobile bottom bar), a
  spotlight and a reveal event that resets filters before scrolling. Every
  non-empty route ends with a Contact step targeting the About social links
  (LinkedIn, GitHub, Medium, Kaggle, YouTube). Open the planner with the gold
  invitation under the header, `Ctrl/Cmd+K`, `/`, or a deep link such as
  `/#visit=NLP`.

Files: `src/data/visit/`, `src/lib/visit/` (`search/`, `plan/`, `evidence/`,
config and graph), `src/lib/skill-tenure.ts`,
`src/hooks/sections/useVisitReveal.ts` and `src/components/ui/VisitSearch/`.
Fixtures live in `scripts/fixtures/`; the visit checks share
`scripts/visit-check.shared.ts`.

Commands: `visit:check` (route invariants), `visit:test` (plan, 17 offers in
FR / EN / ES, modes), `visit:blind` (20 control requests), `visit:dataset` (504
synthetic offers) and `visit:report` (writes
`app/.cache/visit/visit-questions.report.md`).

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

- `scripts/sync-medium.mjs` reads `https://medium.com/feed/@fab.16`, generates `src/data/feeds/medium-posts.json`, and filters posts by the active language.
- `scripts/sync-youtube.mjs` reads the channel feed and generates `src/data/feeds/youtube-videos.json`.
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
- **explicit links** - context links (`educationIds` / `experienceIds` /
  `projectIds` on projects and skills), direct skill matches and declared skill
  concepts (`conceptIds`) complete or prioritize the semantic results.

Themes and technologies remain useful for graph pivots and human-readable
reasons, but they no longer decide whether a content is recommended. Declared
skill concepts create the graph edges and feed the visit lexical expansion;
they are excluded from visit coherence, which stays based on detected mentions.

- Engine, all in `src/lib/knowledge/`: `knowledge.config.ts`,
  `knowledge-index.ts` (cache and graph access), `knowledge-recommendations.ts`
  (public recommendation API), `knowledge-raw-data.ts`, `knowledge-extract.ts`,
  `knowledge-entities.ts`, `knowledge-nodes.ts`, `knowledge-concepts.ts`,
  `knowledge-labels.ts`, `knowledge-structural-tags.ts`, `knowledge-projects.ts`,
  `knowledge-normalize.ts`, `knowledge-matching.ts`, `knowledge-graph.ts`,
  `knowledge-similarity.ts`, `knowledge-rank.ts`, `knowledge-context.ts`,
  `knowledge-fallback.ts`, `knowledge-signals.ts` and `knowledge-sort.ts`.
- Taxonomy, in `src/data/knowledge/`: `knowledge-taxonomy.data.ts` - 15 themes,
  skill concepts generated from `src/data/career/skills.data.ts` (including the
  concepts each skill declares in `conceptIds`), domain-level concepts attached
  to `knowledge-domains.data.ts` (including explicit relations through
  `related`, for example LLM ↔ RAG), and manual aliases or cross-cutting
  concepts in `knowledge-concept-overrides.data.ts`; `knowledge-graph.ts` turns
  each `related` declaration into a `related` edge between the two concept
  nodes. `npm run knowledge:taxonomy` writes
  `.cache/knowledge/knowledge-taxonomy.report.md` with unused concepts, unknown
  tags and unused theme terms.
- Semantic index: `src/data/knowledge/knowledge-similarity.json` — committed neighbors for
  every content, generated by `npm run knowledge:similarity`.
- Types: `src/types/knowledge.types.ts`.

```ts
import { getSimilarProjects } from '@/lib/knowledge/knowledge-recommendations';

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
Projects and skills declare their context with `educationIds` / `experienceIds`
/ `projectIds`; the graph creates explicit `context` edges, while experiences
keep their single `educationId`. The graph is built once, on first import, and
memoised.

### Recommendation blocks

The same engine feeds three blocks, with different filters:

| Block | Source | Accepted kinds | Limit |
| --- | --- | --- | --- |
| "Voir aussi" (`RelatedProjects`) | project | projects only | 3 |
| "Contenus liés" (`RelatedContent`) | project | everything except projects | 6 |
| "Réalisations liées" (`RelatedContent`) | skill | all kinds, weighted | 6 |

Candidates are merged in priority order — explicit context links, semantic
neighbors, direct skill matches, reciprocal projects, then a theme/concept
fallback — deduplicated, sorted by score then year, and cut at the limit. For a
skill source, direct technology matches are merged before semantic neighbors and
projects are sorted first.
Thresholds and weights live in `src/lib/knowledge/knowledge.config.ts`; do not repeat them
here, they move.

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
- `html/` — head, icons, header and workspace partials.
- `styles/` — CSS split by responsibility (base, tokens, fonts, header, filters, search, stage, layout, panel, responsive).
- `scripts/` — JavaScript split by responsibility (constants, data, state, helpers, i18n, theme-init, cluster-layout, layout, cluster-render, render, simulation, interactions, panel, filters, preferences, startup).

`export-knowledge-graph.ts` concatenates these partials and injects the graph
data into the standalone viewer.

Every export writes `public/graph/index.html`, the `/graph/` page linked from
the site header (noindex, nofollow). The deployment workflow regenerates it with
`npm run knowledge:viewer:prod` before the build, which adds the portfolio
prerender; it is git-ignored. The local commands omit the prerender so Vite HMR
and the browser back/forward cache do not produce WebSocket warnings during
development.

`src/data/knowledge/knowledge-similarity.json` is committed so the site and the viewer work
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

- Filter by content kind, search a title and toggle technical concepts.
- Layout switch in the header: `Réseau` (default), `Sections` (one cluster per
  content kind) and `Thèmes` (one cluster per most specific theme, `Autres` for
  unthemed content). Cluster modes hide links and freeze the simulation; each
  cluster title stays above its halo. `Concepts` and `Relâcher` sit with the
  view tools and only appear in `Réseau`. On phones, the view modes collapse
  into a `Vue` menu while the other tools stay visible. Clicking a node still
  opens its panel. The choice is stored locally and can be overridden with
  `?mode=network|sections|themes`.
- Node names stay visible with the same zoom-based decluttering; relation
  details and reasons live in the side panel.
- In a theme panel, see the linked skills/technologies and filter its attached contents by content kind.
- Tap or click a node to see its themes, technologies and "see also" recommendations.
- Drag a node to pin it, double-click to release it; wheel or pinch to zoom. On
  phones, the `+` / `−` buttons zoom, filters start collapsed, and the detail
  sheet opens full height over the graph.
- "Ouvrir la section du site" opens the target card in the same tab through
  `/?target=<kind>-<sourceId>#<section>`. The site reveals the section filters,
  switches to the Medium tab for `article-...` targets, then scrolls to the card.
  The base URL follows the viewer origin in dev and production, and falls back
  to `https://fab16bsb.github.io/` when the HTML file is opened directly.
- Deep link: `/graph/?select=project:these`, optionally with `&concepts=1` or
  `&mode=sections|themes`; use
  `public/graph/index.html?select=project:these` when opening the file directly.

Tune detection in `knowledge-taxonomy.data.ts` (themes, aliases) and scoring in
`src/lib/knowledge/knowledge.config.ts` (weights, thresholds and suggestion weights).

## Privacy

- No CV is present in the repository.
- No email or phone number is published on the site. Contact goes through social links (LinkedIn, GitHub, Medium, Kaggle, YouTube).
- The Contact section has been removed: the site is a personal presentation, not a commercial page.
- The thesis is linked to HAL; the EGC poster is hosted in `public/documents`.

## Deployment

The site is published to GitHub Pages via GitHub Actions:

- workflow: `.github/workflows/deploy.yml`;
- Pages source: **GitHub Actions** (Settings → Pages → Build and deployment → Source);
- published artifact: `app/dist`;
- URL: `https://fab16bsb.github.io/`;
- `base: '/'` in `vite.config.ts`, correct for a user site served at the root.

The workflow triggers on changes to `app/**` or the workflow itself, runs every day at 04:00 UTC, and can be started manually (`workflow_dispatch`). It runs `npm ci`, the Medium/YouTube syncs, `embed:search`, `knowledge:similarity` and `knowledge:check`, regenerates the `/graph/` page with `knowledge:viewer:prod`, builds the site, then publishes the artifact. The embedding and similarity steps are non-blocking and keep the committed indexes on failure.

The site is a single page with anchors (`/#about`, `/#timeline`, `/#skills`, etc.): no SPA rewrite rule is needed.
