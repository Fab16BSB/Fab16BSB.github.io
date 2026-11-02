/* =========================================================================
  IMPORTS
========================================================================= */
import { useSearchSettings } from '@/search/useSearchSettings';

/* =========================================================================
  TYPES
========================================================================= */

/** État affiché par l'indication de recherche approfondie. */
export type SemanticHintState =
  | { kind: 'unavailable' }
  | { kind: 'enable' }
  | { kind: 'error' }
  | { kind: 'active' }
  | { kind: 'loading'; progress: number };

/* =========================================================================
  HOOK : useSemanticHint
  Détermine l'état de l'indication et les actions disponibles.
========================================================================= */
export function useSemanticHint() {
  const {
    semanticEnabled,
    semanticStatus,
    semanticProgress,
    capability,
    requestSemantic,
    retrySemantic,
    disableSemantic,
  } = useSearchSettings();

  // État par défaut : chargement en cours ou en attente.
  let state: SemanticHintState = { kind: 'loading', progress: semanticProgress };

  if (!capability.supported) {
    // L'appareil ne peut pas exécuter le modèle.
    state = { kind: 'unavailable' };
  } else if (!semanticEnabled) {
    // Aucune préférence active : proposer l'activation.
    state = { kind: 'enable' };
  } else if (semanticStatus === 'error') {
    // Le dernier téléchargement ou chargement a échoué.
    state = { kind: 'error' };
  } else if (semanticStatus === 'ready') {
    // Le modèle est prêt : proposer la désactivation.
    state = { kind: 'active' };
  }

  return { state, requestSemantic, retrySemantic, disableSemantic };
}
