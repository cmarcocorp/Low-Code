import React from 'react';
import { Trash2, Edit } from 'lucide-react';

interface TableListProps {
  tables: string[];
  loading: boolean;
  error: Error | null;
  onDelete: (tableName: string) => Promise<void>;
}

export function TableList({ tables, loading, error, onDelete }: TableListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p className="font-medium">Error loading tables</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No tables found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Table Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tables.map((tableName, index) => (
            <tr key={`${tableName}-${index}`} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tableName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  className="text-blue-600 hover:text-blue-900 mr-4"
                  title="Edit table"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(tableName)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete table"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}