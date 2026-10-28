/* =========================================================================
  IMPORTS
========================================================================= */
import { links } from '@/data/links.data';
import { useI18n } from '@/i18n/useI18n';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Icon } from '@/components/ui/Icon/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { MediumPostCard } from './components/MediumPostCard';
import { PublicationCard } from './components/PublicationCard';
import { PublicationsFilters } from './components/PublicationsFilters';
import { usePublications } from './usePublications';
import styles from './Publications.module.css';

/* =========================================================================
  COMPOSANT : Publications
  Section publications.
========================================================================= */
export function Publications() {
  const { t, locale } = useI18n();
  const {
    tab,
    setTab,
    query,
    setQuery,
    year,
    setYear,
    years,
    scientific,
    medium,
    scientificTotal,
    mediumTotal,
    languages,
    chooseLanguage,
    resetFilters,
  } = usePublications(locale);

  const tabs = [
    { id: 'scientific', label: t('publications.tabs.scientific'), count: scientificTotal },
    { id: 'medium', label: t('publications.tabs.medium'), count: mediumTotal },
  ];

  const yearOptions = [
    { value: 'all', label: t('publications.allYears') },
    ...years.map((option) => ({ value: option, label: option })),
  ];

  return (
    <section id="publications" className="section" aria-labelledby="publications-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('publications.eyebrow')}
          title={t('publications.title')}
          description={t('publications.description')}
          titleId="publications-title"
        />

        <PublicationsFilters
          tab={tab}
          tabs={tabs}
          onTabChange={setTab}
          query={query}
          onQueryChange={setQuery}
          year={year}
          yearOptions={yearOptions}
          onYearChange={setYear}
        />

        {/* Nombre de résultats, annoncé aux lecteurs d'écran. */}
        <p className={styles.results} aria-live="polite">
          {tab === 'scientific' ? scientific.length : medium.length} {t('publications.results')}
        </p>

        {/* Publications scientifiques. */}
        {tab === 'scientific' &&
          (scientific.length > 0 ? (
            <div className={styles.papers} key="scientific">
              {scientific.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  locale={locale}
                  selectedLanguage={languages[publication.id]}
                  index={index}
                  onLanguageChange={chooseLanguage}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="search"
              title={t('publications.noResults')}
              description={t('publications.noResultsHint')}
              actionLabel={t('common.resetFilters')}
              onAction={resetFilters}
            />
          ))}

        {/* Articles Medium. */}
        {tab === 'medium' && (
          <div className={styles.medium} key="medium">
            {medium.length > 0 ? (
              <div className={styles.posts}>
                {medium.map((post, index) => (
                  <MediumPostCard key={post.id} post={post} locale={locale} index={index} />
                ))}
              </div>
            ) : mediumTotal === 0 ? (
              // Aucun article Medium disponible pour cette langue.
              <div className={styles.empty}>
                <p>{t('publications.mediumEmpty')}</p>
                <a
                  className="button button--primary"
                  href={links.social.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('publications.mediumEmptyCta')}
                  <Icon name="arrow-up-right" size={15} />
                </a>
              </div>
            ) : (
              <EmptyState
                icon="search"
                title={t('publications.noResults')}
                description={t('publications.noResultsHint')}
                actionLabel={t('common.resetFilters')}
                onAction={resetFilters}
              />
            )}

            {/* Lien vers tous les articles. */}
            <div className={styles.allPosts}>
              <a
                className="button button--soft button--small"
                href={links.social.medium}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('publications.allPosts')}
                <Icon name="arrow-up-right" size={15} />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
