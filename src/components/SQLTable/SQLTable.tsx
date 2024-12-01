import React from 'react';
import { useSQLQuery } from './hooks/useSQLQuery';
import { TableHeader } from './components/TableHeader';
import { TableContent } from './components/TableContent';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

interface SQLTableProps {
  query: string;
  title?: string;
}

export function SQLTable({ query, title }: SQLTableProps) {
  const { data, columns, loading, error } = useSQLQuery(query);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {title && (
        <TableHeader title={title} />
      )}
      <TableContent data={data} columns={columns} />
    </div>
  );
}