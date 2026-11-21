
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { Pais } from '../../interfaces/pais';
import { TablePaisesActions, TablePaisesEvents } from '../../interfaces/table-paises';

@Component({
  selector: 'app-table-paises',
  standalone: true,
  imports: [Button],
  templateUrl: './table-paises.html'
})
export class TablePaises {

  @Input() paises: Pais[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TablePaisesEvents>();


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

  click(id: number, action: TablePaisesActions): void {
    this.onClickActions.emit({ id, action });
  }

}
