/** Clase visual (insignia suave) para mostrar el estado de eventos y reservas. */
export function badgeClass(estado: string): string {
  switch (estado) {
    case 'Confirmada':
    case 'En Boletería':
      return 'ev-badge success';
    case 'En Vivo':
      return 'ev-badge live';
    case 'Reservada':
    case 'Programado':
      return 'ev-badge info';
    case 'Cancelada':
    case 'Cancelado':
      return 'ev-badge danger';
    default:
      return 'ev-badge muted';
  }
}

/** Iniciales para avatares (máx. 2 letras). */
export function initials(nombre: string | null | undefined): string {
  return (nombre ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}

/** Degradado determinista por texto, para "pósters" de eventos. */
const GRADIENTS = [
  'linear-gradient(135deg, #6e1638 0%, #b8234f 60%, #e2566f 100%)',
  'linear-gradient(135deg, #2a1f4f 0%, #5a3e9b 60%, #a26ad6 100%)',
  'linear-gradient(135deg, #0f3b4a 0%, #16707a 60%, #3fb3a5 100%)',
  'linear-gradient(135deg, #4a2408 0%, #b3611a 55%, #e9a93b 100%)',
  'linear-gradient(135deg, #1a1523 0%, #3d2b4f 60%, #b8234f 100%)',
  'linear-gradient(135deg, #12304f 0%, #2e64c9 60%, #6aa2f0 100%)'
];
export function posterGradient(seed: string | number): string {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
