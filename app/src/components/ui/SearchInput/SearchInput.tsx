/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SearchInput.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  className?: string;
};

/* =========================================================================
  COMPOSANT : SearchInput
  Champ de recherche.
========================================================================= */
export function SearchInput({
  value,
  onChange,
  placeholder,
  clearLabel,
  className,
}: SearchInputProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      {/* Icône de recherche. */}
      <Icon name="search" size={16} />

      {/* Champ contrôlé. */}
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        // Efface la recherche.
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label={clearLabel}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
