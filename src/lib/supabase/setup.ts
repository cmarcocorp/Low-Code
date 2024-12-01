import { supabase } from '../supabase';

export async function setupDatabase() {
  try {
    // Create a function to list tables
    const { error: listTablesError } = await supabase.rpc('create_list_tables_function', {
      sql_query: `
        CREATE OR REPLACE FUNCTION list_tables()
        RETURNS TABLE (table_name text)
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          RETURN QUERY
          SELECT t.table_name::text
          FROM information_schema.tables t
          WHERE t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
            AND t.table_name != 'schema_migrations'
          ORDER BY t.table_name;
        END;
        $$;
      `
    });

    if (listTablesError) {
      console.error('Error creating list_tables function:', listTablesError);
    }

    // Create a function to execute DDL operations
    const { error: ddlError } = await supabase.rpc('create_ddl_function', {
      sql_query: `
        CREATE OR REPLACE FUNCTION execute_ddl(ddl_query text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE ddl_query;
        END;
        $$;
      `
    });

    if (ddlError) {
      console.error('Error creating execute_ddl function:', ddlError);
    }

    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}