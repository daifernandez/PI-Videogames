# Sugerencias de mejora – PI Videogames

Resumen de mejoras posibles organizadas por prioridad y área.

---

## Críticas (bugs y buenas prácticas)

### 1. Redux: no mutar el state
En `client/src/Redux/reducer.js` se modifica `state.filterAndSortingState` en varios casos (SELECT_GENRE, SELECT_PLATFORM, ALPH_ORDER, RATING_ORDER, GET_CREATED). En Redux el state debe ser inmutable.

**Solución:** Crear un nuevo objeto en cada caso, por ejemplo:

```javascript
case SELECT_GENRE:
  const newGenreState = {
    ...state.filterAndSortingState,
    genre: action.payload === "-" ? null : action.payload
  };
  const filteredVideogamesGenre = videogamesForFilter(state.videogames, newGenreState);
  // ... usar newGenreState en el return
```

Aplicar el mismo criterio en el resto de casos que tocan `filterAndSortingState`.

### 2. Manejo de errores en búsqueda por nombre
En `getVideogameByName` (actions.js) no se despacha un tipo de error ni se limpia el estado anterior si la petición falla. El usuario puede seguir viendo resultados viejos.

**Solución:** Despachar un tipo como `ERROR_VIDEOGAME_BY_NAME` y en el reducer poner `videogamesOnScreen: []` y un mensaje de error; mostrarlo en la UI (por ejemplo en Home o Search).

### 3. Error Boundary
No hay Error Boundary en React. Un error no capturado en cualquier componente puede tumbar toda la app.

**Solución:** Añadir un componente `ErrorBoundary` que capture errores en el árbol de hijos y mostrar una vista de “Algo salió mal” con opción de recargar. Envolver las rutas o el contenido principal en `App.js` con este componente.

---

## UX y frontend

### 4. Reset de página al cambiar de plataforma
En `PlatformGames.jsx`, si el usuario cambia de ruta (por ejemplo de `/platform/PC` a `/platform/PlayStation`), `currentPage` puede quedar en un valor alto y mostrar una página vacía.

**Solución:** Hacer `setCurrentPage(0)` cuando cambie `platform` (en un `useEffect` que dependa de `platform`).

### 5. Estados de carga y error en PlatformGames
Si `getvideogames()` falla, `loading` pasa a false pero no se muestra el `error` del state de Redux.

**Solución:** Leer `error` del state en `PlatformGames` y mostrar un mensaje amigable (similar a Home con `EmptyResults` o un bloque dedicado) cuando `error` no sea null.

### 6. Accesibilidad (a11y)
- Paginación: los botones de página podrían tener `aria-current="page"` en la página actual y textos como `aria-label="Página 1"`.
- Formulario de creación: asociar labels a los inputs, agrupar campos con `fieldset`/`legend` donde aplique.
- Navegación por teclado y contraste de colores en botones y enlaces.

### 7. SEO y rutas
- Añadir un layout con `<title>` y meta por ruta (por ejemplo con React Helmet o similar).
- Rutas como `/platform/:platform` y `/videogame/:id` son correctas; se puede mejorar con meta description y Open Graph para detalle de juego.

---

## Backend y API

### 8. Variables de entorno de ejemplo
Hay `.env` en client y api pero no hay `.env.example`. Quien clone el repo no sabe qué variables definir.

**Solución:** Añadir `api/.env.example` y `client/.env.example` (sin valores sensibles) con comentarios, por ejemplo:

- API: `PORT`, `DB_*`, `API_KEY` (RAWG), etc.
- Client: `REACT_APP_API_HOST`

### 9. Validación y sanitización en API
Revisar que todos los endpoints que reciben body (por ejemplo creación de videojuego) validen tipos, rangos y longitud de strings. Si ya existe un middleware de validación, asegurar que cubra todos los campos obligatorios y opcionales.

### 10. Rate limiting
La API no tiene rate limiting. Un abuso de peticiones podría sobrecargar el servidor o la API externa (RAWG).

**Solución:** Añadir un middleware de rate limit (por ejemplo `express-rate-limit`) en la app de Express, sobre todo en rutas que llaman a RAWG.

---

## Código y arquitectura

### 11. Constantes y tipos de acciones
En el reducer se usan strings como `"LOADING_VIDEOGAMES"`, `"ERROR_VIDEOGAMES"`, etc., que no están exportados desde `actions.js`. Si hay un typo, el error es silencioso.

**Solución:** Definir todas las constantes de acciones en un mismo archivo (o en `actions.js`) e importarlas en el reducer. Opcional: usar un prefijo (por ejemplo `VIDEOGAMES_LOADING`) para agrupar.

### 12. Paginación reutilizable
En Home se usa el componente `Paginado` conectado a Redux, y en `PlatformGames` la paginación está duplicada en el mismo archivo. La lógica (slice, totalPages, handlePageChange) se repite.

**Solución:** Extraer un componente genérico `Pagination` que reciba `currentPage`, `totalPages`, `onPageChange` y opcionalmente `itemsPerPage`. Usarlo en Home (con Redux) y en PlatformGames (con state local).

### 13. Resincronizar datos al volver a Home
Si el usuario crea un videojuego y luego navega a Home, los datos ya están en Redux. Pero si otro usuario (o otra pestaña) hubiera creado datos, no se reflejan. Dependiendo del objetivo del proyecto, se podría:

- Mantener el comportamiento actual (solo se recargan si `allVideogames.length === 0`), o
- Añadir un “refrescar” manual, o
- Recargar al montar Home (con o sin caché por tiempo).

### 14. Tests
Hay tests en `api/tests/` y en client (`App.test.js`, `setupTests.js`). Conviene:

- Aumentar cobertura en API (controllers y rutas críticas).
- Añadir tests de componentes clave (por ejemplo Search, CreateVideogame, formularios) con React Testing Library.
- Opcional: un test E2E con Playwright o Cypress para el flujo: abrir app → buscar → ver detalle → crear juego.

---

## Mejoras rápidas ya aplicadas

- **PlatformGames.jsx:** Se eliminó el `<div className="pagination">` duplicado que envolvía la paginación (había dos niveles con la misma clase).

---

## Resumen de prioridades

| Prioridad | Tema                         | Esfuerzo |
|----------|------------------------------|----------|
| Alta     | Inmutabilidad en reducer     | Medio    |
| Alta     | Error en búsqueda por nombre | Bajo     |
| Alta     | Error Boundary               | Bajo     |
| Media    | Reset página en PlatformGames| Bajo     |
| Media    | Mostrar error en PlatformGames | Bajo   |
| Media    | .env.example                 | Bajo     |
| Media    | Componente Pagination genérico | Medio  |
| Baja     | Rate limiting API            | Bajo     |
| Baja     | SEO / Helmet                 | Medio    |
| Baja     | Más tests                    | Alto     |

Si quieres, se puede implementar primero el bloque “Críticas” (reducer inmutable, error en búsqueda, Error Boundary) y luego las mejoras de UX y API.
