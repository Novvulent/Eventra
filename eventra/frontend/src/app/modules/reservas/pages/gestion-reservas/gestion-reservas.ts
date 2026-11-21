import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../../reservas/interfaces/reserva';
import { ReservaService } from '../../../reservas/services/reserva.service';
import { badgeClass, initials } from '../../../shared/utils/estado';

@Component({
  selector: 'app-gestion-reservas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './gestion-reservas.html'
})
export class GestionReservas implements OnInit {
  private service = inject(ReservaService);

  reservas = signal<Reserva[]>([]);
  mensaje = signal('');
  error = signal('');
  estados = ['Reservada', 'Confirmada', 'Cancelada'];
  badge = badgeClass;
  initials = initials;
  filtros = ['Todas', 'Reservada', 'Confirmada', 'Cancelada'];
  filtro = signal('Todas');
  busqueda = signal('');
  cancelando = signal<Reserva | null>(null);
  causa = '';

  visibles = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.reservas().filter(
      (r) =>
        (this.filtro() === 'Todas' || r.estado === this.filtro()) &&
        (!q || [r.cliente, r.evento].some((v) => v?.toLowerCase().includes(q)))
    );
  });

  conteo(f: string): number {
    return f === 'Todas' ? this.reservas().length : this.reservas().filter((r) => r.estado === f).length;
  }

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.service.getAll().subscribe({
      next: (r) => this.reservas.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar las reservas')
    });
  }

  cambiarEstado(r: Reserva, estado: string): void {
    if (estado === r.estado) return;
    if (estado === 'Cancelada') {
      // La causa se solicita en un modal antes de enviar la actualización
      this.causa = '';
      this.cancelando.set(r);
      return;
    }
    this.actualizar(r, estado, null);
  }

  cerrarCancelacion(): void {
    this.cancelando.set(null);
    this.cargar(); // restablece el selector al estado real
  }

  confirmarCancelacion(): void {
    const r = this.cancelando();
    if (!r || !this.causa.trim()) return;
    this.cancelando.set(null);
    this.actualizar(r, 'Cancelada', this.causa.trim());
  }

  private actualizar(r: Reserva, estado: string, causa: string | null): void {
    this.service.update(r.id_reserva, { estado, causa_cancelacion: causa }).subscribe({
      next: () => {
        this.mensaje.set(`Reserva ${r.id_reserva} actualizada a ${estado}`);
        this.error.set('');
        this.cargar();
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'No se pudo actualizar la reserva');
        this.cargar();
      }
    });
  }
}
