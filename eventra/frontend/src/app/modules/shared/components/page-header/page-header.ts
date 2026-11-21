import { Component, Input } from '@angular/core';

/** Encabezado de página: sección, título, subtítulo y acciones (contenido proyectado). */
@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.html'
})
export class PageHeader {
  @Input() icon = 'bi-table';
  @Input() section = '';
  @Input({ required: true }) title!: string;
  @Input() subtitle = '';
}
