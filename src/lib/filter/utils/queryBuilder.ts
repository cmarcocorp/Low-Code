import { Filter } from '../types/FilterTypes';
import { SupabaseClient } from '@supabase/supabase-js';
import { applyOperator } from './filterOperations';

export const buildFilteredQuery = (
  supabase: SupabaseClient,
  table: string,
  filters: Record<string, Filter[]>,
  filterNames: string[]
) => {
  console.log('[queryBuilder] Building query for table:', table, {
    filters,
    filterNames
  });

  let query = supabase.from(table).select('*');

  // Process each filter name
  filterNames.forEach(filterName => {
    const filterList = filters[filterName] || [];
    
    filterList.forEach(filter => {
      // Skip if no config or wrong table
      if (!filter.config || filter.config.table !== table) {
        console.log('[queryBuilder] Skipping filter:', {
          reason: !filter.config ? 'no config' : 'wrong table',
          filter,
          table
        });
        return;
      }

      // Handle array values (IN operator)
      if (Array.isArray(filter.value)) {
        const normalizedValues = filter.value
          .map(v => !isNaN(Number(v)) ? Number(v) : v)
          .filter(v => v !== null && v !== undefined);

        if (normalizedValues.length > 0) {
          console.log('[queryBuilder] Applying IN filter:', {
            column: filter.column,
            values: normalizedValues
          });
          query = query.in(filter.column, normalizedValues);
        }
      } else {
        // Handle single value operators
        query = applyOperator(query, filter);
      }
    });
  });

  return query;
}