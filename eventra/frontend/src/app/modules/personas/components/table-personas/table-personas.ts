
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { initials } from '../../../shared/utils/estado';
import { Persona } from '../../interfaces/persona';
import { TablePersonasActions, TablePersonasEvents } from '../../interfaces/table-personas';

@Component({
  selector: 'app-table-personas',
  standalone: true,
  imports: [Button],
  templateUrl: './table-personas.html'
})
export class TablePersonas {

  @Input() personas: Persona[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TablePersonasEvents>();

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

  click(id: number, action: TablePersonasActions): void {
    this.onClickActions.emit({ id, action });
  }

}
