/* =========================================================================
  UTILITAIRES : logger
  Journalisation limitée au mode développement.
========================================================================= */

export const logger = {

  /** Signale un avertissement sans interrompre le flux. */
  warn(message: string, error?: unknown) {
    if (import.meta.env.DEV) {
      console.warn(message, error);
    }
  },

  /** Signale une erreur sans interrompre le flux. */
  error(message: string, error?: unknown) {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
  },
};
