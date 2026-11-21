
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { Departamento } from '../../interfaces/departamento';
import { TableDepartamentosActions, TableDepartamentosEvents } from '../../interfaces/table-departamentos';

@Component({
  selector: 'app-table-departamentos',
  standalone: true,
  imports: [Button],
  templateUrl: './table-departamentos.html'
})
export class TableDepartamentos {

  @Input() departamentos: Departamento[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableDepartamentosEvents>();


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

  click(id: number, action: TableDepartamentosActions): void {
    this.onClickActions.emit({ id, action });
  }

}
