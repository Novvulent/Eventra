import { Persona } from '../../personas/interfaces/persona';

export interface Administrador extends Persona {
  salario: number;
  horario: string;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateAdministradorRequest {
  identificacion?: string | null;
  nombre_completo?: string | null;
  correo?: string | null;
  password?: string | null;
  direccion?: string | null;
  id_ciudad?: number | null;
  telefonos?: string[] | null;
  salario?: number | null;
  horario?: string | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateAdministradorRequest = CreateAdministradorRequest;
