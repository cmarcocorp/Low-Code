import React from 'react';
import { Filter } from '../components/Filter';
import { Selector } from '../components/Selector';
import { Table_CRUD } from '../components/Table_CRUD';
import { Table_View } from '../components/Table_View';
import { Pagination } from '../components/Pagination';
import { useFilterStore } from '../lib/filter/store/filterStore';

export function Page1() {
  const { addFilter } = useFilterStore();

  // Set default filter value
  React.useEffect(() => {
    addFilter('filtro_1', {
      column: 'id',
      operator: 'in',
      value: [2]
    }, {
      table: 'tabla_1',
      schema: 'public',
      targetField: 'id'
    });
  }, [addFilter]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* SQL Query View with filters */}
        <Table_View 
          query="SELECT * FROM public.tabla_1"
          title="Table 1 Contents"
          filters={['filtro_1']}
        />

        {/* Hidden filters that connect Selectors with CRUD */}
        <Filter
          name="filtro_1"
          valueField="id"
          schema="public"
          table="tabla_1"
          targetField="id"
        />
        <Filter
          name="filtro_2"
          valueField="id"
          schema="public"
          table="tabla_2"
          targetField="id"
        />
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Selector 
              table="tabla_1"
              displayColumn="nombre"
              valueColumn="id"
              filterName="filtro_1"
              multiselect={true}
              placeholder="Select from Table 1..."
              title="Table 1 Selection"
            />
          </div>
          <div>
            <Selector 
              table="tabla_2"
              displayColumn="producto_nombre"
              valueColumn="id"
              filterName="filtro_2"
              multiselect={true}
              placeholder="Select from Table 2..."
              title="Table 2 Selection"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <Table_CRUD 
            schema="public"
            table="tabla_1"
            title="Table 1 Management"
            filters={['filtro_1']}
          />
          <Table_CRUD 
            schema="public"
            table="tabla_2"
            title="Table 2 Management"
            filters={['filtro_2']}
          />
        </div>
      </div>
      
      <Pagination currentPage={1} totalPages={2} />
    </div>
  );
}