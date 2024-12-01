import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

interface SQLOption {
  value: string;
  display: string;
}

export function useSelector(
  table: string, 
  displayColumn: string,
  valueColumn: string,
  orderBy?: string
) {
  const [options, setOptions] = useState<SQLOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const { data, error: queryError } = await supabase
          .from(table)
          .select(`${valueColumn}, ${displayColumn}`)
          .order(orderBy || displayColumn);

        if (queryError) throw queryError;
        
        const transformedData = data?.map(item => ({
          value: item[valueColumn],
          display: item[displayColumn]
        })) || [];
        
        setOptions(transformedData);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    if (table && displayColumn && valueColumn) {
      fetchOptions();
    }
  }, [table, displayColumn, valueColumn, orderBy]);

  return {
    options,
    loading,
    error
  };
}