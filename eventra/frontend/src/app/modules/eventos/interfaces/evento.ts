export type EstadoEvento = 'Programado' | 'En Boletería' | 'En Vivo' | 'Finalizado' | 'Cancelado';

export interface Evento {
  codigo_evento: number;
  nombre: string;
  descripcion: string | null;
  teatro: string;
  id_ciudad: number;
  ciudad?: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  precio_base: number;
  observaciones: string | null;
  estado: EstadoEvento;
  causa_cancelacion: string | null;
  id_agente: number;
  agente?: string;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateEventoRequest {
  nombre?: string | null;
  teatro?: string | null;
  id_ciudad?: number | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  capacidad?: number | null;
  precio_base?: number | null;
  estado?: string | null;
  id_agente?: number | null;
  descripcion?: string | null;
  observaciones?: string | null;
  causa_cancelacion?: string | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateEventoRequest = CreateEventoRequest;
