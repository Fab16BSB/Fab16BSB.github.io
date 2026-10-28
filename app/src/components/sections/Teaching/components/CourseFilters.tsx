/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import { SearchInput } from '@/components/ui/SearchInput/SearchInput';
import { Select } from '@/components/ui/Select/Select';
import type { TeachingLevel } from '@/types/teaching.types';
import type { SelectOption } from '@/types/ui.types';
import styles from '../Teaching.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type CourseFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  year: number | 'all';
  years: number[];
  onYearChange: (value: number | 'all') => void;
  level: TeachingLevel | 'all';
  levels: TeachingLevel[];
  onLevelChange: (value: TeachingLevel | 'all') => void;
  hasFilters: boolean;
  onReset: () => void;
};

/* =========================================================================
  COMPOSANT : CourseFilters
  Recherche, année et niveau des cours.
========================================================================= */
export function CourseFilters({
  query,
  onQueryChange,
  year,
  years,
  onYearChange,
  level,
  levels,
  onLevelChange,
  hasFilters,
  onReset,
}: CourseFiltersProps) {
  const { t } = useI18n();

  // Options du filtre d'année.
  const yearOptions: SelectOption[] = [
    { value: 'all', label: t('teaching.filters.allYears') },
    ...years.map((value) => ({ value: String(value), label: String(value) })),
  ];

  // Options du filtre de niveau.
  const levelOptions: SelectOption[] = [
    { value: 'all', label: t('teaching.filters.allLevels') },
    ...levels.map((value) => ({
      value,
      label: t(`teaching.levels.${value}`),
    })),
  ];

  const renderLevel = (option: SelectOption) => (
    <span className={styles.levelTag} data-level={option.value}>
      {option.label}
    </span>
  );

  return (
    <div className={styles.filters} data-reveal>

      {/* Recherche dans les intitulés. */}
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder={t('teaching.searchPlaceholder')}
        clearLabel={t('teaching.clearSearch')}
        className={styles.search}
      />

      {/* Filtre d'année. */}
      <div className={styles.select}>
        <span>{t('teaching.filters.year')}</span>
        <Select
          value={String(year)}
          options={yearOptions}
          onChange={(value) => onYearChange(value === 'all' ? 'all' : Number(value))}
          label={t('teaching.filters.year')}
          icon="calendar"
          className={styles.filterSelect}
          menuAlign="left"
        />
      </div>

      {/* Filtre de niveau. */}
      <div className={styles.select}>
        <span>{t('teaching.filters.level')}</span>
        <Select
          value={level}
          options={levelOptions}
          onChange={(value) => onLevelChange(value as TeachingLevel | 'all')}
          label={t('teaching.filters.level')}
          icon="graduation"
          className={styles.filterSelect}
          menuAlign="left"
          renderOption={renderLevel}
          renderValue={renderLevel}
        />
      </div>

      {/* Réinitialise les filtres. */}
      {hasFilters && (
        <button type="button" className={styles.reset} onClick={onReset}>
          <Icon name="close" size={14} />
          {t('common.all')}
        </button>
      )}
    </div>
  );
}
