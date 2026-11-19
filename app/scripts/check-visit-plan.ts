/**
 * Contrôle du parcours de visite : invariants de routage.
 *
 * Vérifie l'ouverture par la présentation, l'unicité des étapes, les durées,
 * l'ordre des profils, le filtrage des contenus et la parité FR / EN / ES.
 *
 * Lancement : npm run visit:check
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import assert from 'node:assert/strict';
import { visitSections } from '../src/data/visit/visit-sections.data';
import { appendContactStop } from '../src/lib/visit/plan/visit-plan.contact';
import { selectRankedSections } from '../src/lib/visit/search/routing/visit-search-routing.selection';
import {
  isVisitTarget,
  knowledgeTarget,
  visitTarget,
} from '../src/lib/visit/visit-targets';
import { buildCheckPlan, LOCALES } from './visit-check.shared';
import type { VisitSearchSection } from '../src/types/visit-search.types';
import type {
  VisitPlan,
  VisitSectionId,
} from '../src/types/visit.types';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Vérifie les règles communes à tous les parcours.
 *
 * @param name - Nom du scénario.
 * @param plan - Parcours à contrôler.
 */
function checkPlan(name: string, plan: VisitPlan): void {
  const ids = plan.stops.map((stop) => stop.id);
  const anchors = plan.stops.map((stop) => stop.anchor);
  const duration = plan.stops.reduce(
    (total, stop) => total + stop.duration,
    0,
  );

  assert.equal(
    plan.stops[0]?.id,
    'about',
    `${name} : la présentation ouvre le parcours`,
  );
  assert.equal(
    new Set(ids).size,
    ids.length,
    `${name} : aucune étape en double`,
  );
  assert.equal(
    new Set(anchors).size,
    anchors.length,
    `${name} : aucune ancre en double`,
  );
  assert.equal(plan.duration, duration, `${name} : durée cohérente`);
  assert.ok(plan.stops.length > 0, `${name} : au moins une étape`);

  for (const stop of plan.stops) {
    assert.ok(
      stop.anchor.startsWith('#'),
      `${name} : ancre valide pour ${stop.id}`,
    );
    assert.ok(
      stop.duration > 0,
      `${name} : durée positive pour ${stop.id}`,
    );
    assert.ok(
      stop.labelKey.length > 0,
      `${name} : libellé présent pour ${stop.id}`,
    );
  }

  const knownIds = new Set(visitSections.map((section) => section.id));
  assert.ok(
    ids.every((id) => knownIds.has(id)),
    `${name} : toutes les étapes existent`,
  );
}

/* =========================================================================
  SCÉNARIOS
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   PARCOURS PAR DÉFAUT
   ───────────────────────────────────────────────────────────────────────── */

const defaultExpress = buildCheckPlan('', 'general', 'express', 'fr');
checkPlan('express par défaut', defaultExpress);
assert.equal(
  defaultExpress.stops.length,
  5,
  'express par défaut : cinq étapes',
);
assert.equal(
  defaultExpress.stops[1]?.id,
  'timeline',
  'express par défaut : parcours puis projets',
);

const defaultFull = buildCheckPlan('', 'general', 'full', 'fr');
checkPlan('complet par défaut', defaultFull);
assert.equal(defaultFull.stops.length, 8, 'complet par défaut : huit étapes');

const rag = buildCheckPlan('RAG', 'general', 'express', 'fr');
checkPlan('RAG', rag);
assert.ok(
  rag.stops.some((stop) => stop.id === 'timeline'),
  'RAG : parcours retenu',
);
assert.ok(
  rag.stops.some((stop) => stop.id === 'skills'),
  'RAG : compétences retenues',
);

const chatbot = buildCheckPlan('chatbot', 'general', 'express', 'fr');
checkPlan('chatbot', chatbot);
assert.ok(
  chatbot.stops.some((stop) => stop.id === 'skills'),
  'chatbot : compétences LLM retenues',
);
assert.ok(
  chatbot.stops
    .flatMap((stop) => stop.highlights)
    .some((highlight) => highlight.skillId === 'langchain'),
  'chatbot : LangChain retenu',
);

const vectorStore = buildCheckPlan(
  'base vectorielle',
  'general',
  'express',
  'fr',
);
checkPlan('base vectorielle', vectorStore);
assert.ok(
  vectorStore.stops
    .flatMap((stop) => stop.highlights)
    .some((highlight) => highlight.skillId === 'chromadb'),
  'base vectorielle : ChromaDB retenu',
);

