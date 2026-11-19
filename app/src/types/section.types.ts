/**
 * Section du document.
 *
 * `contact` est une ancre rendue à l'intérieur de la section « à propos » :
 * elle ne possède pas de rubrique de navigation propre.
 */
export type SectionId =
  | 'about'
  | 'timeline'
  | 'skills'
  | 'projects'
  | 'publications'
  | 'videos'
  | 'teaching'
  | 'awards'
  | 'contact';

/**
 * Réglages d'une section du document.
 *
 * @property {SectionId} id - Identifiant de la section.
 * @property {boolean} inNav - Indique si la section ouvre une rubrique de navigation.
 */
export type SectionMeta = {
  id: SectionId;
  inNav: boolean;
};
