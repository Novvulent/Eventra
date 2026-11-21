import { Rol } from '../../auth/interfaces/usuario';

export interface Persona {
  id_persona: number;
  identificacion: string;
  nombre_completo: string;
  correo: string;
  direccion: string;
  id_ciudad: number;
  ciudad?: string;
  telefonos: string[];
  rol?: Rol | null;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreatePersonaRequest {
  identificacion?: string | null;
  nombre_completo?: string | null;
  correo?: string | null;
  password?: string | null;
  direccion?: string | null;
  id_ciudad?: number | null;
  telefonos?: string[] | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdatePersonaRequest = CreatePersonaRequest;
