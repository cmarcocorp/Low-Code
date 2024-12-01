import React, { useState } from 'react';

interface RecordFormProps {
  columns: string[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function RecordForm({ columns, initialData, onSubmit, onCancel }: RecordFormProps) {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    columns.forEach(column => {
      if (!formData[column] && formData[column] !== 0) {
        newErrors[column] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {columns.map((column) => (
        <div key={column}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {column.charAt(0).toUpperCase() + column.slice(1)}
          </label>
          <input
            type="text"
            value={formData[column] || ''}
            onChange={(e) => {
              setFormData({ ...formData, [column]: e.target.value });
              if (errors[column]) {
                setErrors({ ...errors, [column]: '' });
              }
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors[column] ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors[column] && (
            <p className="mt-1 text-sm text-red-500">{errors[column]}</p>
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}