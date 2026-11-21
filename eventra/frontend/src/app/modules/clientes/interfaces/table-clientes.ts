
export interface TableClientesEvents {
  id: number;
  action: TableClientesActions;
}

export type TableClientesActions = 'detail' | 'edit' | 'delete';
