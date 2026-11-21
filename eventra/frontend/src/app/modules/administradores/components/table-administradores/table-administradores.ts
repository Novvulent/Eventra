
import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { initials } from '../../../shared/utils/estado';
import { Administrador } from '../../interfaces/administrador';
import { TableAdministradoresActions, TableAdministradoresEvents } from '../../interfaces/table-administradores';

@Component({
  selector: 'app-table-administradores',
  standalone: true,
  imports: [Button, CurrencyPipe],
  templateUrl: './table-administradores.html'
})
export class TableAdministradores {

  @Input() administradores: Administrador[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableAdministradoresEvents>();

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

  click(id: number, action: TableAdministradoresActions): void {
    this.onClickActions.emit({ id, action });
  }

}
