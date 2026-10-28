/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { links } from '@/data/links.data';
import { useI18n } from '@/i18n/useI18n';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Icon } from '@/components/ui/Icon/Icon';
import { SearchInput } from '@/components/ui/SearchInput/SearchInput';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Select } from '@/components/ui/Select/Select';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { useVideos, type VideoFilter } from './useVideos';
import { formatVideoDate } from './videos.helpers';
import styles from './Videos.module.css';

/* =========================================================================
  COMPOSANT : Videos
  Section vidéos YouTube.
========================================================================= */
export function Videos() {
  const { t, locale } = useI18n();
  const {
    filter,
    setFilter,
    query,
    setQuery,
    year,
    setYear,
    years,
    counts,
    filtered,
    hasFilters,
    resetFilters,
  } = useVideos();

  const tabs = [
    { id: 'all', label: t('videos.filters.all'), count: counts.all },
    { id: 'video', label: t('videos.filters.video'), count: counts.video },
    { id: 'short', label: t('videos.filters.short'), count: counts.short },
  ];

  const yearOptions = [
    { value: 'all', label: t('videos.allYears') },
    ...years.map((option) => ({ value: option, label: option })),
  ];

  return (
    <section id="videos" className="section" aria-labelledby="videos-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('videos.eyebrow')}
          title={t('videos.title')}
          description={t('videos.description')}
          titleId="videos-title"
        />

        {/* Filtres : type, recherche et année. */}
        <div className={styles.controls} data-reveal>
          <div className={styles.tabsRow}>
            <Tabs
              items={tabs}
              active={filter}
              onChange={(id) => setFilter(id as VideoFilter)}
              ariaLabel={t('videos.title')}
              variant="filters"
            />
          </div>

          <div className={styles.filters}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('videos.searchPlaceholder')}
              clearLabel={t('videos.clearSearch')}
              className={styles.search}
            />
            <Select
              value={year}
              options={yearOptions}
              onChange={setYear}
              label={t('videos.year')}
              icon="calendar"
            />
          </div>
        </div>

        {/* Nombre de résultats, annoncé aux lecteurs d'écran. */}
        <p className={styles.results} aria-live="polite">
          {filtered.length} {t('videos.results')}
        </p>

        {/* Cartes vidéo. */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((video, index) => (
              <a
                className={styles.card}
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ '--reveal-delay': `${Math.min(index, 9) * 50}ms` } as CSSProperties}
                data-reveal
              >
                {/* Miniature remplacée par le fallback si elle ne charge pas. */}
                <span className={styles.thumb}>
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    width={640}
                    height={360}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = video.fallbackThumbnail;
                    }}
                  />
                  <span className={styles.play} aria-hidden="true">
                    <Icon name="play" size={20} />
                  </span>
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{video.title}</span>
                  <span className={styles.bottom}>

                    {/* Date et nombre de vues. */}
                    <span className={styles.meta}>
                      <span className={styles.metaTag}>
                        <Icon name="calendar" size={12} />
                        {formatVideoDate(video.publishedAt, locale)}
                      </span>
                      <span className={styles.metaTag}>
                        <Icon name="youtube" size={12} />
                        {new Intl.NumberFormat(locale).format(video.views)} {t('videos.views')}
                      </span>
                    </span>

                    {/* Lien vers la vidéo sur YouTube. */}
                    <span className={styles.footer}>
                      {t('videos.watch')}
                      <Icon name="arrow-up-right" size={15} />
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        ) : (
          // Aucun résultat ou aucune vidéo disponible.
          <EmptyState
            icon={hasFilters ? 'search' : 'youtube'}
            title={hasFilters ? t('videos.noResults') : t('videos.empty')}
            description={hasFilters ? t('videos.noResultsHint') : undefined}
            actionLabel={hasFilters ? t('common.resetFilters') : undefined}
            onAction={hasFilters ? resetFilters : undefined}
          />
        )}

        {/* Lien vers la chaîne YouTube. */}
        <div className={styles.allVideos}>
          <a
            className="button button--soft button--small"
            href={links.social.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('videos.allVideos')}
            <Icon name="arrow-up-right" size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
