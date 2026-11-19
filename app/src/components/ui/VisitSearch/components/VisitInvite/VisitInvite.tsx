/* =========================================================================
  IMPORTS
========================================================================= */
import type { Ref } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import styles from './VisitInvite.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitInviteProps = {
  expanded: boolean;
  onOpen: () => void;
  ref?: Ref<HTMLButtonElement>;
};

/* =========================================================================
  COMPOSANT : VisitInvite
  Invitation permanente du header qui ouvre la palette de visite.
========================================================================= */
export function VisitInvite({ expanded, onOpen, ref }: VisitInviteProps) {
  const { t } = useI18n();

  return (
    <button
      ref={ref}
      type="button"
      className={styles.invite}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      title={t('visit.open')}
    >
      <span className={styles.inviteInner}>
        {/* Pastille de recherche et libellé d'invitation. */}
        <span className={styles.invitePill}>
          <Icon name="search" size={15} className={styles.inviteIcon} />
          <span className={styles.inviteText}>{t('visit.invite')}</span>
        </span>
      </span>
    </button>
  );
}
