import React, { useState } from 'react';
import { Filter as FilterIcon, Plus, X } from 'lucide-react';

interface FilterFormProps {
  columns: string[];
  onApply: (filter: FilterConfig) => void;
}

interface FilterConfig {
  column: string;
  operator: string;
  value: string;
}

const operators = [
  { value: 'eq', label: 'Equals' },
  { value: 'neq', label: 'Not equals' },
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less than or equal' },
  { value: 'like', label: 'Contains' },
  { value: 'ilike', label: 'Contains (case insensitive)' }
];

export function FilterForm({ columns, onApply }: FilterFormProps) {
  const [filter, setFilter] = useState<FilterConfig>({
    column: columns[0] || '',
    operator: 'eq',
    value: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filter.column && filter.operator && filter.value.trim()) {
      onApply(filter);
      setFilter({ ...filter, value: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <select
          value={filter.column}
          onChange={(e) => setFilter({ ...filter, column: e.target.value })}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>

        <select
          value={filter.operator}
          onChange={(e) => setFilter({ ...filter, operator: e.target.value })}
          className="px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            value={filter.value}
            onChange={(e) => setFilter({ ...filter, value: e.target.value })}
            placeholder="Value"
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
            title="Add filter"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </form>
  );
}