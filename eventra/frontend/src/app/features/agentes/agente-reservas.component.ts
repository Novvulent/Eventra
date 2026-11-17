import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reserva } from '../../core/models/reserva.model';
import { ReservaService } from '../../core/services/reserva.service';
import { badgeClass, initials } from '../../shared/utils';

@Component({
  selector: 'app-agente-reservas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="ev-page">
      <header class="ev-page-header">
        <div>
          <div class="ev-eyebrow"><i class="bi bi-ticket-detailed"></i> Panel del agente</div>
          <h1 class="ev-page-title">Administración de reservas</h1>
          <p class="ev-page-sub">Confirma o cancela las reservas de los clientes.</p>
        </div>
        <div class="ev-input-icon ev-search">
          <i class="bi bi-search"></i>
          <input class="form-control" type="search" placeholder="Buscar cliente o evento..."
                 [value]="busqueda()" (input)="busqueda.set($any($event.target).value)" aria-label="Buscar reservas">
        </div>
      </header>

      @if (mensaje()) {
        <div class="ev-alert success"><i class="bi bi-check-circle-fill"></i><span>{{ mensaje() }}</span>
          <button class="ev-alert-close" (click)="mensaje.set('')" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button></div>
      }
      @if (error()) {
        <div class="ev-alert danger"><i class="bi bi-exclamation-octagon-fill"></i><span>{{ error() }}</span>
          <button class="ev-alert-close" (click)="error.set('')" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button></div>
      }

      <div class="card">
        <div class="ev-card-header">
          <div class="ev-chips">
            @for (f of filtros; track f) {
              <button class="ev-chip" [class.active]="filtro() === f" (click)="filtro.set(f)">
                {{ f }}<span class="n">{{ conteo(f) }}</span>
              </button>
            }
          </div>
        </div>
        <div class="table-responsive">
          <table class="table ev-table ev-compact table-hover">
            <thead>
              <tr>
                <th>ID</th><th>Cliente</th><th>Evento</th><th>Fecha</th><th>Entradas</th>
                <th>Valor total</th><th>Estado</th><th>Causa de cancelación</th>
              </tr>
            </thead>
            <tbody>
              @for (r of visibles(); track r.id_reserva) {
                <tr>
                  <td class="ev-id">#{{ r.id_reserva }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <span class="ev-avatar sm soft">{{ initials(r.cliente) }}</span>
                      <span class="fw-semibold">{{ r.cliente }}</span>
                    </div>
                  </td>
                  <td>{{ r.evento }}</td>
                  <td class="ev-num">{{ r.fecha_hora | date: 'd MMM y, h:mm a' }}</td>
                  <td class="ev-num">{{ r.numero_entradas }}</td>
                  <td class="ev-num fw-semibold">{{ r.valor_total | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                  <td style="min-width: 160px">
                    <select class="form-select form-select-sm" [value]="r.estado" [attr.aria-label]="'Estado de la reserva ' + r.id_reserva"
                            (change)="cambiarEstado(r, $any($event.target).value)">
                      @for (e of estados; track e) { <option [value]="e" [selected]="e === r.estado">{{ e }}</option> }
                    </select>
                  </td>
                  <td class="text-muted">{{ r.causa_cancelacion || '—' }}</td>
                </tr>
              } @empty {
                <tr><td colspan="8"><div class="ev-empty">
                  <i class="bi bi-inbox"></i><strong>No hay reservas</strong>No se encontraron reservas con este filtro.
                </div></td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Causa de cancelación -->
    @if (cancelando(); as c) {
      <div class="ev-modal-backdrop" (click)="cerrarCancelacion()">
        <form class="ev-modal" (click)="$event.stopPropagation()" (ngSubmit)="confirmarCancelacion()" #f="ngForm">
          <div class="ev-modal-icon"><i class="bi bi-x-octagon"></i></div>
          <h5>Cancelar reserva #{{ c.id_reserva }}</h5>
          <p class="text-muted">{{ c.cliente }} · {{ c.evento }}</p>
          <label class="form-label" for="causa">Causa de la cancelación</label>
          <textarea class="form-control mb-4" id="causa" name="causa" rows="3" [(ngModel)]="causa" required
                    placeholder="Ej.: solicitud del cliente"></textarea>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-light" type="button" (click)="cerrarCancelacion()">Volver</button>
            <button class="btn btn-danger" type="submit" [disabled]="f.invalid">Cancelar reserva</button>
          </div>
        </form>
      </div>
    }
  `
})
export class AgenteReservasComponent implements OnInit {
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
