
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { Ciudad } from '../../interfaces/ciudad';
import { TableCiudadesActions, TableCiudadesEvents } from '../../interfaces/table-ciudades';

@Component({
  selector: 'app-table-ciudades',
  standalone: true,
  imports: [Button],
  templateUrl: './table-ciudades.html'
})
export class TableCiudades {

  @Input() ciudades: Ciudad[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableCiudadesEvents>();


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

  click(id: number, action: TableCiudadesActions): void {
    this.onClickActions.emit({ id, action });
  }

}
