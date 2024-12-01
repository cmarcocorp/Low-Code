import { Filter } from '../types/FilterTypes';

export const applyOperator = (query: any, filter: Filter) => {
  // Skip empty values
  if (!filter.value || (Array.isArray(filter.value) && filter.value.length === 0)) {
    console.log('[filterOperations] Skipping empty filter');
    return query;
  }

  // Normalize value to number if possible
  const value = !isNaN(Number(filter.value)) ? Number(filter.value) : filter.value;

  console.log('[filterOperations] Applying filter:', {
    column: filter.column,
    operator: filter.operator,
    value
  });

  switch (filter.operator) {
    case 'eq':
      return query.eq(filter.column, value);
    case 'neq':
      return query.neq(filter.column, value);
    case 'gt':
      return query.gt(filter.column, value);
    case 'gte':
      return query.gte(filter.column, value);
    case 'lt':
      return query.lt(filter.column, value);
    case 'lte':
      return query.lte(filter.column, value);
    case 'like':
      return query.like(filter.column, `%${value}%`);
    case 'ilike':
      return query.ilike(filter.column, `%${value}%`);
    case 'in':
      if (Array.isArray(value)) {
        return query.in(filter.column, value);
      }
      return query;
    default:
      console.warn('[filterOperations] Unknown operator:', filter.operator);
      return query;
  }
}