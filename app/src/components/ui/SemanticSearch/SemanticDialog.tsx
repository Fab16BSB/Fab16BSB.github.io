/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { useSemanticDialog } from './useSemanticDialog';
import styles from './SemanticSearch.module.css';

/* =========================================================================
  COMPOSANT : SemanticDialog
  Confirmation du téléchargement du modèle de recherche approfondie.
========================================================================= */
export function SemanticDialog() {
  const { t } = useI18n();
  const { promptOpen, capability, confirmSemantic, cancelSemantic, dialogRef, confirmRef } =
    useSemanticDialog();

  const content = promptOpen ? (
    <div className={styles.overlay}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="semantic-dialog-title"
        aria-describedby="semantic-dialog-description"
      >
        {/* Icône décorative du mode. */}
        <span className={styles.dialogIcon}>
          <Icon name="sparkles" size={22} />
        </span>

        {/* Titre et principe de la recherche approfondie. */}
        <h2 id="semantic-dialog-title" className={styles.dialogTitle}>
          {t('search.deep.title')}
        </h2>
        <p id="semantic-dialog-description" className={styles.dialogText}>
          {t('search.deep.description')}
        </p>

        {/* Taille du téléchargement et confidentialité. */}
        <p className={styles.dialogCost}>{t('search.deep.cost')}</p>

        {/* Avertissement si l'appareil ne peut pas exécuter le modèle. */}
        {!capability.supported ? (
          <p className={styles.dialogWarning}>{t('search.deep.unavailable')}</p>
        ) : null}

        {/* Activation ou report du téléchargement. */}
        <div className={styles.dialogActions}>
          <button
            ref={confirmRef}
            type="button"
            className="button button--primary button--small"
            onClick={confirmSemantic}
            disabled={!capability.supported}
          >
            {t('search.deep.confirm')}
          </button>
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={cancelSemantic}
          >
            {t('search.deep.cancel')}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return content;
}
