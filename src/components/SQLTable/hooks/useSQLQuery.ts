import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface SQLQueryResult {
  data: any[];
  columns: string[];
  loading: boolean;
  error: Error | null;
}

export function useSQLQuery(query: string): SQLQueryResult {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function executeQuery() {
      try {
        setLoading(true);
        setError(null);

        const { data: result, error: queryError } = await supabase.rpc('execute_sql', {
          sql_query: query
        });

        if (queryError) throw queryError;

        if (result && result.length > 0) {
          setColumns(Object.keys(result[0]));
          setData(result);
        } else {
          setColumns([]);
          setData([]);
        }
      } catch (err: any) {
        setError(err);
        setData([]);
        setColumns([]);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      executeQuery();
    }
  }, [query]);

  return { data, columns, loading, error };
}