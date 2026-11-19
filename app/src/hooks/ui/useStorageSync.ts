/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect } from 'react';

/* =========================================================================
  TYPES
========================================================================= */

/** Réglages de synchronisation d'une valeur stockée. */
type StorageSyncOptions = {
  key: string;
  isValid: (value: string) => boolean;
  onSync: (value: string) => void;
};

/* =========================================================================
  HOOK : useStorageSync
  Resynchronise une valeur au retour d'historique, entre onglets et au réveil.
========================================================================= */
export function useStorageSync({
  key,
  isValid,
  onSync,
}: StorageSyncOptions) {
  useEffect(() => {
    const sync = () => {
      const stored = window.localStorage.getItem(key);

      if (stored !== null && isValid(stored)) {
        onSync(stored);
      }
    };

    // Retour depuis le cache d'historique du navigateur.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        sync();
      }
    };

    // Modification dans un autre onglet.
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        sync();
      }
    };

    // Réveil de l'onglet.
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sync();
      }
    };

    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [key, isValid, onSync]);
}
