/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { SearchInput } from '@/components/ui/SearchInput/SearchInput';
import { Select } from '@/components/ui/Select/Select';
import { Tabs } from '@/components/ui/Tabs/Tabs';
import type { SelectOption, TabItem } from '@/types/ui.types';
import type { PublicationTab } from '../usePublications';
import styles from '../Publications.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type PublicationsFiltersProps = {
  tab: PublicationTab;
  tabs: TabItem[];
  onTabChange: (tab: PublicationTab) => void;
  query: string;
  onQueryChange: (value: string) => void;
  year: string;
  yearOptions: SelectOption[];
  onYearChange: (value: string) => void;
};

/* =========================================================================
  COMPOSANT : PublicationsFilters
  Onglets, recherche et filtre d'année.
========================================================================= */
export function PublicationsFilters({
  tab,
  tabs,
  onTabChange,
  query,
  onQueryChange,
  year,
  yearOptions,
  onYearChange,
}: PublicationsFiltersProps) {
  const { t } = useI18n();

  return (
    <div className={styles.controls} data-reveal>

      {/* Onglets scientifiques / Medium. */}
      <Tabs
        items={tabs}
        active={tab}
        onChange={(id) => onTabChange(id as PublicationTab)}
        ariaLabel={t('publications.title')}
      />

      {/* Recherche et année. */}
      <div className={styles.filters}>
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder={t('publications.searchPlaceholder')}
          clearLabel={t('publications.clearSearch')}
        />

        <Select
          value={year}
          options={yearOptions}
          onChange={onYearChange}
          label={t('publications.year')}
        />
      </div>
    </div>
  );
}
