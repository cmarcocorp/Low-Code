import React from 'react';
import { useFilter } from '../../lib/filter/hooks/useFilter';
import type { FilterConfig } from '../../lib/filter/types/FilterTypes';

interface FilterProps extends FilterConfig {
  title?: string;
}

export function Filter({ 
  name,
  valueField,
  schema,
  table,
  targetField,
  title
}: FilterProps) {
  useFilter({
    name,
    valueField,
    schema,
    table,
    targetField
  });

  // Filter is a logical component that doesn't render anything
  return null;
}