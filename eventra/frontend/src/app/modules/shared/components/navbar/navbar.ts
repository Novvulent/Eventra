import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NavbarSection } from '../../interfaces/navbar';
import { initials } from '../../utils/estado';

/** Barra lateral de navegación; las secciones dependen del perfil del usuario. */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html'
})
export class Navbar {
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

  sections = computed<NavbarSection[]>(() => {
    const u = this.auth.usuario();
    if (!u) return [];
    if (u.rol === 'cliente') {
      return [{
        title: 'Cliente',
        items: [
          { title: 'Cartelera', url: '/cliente/eventos', icon: 'bi-stars' },
          { title: 'Mis reservas', url: '/cliente/reservas', icon: 'bi-ticket-detailed' }
        ]
      }];
    }
    if (u.rol === 'agente') {
      return [{
        title: 'Agente',
        items: [
          { title: 'Mis eventos', url: '/agente/eventos', icon: 'bi-calendar-event' },
          { title: 'Reservas', url: '/agente/reservas', icon: 'bi-ticket-detailed' }
        ]
      }];
    }
    return [
      { title: 'General', items: [{ title: 'Dashboard', url: '/admin/dashboard', icon: 'bi-grid-1x2' }] },
      {
        title: 'Operación',
        items: [
          { title: 'Eventos', url: '/admin/eventos', icon: 'bi-calendar-event' },
          { title: 'Reservas', url: '/admin/reservas', icon: 'bi-ticket-detailed' }
        ]
      },
      {
        title: 'Usuarios',
        items: [
          { title: 'Personas', url: '/admin/personas', icon: 'bi-person-vcard' },
          { title: 'Clientes', url: '/admin/clientes', icon: 'bi-people' },
          { title: 'Agentes', url: '/admin/agentes', icon: 'bi-person-badge' },
          { title: 'Administradores', url: '/admin/administradores', icon: 'bi-shield-lock' }
        ]
      },
      {
        title: 'Localización',
        items: [
          { title: 'Países', url: '/admin/paises', icon: 'bi-globe-americas' },
          { title: 'Departamentos', url: '/admin/departamentos', icon: 'bi-map' },
          { title: 'Ciudades', url: '/admin/ciudades', icon: 'bi-buildings' }
        ]
      }
    ];
  });
}
