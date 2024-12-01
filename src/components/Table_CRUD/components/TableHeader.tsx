import React from 'react';
import { Plus } from 'lucide-react';

interface TableHeaderProps {
  title: string;
  onAdd: () => void;
}

export function TableHeader({ title, onAdd }: TableHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <button 
        onClick={onAdd}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus size={20} />
        <span>Add Record</span>
      </button>
    </div>
  );
}