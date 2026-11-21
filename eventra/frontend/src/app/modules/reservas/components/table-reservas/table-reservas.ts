
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from '../../../shared/components/button/button';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { badgeClass, initials } from '../../../shared/utils/estado';
import { Reserva } from '../../interfaces/reserva';
import { TableReservasActions, TableReservasEvents } from '../../interfaces/table-reservas';

@Component({
  selector: 'app-table-reservas',
  standalone: true,
  imports: [Button, CurrencyPipe, DatePipe],
  templateUrl: './table-reservas.html'
})
export class TableReservas {

  @Input() reservas: Reserva[] = [];
  @Input() loading = false;
  @Input() search = '';
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Output() onClickActions = new EventEmitter<TableReservasEvents>();

  badge = badgeClass;
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

  click(id: number, action: TableReservasActions): void {
    this.onClickActions.emit({ id, action });
  }

}
