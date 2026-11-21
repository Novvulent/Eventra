import { Persona } from '../../personas/interfaces/persona';

export interface Cliente extends Persona {
  puntos: number;
  visualizacion_publicidad: boolean;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateClienteRequest {
  identificacion?: string | null;
  nombre_completo?: string | null;
  correo?: string | null;
  password?: string | null;
  direccion?: string | null;
  id_ciudad?: number | null;
  telefonos?: string[] | null;
  puntos?: number | null;
  visualizacion_publicidad?: boolean;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateClienteRequest = CreateClienteRequest;