const programming = buildCheckPlan(
  'programmation',
  'general',
  'express',
  'fr',
);
checkPlan('programmation', programming);
assert.ok(
  programming.stops.some((stop) => stop.id === 'skills'),
  'programmation : compétences retenues',
);
assert.ok(
  programming.stops
    .flatMap((stop) => stop.highlights)
    .some((highlight) => highlight.skillId === 'python'),
  'programmation : Python retenu',
);

const oop = buildCheckPlan(
  'programmation orientée objet',
  'general',
  'express',
  'fr',
);
checkPlan('programmation orientée objet', oop);
assert.ok(
  oop.stops
    .flatMap((stop) => stop.highlights)
    .some((highlight) => highlight.skillId === 'poo'),
  'programmation orientée objet : POO retenue',
);

const softwareEngineering = buildCheckPlan(
  'génie logiciel',
  'general',
  'express',
  'fr',
);
checkPlan('génie logiciel', softwareEngineering);
assert.ok(
  softwareEngineering.stops
    .flatMap((stop) => stop.highlights)
    .some((highlight) => highlight.skillId === 'uml'),
  'génie logiciel : UML retenu',
);

const nlp = buildCheckPlan('NLP', 'general', 'express', 'fr');
checkPlan('NLP', nlp);
assert.ok(
  nlp.stops.some((stop) => stop.id === 'projects'),
  'NLP : projets retenus',
);
assert.ok(
  nlp.stops.some((stop) => stop.id === 'skills'),
  'NLP : compétences retenues',
);
assert.ok(
  !nlp.stops.some((stop) => stop.id === 'publications'),
  'NLP : pas de publication sans preuve',
);

const industry = buildCheckPlan(
  'expérience industrielle',
  'general',
  'full',
  'fr',
);
checkPlan('expérience industrielle', industry);
assert.equal(
  industry.stops[1]?.id,
  'timeline',
  'industrie : parcours en deuxième',
);

/* ─────────────────────────────────────────────────────────────────────────
   ORDRE DES PROFILS
   ───────────────────────────────────────────────────────────────────────── */

// Le profil ne définit que l'ordre des sections : parcours par défaut.
const dataExpress = buildCheckPlan('', 'data', 'express', 'fr');
assert.deepEqual(
  dataExpress.stops.map((stop) => stop.id),
  ['about', 'projects', 'skills', 'publications', 'timeline'],
  'data : ordre du profil en essentiel',
);

const dataFull = buildCheckPlan('', 'data', 'full', 'fr');
assert.deepEqual(
  dataFull.stops.map((stop) => stop.id),
  ['about', 'projects', 'skills', 'publications', 'timeline', 'teaching'],
  'data : parcours approfondi',
);

const industryFull = buildCheckPlan('', 'industry', 'full', 'fr');
assert.deepEqual(
  industryFull.stops.map((stop) => stop.id),
  ['about', 'projects', 'skills', 'timeline'],
  'industrie : pas d’enseignement, de vidéos ni de palmarès',
);

const researchExpress = buildCheckPlan('', 'research', 'express', 'fr');
assert.deepEqual(
  researchExpress.stops.map((stop) => stop.id),
  ['about', 'publications', 'projects', 'awards', 'timeline'],
  'recherche : publications en tête et palmarès avant parcours',
);

const teachingExpress = buildCheckPlan('', 'teaching', 'express', 'fr');
assert.deepEqual(
  teachingExpress.stops.map((stop) => stop.id),
  ['about', 'teaching', 'videos', 'awards', 'timeline'],
  'enseignement : cours, vidéos, distinctions et parcours en essentiel',
);
const teachingExpressTargets = teachingExpress.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  teachingExpressTargets.some((target) => target?.startsWith('course-')),
  'enseignement : un cours retenu en essentiel',
);
assert.ok(
  teachingExpressTargets.includes('supervision-stages-tutorat-iut') ||
    teachingExpressTargets.includes('supervision-alternance-aeroport'),
  'enseignement : un tutorat retenu en essentiel',
);
assert.ok(
  teachingExpressTargets.includes('experience-ater-paris8'),
  'enseignement : ATER retenu en essentiel',
);
assert.ok(
  !teachingExpressTargets.includes('supervision-stage-liasd'),
  'enseignement : responsable de stage écarté en essentiel',
);

/* ─────────────────────────────────────────────────────────────────────────
   FILTRAGE DES CONTENUS
   ───────────────────────────────────────────────────────────────────────── */

