export interface Pais {
  id_pais: number;
  nombre: string;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreatePaisRequest {
  nombre?: string | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdatePaisRequest = CreatePaisRequest;
