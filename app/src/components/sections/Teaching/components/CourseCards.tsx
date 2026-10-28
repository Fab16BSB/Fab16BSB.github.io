/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import type { TeachingCourse } from '@/types/teaching.types';
import { formatCourseYears, formatHours } from '../teaching.helpers';
import { DistributionHelp } from './DistributionHelp';
import styles from '../Teaching.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type CourseCardsProps = {
  courses: TeachingCourse[];
};

/* =========================================================================
  COMPOSANT : CourseCards
  Cartes des cours pour les petits écrans.
========================================================================= */
export function CourseCards({ courses }: CourseCardsProps) {
  const { t, loc } = useI18n();

  return (
    <div className={styles.cards}>
      {courses.map((course) => (
        <article className={styles.courseCard} key={course.id}>

          {/* Période et niveau. */}
          <div className={styles.courseTop}>
            <span className={styles.dateTag}>
              <Icon name="calendar" size={12} />
              {formatCourseYears(course)}
            </span>
            <span className={styles.levelTag} data-level={course.level}>
              {t(`teaching.levels.${course.level}`)}
            </span>
          </div>

          <h3>{loc(course.theme)}</h3>

          {/* Effectif, lieu et volume horaire. */}
          <p className={styles.courseMeta}>
            <span>
              {course.students} {t('teaching.stats.students').toLowerCase()}
            </span>
            <span>·</span>
            <span className={styles.placeTag} data-place={course.place}>
              {t(`teaching.labels.${course.place}`)}
            </span>
            <span>·</span>
            <span>{formatHours(course.hours)}h</span>
          </p>

          {/* Répartition par type d'activité. */}
          <div className={styles.courseDistribution}>
            {course.distribution.map((item) => (
              <span
                className={styles.distributionTag}
                data-type={item.type}
                key={`${course.id}-${item.type}`}
              >
                {t(`teaching.distribution.${item.type}`)} {formatHours(item.hours)}h
              </span>
            ))}
            <DistributionHelp />
          </div>
        </article>
      ))}
    </div>
  );
}
