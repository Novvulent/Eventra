/**
 * Utilidades para convertir los valores de los formularios reactivos
 * al formato que espera la API REST.
 */

export function isEmpty(v: unknown): boolean {
  return v === undefined || v === null || v === '';
}

export function toNumber(v: unknown): number | null {
  return isEmpty(v) ? null : Number(v);
}

/** "2026-12-05T19:00" (input datetime-local) -> ISO 8601. */
export function toIso(v: unknown): string | null {
  return isEmpty(v) ? null : new Date(String(v)).toISOString();
}

/** ISO 8601 -> "2026-12-05T19:00" para un input datetime-local (hora local). */
export function toLocalInput(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** "300 111, 310 222" -> ["300 111", "310 222"]. */
export function splitPhones(v: unknown): string[] | null {
  if (isEmpty(v)) return null;
  const list = String(v).split(',').map((t) => t.trim()).filter(Boolean);
  return list.length ? list : null;
}

export function joinPhones(v: string[] | null | undefined): string {
  return Array.isArray(v) ? v.join(', ') : '';
}

/**
 * Limpia el objeto antes de enviarlo:
 * - En creación, los campos vacíos se omiten (aplica el valor por defecto de la BD).
 * - En edición, un campo opcional vacío se envía como null para limpiarlo.
 * - Los campos de "omitIfEmpty" (ej. contraseña) nunca se envían vacíos.
 */
export function cleanPayload<T extends Record<string, unknown>>(
  data: T,
  options: { editing: boolean; required?: string[]; omitIfEmpty?: string[] }
): Partial<T> {
  const required = options.required ?? [];
  const omit = options.omitIfEmpty ?? [];
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!isEmpty(value)) {
      out[key] = value;
    } else if (options.editing && !required.includes(key) && !omit.includes(key)) {
      out[key] = null;
    }
  }
  return out as Partial<T>;
}
