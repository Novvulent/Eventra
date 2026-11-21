
export interface TableDepartamentosEvents {
  id: number;
  action: TableDepartamentosActions;
}

export type TableDepartamentosActions = 'detail' | 'edit' | 'delete';
