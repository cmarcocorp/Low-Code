import { Filter } from './types';
import { SupabaseClient } from '@supabase/supabase-js';

export const applyFilter = (query: any, filter: Filter) => {
  console.log('Applying filter:', filter);
  
  if (!filter.value || (Array.isArray(filter.value) && filter.value.length === 0)) {
    console.log('Skipping empty filter');
    return query;
  }

  switch (filter.operator) {
    case 'in':
      if (Array.isArray(filter.value)) {
        console.log('Applying IN filter:', { column: filter.column, values: filter.value });
        return query.in(filter.column, filter.value);
      }
      return query;
    case 'eq':
      return query.eq(filter.column, filter.value);
    case 'neq':
      return query.neq(filter.column, filter.value);
    case 'gt':
      return query.gt(filter.column, filter.value);
    case 'gte':
      return query.gte(filter.column, filter.value);
    case 'lt':
      return query.lt(filter.column, filter.value);
    case 'lte':
      return query.lte(filter.column, filter.value);
    case 'like':
      return query.like(filter.column, `%${filter.value}%`);
    case 'ilike':
      return query.ilike(filter.column, `%${filter.value}%`);
    default:
      return query;
  }
};

export const buildFilteredQuery = (
  supabase: SupabaseClient,
  table: string,
  filters: Record<string, Filter[]>,
  filterNames: string[]
) => {
  console.log('Building filtered query for table:', table);
  console.log('Available filters:', filters);
  console.log('Filter names to apply:', filterNames);

  let query = supabase.from(table).select('*');

  filterNames.forEach(filterName => {
    const filterList = filters[filterName] || [];
    console.log(`Processing filters for ${filterName}:`, filterList);

    filterList.forEach(filter => {
      if (filter.config?.table === table) {
        console.log('Applying filter to table:', { table, filter });
        query = applyFilter(query, filter);
      } else {
        console.log('Skipping filter - wrong table:', { 
          filterTable: filter.config?.table, 
          currentTable: table 
        });
      }
    });
  });

  return query;
};