import { create } from 'zustand';
import type { Filter } from './types';

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
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: {},
  history: [],
  currentIndex: -1,

  addFilter: (filterName, filter, config) => {
    console.log('Adding filter:', { filterName, filter, config });
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: [{ ...filter, config }]
    };
    
    // Add to history
    const newHistory = [
      ...currentState.history.slice(0, currentState.currentIndex + 1),
      { filters: newFilters, timestamp: Date.now() }
    ];
    
    set({
      filters: newFilters,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });

    console.log('Updated filters:', newFilters);
  },

  removeFilter: (filterName, index) => {
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: (currentState.filters[filterName] || []).filter((_, i) => i !== index)
    };
    
    const newHistory = [
      ...currentState.history.slice(0, currentState.currentIndex + 1),
      { filters: newFilters, timestamp: Date.now() }
    ];
    
    set({
      filters: newFilters,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });
  },

  clearFilters: (filterName) => {
    console.log('Clearing filters for:', filterName);
    const currentState = get();
    const newFilters = {
      ...currentState.filters,
      [filterName]: []
    };
    
    const newHistory = [
      ...currentState.history.slice(0, currentState.currentIndex + 1),
      { filters: newFilters, timestamp: Date.now() }
    ];
    
    set({
      filters: newFilters,
      history: newHistory,
      currentIndex: newHistory.length - 1
    });

    console.log('Filters after clearing:', newFilters);
  },

  getFilter: (filterName) => {
    const state = get();
    return state.filters[filterName] || [];
  },

  undo: () => {
    const state = get();
    if (state.currentIndex > 0) {
      const newIndex = state.currentIndex - 1;
      set({
        filters: state.history[newIndex].filters,
        currentIndex: newIndex
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.currentIndex < state.history.length - 1) {
      const newIndex = state.currentIndex + 1;
      set({
        filters: state.history[newIndex].filters,
        currentIndex: newIndex
      });
    }
  },

  canUndo: () => {
    const state = get();
    return state.currentIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.currentIndex < state.history.length - 1;
  }
}));