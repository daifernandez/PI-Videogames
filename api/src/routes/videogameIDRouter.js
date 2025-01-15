const { Router } = require("express");
const {
  delete_videogame,
  get_videogameDetail,
  get_videogameTrailers,
  get_videogameScreenshots
} = require("../controllers/videogameIDControllers.js");
const { cacheMiddleware } = require("../middlewares");

const videogameIDRouter = Router();

// Cache por 1 hora para detalles del juego
videogameIDRouter.get("/:id", cacheMiddleware(3600000), get_videogameDetail);
videogameIDRouter.delete("/:id", delete_videogame);

// Cache por 2 horas para contenido multimedia
videogameIDRouter.get("/:id/trailers", cacheMiddleware(7200000), get_videogameTrailers);
videogameIDRouter.get("/:id/screenshots", cacheMiddleware(7200000), get_videogameScreenshots);

module.exports = videogameIDRouter;
