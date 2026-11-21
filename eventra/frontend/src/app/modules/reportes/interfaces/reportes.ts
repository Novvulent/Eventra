/** Respuestas de los endpoints de /api/reportes. */

export interface ReporteGeneral {
  clientes: number;
  agentes: number;
  administradores: number;
  reservas: number;
  eventos: number;
}

export interface PromedioIngresosAgente {
  id_agente: number;
  agente: string;
  reservas_confirmadas: number;
  ingresos_totales: number;
  promedio_ingresos: number;
}

export interface PromedioIngresosCliente {
  id_cliente: number;
  cliente: string;
  reservas_confirmadas: number;
  ingresos_totales: number;
  promedio_ingresos: number;
}

export interface IngresoMensual {
  mes: number;
  ingresos: number;
}

export interface ReservasEventoMes {
  evento: string;
  mes: number;
  reservas: number;
}

export interface EventosAgenteCiudad {
  agente: string;
  ciudad: string;
  eventos: number;
}

export interface EventoUbicacion {
  pais: string;
  departamento: string;
  ciudad: string;
  evento: string;
  estado: string;
}

export interface HistorialReserva {
  cliente: string;
  id_reserva: number;
  evento: string;
  fecha_hora: string;
  numero_entradas: number;
  valor_total: number;
  estado: string;
}

export interface ReservaCancelada {
  id_reserva: number;
  cliente: string;
  evento: string;
  causa: string;
}

export interface EventoCancelado {
  codigo_evento: number;
  evento: string;
  ciudad: string;
  fecha_inicio: string;
  causa: string;
}
