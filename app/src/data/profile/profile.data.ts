import type { ProfileAvailabilityStatus } from '@/types/profile.types';

/**
 * Profil public du site.
 *
 * @property {string} name - Nom affiché.
 * @property {Localized} role - Rôle professionnel en FR / EN / ES.
 * @property {ProfileAvailabilityStatus} availability.status - Statut affiché.
 * @property {Localized} availability.text - Texte de disponibilité par statut.
 */
export const profile = {
  name: 'Fabien Poirier',
  role: {
    fr: 'Docteur en Intelligence Artificielle',
    en: 'PhD in Artificial Intelligence',
    es: 'Doctor en Inteligencia Artificial',
  },
  availability: {
    status: 'available' as ProfileAvailabilityStatus,
    text: {
      available: {
        fr: 'Disponible pour du freelance.',
        en: 'Available for freelance work.',
        es: 'Disponible para trabajo freelance.',
      },
      unavailable: {
        fr: 'Indisponible pour le moment.',
        en: 'Not available right now.',
        es: 'No disponible por el momento.',
      },
    },
  },
} as const;
