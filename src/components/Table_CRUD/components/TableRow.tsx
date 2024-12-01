import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface TableRowProps {
  row: any;
  columns: string[];
  onEdit: () => void;
  onDelete: () => void;
}

export function TableRow({ row, columns, onEdit, onDelete }: TableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      {columns.map((column) => (
        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {row[column]?.toString()}
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
}