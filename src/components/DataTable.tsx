import React, { useState } from 'react';
import { TableHeader } from './TableHeader';
import { TableContent } from './TableContent';
import { useTableData } from '../hooks/useTableData';
import { Modal } from './Modal';
import { RecordForm } from './RecordForm';

interface DataTableProps {
  schema: string;
  table: string;
  title: string;
}

export function DataTable({ schema, table, title }: DataTableProps) {
  const { data, columns, loading, error, addRecord, updateRecord, deleteRecord } = useTableData(schema, table);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleAdd = async (newRecord: any) => {
    const { error: addError } = await addRecord(newRecord);
    if (!addError) {
      setIsAddModalOpen(false);
    } else {
      alert(`Error adding record: ${addError}`);
    }
  };

  const handleEdit = async (updatedRecord: any) => {
    if (!selectedRecord) return;
    const { error: updateError } = await updateRecord(selectedRecord.id, updatedRecord);
    if (!updateError) {
      setIsEditModalOpen(false);
      setSelectedRecord(null);
    } else {
      alert(`Error updating record: ${updateError}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;
    const { error: deleteError } = await deleteRecord(selectedRecord.id);
    if (!deleteError) {
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
    } else {
      alert(`Error deleting record: ${deleteError}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <TableHeader 
        title={title} 
        onAdd={() => setIsAddModalOpen(true)} 
      />
      <TableContent 
        data={data} 
        columns={columns}
        onEdit={(record) => {
          setSelectedRecord(record);
          setIsEditModalOpen(true);
        }}
        onDelete={(record) => {
          setSelectedRecord(record);
          setIsDeleteModalOpen(true);
        }}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Record"
      >
        <RecordForm
          columns={columns}
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
        title="Edit Record"
      >
        <RecordForm
          columns={columns}
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
        title="Delete Record"
      >
        <div>
          <p className="mb-4">Are you sure you want to delete this record?</p>
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