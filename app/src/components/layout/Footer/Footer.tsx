/* =========================================================================
  IMPORTS
========================================================================= */
import { navItems } from '@/data/navigation.data';
import { community, socials } from '@/data/socials.data';
import { profile } from '@/data/profile.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { SocialLinks } from '@/components/ui/SocialLinks/SocialLinks';
import styles from './Footer.module.css';

/* =========================================================================
  COMPOSANT : Footer
  Pied de page du site
========================================================================= */
export function Footer() {
  const { t, loc, locale } = useI18n();
  const year = new Date().getFullYear();

  const lastUpdated = new Intl.DateTimeFormat(
    locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' },
  ).format(new Date(__BUILD_DATE__));

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        {/* Identité */}
        <div className={styles.brandColumn}>
          <a className={styles.brand} href="#about">
            <span className={styles.monogram}>FP</span>
            <span>
              <span className={styles.name}>Fabien Poirier</span>
              <span className={styles.role}>{loc(profile.role)}</span>
            </span>
          </a>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
          <SocialLinks links={socials} />
        </div>

        {/* Navigation */}
        <nav className={styles.navColumn} aria-label={t('accessibility.mainNavigation')}>
          <h3 className={styles.heading}>{t('footer.nav')}</h3>
          <ul className={styles.links}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href}>{t(item.labelKey)}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Communauté */}
        <div className={styles.communityColumn}>
          <h3 className={styles.heading}>{t('footer.community')}</h3>
          <SocialLinks links={community} labels />
        </div>
      </div>

      {/* Bas de page */}
      <div className={`container ${styles.bottom}`}>
        <p>
          © {year} Fabien Poirier — {t('footer.rights')}
        </p>
        <p className={styles.updated}>{t('footer.lastUpdated', { date: lastUpdated })}</p>
        <p className={styles.built}>{t('footer.builtWith')}</p>
        <a className={styles.top} href="#about">
          {t('footer.backToTop')}
          <Icon name="arrow-up-right" size={15} />
        </a>
      </div>
    </footer>
  );
}
