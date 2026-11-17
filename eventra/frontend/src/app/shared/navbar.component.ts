import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { initials } from './utils';

interface NavLink { path: string; label: string; icon: string; }
interface NavSection { title: string; links: NavLink[]; }

/** Barra lateral de navegación según el rol del usuario autenticado. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Barra superior (solo móvil) -->
    <header class="ev-topbar">
      <button class="ev-menu-btn" type="button" (click)="open.set(true)" aria-label="Abrir menú">
        <i class="bi bi-list"></i>
      </button>
      <a class="ev-brand" [routerLink]="home()">
        <span class="ev-brand-mark"><i class="bi bi-ticket-perforated-fill"></i></span>
        <span class="ev-brand-name">Eventra</span>
      </a>
    </header>

    <div class="ev-backdrop" [class.open]="open()" (click)="open.set(false)"></div>

    <aside class="ev-sidebar" [class.open]="open()">
      <a class="ev-brand" [routerLink]="home()">
        <span class="ev-brand-mark"><i class="bi bi-ticket-perforated-fill"></i></span>
        <span class="ev-brand-name">Eventra</span>
      </a>

      <nav class="ev-nav">
        @for (s of sections(); track s.title) {
          <div class="ev-nav-section">{{ s.title }}</div>
          @for (l of s.links; track l.path) {
            <a [routerLink]="l.path" routerLinkActive="active">
              <i [class]="'bi ' + l.icon"></i><span>{{ l.label }}</span>
            </a>
          }
        }
      </nav>

      @if (auth.usuario(); as u) {
        <div class="ev-user">
          <span class="ev-avatar">{{ initials(u.nombre_completo) }}</span>
          <div class="min-w-0">
            <div class="ev-user-name text-truncate">{{ u.nombre_completo }}</div>
            <div class="ev-user-role">{{ u.rol }}</div>
          </div>
          <button class="ev-logout" type="button" (click)="auth.logout()" title="Cerrar sesión" aria-label="Cerrar sesión">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
      }
    </aside>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  open = signal(false);
  initials = initials;

  constructor() {
    // Cierra el menú móvil al navegar
    inject(Router).events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.open.set(false));
  }

  home = computed(() => {
    const u = this.auth.usuario();
    return u ? this.auth.homeFor(u.rol) : '/login';
  });

  sections = computed<NavSection[]>(() => {
    const u = this.auth.usuario();
    if (!u) return [];
    if (u.rol === 'cliente') {
      return [{
        title: 'Cliente',
        links: [
          { path: '/cliente/eventos', label: 'Cartelera', icon: 'bi-stars' },
          { path: '/cliente/reservas', label: 'Mis reservas', icon: 'bi-ticket-detailed' }
        ]
      }];
    }
    if (u.rol === 'agente') {
      return [{
        title: 'Agente',
        links: [
          { path: '/agente/eventos', label: 'Mis eventos', icon: 'bi-calendar-event' },
          { path: '/agente/reservas', label: 'Reservas', icon: 'bi-ticket-detailed' }
        ]
      }];
    }
    return [
      { title: 'General', links: [{ path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' }] },
      {
        title: 'Operación',
        links: [
          { path: '/admin/eventos', label: 'Eventos', icon: 'bi-calendar-event' },
          { path: '/admin/reservas', label: 'Reservas', icon: 'bi-ticket-detailed' }
        ]
      },
      {
        title: 'Usuarios',
        links: [
          { path: '/admin/personas', label: 'Personas', icon: 'bi-person-vcard' },
          { path: '/admin/clientes', label: 'Clientes', icon: 'bi-people' },
          { path: '/admin/agentes', label: 'Agentes', icon: 'bi-person-badge' },
          { path: '/admin/administradores', label: 'Administradores', icon: 'bi-shield-lock' }
        ]
      },
      {
        title: 'Localización',
        links: [
          { path: '/admin/paises', label: 'Países', icon: 'bi-globe-americas' },
          { path: '/admin/departamentos', label: 'Departamentos', icon: 'bi-map' },
          { path: '/admin/ciudades', label: 'Ciudades', icon: 'bi-buildings' }
        ]
      }
    ];
  });
}
