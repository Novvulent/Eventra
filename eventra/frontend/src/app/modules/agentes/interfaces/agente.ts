import { Persona } from '../../personas/interfaces/persona';

export interface Agente extends Persona {
  comision: number;
  experiencia: number;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateAgenteRequest {
  identificacion?: string | null;
  nombre_completo?: string | null;
  correo?: string | null;
  password?: string | null;
  direccion?: string | null;
  id_ciudad?: number | null;
  telefonos?: string[] | null;
  comision?: number | null;
  experiencia?: number | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateAgenteRequest = CreateAgenteRequest;
