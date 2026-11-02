/* =========================================================================
  IMPORTS
========================================================================= */
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { useSemanticHint } from './useSemanticHint';
import styles from './SemanticSearch.module.css';

/* =========================================================================
  COMPOSANT : SemanticHint
  Propose la recherche approfondie lorsqu'aucun résultat n'est trouvé.
========================================================================= */
export function SemanticHint() {
  const { t } = useI18n();
  const { state, requestSemantic, retrySemantic, disableSemantic } = useSemanticHint();

  let content: ReactNode = null;

  // L'appareil est trop limité : aucune action possible.
  if (state.kind === 'unavailable') {
    content = <p className={styles.hint}>{t('search.deep.unavailable')}</p>;
  } 

  // Propose le téléchargement du modèle.
  else if (state.kind === 'enable') {
    content = (
      <p className={styles.hint}>
        {t('search.deep.hint')}{' '}
        <button type="button" className={styles.hintButton} onClick={requestSemantic}>
          {t('search.deep.try')}
        </button>
      </p>
    );
  } 
  
  // Le chargement a échoué : permettre une nouvelle tentative.
  else if (state.kind === 'error') {
    content = (
      <p className={styles.hint}>
        {t('search.deep.error')}{' '}
        <button type="button" className={styles.hintButton} onClick={retrySemantic}>
          {t('search.deep.retry')}
        </button>
      </p>
    );
  } 
  
  // Le mode est actif : offrir un retour à la recherche classique.
  else if (state.kind === 'active') {
    content = (
      <p className={styles.hint}>
        {t('search.deep.active')}{' '}
        <button type="button" className={styles.hintButton} onClick={disableSemantic}>
          {t('search.deep.disableShort')}
        </button>
      </p>
    );
  } 
  
  // Téléchargement en cours : afficher la progression et permettre l'annulation.
  else {
    content = (
      <p className={styles.hint}>
        {t('search.deep.loadingShort', { progress: state.progress })}{' '}
        <button type="button" className={styles.hintButton} onClick={disableSemantic}>
          {t('search.deep.cancelDownload')}
        </button>
      </p>
    );
  }

  return content;
}
