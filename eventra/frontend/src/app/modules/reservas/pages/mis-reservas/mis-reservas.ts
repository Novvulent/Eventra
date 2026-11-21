import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { Reserva } from '../../../reservas/interfaces/reserva';
import { ReservaService } from '../../../reservas/services/reserva.service';
import { badgeClass } from '../../../shared/utils/estado';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './mis-reservas.html'
})
export class MisReservas implements OnInit {
  private service = inject(ReservaService);
  private auth = inject(AuthService);

  reservas = signal<Reserva[]>([]);
  error = signal('');
  badge = badgeClass;

  resumen = computed(() => {
    const activas = this.reservas().filter((r) => r.estado !== 'Cancelada');
    return {
      confirmadas: this.reservas().filter((r) => r.estado === 'Confirmada').length,
      entradas: activas.reduce((s, r) => s + Number(r.numero_entradas || 0), 0),
      total: activas.reduce((s, r) => s + Number(r.valor_total || 0), 0)
    };
  });

  ngOnInit(): void {
    const u = this.auth.usuario();
    if (!u) return;
    this.service.getAll({ id_cliente: u.id_persona }).subscribe({
      next: (r) => this.reservas.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar las reservas')
    });
  }
}
