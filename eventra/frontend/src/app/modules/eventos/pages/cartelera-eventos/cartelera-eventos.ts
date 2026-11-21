import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Evento } from '../../../eventos/interfaces/evento';
import { EventoService } from '../../../eventos/services/evento.service';
import { ReservaService } from '../../../reservas/services/reserva.service';
import { badgeClass, posterGradient } from '../../../shared/utils/estado';

@Component({
  selector: 'app-cartelera-eventos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './cartelera-eventos.html'
})
export class CarteleraEventos implements OnInit {
  private eventos = inject(EventoService);
  private reservas = inject(ReservaService);
  private auth = inject(AuthService);

  lista = signal<Evento[]>([]);
  seleccionado = signal<Evento | null>(null);
  mensaje = signal('');
  error = signal('');
  entradas = 1;
  observaciones = '';
  badge = badgeClass;
  poster = posterGradient;
  cargando = signal(true);
  busqueda = signal('');
  filtro = signal('Todos');

  estados = computed(() => {
    const conteo = new Map<string, number>();
    for (const e of this.lista()) conteo.set(e.estado, (conteo.get(e.estado) ?? 0) + 1);
    return [{ nombre: 'Todos', total: this.lista().length }, ...[...conteo].map(([nombre, total]) => ({ nombre, total }))];
  });

  visibles = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const f = this.filtro();
    return this.lista().filter(
      (e) =>
        (f === 'Todos' || e.estado === f) &&
        (!q || [e.nombre, e.teatro, e.ciudad, e.descripcion].some((v) => v?.toLowerCase().includes(q)))
    );
  });

  ngOnInit(): void {
    this.eventos.getAll().subscribe({
      next: (e) => {
        this.lista.set(e.filter((x) => x.estado !== 'Finalizado' && x.estado !== 'Cancelado'));
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'No se pudieron cargar los eventos');
        this.cargando.set(false);
      }
    });
  }

  reservar(e: Evento): void {
    this.seleccionado.set(e);
    this.entradas = 1;
    this.observaciones = '';
    this.mensaje.set('');
    this.error.set('');
  }

  total(): number {
    const e = this.seleccionado();
    return e ? e.precio_base * this.entradas : 0;
  }

  confirmar(): void {
    const e = this.seleccionado();
    const u = this.auth.usuario();
    if (!e || !u) return;
    const data: Record<string, unknown> = {
      id_cliente: u.id_persona,
      codigo_evento: e.codigo_evento,
      numero_entradas: this.entradas,
      valor_total: this.total(),
      estado: 'Reservada'
    };
    if (this.observaciones) data['observaciones'] = this.observaciones;
    this.reservas.create(data).subscribe({
      next: () => {
        this.mensaje.set('Reserva realizada correctamente.');
        this.error.set('');
        this.seleccionado.set(null);
      },
      error: (err) => this.error.set(err?.error?.message ?? 'No se pudo crear la reserva')
    });
  }
}
