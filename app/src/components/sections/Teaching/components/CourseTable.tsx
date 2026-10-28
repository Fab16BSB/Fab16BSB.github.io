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
type CourseTableProps = {
  courses: TeachingCourse[];
};

/* =========================================================================
  COMPOSANT : CourseTable
  Tableau des cours pour les écrans larges.
========================================================================= */
export function CourseTable({ courses }: CourseTableProps) {
  const { t, loc } = useI18n();

  return (
    <div className={styles.tableWrap}>

      {/* Tableau desktop : une ligne par cours. */}
      <table className={styles.table}>

        {/* En-têtes de colonnes. */}
        <thead>
          <tr>
            <th scope="col">{t('teaching.labels.year')}</th>
            <th scope="col">{t('teaching.labels.theme')}</th>
            <th scope="col">{t('teaching.labels.level')}</th>
            <th scope="col">{t('teaching.labels.students')}</th>
            <th scope="col">{t('teaching.labels.place')}</th>
            <th scope="col">{t('teaching.labels.hours')}</th>
            <th scope="col">
              <span className={styles.thWithHelp}>
                {t('teaching.labels.distribution')}
                <DistributionHelp />
              </span>
            </th>
          </tr>
        </thead>

        {/* Lignes des cours filtrés. */}
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className={styles.yearCell}>
                <span className={styles.dateTag}>
                  <Icon name="calendar" size={12} />
                  {formatCourseYears(course)}
                </span>
              </td>
              <td className={styles.themeCell}>{loc(course.theme)}</td>
              <td>
                <span className={styles.levelTag} data-level={course.level}>
                  {t(`teaching.levels.${course.level}`)}
                </span>
              </td>
              <td>{course.students}</td>
              <td>
                <span className={styles.placeTag} data-place={course.place}>
                  {t(`teaching.labels.${course.place}`)}
                </span>
              </td>
              <td className={styles.hoursCell}>{formatHours(course.hours)}h</td>
              <td>
                <span className={styles.distribution}>
                  {course.distribution.map((item) => (
                    <span
                      className={styles.distributionTag}
                      data-type={item.type}
                      key={`${course.id}-${item.type}`}
                    >
                      {t(`teaching.distribution.${item.type}`)} {formatHours(item.hours)}h
                    </span>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
