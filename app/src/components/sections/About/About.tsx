/* =========================================================================
  IMPORTS
========================================================================= */
import { passions, qualities } from '@/data/about.data';
import { profile } from '@/data/profile.data';
import { socials } from '@/data/socials.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { SocialLinks } from '@/components/ui/SocialLinks/SocialLinks';
import styles from './About.module.css';

/* =========================================================================
  COMPOSANT : About
  Section de présentation.
========================================================================= */
export function About() {
  const { t, loc, locale } = useI18n();

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>

        {/* Identité : nom, rôle et localisation. */}
        <header className={styles.header} data-reveal>
          <span className="eyebrow">{t('about.eyebrow')}</span>
          <h1 id="about-title" className={styles.name}>
            {profile.name}
          </h1>
          <p className={styles.role}>{loc(profile.role)}</p>
          <span className="chip">
            <Icon name="map-pin" size={14} />
            {t('about.location')}
          </span>
        </header>

        {/* Portrait principal, chargé en priorité. */}
        <figure className={styles.visual} data-reveal>
          <img
            src="/images/profil/profil.webp"
            alt={t('about.portraitAlt')}
            width={900}
            height={1125}
            fetchPriority="high"
          />
        </figure>

        {/* Présentation et liens sociaux. */}
        <div className={styles.story} data-reveal>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <SocialLinks links={socials} />
        </div>
      </div>

      <div className={`container ${styles.panels}`}>

        {/* Passions : image décorative, le libellé de la figure porte le sens. */}
        <section className={styles.panel} aria-labelledby="about-passions" data-reveal>
          <div className={styles.panelHead}>
            <h2 id="about-passions">{t('about.passions')}</h2>
          </div>
          <div className={styles.passionGrid}>
            {passions.map((passion) => (
              <figure className={styles.passion} key={passion.id}>
                <img src={passion.image} alt="" loading="lazy" width={640} height={640} />
                <figcaption>{t(passion.labelKey)}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Qualités : une illustration par langue. */}
        <section className={styles.panel} aria-labelledby="about-qualities" data-reveal>
          <div className={styles.panelHead}>
            <h2 id="about-qualities">{t('about.qualities')}</h2>
          </div>
          <div className={styles.badges}>
            {qualities.map((quality) => (
              <img
                key={quality.id}
                src={quality.images[locale]}
                alt={t(quality.labelKey)}
                loading="lazy"
                width={320}
                height={320}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Devise personnelle. */}
      <figure className={`container ${styles.motto}`} data-reveal>
        <span className={styles.mottoLabel}>{t('about.mottoLabel')}</span>
        <blockquote>
          <p>{t('about.quote')}</p>
        </blockquote>
      </figure>
    </section>
  );
}
