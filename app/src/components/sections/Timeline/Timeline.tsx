/* =========================================================================
  IMPORTS
========================================================================= */
import { education } from '@/data/education.data';
import { experiences } from '@/data/experience.data';
import { useI18n } from '@/i18n/useI18n';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import { EducationList } from './components/EducationList';
import { ExperienceList } from './components/ExperienceList';
import { useTimeline } from './useTimeline';
import styles from './Timeline.module.css';

/* =========================================================================
  COMPOSANT : Timeline
  Section parcours de formation et d'expérience.
========================================================================= */
export function Timeline() {
  const { t } = useI18n();
  const { tab, setTab } = useTimeline();

  const tabs = [
    { id: 'education', label: t('timeline.tabs.education'), count: education.length },
    { id: 'experience', label: t('timeline.tabs.experience'), count: experiences.length },
  ];

  return (
    <section id="timeline" className="section section--soft" aria-labelledby="timeline-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('timeline.eyebrow')}
          title={t('timeline.title')}
          description={t('timeline.description')}
          titleId="timeline-title"
          wide
        />

        {/* Onglets formation / expérience. */}
        <div className={styles.toolbar} data-reveal>
          <Tabs items={tabs} active={tab} onChange={(id) => setTab(id as typeof tab)} />
        </div>

        {/* Formation. */}
        {tab === 'education' && <EducationList />}

        {/* Expériences. */}
        {tab === 'experience' && <ExperienceList />}
      </div>
    </section>
  );
}
