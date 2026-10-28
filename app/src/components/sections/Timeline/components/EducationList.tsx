/* =========================================================================
  IMPORTS
========================================================================= */
import { education } from '@/data/education.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { formatRange } from '../timeline.helpers';
import { TimelineItem } from './TimelineItem';
import styles from '../Timeline.module.css';

/* =========================================================================
  COMPOSANT : EducationList
  Liste des formations.
========================================================================= */
export function EducationList() {
  const { t, loc } = useI18n();

  return (
    <ol className={styles.list}>
      {education.map((item, index) => {

        // Même période affichée dans la colonne et sur la carte mobile.
        const date = formatRange(item.start, item.end, t('timeline.present'));

        return (
          <TimelineItem
            key={item.id}
            accent={item.accent}
            index={index}
            date={date}
          >
            <h3 className={styles.title}>{loc(item.degree)}</h3>
            {item.detail && <p className={styles.description}>{loc(item.detail)}</p>}

            <p className={styles.org}>
              {item.schoolUrl ? (
                <a href={item.schoolUrl} target="_blank" rel="noopener noreferrer">
                  {loc(item.school)}
                  <Icon name="arrow-up-right" size={13} />
                </a>
              ) : (
                loc(item.school)
              )}
            </p>

            {/* Liens associés au diplôme. */}
            {item.links && (
              <ul className={styles.links}>
                {item.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Icon name={link.icon} size={13} />
                      {loc(link.label)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </TimelineItem>
        );
      })}
    </ol>
  );
}
