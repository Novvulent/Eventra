
export interface TablePersonasEvents {
  id: number;
  action: TablePersonasActions;
}

export type TablePersonasActions = 'detail' | 'edit' | 'delete';
