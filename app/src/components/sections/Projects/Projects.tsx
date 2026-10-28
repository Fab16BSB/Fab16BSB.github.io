/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { EmptyState } from '@/components/ui/EmptyState/EmptyState';
import { Icon } from '@/components/ui/Icon/Icon';
import { ProjectCard } from '@/components/ui/ProjectCard/ProjectCard';
import { ProjectModal } from '@/components/ui/ProjectModal/ProjectModal';
import { SearchInput } from '@/components/ui/SearchInput/SearchInput';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Select } from '@/components/ui/Select/Select';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { projectCategories } from './projects.helpers';
import { useProjects } from './useProjects';
import styles from './Projects.module.css';

/* =========================================================================
  COMPOSANT : Projects
  Section projets.
========================================================================= */
export function Projects() {
  const { t } = useI18n();
  const {
    active,
    setActive,
    query,
    setQuery,
    year,
    setYear,
    years,
    filtered,
    visible,
    counts,
    selected,
    openProject,
    closeProject,
    expanded,
    setExpanded,
    hasMore,
    resetFilters,
    hasFilters,
  } = useProjects();

  const tabs = [
    { id: 'all', label: t('projects.filters.all'), count: counts.all },
    ...projectCategories.map((category) => ({
      id: category,
      label: t(`projects.filters.${category}`),
      count: counts[category],
    })),
  ];

  const yearOptions = [
    { value: 'all', label: t('projects.allYears') },
    ...years.map((option) => ({ value: option, label: option })),
  ];

  return (
    <section id="projects" className="section section--soft" aria-labelledby="projects-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('projects.eyebrow')}
          title={t('projects.title')}
          description={t('projects.description')}
          titleId="projects-title"
        />

        {/* Filtres : catégories, recherche et année. */}
        <div className={styles.controls} data-reveal>
          <div className={styles.tabsRow}>
            <Tabs
              items={tabs}
              active={active}
              onChange={(id) => setActive(id as typeof active)}
              ariaLabel={t('projects.title')}
              variant="filters"
            />
          </div>

          <div className={styles.filters}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={t('projects.searchPlaceholder')}
              clearLabel={t('projects.clearSearch')}
              className={styles.search}
            />
            <Select
              value={year}
              options={yearOptions}
              onChange={setYear}
              label={t('projects.year')}
            />
          </div>
        </div>

        {/* Nombre de résultats, annoncé aux lecteurs d'écran. */}
        <p className={styles.results} aria-live="polite">
          {filtered.length} {t('projects.results')}
        </p>

        {filtered.length > 0 ? (
          <>
            {/* La clé force le remontage de la grille pour rejouer l'animation. */}
            <div className={styles.grid} key={`${active}-${year}-${query}`}>
              {visible.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onOpen={openProject}
                />
              ))}
            </div>

            {/* « Voir plus » n'apparaît que sur la vue complète. */}
            {hasMore && (
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

          // Aucun résultat : réinitialisation proposée si des filtres sont actifs.
          <EmptyState
            icon="search"
            title={t('projects.noResults')}
            description={t('projects.noResultsHint')}
            actionLabel={hasFilters ? t('common.resetFilters') : undefined}
            onAction={hasFilters ? resetFilters : undefined}
          />
        )}
      </div>

      {/* Modale de détail du projet sélectionné. */}
      {selected && <ProjectModal project={selected} onClose={closeProject} />}
    </section>
  );
}
