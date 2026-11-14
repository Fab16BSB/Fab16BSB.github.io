/* =========================================================================
  IMPORTS
========================================================================= */
import { navItems } from '@/data/navigation.data';
import { useActiveSection } from '@/hooks/sections/useActiveSection';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SectionBar.module.css';

/* =========================================================================
  COMPOSANT : SectionBar
  Barre de navigation entre les sections.
========================================================================= */
export function SectionBar() {
  const { t } = useI18n();
  const ids = navItems.map((item) => item.id);
  const active = useActiveSection(ids);
  const index = Math.max(0, navItems.findIndex((item) => item.id === active),);
  const current = navItems[index];
  const previous = navItems[index - 1];
  const next = navItems[index + 1];
  const total = String(navItems.length).padStart(2, '0');

  return (
    <nav className={styles.bar} aria-label={t('accessibility.sectionNavigation')}>

      {/* Section précédente */}
      {previous ? (
        <a
          className={styles.previous}
          href={previous.href}
          aria-label={`${t('accessibility.previousSection')} : ${t(previous.labelKey)}`}
        >
          <Icon name="chevron-left" size={15} className={styles.chevron} />
          <span>{t(previous.labelKey)}</span>
          <Icon name={previous.icon} size={18} className={styles.sectionIcon} />
        </a>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}

      {/* Section courante */}
      <div className={styles.center}>
        <span className={styles.current}>
          <Icon name={current.icon} size={20} className={styles.sectionIcon} />
          <span className={styles.currentLabel}>{t(current.labelKey)}</span>
        </span>
        <span className={styles.count}>
          {String(index + 1).padStart(2, '0')} / {total}
        </span>
      </div>

      {/* Section suivante */}
      {next ? (
        <a
          className={styles.next}
          href={next.href}
          aria-label={`${t('accessibility.nextSection')} : ${t(next.labelKey)}`}
        >
          <Icon name={next.icon} size={18} className={styles.sectionIcon} />
          <span>{t(next.labelKey)}</span>
          <Icon name="chevron-right" size={15} className={styles.chevron} />
        </a>
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </nav>
  );
}
