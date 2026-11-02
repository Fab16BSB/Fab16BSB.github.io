/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/types/common.types';

/* =========================================================================
  TYPES
========================================================================= */
export type EssentialsTab = 'essentials' | 'abstract';

/* =========================================================================
  HOOK : usePublicationEssentials
  Gère les onglets « L'essentiel » et « Abstract » d'une publication.
========================================================================= */
export function usePublicationEssentials(id: string, locale: Locale) {
  const { tFor } = useI18n();

  // Onglet actif, « L'essentiel » par défaut.
  const [activeTab, setActiveTab] = useState<EssentialsTab>('essentials');

  // Références des onglets pour déplacer le focus au clavier.
  const tabRefs = useRef<Record<EssentialsTab, HTMLButtonElement | null>>({
    essentials: null,
    abstract: null,
  });

  // Onglets libellés dans la langue du contenu affiché.
  const tabs = useMemo(
    () => [
      { id: 'essentials' as const, label: tFor(locale, 'publications.summary') },
      { id: 'abstract' as const, label: tFor(locale, 'publications.abstract') },
    ],
    [locale, tFor],
  );

  // Change l'onglet actif.
  const select = useCallback((next: EssentialsTab) => setActiveTab(next), []);

  // Navigation clavier : flèches, Home et End.
  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      const handled =
        event.key === 'ArrowRight' ||
        event.key === 'ArrowLeft' ||
        event.key === 'Home' ||
        event.key === 'End';

      if (handled) {
        event.preventDefault();

        const current = tabs.findIndex((tab) => tab.id === activeTab);
        let nextIndex = current;

        if (event.key === 'ArrowRight') {
          nextIndex = (current + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (current - 1 + tabs.length) % tabs.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        const next = tabs[nextIndex];

        if (next) {
          setActiveTab(next.id);
          tabRefs.current[next.id]?.focus();
        }
      }
    },
    [activeTab, tabs],
  );

  // Identifiant ARIA d'un onglet ou de son panneau.
  const tabId = useCallback((tab: EssentialsTab) => `${id}-tab-${tab}`, [id]);
  const panelId = useCallback((tab: EssentialsTab) => `${id}-panel-${tab}`, [id]);

  return { activeTab, tabs, select, onKeyDown, tabRefs, tabId, panelId };
}
