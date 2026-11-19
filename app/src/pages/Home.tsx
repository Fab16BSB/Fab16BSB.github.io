/* =========================================================================
  IMPORTS
========================================================================= */
import { useReveal } from '@/hooks/sections/useReveal';
import { useSectionProgress } from '@/hooks/sections/useSectionProgress';
import { navSectionIds } from '@/data/site/sections.data';
import { useI18n } from '@/i18n/useI18n';

// Layout
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { SectionTimeline } from '@/components/layout/SectionTimeline/SectionTimeline';

// Sections
import { About } from '@/components/sections/About/About';
import { Timeline } from '@/components/sections/Timeline/Timeline';
import { Skills } from '@/components/sections/Skills/Skills';
import { Projects } from '@/components/sections/Projects/Projects';
import { Publications } from '@/components/sections/Publications/Publications';
import { Videos } from '@/components/sections/Videos/Videos';
import { Teaching } from '@/components/sections/Teaching/Teaching';
import { HallOfFame } from '@/components/sections/HallOfFame/HallOfFame';

/* =========================================================================
  COMPOSANT : Home
  Assemble le layout et les sections du portfolio.
========================================================================= */
export function Home() {
  const { t } = useI18n();
  const revealRef = useReveal<HTMLDivElement>();

  // Section lue et progression commune au header et à la frise du bas.
  const { active, progressRef } = useSectionProgress(navSectionIds);

  return (
    <div ref={revealRef}>

      {/* Premier élément focusable : permet de sauter la navigation répétée. */}
      <a className="skip-link" href="#main">
        {t('accessibility.skipToContent')}
      </a>

      <Header active={active} />

      <main id="main">
        <About />
        <Timeline />
        <Skills />
        <Projects />
        <Publications />
        <Videos />
        <Teaching />
        <HallOfFame />
      </main>

      <Footer />

      {/* Frise de progression entre les sections, fixée en bas de page. */}
      <SectionTimeline active={active} progressRef={progressRef} />
    </div>
  );
}
