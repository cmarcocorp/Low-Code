import React, { useState, useEffect } from 'react';
import { Dropdown } from './components/Dropdown';
import { useSelector } from './hooks/useSelector';
import { useFilterStore } from '../../lib/filter/store';

interface SelectorProps {
  table: string;
  displayColumn: string;
  valueColumn: string;
  filterName?: string;
  multiselect?: boolean;
  placeholder?: string;
  title?: string;
}

export function Selector({ 
  table,
  displayColumn,
  valueColumn,
  filterName,
  multiselect = false,
  placeholder = 'Select values...',
  title
}: SelectorProps) {
  const { options, loading, error } = useSelector(table, displayColumn, valueColumn);
  const { addFilter, clearFilters, getFilter } = useFilterStore();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (filterName) {
      const currentFilter = getFilter(filterName)[0];
      if (currentFilter && Array.isArray(currentFilter.value)) {
        setSelectedValues(currentFilter.value.map(v => v.toString()));
      }
    }
  }, [filterName, getFilter]);

  const handleChange = (values: string | string[]) => {
    if (!filterName) return;
    
    const newValues = Array.isArray(values) ? values : [values];
    setSelectedValues(newValues);
    clearFilters(filterName);
    
    if (newValues.length > 0) {
      addFilter(filterName, {
        column: valueColumn,
        operator: 'in',
        value: newValues
      });
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 space-y-2">
        {title && (
          <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
        )}
        <Dropdown
          value={selectedValues}
          onChange={handleChange}
          options={options}
          loading={loading}
          placeholder={placeholder}
          multiselect={multiselect}
        />
      </div>
    </div>
  );
}