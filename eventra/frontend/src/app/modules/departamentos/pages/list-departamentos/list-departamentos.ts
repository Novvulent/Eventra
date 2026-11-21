
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableDepartamentos } from '../../components/table-departamentos/table-departamentos';
import { Departamento } from '../../interfaces/departamento';
import { TableDepartamentosEvents } from '../../interfaces/table-departamentos';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-list-departamentos',
  standalone: true,
  imports: [Button, PageHeader, TableDepartamentos],
  templateUrl: './list-departamentos.html'
})
export class ListDepartamentos implements OnInit {

  private router = inject(Router);
  private departamentoService = inject(DepartamentoService);
  private alertService = inject(AlertService);

  base = '/admin/departamentos';
  section = 'Localización';
  subtitle = 'Departamentos o estados asociados a cada país.';

  departamentos = signal<Departamento[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.departamentos();
    return this.departamentos().filter((item) =>
      [item.id_departamento, item.nombre, item.pais].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-departamento-button',
    title: 'Nuevo departamento',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getDepartamentos();
  }

  getDepartamentos(): void {
    this.loading.set(true);
    this.departamentoService.getAll().subscribe({
      next: (data) => {
        this.departamentos.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar departamentos'), 'error');
      }
    });
  }

  createDepartamento(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableDepartamentosEvents): void {
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
      `¿Eliminar departamento #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.departamentoService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Departamento eliminado correctamente', 'success');
        this.getDepartamentos();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el departamento'), 'error')
    });
  }

}
