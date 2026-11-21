import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { roleGuard } from './modules/auth/guards/role.guard';
import { Login } from './modules/auth/pages/login/login';
import { Register } from './modules/auth/pages/register/register';
import { CreateAdministrador } from './modules/administradores/pages/create-administrador/create-administrador';
import { DetailAdministrador } from './modules/administradores/pages/detail-administrador/detail-administrador';
import { ListAdministradores } from './modules/administradores/pages/list-administradores/list-administradores';
import { UpdateAdministrador } from './modules/administradores/pages/update-administrador/update-administrador';
import { CreateAgente } from './modules/agentes/pages/create-agente/create-agente';
import { DetailAgente } from './modules/agentes/pages/detail-agente/detail-agente';
import { ListAgentes } from './modules/agentes/pages/list-agentes/list-agentes';
import { UpdateAgente } from './modules/agentes/pages/update-agente/update-agente';
import { CreateCiudad } from './modules/ciudades/pages/create-ciudad/create-ciudad';
import { DetailCiudad } from './modules/ciudades/pages/detail-ciudad/detail-ciudad';
import { ListCiudades } from './modules/ciudades/pages/list-ciudades/list-ciudades';
import { UpdateCiudad } from './modules/ciudades/pages/update-ciudad/update-ciudad';
import { CreateCliente } from './modules/clientes/pages/create-cliente/create-cliente';
import { DetailCliente } from './modules/clientes/pages/detail-cliente/detail-cliente';
import { ListClientes } from './modules/clientes/pages/list-clientes/list-clientes';
import { UpdateCliente } from './modules/clientes/pages/update-cliente/update-cliente';
import { CreateDepartamento } from './modules/departamentos/pages/create-departamento/create-departamento';
import { DetailDepartamento } from './modules/departamentos/pages/detail-departamento/detail-departamento';
import { ListDepartamentos } from './modules/departamentos/pages/list-departamentos/list-departamentos';
import { UpdateDepartamento } from './modules/departamentos/pages/update-departamento/update-departamento';
import { CarteleraEventos } from './modules/eventos/pages/cartelera-eventos/cartelera-eventos';
import { CreateEvento } from './modules/eventos/pages/create-evento/create-evento';
import { DetailEvento } from './modules/eventos/pages/detail-evento/detail-evento';
import { ListEventos } from './modules/eventos/pages/list-eventos/list-eventos';
import { UpdateEvento } from './modules/eventos/pages/update-evento/update-evento';
import { CreatePais } from './modules/paises/pages/create-pais/create-pais';
import { DetailPais } from './modules/paises/pages/detail-pais/detail-pais';
import { ListPaises } from './modules/paises/pages/list-paises/list-paises';
import { UpdatePais } from './modules/paises/pages/update-pais/update-pais';
import { CreatePersona } from './modules/personas/pages/create-persona/create-persona';
import { DetailPersona } from './modules/personas/pages/detail-persona/detail-persona';
import { ListPersonas } from './modules/personas/pages/list-personas/list-personas';
import { UpdatePersona } from './modules/personas/pages/update-persona/update-persona';
import { Dashboard } from './modules/reportes/pages/dashboard/dashboard';
import { CreateReserva } from './modules/reservas/pages/create-reserva/create-reserva';
import { DetailReserva } from './modules/reservas/pages/detail-reserva/detail-reserva';
import { GestionReservas } from './modules/reservas/pages/gestion-reservas/gestion-reservas';
import { ListReservas } from './modules/reservas/pages/list-reservas/list-reservas';
import { MisReservas } from './modules/reservas/pages/mis-reservas/mis-reservas';
import { UpdateReserva } from './modules/reservas/pages/update-reserva/update-reserva';

/** Rutas CRUD estándar de un módulo: list, create, update/:id y detail/:id. */
function crud(list: Type<unknown>, create: Type<unknown>, update: Type<unknown>, detail: Type<unknown>): Routes {
  return [
    { path: 'list', component: list },
    { path: 'create', component: create },
    { path: 'update/:id', component: update },
    { path: 'detail/:id', component: detail },
    { path: '**', redirectTo: 'list' }
  ];
}

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Auth (Inicio de sesión, Registro)
  { path: 'login', component: Login },
  { path: 'registro', component: Register },

  // Perfil administrador: reportes y CRUD de todas las entidades
  {
    path: 'admin',
    canActivate: [roleGuard('administrador')],
    children: [
      { path: 'dashboard', component: Dashboard },
      // Localización
      { path: 'paises', children: crud(ListPaises, CreatePais, UpdatePais, DetailPais) },
      { path: 'departamentos', children: crud(ListDepartamentos, CreateDepartamento, UpdateDepartamento, DetailDepartamento) },
      { path: 'ciudades', children: crud(ListCiudades, CreateCiudad, UpdateCiudad, DetailCiudad) },
      // Usuarios
      { path: 'personas', children: crud(ListPersonas, CreatePersona, UpdatePersona, DetailPersona) },
      { path: 'clientes', children: crud(ListClientes, CreateCliente, UpdateCliente, DetailCliente) },
      { path: 'agentes', children: crud(ListAgentes, CreateAgente, UpdateAgente, DetailAgente) },
      { path: 'administradores', children: crud(ListAdministradores, CreateAdministrador, UpdateAdministrador, DetailAdministrador) },
      // Operación
      { path: 'eventos', children: crud(ListEventos, CreateEvento, UpdateEvento, DetailEvento) },
      { path: 'reservas', children: crud(ListReservas, CreateReserva, UpdateReserva, DetailReserva) },
      { path: '**', redirectTo: 'dashboard' }
    ]
  },

  // Perfil agente: registra y consulta eventos, administra reservas
  {
    path: 'agente',
    canActivate: [roleGuard('agente')],
    children: [
      {
        path: 'eventos',
        children: [
          { path: 'list', component: ListEventos },
          { path: 'create', component: CreateEvento },
          { path: 'detail/:id', component: DetailEvento },
          { path: '**', redirectTo: 'list' }
        ]
      },
      { path: 'reservas', component: GestionReservas },
      { path: '**', redirectTo: 'eventos' }
    ]
  },

  // Perfil cliente: cartelera y sus reservas
  {
    path: 'cliente',
    canActivate: [roleGuard('cliente')],
    children: [
      { path: 'eventos', component: CarteleraEventos },
      { path: 'reservas', component: MisReservas },
      { path: '**', redirectTo: 'eventos' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
