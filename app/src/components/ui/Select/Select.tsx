/* =========================================================================
  IMPORTS
========================================================================= */
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { useSelect } from './useSelect';
import type { IconName, SelectOption } from '@/types/ui.types';
import styles from './Select.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SelectProps = {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  label: string;
  icon?: IconName;
  className?: string;
  menuAlign?: 'left' | 'right';
  renderOption?: (option: SelectOption) => ReactNode;
  renderValue?: (option: SelectOption) => ReactNode;
};

/* =========================================================================
  COMPOSANT : Select
  Sélecteur accessible.
========================================================================= */
export function Select({
  value,
  options,
  onChange,
  label,
  icon = 'calendar',
  className,
  menuAlign = 'right',
  renderOption,
  renderValue,
}: SelectProps) {
  const {
    open,
    openUp,
    wrapperRef,
    triggerRef,
    menuRef,
    optionRefs,
    selected,
    toggle,
    selectOption,
    onTriggerKeyDown,
    onOptionKeyDown,
  } = useSelect(value, options, onChange);

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} ref={wrapperRef}>

      {/* Déclencheur : valeur courante et chevron. */}
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label} : ${selected?.label ?? ''}`}
      >
        {/* Icône du sélecteur. */}
        <Icon name={icon} size={15} className={styles.icon} />

        {/* Valeur affichée. */}
        <span className={styles.value}>
          {renderValue && selected ? renderValue(selected) : selected?.label}
        </span>

        {/* Chevron d'ouverture. */}
        <Icon
          name="chevron-down"
          size={14}
          className={[styles.chevron, open ? styles.rotated : ''].filter(Boolean).join(' ')}
        />
      </button>

      {open && (
        // Menu des options.
        <ul
          ref={menuRef}
          className={[
            styles.menu,
            openUp ? styles.menuUp : '',
            menuAlign === 'left' ? styles.menuLeft : '',
          ]
            .filter(Boolean)
            .join(' ')}
          role="listbox"
          aria-label={label}
        >
          {options.map((option, index) => {
            const active = option.value === value;

            return (
              <li key={option.value}>
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={[styles.option, active ? styles.active : ''].filter(Boolean).join(' ')}
                  onClick={() => selectOption(option.value)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                >
                  {/* Libellé de l'option. */}
                  <span>{renderOption ? renderOption(option) : option.label}</span>

                  {/* Coche de l'option active. */}
                  {active && <Icon name="check" size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
