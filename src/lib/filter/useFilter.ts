import { useCallback } from 'react';
import { Filter, FilterState, FilterConfig } from './types';
import { useFilterStore } from './store';

export function useFilter(config: FilterConfig): FilterState {
  const { filters, addFilter: addToStore, removeFilter: removeFromStore, clearFilters: clearFromStore } = useFilterStore();

  const currentFilters = filters[config.name] || [];

  const addFilter = useCallback((filter: Filter) => {
    const filterConfig = {
      ...config,
      table: config.table,
      schema: config.schema
    };

    addToStore(config.name, {
      ...filter,
      column: config.targetField,
    }, filterConfig);
  }, [config, addToStore]);

  const removeFilter = useCallback((index: number) => {
    removeFromStore(config.name, index);
  }, [config.name, removeFromStore]);

  const clearFilters = useCallback(() => {
    clearFromStore(config.name);
  }, [config.name, clearFromStore]);

  const buildQuery = useCallback((baseQuery: any) => {
    let query = baseQuery;
    
    currentFilters.forEach((filter) => {
      if (filter.config?.table === config.table) {
        if (filter.operator === 'in' && Array.isArray(filter.value) && filter.value.length > 0) {
          query = query.in(filter.column, filter.value);
        }
      }
    });

    return query;
  }, [currentFilters, config.table]);

  return {
    filters: currentFilters,
    addFilter,
    removeFilter,
    clearFilters,
    buildQuery
  };
}