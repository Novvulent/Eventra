/** Mensaje de error enviado por la API (o uno genérico). */
export function errorMessage(e: any, fallback = 'No se pudo completar la operación'): string {
  return e?.error?.message ?? fallback;
}
