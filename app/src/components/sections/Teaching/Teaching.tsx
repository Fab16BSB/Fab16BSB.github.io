/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Icon } from '@/components/ui/Icon/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { CourseCards } from './components/CourseCards';
import { CourseFilters } from './components/CourseFilters';
import { CourseTable } from './components/CourseTable';
import { SupervisionCard } from './components/SupervisionCard';
import { formatHours } from './teaching.helpers';
import { useTeaching } from './useTeaching';
import styles from './Teaching.module.css';

/* =========================================================================
  COMPOSANT : Teaching
  Section enseignement.
========================================================================= */
export function Teaching() {
  const { t } = useI18n();
  const {
    tab,
    setTab,
    year,
    setYear,
    level,
    setLevel,
    query,
    setQuery,
    filtered,
    visible,
    years,
    levels,
    allHours,
    expanded,
    setExpanded,
    reset,
    supervisions,
    hasFilters,
  } = useTeaching();

  const tabs = [
    { id: 'courses', label: t('teaching.tabs.courses'), count: filtered.length },
    { id: 'supervisions', label: t('teaching.tabs.supervisions'), count: supervisions.length },
  ];

  // Totaux des encadrements, toutes périodes confondues.
  const supervisionStudents = supervisions.reduce(
    (sum, supervision) => sum + supervision.students,
    0,
  );
  const remoteSupervisions = supervisions.filter(
    (supervision) => supervision.mode === 'remote',
  ).length;

  // Statistiques affichées selon l'onglet actif.
  const stats =
    tab === 'courses'
      ? [
          { value: `${formatHours(allHours)}h`, label: t('teaching.stats.hours') },
          { value: String(filtered.length), label: t('teaching.stats.courses') },
          { value: String(levels.length), label: t('teaching.stats.levels') },
        ]
      : [
          { value: String(supervisionStudents), label: t('teaching.students') },
          {
            value: String(supervisions.length),
            label: t('teaching.supervisionStats.contexts'),
          },
          {
            value: String(remoteSupervisions),
            label: t('teaching.supervisionStats.remote'),
          },
        ];

  return (
    <section id="teaching" className="section section--soft" aria-labelledby="teaching-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('teaching.eyebrow')}
          title={t('teaching.title')}
          description={t('teaching.description')}
          titleId="teaching-title"
        />

        {/* Onglets et statistiques. */}
        <div className={styles.top} data-reveal>
          <Tabs
            items={tabs}
            active={tab}
            onChange={(id) => setTab(id as typeof tab)}
            ariaLabel={t('teaching.title')}
          />
          <dl className={styles.stats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Cours. */}
        {tab === 'courses' && (
          <>
            <CourseFilters
              query={query}
              onQueryChange={setQuery}
              year={year}
              years={years}
              onYearChange={setYear}
              level={level}
              levels={levels}
              onLevelChange={setLevel}
              hasFilters={hasFilters}
              onReset={reset}
            />

            {filtered.length > 0 ? (
              <>
                <CourseTable courses={visible} />
                <CourseCards courses={visible} />

                {/* Voir plus / voir moins. */}
                {filtered.length > 8 && (
                  <div className={styles.more}>
                    <button
                      type="button"
                      className="button button--ghost button--small"
                      onClick={() => setExpanded(!expanded)}
                    >
                      {expanded ? t('common.seeLess') : t('common.seeMore')}
                      <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Aucun cours ne correspond aux filtres.
              <EmptyState
                icon="search"
                title={t('teaching.noResults')}
                description={t('teaching.noResultsHint')}
                actionLabel={hasFilters ? t('common.resetFilters') : undefined}
                onAction={hasFilters ? reset : undefined}
              />
            )}
          </>
        )}

        {/* Encadrements. */}
        {tab === 'supervisions' &&
          (supervisions.length > 0 ? (
            <div className={styles.supervisions}>
              {supervisions.map((supervision) => (
                <SupervisionCard key={supervision.id} supervision={supervision} />
              ))}
            </div>
          ) : (
            // Aucun encadrement enregistré.
            <div className={styles.placeholder} data-reveal>
              <span className={styles.placeholderIcon}>
                <Icon name="users" size={28} />
              </span>
              <h3>{t('teaching.placeholder.title')}</h3>
              <p>{t('teaching.placeholder.text')}</p>
            </div>
          ))}
      </div>
    </section>
  );
}
