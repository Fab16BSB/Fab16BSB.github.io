/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { navItems } from '@/data/navigation.data';
import { socials } from '@/data/socials.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { SocialLinks } from '@/components/ui/SocialLinks/SocialLinks';
import { useMobileMenu } from './useMobileMenu';
import styles from './MobileMenu.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type MobileMenuProps = {
  open: boolean;
  active: string | null;
  onClose: () => void;
};

/* =========================================================================
  COMPOSANT : MobileMenu
  Menu mobile de navigation et réseaux sociaux.
========================================================================= */
export function MobileMenu({ open, active, onClose }: MobileMenuProps) {
  const { t } = useI18n();
  useMobileMenu(open, onClose);

  return (
    <div
      id="mobile-menu"
      className={[styles.panel, open ? styles.open : ''].filter(Boolean).join(' ')}
      aria-hidden={!open}
    >
      {/* Navigation */}
      <nav className={styles.nav} aria-label={t('accessibility.mainNavigation')}>
        <ul className={styles.list}>
          {navItems.map((item, index) => (
            <li key={item.id} style={{ '--index': index } as CSSProperties}>
              <a
                className={[styles.link, active === item.id ? styles.active : ''].filter(Boolean).join(' ')}
                href={item.href}
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                <span>{t(item.labelKey)}</span>
                <Icon name="arrow-up-right" size={17} />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Réseaux sociaux */}
      <div className={styles.footer}>
        <SocialLinks links={socials} />
      </div>
    </div>
  );
}
