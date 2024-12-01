import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useFilterStore } from '../../../lib/filter/store/filterStore';

interface TableQueryResult {
  data: any[];
  columns: string[];
  loading: boolean;
  error: Error | null;
}

export function useTableQuery(query: string, filterNames: string[] = []): TableQueryResult {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filters = useFilterStore(state => state.filters);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const words = query.toLowerCase().split(' ');
        const fromIndex = words.indexOf('from');
        
        if (fromIndex === -1) {
          throw new Error('Invalid query format: Missing FROM clause');
        }

        const tableName = words[fromIndex + 1];
        if (!tableName) {
          throw new Error('Invalid query format: Missing table name');
        }

        // Remove schema prefix if present
        const cleanTableName = tableName.includes('.') ? tableName.split('.')[1] : tableName;

        let queryBuilder = supabase.from(cleanTableName).select('*');

        // Apply filters
        for (const filterName of filterNames) {
          const filterList = filters[filterName] || [];
          for (const filter of filterList) {
            if (filter.config?.table === cleanTableName) {
              const targetField = filter.config.targetField || filter.column;
              const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value];
              
              if (filterValues.length > 0) {
                console.log('Applying filter to Table_View:', {
                  table: cleanTableName,
                  field: targetField,
                  values: filterValues
                });
                queryBuilder = queryBuilder.in(targetField, filterValues);
              }
            }
          }
        }

        const { data: result, error: queryError } = await queryBuilder;

        if (queryError) throw queryError;

        if (result && result.length > 0) {
          setColumns(Object.keys(result[0]));
          setData(result);
        } else {
          setColumns([]);
          setData([]);
        }
      } catch (err: any) {
        console.error('Query error:', err);
        setError(err);
        setData([]);
        setColumns([]);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      fetchData();
    }
  }, [query, filterNames, filters]);

  return { data, columns, loading, error };
}