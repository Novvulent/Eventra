
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableCiudades } from '../../components/table-ciudades/table-ciudades';
import { Ciudad } from '../../interfaces/ciudad';
import { TableCiudadesEvents } from '../../interfaces/table-ciudades';
import { CiudadService } from '../../services/ciudad.service';

@Component({
  selector: 'app-list-ciudades',
  standalone: true,
  imports: [Button, PageHeader, TableCiudades],
  templateUrl: './list-ciudades.html'
})
export class ListCiudades implements OnInit {

  private router = inject(Router);
  private ciudadService = inject(CiudadService);
  private alertService = inject(AlertService);

  base = '/admin/ciudades';
  section = 'Localización';
  subtitle = 'Ciudades donde se realizan los eventos.';

  ciudades = signal<Ciudad[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.ciudades();
    return this.ciudades().filter((item) =>
      [item.id_ciudad, item.nombre, item.departamento, item.pais].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-ciudad-button',
    title: 'Nueva ciudad',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getCiudades();
  }

  getCiudades(): void {
    this.loading.set(true);
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar ciudades'), 'error');
      }
    });
  }

  createCiudad(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableCiudadesEvents): void {
    switch (action) {
      case 'detail':
        this.viewDetail(id);
        break;
      case 'edit':
        this.update(id);
        break;
      case 'delete':
        this.delete(id);
        break;
    }
  }

  viewDetail(id: number): void {
    this.router.navigateByUrl(`${this.base}/detail/${id}`);
  }

  update(id: number): void {
    this.router.navigateByUrl(`${this.base}/update/${id}`);
  }

  async delete(id: number): Promise<void> {
    const confirm = await this.alertService.confirm(
      `¿Eliminar ciudad #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.ciudadService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Ciudad eliminada correctamente', 'success');
        this.getCiudades();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar la ciudad'), 'error')
    });
  }

}