// Les thèmes du profil filtrent réellement les contenus.
const dataTargets = dataExpress.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  dataTargets.includes('project-kaggle-auto-mpg'),
  'data : projet IA retenu',
);
assert.ok(
  !dataTargets.includes('project-scheduler-finder'),
  'data : projet non IA écarté',
);
assert.ok(
  dataTargets.includes('skill-python'),
  'data : Python conservé',
);

const dataFullTargets = dataFull.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  dataFullTargets.includes('education-master'),
  'data : formation retenue en complet',
);
assert.ok(
  !dataFullTargets.includes('education-licence') &&
    !dataFullTargets.includes('education-dut'),
  'data : diplômes hors domaine écartés',
);

const industryTargets = industryFull.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  industryTargets.includes('skill-docker') &&
    industryTargets.includes('skill-mlflow'),
  'industrie : compétences de déploiement retenues',
);
assert.ok(
  !industryTargets.includes('education-phd'),
  'industrie : doctorat écarté',
);
assert.ok(
  industryTargets.includes('education-dut') &&
    industryTargets.includes('education-licence'),
  'industrie : diplômes techniques retenus',
);

const researchTargets = researchExpress.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  researchTargets.includes('education-phd') ||
    researchTargets.includes('experience-these'),
  'recherche : thèse ou doctorat retenu',
);
assert.ok(
  !researchTargets.includes('experience-freelance-leasup'),
  'recherche : freelance écarté en essentiel',
);

const researchFull = buildCheckPlan('', 'research', 'full', 'fr');
const researchFullTargets = researchFull.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  !researchFull.stops.some((stop) => stop.id === 'teaching'),
  'recherche : pas d’enseignement',
);
assert.ok(
  researchFull.stops.some((stop) => stop.id === 'awards'),
  'recherche : palmarès retenu en complet',
);
assert.ok(
  researchFullTargets.includes('award-egc-2022'),
  'recherche : prix EGC retenu',
);
assert.ok(
  !researchFullTargets.includes('award-forum-metiers') &&
    !researchFullTargets.includes('award-co-responsable-alternance'),
  'recherche : distinctions non scientifiques écartées',
);
assert.ok(
  !researchFullTargets.includes('education-licence') &&
    !researchFullTargets.includes('education-dut'),
  'recherche : diplômes hors domaine écartés',
);
assert.ok(
  researchFullTargets.includes('education-master'),
  'recherche : master retenu',
);
assert.ok(
  researchFullTargets.includes('experience-ater-paris8') &&
    researchFullTargets.includes('experience-freelance-leasup'),
  'recherche : expériences NLP conservées',
);
assert.ok(
  !researchFullTargets.includes('experience-stage-quatorze'),
  'recherche : stage non research écarté',
);
const researchProjects = researchFull.stops
  .find((stop) => stop.id === 'projects')
  ?.highlights.map((highlight) => highlight.target);
assert.deepEqual(
  researchProjects,
  ['project-these'],
  'recherche : seul le projet de recherche est retenu',
);

const teachingFull = buildCheckPlan('', 'teaching', 'full', 'fr');
const teachingFullTargets = teachingFull.stops.flatMap((stop) =>
  stop.highlights.map((highlight) => highlight.target),
);
assert.ok(
  teachingFull.stops.some((stop) => stop.id === 'videos'),
  'enseignement : vidéos retenues en complet',
);
assert.ok(
  teachingFullTargets.some((target) => target?.startsWith('video-')),
  'enseignement : au moins une vidéo retenue',
);
assert.ok(
  teachingFull.stops.some((stop) => stop.id === 'awards'),
  'enseignement : palmarès retenu en complet',
);
assert.ok(
  teachingFullTargets.includes('award-forum-metiers'),
  'enseignement : forum des métiers retenu',
);

