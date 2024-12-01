import React from 'react';
import { useTableQuery } from './hooks/useTableQuery';
import { TableHeader } from './components/TableHeader';
import { TableContent } from './components/TableContent';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

interface TableViewProps {
  query: string;
  title?: string;
  filters?: string[];
}

export function Table_View({ query, title, filters = [] }: TableViewProps) {
  const { data, columns, loading, error } = useTableQuery(query, filters);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {title && <TableHeader title={title} />}
      <TableContent data={data} columns={columns} />
    </div>
  );
}