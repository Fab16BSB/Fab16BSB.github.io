/* =========================================================================
  HELPERS : capacités de l'appareil
  Décide si le modèle sémantique peut être proposé.
========================================================================= */

/* =========================================================================
  TYPES
========================================================================= */

/** Capacité de l'appareil à exécuter le modèle. */
export type SemanticCapability = {
  supported: boolean;
};

/** Champs non standard exposés par certains navigateurs. */
type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
  deviceMemory?: number;
};

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Détecte si l'appareil peut télécharger et exécuter le modèle.
 *
 * Les critères couvrent les vieux ordinateurs autant que les mobiles :
 * économie de données, réseau lent, mémoire vive et nombre de cœurs.
 *
 * @returns La capacité de l'appareil.
 */
export function detectSemanticCapability(): SemanticCapability {
  // Capacité supposée avant vérification des API et du matériel.
  let supported = true;

  // Sans Worker ni WebAssembly, le modèle ne peut pas s'exécuter.
  if (
    typeof navigator === 'undefined' ||
    typeof Worker === 'undefined' ||
    typeof WebAssembly === 'undefined'
  ) {
    supported = false;
  }

  // Navigateur compatible : vérifier les ressources de l'appareil.
  else {
    const device = navigator as NavigatorWithHints;

    // L'utilisateur a activé l'économie de données de son navigateur.
    if (device.connection?.saveData) {
      supported = false;
    }

    // 2G/3G : trop lent pour télécharger puis exécuter le modèle.
    else if (
      device.connection?.effectiveType &&
      ['slow-2g', '2g', '3g'].includes(device.connection.effectiveType)
    ) {
      supported = false;
    }

    // Moins de 4 Go de RAM : le modèle risque de faire planter l'onglet.
    else if (
      typeof device.deviceMemory === 'number' &&
      device.deviceMemory < 4
    ) {
      supported = false;
    }

    // Moins de 4 cœurs : l'inférence serait trop lente.
    else if (
      typeof device.hardwareConcurrency === 'number' &&
      device.hardwareConcurrency < 4
    ) {
      supported = false;
    }
  }

  return { supported };
}
