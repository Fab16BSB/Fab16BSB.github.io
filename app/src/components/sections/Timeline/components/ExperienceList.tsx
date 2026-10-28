/* =========================================================================
  IMPORTS
========================================================================= */
import { experiences } from '@/data/experience.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { formatRange, experienceTypeLabels, sortExperiences } from '../timeline.helpers';
import { TimelineItem } from './TimelineItem';
import styles from '../Timeline.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
const sortedExperiences = sortExperiences(experiences);

/* =========================================================================
  COMPOSANT : ExperienceList
  Liste des expériences professionnelles.
========================================================================= */
export function ExperienceList() {
  const { t, loc } = useI18n();

  return (
    <ol className={styles.list}>
      {sortedExperiences.map((item, index) => {

        // Même période affichée dans la colonne et sur la carte mobile.
        const date = formatRange(item.start, item.end, t('timeline.present'));

        return (
          <TimelineItem
            key={item.id}
            accent={item.accent}
            index={index}
            date={date}
            badge={
              <span className={styles.type} data-type={item.type}>
                {loc(experienceTypeLabels[item.type])}
              </span>
            }
          >
            <h3 className={styles.title}>{loc(item.role)}</h3>

            <p className={styles.org}>
              {item.companyUrl ? (
                <a href={item.companyUrl} target="_blank" rel="noopener noreferrer">
                  {item.company}
                  <Icon name="arrow-up-right" size={13} />
                </a>
              ) : (
                item.company
              )}

              {item.secondaryUrl && (
                <>
                  <span className={styles.separator}>·</span>
                  <a href={item.secondaryUrl} target="_blank" rel="noopener noreferrer">
                    LIASD
                    <Icon name="arrow-up-right" size={13} />
                  </a>
                </>
              )}
            </p>

            {/* Points détaillés, sinon description courte. */}
            {item.points ? (
              <ul className={styles.points}>
                {item.points.map((point) => (
                  <li key={point.fr}>{loc(point)}</li>
                ))}
              </ul>
            ) : (
              item.description && <p className={styles.description}>{loc(item.description)}</p>
            )}

            {/* Technologies et mots-clés. */}
            <ul className={styles.tags}>
              {item.tags.map((tag) => (
                <li className="tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </TimelineItem>
        );
      })}
    </ol>
  );
}
