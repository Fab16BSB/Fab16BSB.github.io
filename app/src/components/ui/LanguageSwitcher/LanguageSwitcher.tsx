/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/types/common.types';
import { Icon } from '@/components/ui/Icon/Icon';
import { LanguageFlag } from '@/components/ui/LanguageFlag/LanguageFlag';
import { languageOptions } from '@/data/languages.data';
import { useLanguageSwitcher } from './useLanguageSwitcher';
import styles from './LanguageSwitcher.module.css';

/* =========================================================================
  COMPOSANT : LanguageSwitcher
  Sélecteur de langue.
========================================================================= */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const { open, toggle, close, ref } = useLanguageSwitcher();
  const current = languageOptions.find((option) => option.code === locale) ?? languageOptions[0];

  const choose = (code: Locale) => {
    setLocale(code);
    close();
  };

  return (
    <div className={styles.wrapper} ref={ref}>

      {/* Langue courante. */}
      <button
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('accessibility.changeLanguage')}
      >
        <LanguageFlag code={current.code} className={styles.flag} />
        <span className={styles.current}>{current.label}</span>
        <Icon name="chevron-down" size={14} className={open ? styles.rotated : ''} />
      </button>

      {open && (
        // Liste des langues disponibles.
        <ul className={styles.menu} role="listbox" aria-label={t('accessibility.changeLanguage')}>
          {languageOptions.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={option.code === locale}
                className={[styles.option, option.code === locale ? styles.active : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => choose(option.code)}
              >
                <LanguageFlag code={option.code} className={[styles.flag, styles.flagSmall].join(' ')} />

                {/* Libellé et coche de la langue active. */}
                <span>{option.label}</span>
                {option.code === locale && <Icon name="check" size={15} className={styles.check} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