const teachingTimeline = teachingFull.stops.find(
  (stop) => stop.id === 'timeline',
);
assert.ok(
  teachingTimeline?.highlights.some(
    (highlight) => highlight.target === 'education-phd',
  ),
  'enseignement : doctorat retenu',
);
assert.ok(
  !teachingTimeline?.highlights.some((highlight) =>
    highlight.target?.startsWith('experience-stage-'),
  ),
  'enseignement : stages de développement écartés',
);
assert.ok(
  teachingFullTargets.includes('education-licence') &&
    teachingFullTargets.includes('education-dut'),
  'enseignement : parcours académique complet',
);
assert.ok(
  teachingFullTargets.includes('project-scheduler-finder') &&
    teachingFullTargets.includes('project-progenimages'),
  'enseignement : projets pédagogiques conservés en complet',
);
assert.ok(
  !teachingFullTargets.includes('project-these') &&
    !teachingFullTargets.includes('project-story-bot'),
  'enseignement : projets académiques non pédagogiques écartés',
);
assert.ok(
  !teachingFullTargets.includes('supervision-stage-liasd') &&
    !teachingFullTargets.includes('supervision-stage-imt-albi'),
  'enseignement : responsables de stage écartés',
);
assert.ok(
  teachingFullTargets.includes('supervision-stages-tutorat-iut') &&
    teachingFullTargets.includes('supervision-alternance-aeroport'),
  'enseignement : tutorats conservés en complet',
);
assert.equal(
  teachingTimeline?.highlights[0]?.target,
  'experience-ater-paris8',
  'enseignement : ATER en tête du parcours',
);

const dataTeaching = dataFull.stops.find(
  (stop) => stop.id === 'teaching',
);
assert.ok(
  dataTeaching?.highlights.some(
    (highlight) => highlight.target === 'course-deep-learning-2023',
  ),
  'data : cours de Deep Learning retenu',
);
assert.ok(
  !dataTeaching?.highlights.some(
    (highlight) => highlight.target === 'supervision-stages-tutorat-iut',
  ),
  'data : encadrement non IA écarté',
);

/* ─────────────────────────────────────────────────────────────────────────
   COHÉRENCE DES LANGUES
   ───────────────────────────────────────────────────────────────────────── */

// Les formations affichées doivent être les mêmes dans les trois langues.
for (const persona of ['data', 'research', 'teaching', 'industry'] as const) {
  for (const mode of ['express', 'full'] as const) {
    const targets = LOCALES.map((locale) => {
      const plan = buildCheckPlan('', persona, mode, locale);
      const timeline = plan.stops.find((stop) => stop.id === 'timeline');

      return timeline
        ? timeline.highlights
            .map((highlight) => highlight.target)
            .filter((target) => target?.startsWith('education-'))
            .sort()
            .join(',')
        : '';
    });

    assert.equal(
      new Set(targets).size,
      1,
      `${persona} ${mode} : mêmes formations en FR/EN/ES`,
    );
  }
}

// Enseignement : même type de cours, de tutorat et d'expérience par langue.
for (const locale of LOCALES) {
  const plan = buildCheckPlan('', 'teaching', 'express', locale);
  const targets = plan.stops.flatMap((stop) =>
    stop.highlights.map((highlight) => highlight.target),
  );

  assert.ok(
    targets.some((target) => target?.startsWith('course-')),
    `enseignement ${locale} : un cours retenu`,
  );
  assert.ok(
    targets.includes('supervision-stages-tutorat-iut') ||
      targets.includes('supervision-alternance-aeroport'),
    `enseignement ${locale} : un tutorat retenu`,
  );
  assert.ok(
    targets.includes('experience-ater-paris8'),
    `enseignement ${locale} : ATER retenu`,
  );
}

// Enseignement : les mêmes projets pédagogiques dans les trois langues.
for (const locale of LOCALES) {
  const plan = buildCheckPlan('', 'teaching', 'full', locale);
  const projects = plan.stops
    .find((stop) => stop.id === 'projects')
    ?.highlights.map((highlight) => highlight.target)
    .sort();

  assert.deepEqual(
    projects,
    ['project-progenimages', 'project-scheduler-finder'],
    `enseignement ${locale} : projets pédagogiques cohérents`,
  );
}

// Recherche : le même projet de recherche et le palmarès avant le parcours.
for (const locale of LOCALES) {
  const plan = buildCheckPlan('', 'research', 'full', locale);
  const projects = plan.stops
    .find((stop) => stop.id === 'projects')
    ?.highlights.map((highlight) => highlight.target)
    .sort();
  const awards = plan.stops
    .find((stop) => stop.id === 'awards')
    ?.highlights.map((highlight) => highlight.target)
    .sort();
  const sections = plan.stops.map((stop) => stop.id);

  assert.deepEqual(
    projects,
    ['project-these'],
    `recherche ${locale} : seul le projet de recherche`,
  );
  assert.deepEqual(
    awards,
    ['award-egc-2022'],
    `recherche ${locale} : palmarès scientifique uniquement`,
  );
  assert.ok(
    sections.indexOf('awards') < sections.indexOf('timeline'),
    `recherche ${locale} : palmarès avant parcours`,
  );
}

