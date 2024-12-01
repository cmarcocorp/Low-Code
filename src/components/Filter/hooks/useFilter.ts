import { useState, useCallback } from 'react';

interface FilterConfig {
  name: string;
  valueField: string;
  schema: string;
  table: string;
  targetField: string;
}

export function useFilter(config: FilterConfig) {
  const [filters, setFilters] = useState<any[]>([]);

  const addFilter = useCallback((filter: any) => {
    setFilters(prev => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  return {
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    config
  };
}