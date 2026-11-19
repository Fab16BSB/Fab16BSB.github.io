/* =========================================================================
  IMPORTS
========================================================================= */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { languageOptions } from '@/data/profile/languages.data';
import { useI18n } from '@/i18n/useI18n';
import { useOnClickOutside } from '@/hooks/ui/useOnClickOutside';
import type { Locale } from '@/types/common.types';
import { getOptionFocusIndex } from './LanguageSwitcher.helpers';

/* =========================================================================
  HOOK : useLanguageSwitcher
  Gère l'ouverture, la sélection et le clavier du sélecteur de langue.
========================================================================= */
export function useLanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  // État d'ouverture du menu.
  const [open, setOpen] = useState(false);

  // Conteneur du sélecteur, pour les clics extérieurs.
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Bouton déclencheur.
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Références des langues, pour le déplacement du focus.
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Langue affichée dans le déclencheur.
  const current =
    languageOptions.find((option) => option.code === locale) ??
    languageOptions[0];

  // Ferme le menu.
  const close = useCallback(() => setOpen(false), []);

  // Ouvre ou ferme le menu.
  const toggle = useCallback(() => setOpen((isOpen) => !isOpen), []);

  // Ferme aussi au clic extérieur.
  useOnClickOutside(wrapperRef, close, open);

  // Donne le focus à la langue active à l'ouverture.
  useEffect(() => {
    if (open) {
      const index = languageOptions.findIndex(
        (option) => option.code === locale,
      );
      optionRefs.current[index]?.focus();
    }
  }, [open, locale]);

  // Sélectionne une langue, ferme la liste et rend le focus au déclencheur.
  const choose = useCallback(
    (code: Locale) => {
      setLocale(code);
      close();
      triggerRef.current?.focus();
    },
    [setLocale, close],
  );

  // Déplace le focus entre les langues et referme avec Échap.
  const onListKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLUListElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        triggerRef.current?.focus();
        close();
      } else {
        const currentIndex = optionRefs.current.findIndex(
          (element) => element === document.activeElement,
        );
        const nextIndex = getOptionFocusIndex(
          event.key,
          currentIndex,
          languageOptions.length,
        );

        if (nextIndex !== null) {
          event.preventDefault();
          optionRefs.current[nextIndex]?.focus();
        }
      }
    },
    [close],
  );

  return {
    open,
    toggle,
    current,
    choose,
    onListKeyDown,
    wrapperRef,
    triggerRef,
    optionRefs,
  };
}
