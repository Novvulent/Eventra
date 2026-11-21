
export interface TableEventosEvents {
  id: number;
  action: TableEventosActions;
}

export type TableEventosActions = 'detail' | 'edit' | 'delete';
