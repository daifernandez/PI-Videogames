<p align="left">
  <img src="./assets/gamepad-logo.svg" alt="GameStream" width="260" height="64" />
</p>

Aplicación web fullstack para explorar y descubrir una amplia biblioteca de videojuegos utilizando la [API de RAWG](https://rawg.io/). Ofrece búsqueda avanzada, filtros por géneros y plataformas, detalle enriquecido con galería de medios, comparativa de precios y experiencia responsive con modo oscuro.

## Características principales

- **Búsqueda con autocompletado** — Sugerencias instantáneas (client-side) y historial de búsquedas recientes
- **Filtros y ordenamiento** — Por género, plataforma, origen (API / Base de datos) y orden por nombre o rating
- **Estado en URL** — Query params para compartir búsquedas, filtros y página actual; compatibilidad con Back/Forward del navegador
- **Detalle de videojuego** — Hero, galería de medios con lightbox, breadcrumbs, rating visual, juegos similares
- **Comparativa de precios** — Dónde comprar y precios en tiendas (Steam, GOG, etc.) en la página de detalle
- **Exploración por plataforma** — Vista dedicada por plataforma (PC, PlayStation, Xbox, Nintendo, etc.)
- **Secciones de descubrimiento** — Juegos recientes y próximos lanzamientos en la página principal
- **Modo oscuro** — Con detección de preferencia del sistema y persistencia en `localStorage`
- **Feedback y resiliencia** — Barra de progreso en navegación, transiciones entre páginas, banner offline, toasts, error boundaries
- **Accesibilidad** — Skip to content, foco visible, ARIA labels, navegación por teclado

## Tecnologías utilizadas

### Frontend
- React 18
- Redux 5 + Redux Thunk
- React Router DOM 6
- Framer Motion (animaciones, transiciones)
- CSS con variables de tema (light/dark)

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL

### Testing
- Jest + React Testing Library
- Mocha + Chai + Supertest

## Vistas de la aplicación

### Página principal (`/`)
- **Búsqueda** — Input con autocompletado y sugerencias
- **Filtros** — Chips activos, dropdowns (género, plataforma), ordenamiento
- **Catálogo** — Grid de cards con skeleton loading y paginación
- **Descubrimiento** — Secciones horizontales: juegos recientes y próximos lanzamientos
- **Footer** — Enlaces e información

### Detalle del videojuego (`/videogame/:id`)
- **Hero** — Imagen fullscreen, rating circular, géneros, fecha
- **Tabs** — About | Media | Similar
- **Media** — Screenshots y trailers con lightbox
- **Plataformas** — Pills clicables que llevan a `/platform/:platform`
- **Precios** — Sección "Dónde comprar" con comparativa de tiendas

### Juegos por plataforma (`/platform/:platform`)
- Catálogo filtrado por plataforma (PC, PlayStation, Xbox, Nintendo, etc.)



## Estructura del proyecto

```
PI-Videogames-main/
├── assets/                 # Logo y recursos del README
├── client/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes UI (JSX)
│   │   │   └── Styles/      # CSS por componente
│   │   ├── Redux/          # store, actions, reducer
│   │   ├── hooks/          # useToast, useTheme, useInView, useSearchHistory, useUrlState, useOnlineStatus
│   │   └── utils/          # platformIcons y utilidades
│   └── package.json
├── api/                    # API Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/         # Videogame, Genre (Sequelize)
│   │   ├── helpers/
│   │   └── middlewares/
│   └── package.json
├── AGENTS.md               # Guía para agentes de IA
├── DEPLOY.md               # Checklist de deploy
├── UX_IMPROVEMENT_PLAN.md
└── UI_IMPROVEMENT_PLAN.md
```

## Cómo ejecutar

1. **Instalar dependencias:** `cd client && npm install && cd ../api && npm install`
2. **Variables de entorno:** `REACT_APP_API_HOST` en `client/.env`; `API_KEY`, `DB` en `api/.env`
3. **API:** `cd api && npm start` (puerto 3001)
4. **Cliente:** `cd client && npm start` (puerto 3000)
5. **Tests:** `npm test` en `client/` o `api/`

## Documentación

- [AGENTS.md](./AGENTS.md) — Guía para agentes de IA
- [DEPLOY.md](./DEPLOY.md) — Checklist de deploy

## Autor

Desarrollado por **DaiFernandez**
