/* =========================================================================
  HELPERS : capacités de l'appareil
  Décide si le modèle sémantique peut être proposé.
========================================================================= */

/** Raison pour laquelle le modèle est disponible ou non. */
export type SemanticCapabilityReason =
  | 'ok'
  | 'worker'
  | 'saveData'
  | 'network'
  | 'memory'
  | 'cpu';

/** Capacité de l'appareil à exécuter le modèle. */
export type SemanticCapability = {
  supported: boolean;
  reason: SemanticCapabilityReason;
};

/** Champs non standard exposés par certains navigateurs. */
type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
  deviceMemory?: number;
};

/**
 * Détecte si l'appareil peut télécharger et exécuter le modèle.
 *
 * Les critères couvrent les vieux ordinateurs autant que les mobiles :
 * économie de données, réseau lent, mémoire vive et nombre de cœurs.
 *
 * @returns La capacité et la raison du refus.
 */
export function detectSemanticCapability(): SemanticCapability {
  let result: SemanticCapability = { supported: true, reason: 'ok' };

  // Sans Worker ni WebAssembly, le modèle ne peut pas s'exécuter.
  if (
    typeof navigator === 'undefined' ||
    typeof Worker === 'undefined' ||
    typeof WebAssembly === 'undefined'
  ) {
    result = { supported: false, reason: 'worker' };
  } 
  
  else {
    const device = navigator as NavigatorWithHints;

    // L'utilisateur a activé l'économie de données de son navigateur.
    if (device.connection?.saveData) {
      result = { supported: false, reason: 'saveData' };
    } 

    // 2G/3G : trop lent pour télécharger puis exécuter le modèle.
    else if (
      device.connection?.effectiveType &&
      ['slow-2g', '2g', '3g'].includes(device.connection.effectiveType)
    ) {
      result = { supported: false, reason: 'network' };
    } 
    
    // Moins de 4 Go de RAM : le modèle risque de faire planter l'onglet.
    else if (
      typeof device.deviceMemory === 'number' &&
      device.deviceMemory < 4
    ) {
      result = { supported: false, reason: 'memory' };
    } 

    // Moins de 4 cœurs : l'inférence serait trop lente.
    else if (
      typeof device.hardwareConcurrency === 'number' &&
      device.hardwareConcurrency < 4
    ) {
      result = { supported: false, reason: 'cpu' };
    }
  }

  return result;
}
