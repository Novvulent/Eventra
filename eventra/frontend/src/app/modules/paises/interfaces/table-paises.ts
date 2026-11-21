
export interface TablePaisesEvents {
  id: number;
  action: TablePaisesActions;
}

export type TablePaisesActions = 'detail' | 'edit' | 'delete';
