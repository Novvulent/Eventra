export interface Ciudad {
  id_ciudad: number;
  nombre: string;
  id_departamento: number;
  departamento?: string;
  pais?: string;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateCiudadRequest {
  nombre?: string | null;
  id_departamento?: number | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateCiudadRequest = CreateCiudadRequest;
