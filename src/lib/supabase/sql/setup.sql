-- Create a function to safely execute SQL queries
CREATE OR REPLACE FUNCTION execute_sql(sql_query text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT jsonb_agg(row_to_json(t)) FROM (SELECT * FROM dblink('dbname=' || current_database(), sql_query) AS t) AS t);
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error executing query: %', SQLERRM;
END;
$$;