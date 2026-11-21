
export interface TableCiudadesEvents {
  id: number;
  action: TableCiudadesActions;
}

export type TableCiudadesActions = 'detail' | 'edit' | 'delete';
