
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { initials } from '../../../shared/utils/estado';
import { Agente } from '../../interfaces/agente';
import { TableAgentesActions, TableAgentesEvents } from '../../interfaces/table-agentes';

@Component({
  selector: 'app-table-agentes',
  standalone: true,
  imports: [Button],
  templateUrl: './table-agentes.html'
})
export class TableAgentes {

  @Input() agentes: Agente[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableAgentesEvents>();

  initials = initials;

  configDetailButton: ButtonConfig = {
    id: 'detail',
    type: 'secondary',
    icon: 'eye',
    outline: true,
    size: 'sm',
    tooltip: 'Ver detalle'
  };

  configEditButton: ButtonConfig = {
    id: 'update',
    type: 'primary',
    icon: 'pencil',
    outline: true,
    size: 'sm',
    tooltip: 'Editar'
  };

  configDeleteButton: ButtonConfig = {
    id: 'delete',
    type: 'danger',
    icon: 'trash3',
    outline: true,
    size: 'sm',
    tooltip: 'Eliminar'
  };

  click(id: number, action: TableAgentesActions): void {
    this.onClickActions.emit({ id, action });
  }

}
