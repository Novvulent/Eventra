export type Rol = 'cliente' | 'agente' | 'administrador';

/** Usuario autenticado (respuesta de POST /auth/login). */
export interface Usuario {
  id_persona: number;
  nombre_completo: string;
  correo: string;
  rol: Rol;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface RegisterRequest {
  rol: Exclude<Rol, 'administrador'>;
  identificacion: string;
  nombre_completo: string;
  correo: string;
  password: string;
  direccion: string;
  id_ciudad: number;
  telefonos?: string;
  experiencia?: number;
}
