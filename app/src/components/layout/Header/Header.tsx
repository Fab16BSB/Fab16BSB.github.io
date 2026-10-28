/* =========================================================================
  IMPORTS
========================================================================= */
import { navItems } from '@/data/navigation.data';
import { profile } from '@/data/profile.data';
import { useI18n } from '@/i18n/useI18n';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import { Icon } from '@/components/ui/Icon/Icon';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { useHeader } from './useHeader';
import styles from './Header.module.css';

/* =========================================================================
  COMPOSANT : Header
  En-tête du site avec navigation et actions.
========================================================================= */
export function Header() {
  const { t, loc } = useI18n();
  const { scrolled, active, open, close, toggle } = useHeader();

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={`container ${styles.inner}`}>

          {/* Identité */}
          <a className={styles.brand} href="#about" aria-label="Fabien Poirier — accueil">
            <span className={styles.monogram}>FP</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>Fabien Poirier</span>
              <span className={styles.brandRole}>{loc(profile.role)}</span>
            </span>
          </a>

          {/* Navigation desktop */}
          <nav className={styles.nav} aria-label={t('accessibility.mainNavigation')}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    className={[styles.navLink, active === item.id ? styles.active : ''].filter(Boolean).join(' ')}
                    href={item.href}
                  >
                    {t(item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className={styles.menuButton}
              onClick={toggle}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t('accessibility.closeMenu') : t('accessibility.openMenu')}
            >
              <Icon name={open ? 'close' : 'menu'} size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <MobileMenu open={open} active={active} onClose={close} />
    </>
  );
}
