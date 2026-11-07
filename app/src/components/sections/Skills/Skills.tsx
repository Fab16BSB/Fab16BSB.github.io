/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { KnowledgeIcon } from '@/components/ui/KnowledgeIcon/KnowledgeIcon';
import { ProjectModal } from '@/components/ui/ProjectModal/ProjectModal';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Select } from '@/components/ui/Select/Select';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { SkillModal } from './components/SkillModal';
import { knowledgeDomains } from '@/data/knowledge-domains.data';
import { skillCategories } from './skills.helpers';
import { useSkills } from './useSkills';
import styles from './Skills.module.css';

/* =========================================================================
  COMPOSANT : Skills
  Section compétences.
========================================================================= */
export function Skills() {
  const { t } = useI18n();
  const {
    active,
    setActive,
    filtered,
    visible,
    counts,
    expanded,
    setExpanded,
    hasMore,
    selectedSkill,
    selectedProject,
    openSkill,
    closeSkill,
    openProject,
    openProjectById,
    closeProject,
  } = useSkills();

  const tabs = [
    { id: 'all', label: t('common.all'), count: counts.all },
    ...skillCategories.map((category) => ({
      id: category,
      label: t(`skills.categories.${category}`),
      count: counts[category],
    })),
  ];

  const filterOptions = tabs.map((tab) => ({
    value: tab.id,
    label: `${tab.label} (${tab.count})`,
  }));

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('skills.eyebrow')}
          title={t('skills.knowledge.title')}
          titleId="skills-title"
        />

        {/* Domaines de connaissance. */}
        <div className={styles.knowledge} data-reveal>
          <div className={styles.knowledgeGrid}>
            {knowledgeDomains.map((domain) => (
              <article className={styles.knowledgeCard} key={domain.id}>
                <span className={styles.knowledgeIcon}>
                  <KnowledgeIcon name={domain.id} />
                </span>
                <h3>{t(domain.titleKey)}</h3>
                <ul className={styles.knowledgeTags}>
                  {domain.items.map((item) => (
                    <li key={item.id}>{t(`skills.knowledge.items.${item.labelKey}`)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Outils et filtres. */}
        <div className={styles.tools}>
          <div className={styles.toolsHead} data-reveal>
            <h3 className={styles.toolsTitle}>{t('skills.toolsTitle')}</h3>
            <span className={styles.count}>
              {visible.length < filtered.length
                ? `${visible.length} / ${filtered.length}`
                : filtered.length}{' '}
              {t('skills.count')}
            </span>
          </div>

          {/* Onglets sur desktop, sélecteur sur mobile. */}
          <div className={styles.toolbar} data-reveal>
            <div className={styles.desktopFilters}>
              <Tabs
                items={tabs}
                active={active}
                onChange={(id) => setActive(id as typeof active)}
                ariaLabel={t('skills.toolsTitle')}
                variant="filters"
              />
            </div>
            <div className={styles.mobileFilters}>
              <Select
                value={active}
                options={filterOptions}
                onChange={(value) => setActive(value as typeof active)}
                label={t('skills.toolsTitle')}
                icon="filter"
                menuAlign="left"
              />
            </div>
          </div>

          {/* Grille des compétences filtrées. */}
          <div className={styles.grid} key={active}>
            {visible.map((skill, index) => (
              <button
                type="button"
                className={styles.card}
                key={skill.id}
                style={{ '--reveal-delay': `${Math.min(index, 12) * 28}ms` } as CSSProperties}
                onClick={() => openSkill(skill)}
                aria-label={t('skills.related.open', { name: skill.name })}
                data-reveal
              >
                {/* Icône ou monogramme de la compétence. */}
                <span className={styles.iconTile} aria-hidden="true">
                  {skill.icon ? (
                    <img
                      src={`/images/skills/${skill.icon}`}
                      alt=""
                      loading="lazy"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className={styles.monogram}>{skill.monogram ?? skill.name.slice(0, 2)}</span>
                  )}
                </span>
                <span className={styles.name}>{skill.name}</span>
                <Icon name="chevron-right" size={16} className={styles.chevron} />
              </button>
            ))}
          </div>

          {/* Voir plus / voir moins. */}
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
        </div>
      </div>

      {/* Détail d'une compétence et projets associés. */}
      {selectedSkill && (
        <SkillModal
          skill={selectedSkill}
          onClose={closeSkill}
          onOpenProject={openProjectById}
        />
      )}

      {selectedProject && (
        <ProjectModal
          key={selectedProject.id}
          project={selectedProject}
          onClose={closeProject}
          onOpenProject={openProject}
        />
      )}
    </section>
  );
}
