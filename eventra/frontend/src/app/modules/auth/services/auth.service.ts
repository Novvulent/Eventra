import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RegisterRequest, Rol, Usuario } from '../interfaces/usuario';

const KEY = 'eventra_usuario';

/** Inicio de sesión, registro y sesión del usuario (guardada en localStorage). */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private url = `${environment.apiUrl}/auth`;

  usuario = signal<Usuario | null>(this.cargar());

  private cargar(): Usuario | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  login(correo: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/login`, { correo, password }).pipe(
      tap((u) => {
        localStorage.setItem(KEY, JSON.stringify(u));
        this.usuario.set(u);
      })
    );
  }

  register(data: RegisterRequest | Record<string, unknown>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(KEY);
    this.usuario.set(null);
    this.router.navigateByUrl('/login');
  }

  /** Página de inicio según el perfil. */
  homeFor(rol: Rol): string {
    if (rol === 'administrador') return '/admin/dashboard';
    return rol === 'agente' ? '/agente/eventos' : '/cliente/eventos';
  }
}
