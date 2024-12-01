import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface TableError {
  message: string;
}

export function useTableData(schema: string, table: string) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<TableError | null>(null);

  const fetchData = async () => {
    try {
      const { data: tableData, error: supabaseError } = await supabase
        .from(table)
        .select('*');

      if (supabaseError) throw supabaseError;

      if (tableData && tableData.length > 0) {
        setColumns(Object.keys(tableData[0]));
        setData(tableData);
      } else {
        setColumns([]);
        setData([]);
      }
      setError(null);
    } catch (err: any) {
      setError({ message: err.message || 'Failed to fetch data' });
      setData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchData();
  }, [schema, table]);

  return { 
    data, 
    columns, 
    loading, 
    error,
    addRecord,
    updateRecord,
    deleteRecord
  };
}