import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TableList } from './components/TableList';
import { CreateTableModal } from './components/CreateTableModal';
import { useTableManager } from './hooks/useTableManager';

export function TableManager() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { tables, loading, error, createTable, deleteTable } = useTableManager();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Table</span>
        </button>
      </div>

      <TableList
        tables={tables}
        loading={loading}
        error={error}
        onDelete={deleteTable}
      />

      <CreateTableModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTable}
      />
    </div>
  );
}