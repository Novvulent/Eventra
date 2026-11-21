
export interface TableReservasEvents {
  id: number;
  action: TableReservasActions;
}

export type TableReservasActions = 'detail' | 'edit' | 'delete';
