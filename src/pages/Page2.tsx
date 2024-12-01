import React from 'react';
import { Table_View } from '../components/Table_View';
import { Pagination } from '../components/Pagination';

export function Page2() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <Table_View 
          query="SELECT * FROM tabla_2"
          title="Table 2 Contents"
        />
        
        {/* Add more content specific to Page 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Page 2 Content</h2>
          <p className="text-gray-600">This is the second page of our application.</p>
        </div>
      </div>
      
      {/* Pagination */}
      <Pagination currentPage={2} totalPages={2} />
    </div>
  );
}