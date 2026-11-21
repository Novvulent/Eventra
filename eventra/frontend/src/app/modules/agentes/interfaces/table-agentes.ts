
export interface TableAgentesEvents {
  id: number;
  action: TableAgentesActions;
}

export type TableAgentesActions = 'detail' | 'edit' | 'delete';
