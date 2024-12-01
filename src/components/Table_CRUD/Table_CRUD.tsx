import React, { useState } from 'react';
import { TableHeader } from './components/TableHeader';
import { TableContent } from './components/TableContent';
import { useTableData } from './hooks/useTableData';
import { Modal } from './components/Modal';
import { RecordForm } from './components/RecordForm';

interface Table_CRUDProps {
  schema: string;
  table: string;
  title: string;
  filters?: string[];
}

export function Table_CRUD({ schema, table, title, filters = [] }: Table_CRUDProps) {
  const { data, columns, displayColumns, loading, error, addRecord, updateRecord, deleteRecord } = useTableData(schema, table, filters);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleAdd = async (newRecord: any) => {
    console.log('[Table_CRUD] Adding new record:', newRecord);
    const { error: addError } = await addRecord(newRecord);
    if (!addError) {
      setIsAddModalOpen(false);
    } else {
      console.error('[Table_CRUD] Error adding record:', addError);
      alert(`Error adding record: ${addError}`);
    }
  };

  const handleEdit = async (updatedRecord: any) => {
    if (!selectedRecord) return;
    console.log('[Table_CRUD] Updating record:', { id: selectedRecord.id, data: updatedRecord });
    const { error: updateError } = await updateRecord(selectedRecord.id, updatedRecord);
    if (!updateError) {
      setIsEditModalOpen(false);
      setSelectedRecord(null);
    } else {
      console.error('[Table_CRUD] Error updating record:', updateError);
      alert(`Error updating record: ${updateError}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    console.log('[Table_CRUD] Deleting record:', selectedRecord.id);
    const { error: deleteError } = await deleteRecord(selectedRecord.id);
    if (!deleteError) {
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
    } else {
      console.error('[Table_CRUD] Error deleting record:', deleteError);
      alert(`Error deleting record: ${deleteError}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <TableHeader 
            title={title} 
            onAdd={() => setIsAddModalOpen(true)} 
          />
        </div>
        <div className="p-6">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No rows found</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first row
              </button>
            </div>
          ) : (
            <>
              <TableContent 
                data={data} 
                columns={columns}
                displayColumns={displayColumns}
                onEdit={(record) => {
                  setSelectedRecord(record);
                  setIsEditModalOpen(true);
                }}
                onDelete={(record) => {
                  setSelectedRecord(record);
                  setIsDeleteModalOpen(true);
                }}
              />
              <div className="mt-4 text-sm text-gray-600 border-t border-gray-100 pt-4 flex justify-between items-center">
                <span>
                  Showing <span className="font-medium">{data.length}</span> {data.length === 1 ? 'row' : 'rows'}
                </span>
                {filters && filters.length > 0 && (
                  <span className="text-gray-500">
                    Filtered by: {filters.join(', ')}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Row"
      >
        <RecordForm
          columns={displayColumns}
          onSubmit={handleAdd}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecord(null);
        }}
        title="Edit Row"
      >
        <RecordForm
          columns={displayColumns}
          initialData={selectedRecord}
          onSubmit={handleEdit}
          onCancel={() => {
            setIsEditModalOpen(false);
            setSelectedRecord(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedRecord(null);
        }}
        title="Delete Row"
      >
        <div>
          <p className="mb-4">Are you sure you want to delete this row?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedRecord(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}