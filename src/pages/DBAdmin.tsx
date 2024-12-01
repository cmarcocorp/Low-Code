import React from 'react';
import { TableManager } from '../components/TableManager';
import { Pagination } from '../components/Pagination';

export function DBAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Administration</h1>
          <TableManager />
        </div>
      </div>
      
      <Pagination currentPage={2} totalPages={2} />
    </div>
  );
}