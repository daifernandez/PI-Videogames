# Sugerencias de mejora – PI Videogames

Resumen de mejoras posibles organizadas por prioridad y área.

---

## Críticas (bugs y buenas prácticas)

### ~~1. Redux: no mutar el state~~ ✅

Corregido — el reducer crea nuevos objetos en cada caso (`SELECT_GENRE`, `SELECT_PLATFORM`, `ALPH_ORDER`, `RATING_ORDER`, `GET_CREATED`).

### ~~2. Manejo de errores en búsqueda por nombre~~ ✅

Corregido — se despacha `ERROR_VIDEOGAME_BY_NAME` y en el reducer se limpia `videogamesOnScreen` y se muestra un mensaje de error.

### ~~3. Error Boundary~~ ✅

Implementado en `ErrorBoundary.jsx` con vista de "Algo salió mal" + botón recargar. Envuelve las rutas en `App.js`.

---

## UX y frontend

### ~~4. Reset de página al cambiar de plataforma~~ ✅

Implementado con `useEffect` que depende de `platform` → `setCurrentPage(0)`.

### ~~5. Estados de carga y error en PlatformGames~~ ✅

Se lee `error` del state Redux y se muestra un mensaje amigable. Loading ahora usa skeleton cards integrado.

### 6. Accesibilidad (a11y)

- Paginación en PlatformGames: ya tiene `aria-current="page"` y `aria-label` en los botones.
- Falta: formulario de creación (labels, fieldset/legend), contraste de colores global, navegación por teclado completa.

### 7. SEO y rutas

- Pendiente: React Helmet o equivalente para `<title>` y meta por ruta.
- Pendiente: meta description y Open Graph para detalle de juego.

---

## Backend y API

### ~~8. Variables de entorno de ejemplo~~ ✅

Creados `api/.env.example` y `client/.env.example` con las variables documentadas.

### 9. Validación y sanitización en API

Pendiente — revisar que todos los endpoints validen tipos, rangos y longitud de strings.

### 10. Rate limiting

Pendiente — añadir `express-rate-limit` en las rutas que llaman a RAWG.

---

## Código y arquitectura

### ~~11. Constantes y tipos de acciones~~ ✅

Todas las constantes (`LOADING_VIDEOGAMES`, `ERROR_VIDEOGAMES`, `ERROR_VIDEOGAME_BY_NAME`, `LOADING_UPCOMING_GAMES`, `ERROR_UPCOMING_GAMES`, etc.) ahora se exportan desde `actions.js` e importan en `reducer.js`. Cero strings sueltos.

### 12. Paginación reutilizable

Pendiente — extraer un componente genérico `Pagination` que reciba `currentPage`, `totalPages`, `onPageChange`. Usarlo en Home (con Redux) y en PlatformGames (con state local).

### 13. Resincronizar datos al volver a Home

Pendiente — evaluar si añadir refresco manual o caché por tiempo.

### 14. Tests

Pendiente — aumentar cobertura en API y añadir tests de componentes clave.

---

## Mejoras aplicadas (historial)

| Fecha | Mejora |
|-------|--------|
| 15 Feb 2026 | Inmutabilidad en reducer (punto 1) |
| 15 Feb 2026 | Error en búsqueda por nombre (punto 2) |
| 15 Feb 2026 | Error Boundary (punto 3) |
| 15 Feb 2026 | Reset de página en PlatformGames (punto 4) |
| 15 Feb 2026 | Mostrar error en PlatformGames (punto 5) |
| 15 Feb 2026 | Constantes de acciones centralizadas (punto 11) |
| 15 Feb 2026 | Archivos `.env.example` creados (punto 8) |
| 15 Feb 2026 | `GameCard.jsx` eliminado — `Card.jsx` es el único componente de card |
| 15 Feb 2026 | Framer Motion instalado + staggered animations en grid |
| 15 Feb 2026 | `CardSkeleton.jsx` creado con shimmer animation |
| 15 Feb 2026 | Skeleton loading integrado en `Cards.jsx` (reemplaza spinner en Home y PlatformGames) |
| 15 Feb 2026 | Card rediseñada: parallax sutil, labels frosted glass, dual gradient overlay |
| 15 Feb 2026 | UI refinada hacia estética delicada y minimalista |
| 15 Feb 2026 | Accesibilidad básica en paginación de PlatformGames (`aria-label`, `aria-current`) |
| 15 Feb 2026 | Filtros rediseñados: barra horizontal con grupos Filter/Sort, chips animados, bottom sheet mobile |
| 15 Feb 2026 | Componente `FilterChips.jsx`: chips interactivos con iconos, "x" individual, "Clear all" |
| 15 Feb 2026 | Contador de resultados en tiempo real ("X of Y games") con cálculo preciso |

---

## Resumen de pendientes

| Prioridad | Tema | Esfuerzo |
|-----------|------|----------|
| Media | Componente Pagination genérico | Medio |
| Media | Accesibilidad completa (a11y) | Medio |
| Baja | SEO / Helmet | Medio |
| Baja | Validación API | Medio |
| Baja | Rate limiting API | Bajo |
| Baja | Más tests | Alto |
