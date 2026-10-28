/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { useTheme } from '@/theme/useTheme';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './ThemeToggle.module.css';

/* =========================================================================
  COMPOSANT : ThemeToggle
  Bouton de changement de thème.
========================================================================= */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={t('accessibility.toggleTheme')}
      title={theme === 'dark' ? t('common.light') : t('common.dark')}
    >
      <span className={styles.iconWrap}>
        {/* Icône du thème vers lequel on bascule. */}
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
      </span>
    </button>
  );
}
