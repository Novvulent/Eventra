import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { badgeClass, initials } from '../../../shared/utils/estado';
import { ReportesService } from '../../services/reportes.service';

const ANIO = 2026;
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private reportes = inject(ReportesService);

  anio = ANIO;
  meses = MESES;
  d = signal<any | null>(null);
  error = signal('');
  badge = badgeClass;
  initials = initials;

  ngOnInit(): void {
    forkJoin({
      general: this.reportes.general(),
      promedioAgente: this.reportes.promedioIngresosAgente(),
      promedioCliente: this.reportes.promedioIngresosCliente(),
      ingresosMensuales: this.reportes.ingresosMensuales(ANIO),
      reservasEventoMes: this.reportes.reservasEventoMes(ANIO),
      eventosAgenteCiudad: this.reportes.eventosAgenteCiudad(),
      eventosUbicacion: this.reportes.eventosUbicacion(),
      historial: this.reportes.historialReservasCliente(),
      reservasCanceladas: this.reportes.reservasCanceladas(),
      eventosCancelados: this.reportes.eventosCancelados()
    }).subscribe({
      next: (r) => this.d.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar los reportes')
    });
  }

  tarjetas(g: Record<string, number>) {
    return [
      { label: 'Clientes', valor: g['clientes'], icon: 'bi-people', tone: 'tone-primary' },
      { label: 'Agentes', valor: g['agentes'], icon: 'bi-person-badge', tone: 'tone-gold' },
      { label: 'Administradores', valor: g['administradores'], icon: 'bi-shield-lock', tone: 'tone-ink' },
      { label: 'Reservas', valor: g['reservas'], icon: 'bi-ticket-detailed', tone: 'tone-success' },
      { label: 'Eventos', valor: g['eventos'], icon: 'bi-calendar-event', tone: 'tone-info' }
    ];
  }

  /** Serie de 12 meses (los meses sin datos quedan en cero) con porcentaje respecto al máximo. */
  serieMensual(lista: { mes: number; ingresos: number }[]) {
    const porMes = new Map(lista.map((x) => [Number(x.mes), Number(x.ingresos) || 0]));
    const max = Math.max(...porMes.values(), 0);
    return MESES.map((_, i) => {
      const ingresos = porMes.get(i + 1) ?? 0;
      return { mes: i + 1, ingresos, pct: max ? Math.round((ingresos / max) * 100) : 0 };
    });
  }

  totalAnual(lista: { ingresos: number }[]): number {
    return lista.reduce((s, x) => s + (Number(x.ingresos) || 0), 0);
  }
}
