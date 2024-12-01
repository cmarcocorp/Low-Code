import React from 'react';

interface TableHeaderProps {
  title: string;
}

export function TableHeader({ title }: TableHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
  );
}