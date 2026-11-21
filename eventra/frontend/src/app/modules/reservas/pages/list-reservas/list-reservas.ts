
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../shared/components/button/button';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { ButtonConfig } from '../../../shared/interfaces/button';
import { AlertService } from '../../../shared/services/alert.service';
import { errorMessage } from '../../../shared/utils/http';
import { TableReservas } from '../../components/table-reservas/table-reservas';
import { Reserva } from '../../interfaces/reserva';
import { TableReservasEvents } from '../../interfaces/table-reservas';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-list-reservas',
  standalone: true,
  imports: [Button, PageHeader, TableReservas],
  templateUrl: './list-reservas.html'
})
export class ListReservas implements OnInit {

  private router = inject(Router);
  private reservaService = inject(ReservaService);
  private alertService = inject(AlertService);

  base = '/admin/reservas';
  section = 'Operación';
  subtitle = 'Reservas realizadas por los clientes.';

  reservas = signal<Reserva[]>([]);
  loading = signal(true);
  search = signal('');

  /** Búsqueda en el navegador sobre las columnas de texto. */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.reservas();
    return this.reservas().filter((item) =>
      [item.id_reserva, item.cliente, item.evento, item.numero_entradas, item.estado, item.causa_cancelacion].some((v) =>
        String(Array.isArray(v) ? v.join(' ') : v ?? '').toLowerCase().includes(q)
      )
    );
  });

  createButtonConfig: ButtonConfig = {
    id: 'create-reserva-button',
    title: 'Nueva reserva',
    type: 'primary',
    icon: 'plus-lg'
  };

  ngOnInit(): void {
    this.getReservas();
  }

  getReservas(): void {
    this.loading.set(true);
    this.reservaService.getAll().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.loading.set(false);
      },
      error: (e) => {
        this.loading.set(false);
        this.alertService.toast(errorMessage(e, 'Error al consultar reservas'), 'error');
      }
    });
  }

  createReserva(): void {
    this.router.navigateByUrl(`${this.base}/create`);
  }

  tableEvents({ id, action }: TableReservasEvents): void {
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
      `¿Eliminar reserva #${id}?`,
      'Esta acción no se puede deshacer. El registro se eliminará de la base de datos.'
    );
    if (!confirm) return;
    this.reservaService.delete(id).subscribe({
      next: (r) => {
        this.alertService.toast(r?.message ?? 'Reserva eliminada correctamente', 'success');
        this.getReservas();
      },
      error: (e) => this.alertService.toast(errorMessage(e, 'Error al eliminar la reserva'), 'error')
    });
  }

}
