
export interface TableAdministradoresEvents {
  id: number;
  action: TableAdministradoresActions;
}

export type TableAdministradoresActions = 'detail' | 'edit' | 'delete';
