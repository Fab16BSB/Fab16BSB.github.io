/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useState } from 'react';
import { logger } from '@/lib/logger';

/* =========================================================================
  HOOK : useLocalStorage
  Persiste un état dans le localStorage.
========================================================================= */
export function useLocalStorage<T>(key: string, initialValue: T) {

  // Valeur persistée, lue une seule fois au premier rendu.
  const [value, setValue] = useState<T>(() => {
    let initial = initialValue;

    try {
      const stored = window.localStorage.getItem(key);

      if (stored) {
        initial = JSON.parse(stored) as T;
      }
    } catch (error) {
      logger.warn('Lecture du localStorage impossible — valeur initiale utilisée', error);
    }

    return initial;
  });

  // Met à jour l'état et le stockage.
  const update = useCallback(
    (next: T | ((current: T) => T)) => {

      // L'écriture se fait dans l'updater pour disposer de l'état courant,
      // y compris quand `next` est une fonction.
      setValue((current) => {
        const resolved = next instanceof Function ? next(current) : next;

        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (error) {
          logger.warn('Écriture dans le localStorage impossible — état local conservé', error);
        }

        return resolved;
      });
    },
    [key],
  );

  return [value, update] as const;
}
