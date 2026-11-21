export type EstadoReserva = 'Reservada' | 'Confirmada' | 'Cancelada';

export interface Reserva {
  id_reserva: number;
  id_cliente: number;
  cliente?: string;
  codigo_evento: number;
  evento?: string;
  fecha_hora: string;
  valor_total: number;
  numero_entradas: number;
  observaciones: string | null;
  estado: EstadoReserva;
  causa_cancelacion: string | null;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateReservaRequest {
  id_cliente?: number | null;
  codigo_evento?: number | null;
  numero_entradas?: number | null;
  valor_total?: number | null;
  fecha_hora?: string | null;
  estado?: string | null;
  causa_cancelacion?: string | null;
  observaciones?: string | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateReservaRequest = CreateReservaRequest;
