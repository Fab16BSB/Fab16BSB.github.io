/* =========================================================================
  IMPORTS
========================================================================= */
import { useReveal } from '@/hooks/sections/useReveal';
import { useI18n } from '@/i18n/useI18n';

// Layout
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { SectionBar } from '@/components/layout/SectionBar/SectionBar';

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

  return (
    <div ref={revealRef}>

      {/* Premier élément focusable : permet de sauter la navigation répétée. */}
      <a className="skip-link" href="#main">
        {t('accessibility.skipToContent')}
      </a>

      <Header />

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

      {/* Barre flottante de navigation entre les sections. */}
      <SectionBar />
    </div>
  );
}