// Enseignement : les mêmes distinctions pédagogiques dans les trois langues.
for (const locale of LOCALES) {
  const express = buildCheckPlan('', 'teaching', 'express', locale);
  const full = buildCheckPlan('', 'teaching', 'full', locale);
  const expressAwards = express.stops
    .find((stop) => stop.id === 'awards')
    ?.highlights.map((highlight) => highlight.target)
    .sort();
  const fullAwards = full.stops
    .find((stop) => stop.id === 'awards')
    ?.highlights.map((highlight) => highlight.target)
    .sort();

  assert.deepEqual(
    expressAwards,
    ['award-co-responsable-alternance', 'award-forum-metiers'],
    `enseignement ${locale} : palmarès essentiel cohérent`,
  );
  assert.deepEqual(
    fullAwards,
    [
      'award-co-responsable-alternance',
      'award-forum-metiers',
      'award-jury-alternance',
      'award-selection-candidats',
    ],
    `enseignement ${locale} : palmarès complet cohérent`,
  );
}

// Une section nommée garde le filtre de prix du profil, même sans contenu fort.
for (const query of ['prix', 'distinction']) {
  const researchSearch = buildCheckPlan(query, 'research', 'express', 'fr');
  const researchAwards = researchSearch.stops
    .find((stop) => stop.id === 'awards')
    ?.highlights.map((highlight) => highlight.target);

  assert.deepEqual(
    researchAwards,
    ['award-egc-2022'],
    `recherche « ${query} » : palmarès scientifique uniquement`,
  );

  const teachingSearch = buildCheckPlan(query, 'teaching', 'express', 'fr');
  const teachingAwards =
    teachingSearch.stops
      .find((stop) => stop.id === 'awards')
      ?.highlights.map((highlight) => highlight.target) ?? [];
  const sharedAwards = teachingAwards.filter(
    (target) =>
      target !== undefined && researchAwards?.includes(target),
  );

  assert.ok(
    teachingAwards.length > 0 && sharedAwards.length === 0,
    `enseignement « ${query} » : palmarès pédagogique uniquement`,
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CAS LIMITES
   ───────────────────────────────────────────────────────────────────────── */

// Un mot précis retrouve une section par son contenu, sans mot-clé dédié.
const churn = buildCheckPlan('churn', 'general', 'express', 'fr');
assert.ok(
  churn.stops.some((stop) => stop.id === 'projects'),
  'churn : projets retrouvés par le contenu',
);
assert.ok(
  !churn.stops.some((stop) => stop.id === 'publications'),
  'churn : publications écartées faute de contenu',
);

const noMatch = buildCheckPlan('zzzz', 'general', 'express', 'fr');
assert.equal(noMatch.hasMatches, false, 'sans correspondance : aucune visite');
assert.equal(
  noMatch.stops.length,
  0,
  'sans correspondance : aucune étape proposée',
);
assert.equal(
  noMatch.verdict?.fit,
  'weak',
  'sans correspondance : verdict faible',
);

// Le mode complet prolonge exactement l'ordre de l'essentiel.
for (const persona of [
  'general',
  'data',
  'industry',
  'research',
  'teaching',
] as const) {
  const essential = buildCheckPlan('', persona, 'express', 'fr');
  const full = buildCheckPlan('', persona, 'full', 'fr');
  const essentialIds = essential.stops.map((stop) => stop.id);
  const fullIds = full.stops.map((stop) => stop.id);

  assert.deepEqual(
    fullIds.slice(0, essentialIds.length),
    essentialIds,
    `${persona} : le complet prolonge l’essentiel`,
  );
}

const weakOffer = buildCheckPlan(
  'AWS GCP banking regulation',
  'general',
  'express',
  'fr',
);
assert.equal(
  weakOffer.verdict?.fit,
  'weak',
  'offre inconnue : verdict faible',
);
assert.equal(
  weakOffer.hasMatches,
  false,
  'offre inconnue : aucune correspondance directe',
);
assert.equal(
  weakOffer.stops.length,
  0,
  'offre inconnue : aucune visite proposée',
);
assert.deepEqual(
  weakOffer.verdict?.gaps.map((gap) => gap.key),
  ['visit.gaps.unknown', 'visit.gaps.unknown'],
  'offre inconnue : acronymes non documentés',
);
assert.deepEqual(
  weakOffer.verdict?.gaps.map((gap) => gap.params?.term),
  ['AWS', 'GCP'],
  'offre inconnue : termes nommés',
);

/* ─────────────────────────────────────────────────────────────────────────
   CONTACT
   ───────────────────────────────────────────────────────────────────────── */

// Tout parcours non vide se termine par l'étape de contact.
const contactBase = buildCheckPlan('', 'general', 'express', 'fr');
const contactPlan = appendContactStop(contactBase, 'fr');

assert.equal(
  contactPlan.stops.at(-1)?.id,
  'contact',
  'contact : dernière étape du parcours',
);
assert.equal(
  contactPlan.duration,
  contactBase.duration + 10,
  'contact : durée ajoutée',
);
assert.equal(
  appendContactStop(
    buildCheckPlan('zzzz', 'general', 'express', 'fr'),
    'fr',
  ).stops.length,
  0,
  'contact : aucune étape sans parcours',
);

/* ─────────────────────────────────────────────────────────────────────────
   MODES ESSENTIEL ET COMPLET
   ───────────────────────────────────────────────────────────────────────── */

// Une section nommée reste proposée en complet, même face à un meilleur score.
for (const mode of ['express', 'full'] as const) {
  const plan = buildCheckPlan(
    'machine learning distinctions',
    'general',
    mode,
    'fr',
  );

  assert.ok(
    plan.stops.some((stop) => stop.id === 'awards'),
    `section nommée : complément retenu en ${mode}`,
  );
}

// Le complet ouvre les sections cœur portées par les thèmes de la demande.
const themeExpress = buildCheckPlan(
  'consultant en Intelligence Artificielle',
  'general',
  'express',
  'fr',
);
const themeFull = buildCheckPlan(
  'consultant en Intelligence Artificielle',
  'general',
  'full',
  'fr',
);
const countHighlights = (plan: VisitPlan) =>
  plan.stops.reduce(
    (total, stop) => total + stop.highlights.length,
    0,
  );

assert.ok(
  themeExpress.stops.some((stop) => stop.id === 'skills'),
  'thèmes : compétences ouvertes en essentiel',
);
assert.ok(
  themeFull.stops.some((stop) => stop.id === 'skills'),
  'thèmes : compétences ouvertes en complet',
);
assert.equal(
  themeExpress.verdict?.fit,
  'strong',
  'thèmes : correspondance confirmée en essentiel',
);
assert.ok(
  themeFull.stops.length > themeExpress.stops.length,
  'thèmes : le complet ajoute des sections',
);
assert.ok(
  countHighlights(themeFull) > countHighlights(themeExpress),
  'thèmes : le complet enrichit les contenus',
);
assert.equal(
  themeFull.verdict?.fit,
  'strong',
  'thèmes : le complet confirme la correspondance',
);
assert.deepEqual(
  themeFull.stops
    .slice(0, themeExpress.stops.length)
    .map((stop) => stop.id),
  themeExpress.stops.map((stop) => stop.id),
  'thèmes : le complet prolonge l’essentiel',
);

// Une section nommée avec contenu reste retenue sous le plancher de score.
const namedRanked: VisitSearchSection[] = [
  { section: 'skills', score: 100, hasRealItem: true, entries: [] },
  { section: 'projects', score: 50, hasRealItem: true, entries: [] },
  // Sous le plancher : 5 % du meilleur score.
  { section: 'teaching', score: 3, hasRealItem: true, entries: [] },
];
const namedSectionIds = new Set<VisitSectionId>(['teaching']);

for (const mode of ['express', 'full'] as const) {
  const selected = selectRankedSections(
    namedRanked,
    mode,
    namedSectionIds,
  ).map((entry) => entry.section);

  assert.ok(
    selected.includes('teaching'),
    `section nommée sous le plancher : retenue en ${mode}`,
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CIBLES DE LIEN PROFOND
   ───────────────────────────────────────────────────────────────────────── */

// Un article Medium doit être ciblable comme les autres cartes.
assert.equal(
  knowledgeTarget('article'),
  'article',
  'lien profond : article Medium ciblable',
);
assert.ok(
  isVisitTarget(visitTarget('project', 'these')),
  'lien profond : cible projet reconnue',
);
assert.ok(
  isVisitTarget(visitTarget('article', 'https://medium.com/p/1')),
  'lien profond : cible article reconnue',
);
assert.ok(
  !isVisitTarget('inconnu-these'),
  'lien profond : préfixe inconnu refusé',
);

/* =========================================================================
  RÉSULTAT
========================================================================= */

console.log('Parcours de visite : invariants vérifiés');
