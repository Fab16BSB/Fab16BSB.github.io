/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { KnowledgeIcon } from '@/components/ui/KnowledgeIcon/KnowledgeIcon';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Select } from '@/components/ui/Select/Select';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { knowledgeDomains, skillCategories } from './skills.helpers';
import { useSkills } from './useSkills';
import styles from './Skills.module.css';

/* =========================================================================
  COMPOSANT : Skills
  Section compétences.
========================================================================= */
export function Skills() {
  const { t } = useI18n();
  const { active, setActive, filtered, visible, counts, expanded, setExpanded, hasMore } = useSkills();

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
                    <li key={item}>{t(`skills.knowledge.items.${item}`)}</li>
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
              <article
                className={styles.card}
                key={skill.id}
                style={{ '--reveal-delay': `${Math.min(index, 12) * 28}ms` } as CSSProperties}
                data-reveal
              >
                {/* Icône ou monogramme de la compétence. */}
                <div className={styles.iconTile} aria-hidden="true">
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
                </div>
                <h3 className={styles.name}>{skill.name}</h3>
              </article>
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
    </section>
  );
}
