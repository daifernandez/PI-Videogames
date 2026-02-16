# AGENTS.md — Guía para Agentes de IA

Este documento orienta a los agentes de IA que trabajan en el proyecto **PI-Videogames**: una aplicación web fullstack para explorar y gestionar una biblioteca de videojuegos mediante la API de RAWG.

---

## Resumen del proyecto

- **Frontend**: React 18 + Redux + React Router DOM
- **Backend**: Node.js + Express + Sequelize + PostgreSQL
- **Arquitectura**: Monorepo con carpetas `client/` y `api/`

---

## Estructura del proyecto

```
PI-Videogames-main/
├── client/                 # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes UI (JSX)
│   │   │   └── Styles/     # CSS por componente
│   │   ├── Redux/          # store, actions, reducer
│   │   ├── hooks/          # useToast, useTheme, useInView, useSearchHistory
│   │   └── utils/          # utilidades (platformIcons)
│   ├── .env                # REACT_APP_API_HOST
│   └── package.json
├── api/                    # API Express
│   ├── src/
│   │   ├── controllers/    # videogamesControllers, videogameIDControllers, genresControllers
│   │   ├── routes/         # videogamesRouter, videogameIDRouter, genresRouter
│   │   ├── models/         # Videogame, Genre (Sequelize)
│   │   ├── helpers/        # videogamesHelpers, genresHelpers (lógica de negocio)
│   │   ├── middlewares/    # validaciones
│   │   ├── db.js           # conexión Sequelize
│   │   └── app.js          # configuración Express
│   ├── tests/              # Mocha + Supertest
│   ├── .env                # API_KEY, DB, ALLOW_CONNECTION, etc.
│   └── package.json
├── DEPLOY.md               # Checklist de deploy
├── UX_IMPROVEMENT_PLAN.md
└── UI_IMPROVEMENT_PLAN.md
```

---

## Convenciones y patrones

### Frontend (client/)

- **Componentes**: JSX funcionales; estilos en `components/Styles/NombreComponente.css`
- **Estado global**: Redux con Redux Thunk; acciones en `Redux/actions.js`, reducer en `Redux/reducer.js`
- **API**: requests desde actions; URL base desde `process.env.REACT_APP_API_HOST`
- **Idioma**: Comentarios y mensajes en español

### Backend (api/)

- **Rutas**: prefijo `/` desde `routes/index.js`; videogames, videogame/:id, genres
- **Controladores**: orquestan requests; lógica en `helpers/`
- **Base de datos**: Sequelize con modelos Videogame y Genre (relación many-to-many)
- **API externa**: RAWG vía `API_KEY` en variables de entorno

---

## Cómo ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   cd client && npm install && cd ../api && npm install
   ```

2. **Variables de entorno**:
   - `client/.env`: `REACT_APP_API_HOST` (URL de la API)
   - `api/.env`: `API_KEY`, `DB`, `ALLOW_CONNECTION`, etc.

3. **Iniciar servicios**:
   - API: `cd api && npm start` → puerto 3001
   - Cliente: `cd client && npm start` → puerto 3000

---

## Archivos clave

| Ruta | Propósito |
|------|-----------|
| `client/src/App.js` | Rutas, ToastProvider, ErrorBoundary |
| `client/src/Redux/` | store, actions, reducer |
| `api/src/routes/index.js` | Montaje de rutas |
| `api/src/helpers/videogamesHelpers.js` | Lógica de videogames (API + DB) |
| `api/src/db.js` | Configuración Sequelize |

---

## Testing

- **Frontend**: Jest + React Testing Library (`client/src/setupTests.js`)
- **Backend**: Mocha + Chai + Supertest (`api/tests/`)
- Ejecutar tests: `npm test` en `client/` o `api/`

---

## Testeo manual con agent-browser

Para pruebas manuales o exploratorias de la UI, usar la habilidad **agent-browser** (`.cursor/skills/agent-browser/SKILL.md`).

---

## Deploy

Ver `DEPLOY.md`:

- Frontend: Vercel/Netlify, variable `REACT_APP_API_HOST`, build desde `client/`
- Backend: Render o Railway recomendados (servidor persistente). Vercel serverless requiere configuración específica

---

## Mejoras planificadas

- `UX_IMPROVEMENT_PLAN.md`: mejoras de experiencia de usuario
- `UI_IMPROVEMENT_PLAN.md`: mejoras de interfaz

---

## Notas para agentes

- Usar **español** en mensajes, comentarios y documentación.
- Mantener la estructura actual de carpetas y convenciones de nombrado.
- Al modificar la API, comprobar compatibilidad con los actions de Redux existentes.
- No hardcodear credenciales; usar variables de entorno.
- Los estilos se organizan por componente en `client/src/components/Styles/`.
