import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
}

export function useTableManager() {
  const [tables, setTables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE')
        .neq('table_name', 'schema_migrations')
        .order('table_name');

      if (fetchError) throw fetchError;

      setTables(data?.map(t => t.table_name) || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tables:', err);
      setError(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (tableName: string, columns: Column[]) => {
    try {
      const createTableSQL = `
        CREATE TABLE "${tableName}" (
          ${columns
            .map(col => {
              const constraints = [];
              if (!col.nullable) constraints.push('NOT NULL');
              if (col.isPrimary) constraints.push('PRIMARY KEY');
              return `"${col.name}" ${col.type.toUpperCase()} ${constraints.join(' ')}`;
            })
            .join(',\n')}
        )
      `;

      const { error: createError } = await supabase.rpc('execute_sql', {
        sql_query: createTableSQL
      });

      if (createError) throw createError;

      await fetchTables();
    } catch (err: any) {
      console.error('Error creating table:', err);
      setError(err);
      throw err;
    }
  };

  const deleteTable = async (tableName: string) => {
    try {
      const { error: deleteError } = await supabase.rpc('execute_sql', {
        sql_query: `DROP TABLE IF EXISTS "${tableName}"`
      });

      if (deleteError) throw deleteError;

      await fetchTables();
    } catch (err: any) {
      console.error('Error deleting table:', err);
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return {
    tables,
    loading,
    error,
    createTable,
    deleteTable
  };
}