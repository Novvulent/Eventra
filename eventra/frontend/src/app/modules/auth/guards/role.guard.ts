import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../interfaces/usuario';
import { AuthService } from '../services/auth.service';

/** Solo permite el acceso a los perfiles indicados; si no hay sesión envía al login. */
export const roleGuard = (...roles: Rol[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();
  if (!usuario) return router.createUrlTree(['/login']);
  return roles.includes(usuario.rol) ? true : router.createUrlTree([auth.homeFor(usuario.rol)]);
};
