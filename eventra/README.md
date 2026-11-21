# Eventra

Aplicación web para la gestión de eventos y reservas, desarrollada como Proyecto Integrador 2026-2 de las asignaturas Bases de Datos y Programación en Ambiente Web I.

- **Base de datos:** PostgreSQL
- **Backend:** Node.js + Express (API REST). Módulos con `routes`, `controllers`, `services` y `models`.
- **Frontend:** Angular (standalone) + Bootstrap + SweetAlert2, organizado por módulos (`components`, `interfaces`, `pages`, `services`) y consumiendo la API REST.

## Estructura

```
eventra/
├── database/        schema.sql y seed.sql
├── backend/         API REST (src/modules/<modulo>/*.model|service|controller|routes.js)
└── frontend/        Aplicación Angular
```

Módulos del backend: `localizacion` (países, departamentos, ciudades), `auth` (inicio de sesión y registro),
`clientes` (personas, clientes, reservas), `agentes` (agentes, eventos) y `administradores` (administradores, reportes).

### Estructura del frontend

Cada entidad es un módulo en `frontend/src/app/modules/<entidad>/` con la misma organización:

```
modules/
├── shared/                         Elementos reutilizables
│   ├── components/                 button, back, navbar (barra lateral), page-header
│   ├── interfaces/                 button, navbar, theme
│   ├── services/                   alert.service (confirmaciones y notificaciones con SweetAlert2)
│   └── utils/                      estado (insignias), form (conversión de formularios), http (errores)
├── auth/                           guards/role.guard, interfaces/usuario, pages/login|register, services/auth.service
├── reportes/                       interfaces/reportes, pages/dashboard, services/reportes.service
├── paises/                         ← ejemplo de módulo CRUD
│   ├── components/
│   │   ├── table-paises/           tabla con acciones (detalle, editar, eliminar)
│   │   └── form-pais/              formulario reactivo usado al crear y al actualizar
│   ├── interfaces/                 pais.ts (modelo y request), table-paises.ts (eventos de la tabla)
│   ├── pages/
│   │   ├── list-paises/            consulta (GetAll) y eliminación (Delete)
│   │   ├── create-pais/            registro (Create)
│   │   ├── update-pais/            actualización (Update)
│   │   └── detail-pais/            detalle (GetById)
│   └── services/pais.service.ts    las 5 operaciones CRUD contra la API
├── departamentos/  ciudades/  personas/  clientes/  agentes/  administradores/
├── eventos/                        + pages/cartelera-eventos (perfil cliente)
└── reservas/                       + pages/mis-reservas (cliente) y pages/gestion-reservas (agente)
```

Rutas por perfil (`app.routes.ts`):

| Perfil | Rutas |
|---|---|
| Administrador | `/admin/dashboard` y `/admin/<entidad>/list`, `/create`, `/update/:id`, `/detail/:id` |
| Agente | `/agente/eventos/list`, `/create`, `/detail/:id` y `/agente/reservas` |
| Cliente | `/cliente/eventos` (cartelera) y `/cliente/reservas` |

## Requisitos

- Node.js 18 o superior
- PostgreSQL 13 o superior (con la extensión `pgcrypto`, usada solo por `seed.sql`)

## 1. Base de datos

```bash
createdb -U postgres eventra
psql -U postgres -d eventra -f database/schema.sql
psql -U postgres -d eventra -f database/seed.sql
```

## 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env  (ajuste usuario y contraseña de PostgreSQL)
npm run dev               # o npm start
```

La API queda en `http://localhost:3000/api` (prueba: `GET /api/health`).

## 3. Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación queda en `http://localhost:4200`. La URL de la API se configura en
`frontend/src/environments/environment.ts`.

## Usuarios de prueba (contraseña `Eventra123*`)

| Perfil | Correo |
|---|---|
| Administrador | admin@eventra.com |
| Agente | agente1@eventra.com |
| Cliente | cliente1@eventra.com |

## Endpoints REST

Cada entidad expone las cinco operaciones CRUD:

| Operación | Método | Ruta |
|---|---|---|
| GetAll | GET | `/api/<recurso>` |
| GetById | GET | `/api/<recurso>/:id` |
| Create | POST | `/api/<recurso>` |
| Update | PUT | `/api/<recurso>/:id` |
| Delete | DELETE | `/api/<recurso>/:id` |

Recursos: `paises`, `departamentos`, `ciudades`, `personas`, `clientes`, `agentes`, `administradores`, `eventos`, `reservas`.

Autenticación: `POST /api/auth/login` y `POST /api/auth/register` (rol `cliente` o `agente`).

Reportes (GET, solo lectura): `/api/reportes/general`, `promedio-ingresos-agente`, `promedio-ingresos-cliente`,
`ingresos-mensuales?anio=2026`, `reservas-evento-mes?anio=2026`, `eventos-agente-ciudad`, `eventos-ubicacion`,
`historial-reservas-cliente`, `reservas-canceladas`, `eventos-cancelados`.

Códigos de respuesta: 200 (consulta/actualización), 201 (creación), 400 (datos inválidos),
401 (credenciales), 404 (no encontrado), 409 (duplicado o registro relacionado), 500 (error interno).

## Criterios del proyecto

- Los **ingresos** se calculan con las reservas en estado `Confirmada`.
- Si al crear una reserva no se envía `valor_total`, se calcula como `precio_base x número de entradas`.
- La contraseña se guarda cifrada (bcrypt) en `persona.password_hash`.

## Estándar de commits

Los commits siguen el formato `tipo(ámbito): descripción`, con los tipos `feat`, `fix`, `docs`, `chore` y `refactor`. Ejemplo: `feat(reservas): CRUD backend de reservas`.

## Integrantes

| Integrante | Código | Módulos desarrollados |
|---|---|---|
| Santiago Atehortua Jaramillo | 230251013 | Base del proyecto, Localización y Auth |
| Samuel Alzate Correa | 230252022 | Personas, Clientes y Reservas |
| Nicolas Restrepo Sanchez | 230251043 | Agentes, Eventos, Administradores y Reportes |

Docente: Jesús David Mejía Vergara - Unidad Central del Valle del Cauca, Facultad de Ingeniería.
