/* =========================================================================
  IMPORTS
========================================================================= */
import { useCopyToClipboard } from '@/hooks/ui/useCopyToClipboard';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './CopyButton.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
};

/* =========================================================================
  COMPOSANT : CopyButton
  Bouton de copie dans le presse-papiers.
========================================================================= */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();
  const { t } = useI18n();

  return (
    <button
      type="button"
      className={[styles.button, copied ? styles.copied : '', className].filter(Boolean).join(' ')}
      onClick={() => copy(value)}
    >
      <Icon name={copied ? 'check' : 'copy'} size={15} />

      {/* Icône et libellé changent après la copie. */}
      <span>{copied ? t('common.copied') : (label ?? t('common.cite'))}</span>

      {/* Annonce le succès aux lecteurs d'écran. */}
      <span className="sr-only" aria-live="polite">
        {copied ? t('common.copied') : ''}
      </span>
    </button>
  );
}
