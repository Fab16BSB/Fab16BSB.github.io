/* =========================================================================
  IMPORTS
========================================================================= */
import { socials } from '@/data/profile/socials.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { SocialLinks } from '@/components/ui/SocialLinks/SocialLinks';
import styles from './VisitContactBar.module.css';

/* =========================================================================
  COMPOSANT : VisitContactBar
  Barre de contact compacte, toujours visible dans le panneau de visite.
========================================================================= */
export function VisitContactBar() {
  const { t } = useI18n();

  return (
    <div className={styles.bar}>
      <span className={styles.label}>
        <Icon name="mail" size={14} />
        {t('visit.contactTitle')}
      </span>

      <SocialLinks links={socials} variant="contact" />
    </div>
  );
}
