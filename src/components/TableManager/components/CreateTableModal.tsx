import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
}

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tableName: string, columns: Column[]) => Promise<void>;
}

export function CreateTableModal({ isOpen, onClose, onSubmit }: CreateTableModalProps) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([
    { name: 'id', type: 'serial', nullable: false, isPrimary: true }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(tableName, columns);
    onClose();
    setTableName('');
    setColumns([{ name: 'id', type: 'serial', nullable: false, isPrimary: true }]);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'text', nullable: true, isPrimary: false }]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Create New Table</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Columns
              </label>
              <button
                type="button"
                onClick={addColumn}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} />
                Add Column
              </button>
            </div>

            <div className="space-y-3">
              {columns.map((column, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => {
                      const newColumns = [...columns];
                      newColumns[index].name = e.target.value;
                      setColumns(newColumns);
                    }}
                    placeholder="Column name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <select
                    value={column.type}
                    onChange={(e) => {
                      const newColumns = [...columns];
                      newColumns[index].type = e.target.value;
                      setColumns(newColumns);
                    }}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text">Text</option>
                    <option value="integer">Integer</option>
                    <option value="serial">Serial</option>
                    <option value="boolean">Boolean</option>
                    <option value="timestamp">Timestamp</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeColumn(index)}
                    className="text-red-600 hover:text-red-700"
                    disabled={index === 0}
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}