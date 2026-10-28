/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/types/common.types';
import type { Publication, PublicationLanguage, PublicationLink } from '@/types/publication.types';
import type { IconName } from '@/types/ui.types';
import { CopyButton } from '@/components/ui/CopyButton/CopyButton';
import { Icon } from '@/components/ui/Icon/Icon';
import { LanguageFlag } from '@/components/ui/LanguageFlag/LanguageFlag';
import { pickPublicationVersion } from '../publications.helpers';
import styles from '../Publications.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
const linkIcons: Record<PublicationLink['key'], IconName> = {
  article: 'external',
  pdf: 'download',
  poster: 'download',
  demo: 'play',
  code: 'github',
};

/* =========================================================================
  INTERFACE
========================================================================= */
type PublicationCardProps = {
  publication: Publication;
  locale: Locale;
  selectedLanguage?: PublicationLanguage;
  index: number;
  onLanguageChange: (id: string, language: PublicationLanguage) => void;
};

/* =========================================================================
  COMPOSANT : PublicationCard
  Carte d'une publication scientifique.
========================================================================= */
export function PublicationCard({
  publication,
  locale,
  selectedLanguage,
  index,
  onLanguageChange,
}: PublicationCardProps) {
  const { t, loc } = useI18n();
  const fallbackVersion = pickPublicationVersion(publication, locale);
  const activeLanguage = selectedLanguage ?? fallbackVersion.language;
  const version =
    publication.versions.find((item) => item.language === activeLanguage) ?? fallbackVersion;

  return (
    <article
      className={styles.paper}
      style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}
      data-reveal
    >
      <div className={styles.paperYear}>
        {/* Année et statut de publication. */}
        <span>{publication.year}</span>
        <span className={publication.preprint ? styles.preprint : styles.published}>
          {t(publication.preprint ? 'publications.preprint' : 'publications.published')}
        </span>
      </div>

      <div className={styles.paperBody}>
        {/* Lieu de publication. */}
        <div className={styles.paperTop}>
          <p className={styles.venue}>
            {publication.venueUrl ? (
              <a href={publication.venueUrl} target="_blank" rel="noopener noreferrer">
                {loc(publication.venue)}
                <Icon name="arrow-up-right" size={12} />
              </a>
            ) : (
              loc(publication.venue)
            )}
          </p>

          {/* Sélecteur de version linguistique. */}
          {publication.versions.length > 1 ? (
            <div
              className={styles.langSwitch}
              role="group"
              aria-label={t('publications.language')}
            >
              {publication.versions.map((option) => {
                const active = option.language === version.language;
                const languageLabel = t(`publications.languages.${option.language}`);
                const code = option.language.toUpperCase();

                return active ? (
                  <span
                    key={option.language}
                    className={`${styles.langOption} ${styles.langOptionActive}`}
                    title={languageLabel}
                    aria-label={languageLabel}
                    aria-current="true"
                  >
                    <LanguageFlag code={option.language} className={styles.langFlag} />
                    <span>{code}</span>
                  </span>
                ) : (
                  <button
                    key={option.language}
                    type="button"
                    className={styles.langOption}
                    onClick={() => onLanguageChange(publication.id, option.language)}
                    title={languageLabel}
                    aria-label={`${t('publications.showVersion')} ${languageLabel}`}
                  >
                    <LanguageFlag code={option.language} className={styles.langFlag} />
                    <span>{code}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <span
              className={styles.langBadge}
              title={t(`publications.languages.${version.language}`)}
              aria-label={t(`publications.languages.${version.language}`)}
            >
              <LanguageFlag code={version.language} className={styles.langFlag} />
              <span>{version.language.toUpperCase()}</span>
            </span>
          )}
        </div>

        {/* Auteurs, titre et sous-titre. */}
        <p className={styles.authors}>{publication.authors.join(' · ')}</p>
        <h3 className={styles.paperTitle}>{version.title}</h3>
        {version.subtitle && <p className={styles.subtitle}>{loc(version.subtitle)}</p>}

        {/* Liens et citation. */}
        <div className={styles.paperActions}>
          {version.links.map((link) => (
            <a
              className={`button button--ghost button--small ${styles.link}`}
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name={linkIcons[link.key]} size={14} />
              {link.label}
            </a>
          ))}
          <CopyButton value={version.bibtex} label={t('publications.cite')} />
        </div>
      </div>
    </article>
  );
}
