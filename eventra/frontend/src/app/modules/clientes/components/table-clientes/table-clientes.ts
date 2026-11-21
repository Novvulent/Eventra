
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { initials } from '../../../shared/utils/estado';
import { Cliente } from '../../interfaces/cliente';
import { TableClientesActions, TableClientesEvents } from '../../interfaces/table-clientes';

@Component({
  selector: 'app-table-clientes',
  standalone: true,
  imports: [Button],
  templateUrl: './table-clientes.html'
})
export class TableClientes {

  @Input() clientes: Cliente[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableClientesEvents>();

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

  click(id: number, action: TableClientesActions): void {
    this.onClickActions.emit({ id, action });
  }

}
