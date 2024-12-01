export interface FilterConfig {
  name: string;
  valueField: string;
  schema: string;
  table: string;
  targetField: string;
}

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in';

export interface Filter {
  column: string;
  operator: FilterOperator;
  value: string | number | (string | number)[];
  config?: FilterConfig;
}

export interface FilterState {
  filters: Filter[];
  addFilter: (filter: Filter) => void;
  removeFilter: (index: number) => void;
  clearFilters: () => void;
  buildQuery: (baseQuery: any) => any;
}