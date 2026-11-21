
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableAdministradores } from '../../components/table-administradores/table-administradores';
import { Administrador } from '../../interfaces/administrador';
import { TableAdministradoresEvents } from '../../interfaces/table-administradores';
import { AdministradorService } from '../../services/administrador.service';

@Component({
  selector: 'app-list-administradores',
  standalone: true,
  imports: [Button, PageHeader, TableAdministradores],
  templateUrl: './list-administradores.html'
})
export class ListAdministradores implements OnInit {

  private router = inject(Router);
  private administradorService = inject(AdministradorService);
  private alertService = inject(AlertService);

  base = '/admin/administradores';
  section = 'Usuarios';
  subtitle = 'Usuarios con acceso total a la plataforma.';

  administradores = signal<Administrador[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.administradores();
    return this.administradores().filter((item) =>
      [item.id_persona, item.identificacion, item.nombre_completo, item.correo, item.ciudad, item.telefonos, item.horario].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-administrador-button',
    title: 'Nuevo administrador',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getAdministradores();
  }

  getAdministradores(): void {
    this.loading.set(true);
    this.administradorService.getAll().subscribe({
      next: (data) => {
        this.administradores.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar administradores'), 'error');
      }
    });
  }

  createAdministrador(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableAdministradoresEvents): void {
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
      `¿Eliminar administrador #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.administradorService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Administrador eliminado correctamente', 'success');
        this.getAdministradores();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el administrador'), 'error')
    });
  }

}
