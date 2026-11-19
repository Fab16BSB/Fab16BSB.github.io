/* =========================================================================
  IMPORTS
========================================================================= */
import { navItems } from '@/data/site/navigation.data';
import { SECTION, sectionAnchor } from '@/data/site/sections.data';
import { profile } from '@/data/profile/profile.data';
import { useI18n } from '@/i18n/useI18n';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/ui/ThemeToggle/ThemeToggle';
import { VisitSearch } from '@/components/ui/VisitSearch/VisitSearch';
import { Icon } from '@/components/ui/Icon/Icon';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { useHeader } from './useHeader';
import styles from './Header.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type HeaderProps = {
  active: string | null;
};

/* =========================================================================
  COMPOSANT : Header
  En-tête du site avec navigation et actions.
========================================================================= */
export function Header({ active }: HeaderProps) {
  const { t, loc } = useI18n();
  const { scrolled, open, close, toggle } = useHeader();

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled}>
        <div className={styles.inner}>

          {/* Identité */}
          <a
            className={styles.brand}
            href={sectionAnchor(SECTION.about.id)}
            aria-label={`${profile.name} — ${t('accessibility.home')}`}
          >
            <span className={styles.monogram}>FP</span>
            <span className={styles.brandText}>
              <span className={styles.brandName}>{profile.name}</span>
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
                    aria-current={active === item.id ? 'location' : undefined}
                  >
                    <Icon name={item.icon} size={18} className={styles.navIcon} />
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
            <a
              className={styles.graphButton}
              href="/graph/index.html"
              aria-label={t('graph.open')}
              title={t('graph.open')}
            >
              <Icon name="graph" size={19} />
            </a>
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

        {/* Invitation permanente à lancer la visite. */}
        <VisitSearch />
      </header>

      {/* Menu mobile */}
      <MobileMenu open={open} active={active} onClose={close} />
    </>
  );
}
