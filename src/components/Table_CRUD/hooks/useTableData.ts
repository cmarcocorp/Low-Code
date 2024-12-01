import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { useFilterStore } from '../../../lib/filter/store/filterStore';

interface TableError {
  message: string;
}

export function useTableData(schema: string, table: string, filterNames: string[] = []) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [displayColumns, setDisplayColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TableError | null>(null);
  
  const filters = useFilterStore(state => state.filters);

  const fetchData = useCallback(async () => {
    try {
      console.group(`[useTableData] Fetching data for ${table}`);
      console.log('Filter names:', filterNames);
      console.log('Active filters:', filters);

      let query = supabase.from(table).select('*');

      // Apply filters
      for (const filterName of filterNames) {
        const filterList = filters[filterName] || [];
        console.log(`Processing filters for ${filterName}:`, filterList);

        for (const filter of filterList) {
          if (filter.config?.table === table) {
            const targetField = filter.config.targetField || filter.column;
            const filterValues = Array.isArray(filter.value) ? filter.value : [filter.value];
            
            if (filterValues.length > 0) {
              console.log('Applying filter:', {
                table,
                field: targetField,
                values: filterValues
              });
              query = query.in(targetField, filterValues);
            }
          }
        }
      }

      const { data: tableData, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      console.log('Query results:', {
        rowCount: tableData?.length,
        data: tableData
      });
      console.groupEnd();

      if (tableData) {
        const allColumns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
        setColumns(allColumns);
        setDisplayColumns(allColumns.filter(col => col !== 'id'));
        setData(tableData);
      } else {
        setColumns([]);
        setDisplayColumns([]);
        setData([]);
      }
      setError(null);
    } catch (err: any) {
      console.error('[useTableData] Error:', err);
      setError({ message: err.message || 'Failed to fetch data' });
      setData([]);
      setColumns([]);
      setDisplayColumns([]);
    } finally {
      setLoading(false);
    }
  }, [table, schema, filterNames, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRecord = async (record: any) => {
    try {
      const { error: supabaseError } = await supabase
        .from(table)
        .insert(record);

      if (supabaseError) throw supabaseError;
      await fetchData();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateRecord = async (id: number, record: any) => {
    try {
      const { error: supabaseError } = await supabase
        .from(table)
        .update(record)
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      await fetchData();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteRecord = async (id: number) => {
    try {
      const { error: supabaseError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (supabaseError) throw supabaseError;
      await fetchData();
      return { error: null };
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return { 
    data, 
    columns,
    displayColumns,
    loading, 
    error,
    addRecord,
    updateRecord,
    deleteRecord
  };
}