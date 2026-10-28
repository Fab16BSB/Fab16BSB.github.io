/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { awards } from '@/data/awards.data';
import { useI18n } from '@/i18n/useI18n';
import { AwardPin } from '@/components/ui/AwardPin/AwardPin';
import { getPinAccent } from '@/components/ui/AwardPin/awardPin.helpers';
import { SectionHeading } from '@/components/ui/SectionHeading/SectionHeading';
import styles from './HallOfFame.module.css';

/* =========================================================================
  COMPOSANT : HallOfFame
  Section palmarès et responsabilités.
========================================================================= */
export function HallOfFame() {
  const { t, loc } = useI18n();

  return (
    <section id="awards" className="section" aria-labelledby="awards-title">
      <div className="container">

        {/* En-tête de la section. */}
        <SectionHeading
          eyebrow={t('awards.eyebrow')}
          title={t('awards.title')}
          description={t('awards.description')}
          titleId="awards-title"
        />

        {/* Distinction à afficher */}
        <div className={styles.grid}>
          {awards.map((award, index) => (
            <article
              className={styles.award}
              key={award.id}
              data-kind={award.kind}
              style={
                {
                  '--reveal-delay': `${index * 70}ms`,
                  ...(award.color ? { '--pin-color': getPinAccent(award.color) } : {}),
                } as CSSProperties
              }
              data-reveal
            >
              {/* Le type de distinction pilote la couleur du pin. */}
              <div className={styles.visual}>
                <AwardPin kind={award.kind} tier={award.tier} color={award.color} />
              </div>

              <h3>{loc(award.title)}</h3>

              {/* Année et événement optionnel. */}
              <p className={styles.meta}>
                {award.year}
                {award.event ? ` · ${award.event}` : ''}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
