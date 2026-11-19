/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { LanguageFlag } from '@/components/ui/LanguageFlag/LanguageFlag';
import { languageOptions } from '@/data/profile/languages.data';
import { useLanguageSwitcher } from './useLanguageSwitcher';
import styles from './LanguageSwitcher.module.css';

/* =========================================================================
  COMPOSANT : LanguageSwitcher
  Sélecteur de langue.
========================================================================= */
export function LanguageSwitcher() {
  const { t } = useI18n();
  const {
    open,
    toggle,
    current,
    choose,
    onListKeyDown,
    wrapperRef,
    triggerRef,
    optionRefs,
  } = useLanguageSwitcher();

  // Identifiant unique de la liste, référencé par le déclencheur.
  const menuId = useId();

  return (
    <div className={styles.wrapper} ref={wrapperRef}>

      {/* Langue courante. */}
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('accessibility.changeLanguage')}
      >
        <LanguageFlag code={current.code} className={styles.flag} />
        <span className={styles.current}>{current.label}</span>
        <Icon name="chevron-down" size={14} className={open ? styles.rotated : ''} />
      </button>

      {open && (
        // Liste des langues disponibles.
        <ul
          id={menuId}
          className={styles.menu}
          role="listbox"
          aria-label={t('accessibility.changeLanguage')}
          onKeyDown={onListKeyDown}
        >
          {languageOptions.map((option, index) => (
            <li key={option.code}>
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={option.code === current.code}
                className={[styles.option, option.code === current.code ? styles.active : '']
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => choose(option.code)}
              >
                <LanguageFlag code={option.code} className={[styles.flag, styles.flagSmall].join(' ')} />

                {/* Libellé et coche de la langue active. */}
                <span>{option.label}</span>
                {option.code === current.code && <Icon name="check" size={15} className={styles.check} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
