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

  // L'appareil ne peut pas exécuter le modèle.
  if (!capability.supported) {
    state = { kind: 'unavailable' };
  }

  // Aucune préférence active : proposer l'activation.
  else if (!semanticEnabled) {
    state = { kind: 'enable' };
  }

  // Le navigateur ne fournit pas les API nécessaires au modèle.
  else if (semanticStatus === 'unsupported') {
    state = { kind: 'unavailable' };
  }

  // Le dernier téléchargement ou chargement a échoué.
  else if (semanticStatus === 'error') {
    state = { kind: 'error' };
  }

  // Le modèle est prêt : proposer la désactivation.
  else if (semanticStatus === 'ready') {
    state = { kind: 'active' };
  }

  return { state, requestSemantic, retrySemantic, disableSemantic };
}
