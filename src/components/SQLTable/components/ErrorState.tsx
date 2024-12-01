import React from 'react';

interface ErrorStateProps {
  error: Error | { message: string };
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-center text-red-600 mb-2">
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="font-medium">Error executing query</h3>
      </div>
      <p className="text-sm text-red-500">{error.message}</p>
    </div>
  );
}