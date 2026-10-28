/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useOnClickOutside } from '@/hooks/ui/useOnClickOutside';
import type { SelectOption } from '@/types/ui.types';

/* =========================================================================
  HOOK : useSelect
  Gère l'ouverture, le positionnement et la navigation clavier du sélecteur.
========================================================================= */
export function useSelect(
  value: string,
  options: SelectOption[],
  onChange: (value: string) => void,
) {
  // État d'ouverture du menu.
  const [open, setOpen] = useState(false);

  // Menu ouvert vers le haut.
  const [openUp, setOpenUp] = useState(false);

  // Conteneur du sélecteur.
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Bouton déclencheur.
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Liste des options.
  const menuRef = useRef<HTMLUListElement>(null);

  // Références des options.
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Index de l'option courante.
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  // Option affichée dans le déclencheur.
  const selected = options[selectedIndex] ?? options[0];

  // Ferme le menu au clic extérieur.
  useOnClickOutside(wrapperRef, () => setOpen(false), open);

  // Ferme le menu.
  const close = (focusTrigger = false) => {
    setOpen(false);

    // Rend le focus au déclencheur.
    if (focusTrigger) {
      triggerRef.current?.focus();
    }
  };

  // Ouvre ou ferme le menu.
  const toggle = () => setOpen((current) => !current);

  // Sélectionne une option et ferme le menu.
  const selectOption = (next: string) => {
    onChange(next);
    close(true);
  };

  // Gère les touches du déclencheur.
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' && !open) {
      event.preventDefault();
      setOpen(true);
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault();
      close(true);
    }
  };

  // Gère les touches dans la liste.
  const onOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Home') {
      event.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      optionRefs.current[options.length - 1]?.focus();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // Les flèches bouclent dans la liste.
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      optionRefs.current[(index + delta + options.length) % options.length]?.focus();
    }
  };

  // Place le focus sur l'option courante.
  useEffect(() => {
    if (open) {
      optionRefs.current[selectedIndex]?.focus();
    }
  }, [open, selectedIndex]);

  // Mesure l'espace avant peinture pour choisir le sens.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;

    if (open && trigger) {
      // Position du déclencheur.
      const rect = trigger.getBoundingClientRect();

      // Hauteur estimée du menu.
      const menuHeight = menuRef.current?.offsetHeight ?? Math.min(options.length * 44 + 16, 320);

      // Espace disponible en dessous et au-dessus.
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setOpenUp(spaceBelow < menuHeight + 16 && spaceAbove > spaceBelow);
    }
  }, [open, options.length]);

  // État et actions du sélecteur.
  return {
    open,
    openUp,
    wrapperRef,
    triggerRef,
    menuRef,
    optionRefs,
    selected,
    toggle,
    selectOption,
    onTriggerKeyDown,
    onOptionKeyDown,
  };
}
