/* =========================================================================
  CORPUS : fiches de section
  Retiennent une section nommée sans jamais servir de preuve.
========================================================================= */
import { visitSections } from '@/data/visit/visit-sections.data';
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { Locale } from '@/types/common.types';
import type { CorpusAdd } from './visit-search-corpus.sources';

/**
 * Ajoute les fiches de présentation des sections au corpus.
 *
 * Une fiche sert uniquement à retenir la section quand la demande la nomme,
 * jamais à afficher une preuve. Elle ne reprend pas les titres des contenus,
 * sinon elle se comporte comme un document et fait remonter la section pour
 * n'importe quel mot du domaine.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectSectionSheets(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const definition of visitSections) {
    if (definition.id === 'about') {
      continue;
    }

    add(
      {
        id: `section-${definition.id}`,
        section: definition.id,
        label: definition.description[locale],
        detail: '',
        target: definition.anchor,
        year: 0,
        kind: 'section',
      },
      definition.id,
      [
        ...definition.searchTags,
        ...(definition.searchAliases ?? []),
      ],
      [],
    );
  }
}

/**
 * Ajoute la disponibilité au corpus comme fiche de section.
 *
 * La disponibilité est une information du profil, pas un mot-clé de routage.
 * La fiche hérite des tags et alias de la section « à propos » pour capter
 * `cdi`, `cdd` ou `freelance`. Ces tags ne doivent pas contenir de mots
 * d'offre courants comme « profil », sinon toute demande d'offre bascule sur
 * la disponibilité.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param availabilityText - Texte localisé, ou `null` s'il est masqué.
 */
export function collectAvailability(
  add: CorpusAdd,
  availabilityText: string | null,
): void {
  if (!availabilityText) {
    return;
  }

  add(
    {
      id: 'availability-profile',
      section: 'about',
      label: availabilityText,
      detail: '',
      target: 'about-profile',
      year: 0,
      kind: 'section',
    },
    availabilityText,
    [
      ...(sectionsById.get('about')?.searchTags ?? []),
      ...(sectionsById.get('about')?.searchAliases ?? []),
    ],
    [],
  );
}
