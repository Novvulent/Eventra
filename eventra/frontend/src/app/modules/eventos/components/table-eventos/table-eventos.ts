
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { badgeClass } from '../../../shared/utils/estado';
import { Evento } from '../../interfaces/evento';
import { TableEventosActions, TableEventosEvents } from '../../interfaces/table-eventos';

@Component({
  selector: 'app-table-eventos',
  standalone: true,
  imports: [Button, CurrencyPipe, DatePipe],
  templateUrl: './table-eventos.html'
})
export class TableEventos {

  @Input() eventos: Evento[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableEventosEvents>();

  badge = badgeClass;

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

  click(id: number, action: TableEventosActions): void {
    this.onClickActions.emit({ id, action });
  }

}
