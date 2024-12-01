import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface DropdownProps {
  value: string[];
  onChange: (value: string | string[]) => void;
  options: { value: string; display: string | number }[];
  loading?: boolean;
  placeholder?: string;
  className?: string;
  multiselect?: boolean;
}

export function Dropdown({
  value = [],
  onChange,
  options = [],
  loading = false,
  placeholder = 'Select a value...',
  className = '',
  multiselect = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    if (!multiselect) {
      onChange([optionValue]);
      setIsOpen(false);
      return;
    }

    const newValues = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValues);
  };

  const handleRemoveValue = (valueToRemove: string) => {
    const newValues = value.filter(v => v !== valueToRemove);
    onChange(newValues);
  };

  const getDisplayValue = (val: string) => {
    const option = options.find(opt => opt.value === val);
    return option?.display?.toString() || val;
  };

  const displayValue = multiselect
    ? value.length > 0 ? `${value.length} selected` : placeholder
    : getDisplayValue(value[0]) || placeholder;

  const filteredOptions = options.filter(option =>
    option.display?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {multiselect && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((selectedValue) => (
            <span
              key={selectedValue}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
            >
              {getDisplayValue(selectedValue)}
              <button
                onClick={() => handleRemoveValue(selectedValue)}
                className="hover:text-blue-900 focus:outline-none"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => !loading && setIsOpen(!isOpen)}
        disabled={loading}
        className={`w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between gap-2 ${
          isOpen ? 'ring-2 ring-blue-500 border-transparent' : 'hover:border-gray-400'
        } ${loading ? 'bg-gray-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`truncate ${!value.length ? 'text-gray-500' : 'text-gray-900'}`}>
          {loading ? 'Loading...' : displayValue}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search options..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleOptionClick(option.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className={`${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>
                        {option.display.toString()}
                      </span>
                    </label>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                {searchTerm ? 'No matching options' : 'No options available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}