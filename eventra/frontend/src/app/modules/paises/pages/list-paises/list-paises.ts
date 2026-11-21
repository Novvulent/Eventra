
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TablePaises } from '../../components/table-paises/table-paises';
import { Pais } from '../../interfaces/pais';
import { TablePaisesEvents } from '../../interfaces/table-paises';
import { PaisService } from '../../services/pais.service';

@Component({
  selector: 'app-list-paises',
  standalone: true,
  imports: [Button, PageHeader, TablePaises],
  templateUrl: './list-paises.html'
})
export class ListPaises implements OnInit {

  private router = inject(Router);
  private paisService = inject(PaisService);
  private alertService = inject(AlertService);

  base = '/admin/paises';
  section = 'Localización';
  subtitle = 'Países disponibles para ubicar personas y eventos.';

  paises = signal<Pais[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.paises();
    return this.paises().filter((item) =>
      [item.id_pais, item.nombre].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-pais-button',
    title: 'Nuevo país',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getPaises();
  }

  getPaises(): void {
    this.loading.set(true);
    this.paisService.getAll().subscribe({
      next: (data) => {
        this.paises.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar países'), 'error');
      }
    });
  }

  createPais(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TablePaisesEvents): void {
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
      `¿Eliminar país #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.paisService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'País eliminado correctamente', 'success');
        this.getPaises();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el país'), 'error')
    });
  }

}
