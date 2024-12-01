import React from 'react';
import { TableRow } from './TableRow';

interface TableContentProps {
  data: any[];
  columns: string[];
  displayColumns: string[];
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
}

export function TableContent({ data, displayColumns, onEdit, onDelete }: TableContentProps) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {displayColumns.map((column) => (
              <th
                key={column}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <TableRow 
              key={row.id || index} 
              row={row} 
              columns={displayColumns}
              onEdit={() => onEdit(row)}
              onDelete={() => onDelete(row)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}