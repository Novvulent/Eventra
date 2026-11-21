export interface Departamento {
  id_departamento: number;
  nombre: string;
  id_pais: number;
  pais?: string;
}

/** Datos que se envían a la API al crear (los campos vacíos se omiten). */
export interface CreateDepartamentoRequest {
  nombre?: string | null;
  id_pais?: number | null;
}

/** Datos que se envían a la API al actualizar (un campo opcional vacío se envía como null). */
export type UpdateDepartamentoRequest = CreateDepartamentoRequest;
