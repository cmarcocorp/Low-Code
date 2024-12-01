import React from 'react';
import { X } from 'lucide-react';

interface FilterBadgeProps {
  column: string;
  operator: string;
  value: string;
  onRemove: () => void;
}

const operatorLabels: Record<string, string> = {
  eq: 'equals',
  neq: 'not equals',
  gt: 'greater than',
  gte: 'greater than or equal',
  lt: 'less than',
  lte: 'less than or equal',
  like: 'contains',
  ilike: 'contains (case insensitive)'
};

export function FilterBadge({ column, operator, value, onRemove }: FilterBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
      <span className="font-medium">{column}</span>
      <span className="text-blue-500">{operatorLabels[operator]}</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="hover:text-blue-900 focus:outline-none"
        title="Remove filter"
      >
        <X size={14} />
      </button>
    </div>
  );
}