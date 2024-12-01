import { create } from 'zustand';
import type { Filter } from '../types/FilterTypes';

interface FilterHistory {
  filters: Record<string, Filter[]>;
  timestamp: number;
}

interface FilterStore {
  filters: Record<string, Filter[]>;
  history: FilterHistory[];
  currentIndex: number;
  addFilter: (filterName: string, filter: Filter, config?: any) => void;
  removeFilter: (filterName: string, index: number) => void;
  clearFilters: (filterName: string) => void;
  getFilter: (filterName: string) => Filter[];
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: {},
  history: [],
  currentIndex: -1,

  addFilter: (filterName, filter, config) => {
    console.log('[FilterStore] Adding filter:', { filterName, filter, config });
    
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: [{
        ...filter,
        config: {
          ...config,
          table: config?.table,
          targetField: config?.targetField || filter.column
        }
      }]
    };

    console.log('[FilterStore] New filters state:', newFilters);
    
    set({
      filters: newFilters,
      history: [
        ...currentState.history.slice(0, currentState.currentIndex + 1),
        { filters: newFilters, timestamp: Date.now() }
      ],
      currentIndex: currentState.currentIndex + 1
    });
  },

  removeFilter: (filterName, index) => {
    console.log('[FilterStore] Removing filter:', { filterName, index });
    
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: (currentState.filters[filterName] || []).filter((_, i) => i !== index)
    };
    
    set({
      filters: newFilters,
      history: [
        ...currentState.history.slice(0, currentState.currentIndex + 1),
        { filters: newFilters, timestamp: Date.now() }
      ],
      currentIndex: currentState.currentIndex + 1
    });
  },

  clearFilters: (filterName) => {
    console.log('[FilterStore] Clearing filters for:', filterName);
    
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: []
    };
    
    set({
      filters: newFilters,
      history: [
        ...currentState.history.slice(0, currentState.currentIndex + 1),
        { filters: newFilters, timestamp: Date.now() }
      ],
      currentIndex: currentState.currentIndex + 1
    });
  },

  getFilter: (filterName) => {
    const filters = get().filters[filterName] || [];
    console.log('[FilterStore] Getting filters for:', filterName, filters);
    return filters;
  }
}));