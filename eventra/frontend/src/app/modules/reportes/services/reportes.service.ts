import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  EventoCancelado,
  EventoUbicacion,
  EventosAgenteCiudad,
  HistorialReserva,
  IngresoMensual,
  PromedioIngresosAgente,
  PromedioIngresosCliente,
  ReporteGeneral,
  ReservaCancelada,
  ReservasEventoMes
} from '../interfaces/reportes';

/** Consultas de reportes del administrador (/api/reportes). */
@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/reportes`;

  private get<T>(path: string, anio?: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${path}`, { params: anio ? { anio } : {} });
  }

  general() { return this.get<ReporteGeneral>('general'); }
  promedioIngresosAgente() { return this.get<PromedioIngresosAgente[]>('promedio-ingresos-agente'); }
  promedioIngresosCliente() { return this.get<PromedioIngresosCliente[]>('promedio-ingresos-cliente'); }
  ingresosMensuales(anio: number) { return this.get<IngresoMensual[]>('ingresos-mensuales', anio); }
  reservasEventoMes(anio: number) { return this.get<ReservasEventoMes[]>('reservas-evento-mes', anio); }
  eventosAgenteCiudad() { return this.get<EventosAgenteCiudad[]>('eventos-agente-ciudad'); }
  eventosUbicacion() { return this.get<EventoUbicacion[]>('eventos-ubicacion'); }
  historialReservasCliente() { return this.get<HistorialReserva[]>('historial-reservas-cliente'); }
  reservasCanceladas() { return this.get<ReservaCancelada[]>('reservas-canceladas'); }
  eventosCancelados() { return this.get<EventoCancelado[]>('eventos-cancelados'); }

}
