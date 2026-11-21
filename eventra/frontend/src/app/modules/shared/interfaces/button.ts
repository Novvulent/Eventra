import { Theme } from './theme';

export interface ButtonConfig {
  id: string;
  type: ButtonType;
  title?: string;
  /** Nombre del ícono de Bootstrap Icons sin el prefijo "bi-" (ej. "pencil"). */
  icon?: string;
  outline?: boolean;
  size?: ButtonSize;
  /** Texto de ayuda (tooltip y aria-label), útil en botones solo con ícono. */
  tooltip?: string;
}

export type ButtonSize = 'lg' | 'sm';

export type ButtonType = Theme;
