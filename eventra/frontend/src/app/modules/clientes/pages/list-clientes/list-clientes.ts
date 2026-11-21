
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableClientes } from '../../components/table-clientes/table-clientes';
import { Cliente } from '../../interfaces/cliente';
import { TableClientesEvents } from '../../interfaces/table-clientes';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-list-clientes',
  standalone: true,
  imports: [Button, PageHeader, TableClientes],
  templateUrl: './list-clientes.html'
})
export class ListClientes implements OnInit {

  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private alertService = inject(AlertService);

  base = '/admin/clientes';
  section = 'Usuarios';
  subtitle = 'Clientes registrados, sus puntos y preferencias.';

  clientes = signal<Cliente[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.clientes();
    return this.clientes().filter((item) =>
      [item.id_persona, item.identificacion, item.nombre_completo, item.correo, item.ciudad, item.telefonos, item.puntos].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-cliente-button',
    title: 'Nuevo cliente',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.loading.set(true);
    this.clienteService.getAll().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar clientes'), 'error');
      }
    });
  }

  createCliente(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableClientesEvents): void {
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
      `¿Eliminar cliente #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.clienteService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Cliente eliminado correctamente', 'success');
        this.getClientes();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar el cliente'), 'error')
    });
  }

}
