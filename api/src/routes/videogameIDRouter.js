const { Router } = require("express");
const {
  get_videogameDetail,
  get_videogameTrailers,
  get_videogameScreenshots
} = require("../controllers/videogameIDControllers.js");
const { getVideogamePrices } = require("../controllers/pricesController.js");
const { cacheMiddleware } = require("../middlewares");

const videogameIDRouter = Router();

// Cache por 1 hora para detalles del juego
videogameIDRouter.get("/:id", cacheMiddleware(3600000), get_videogameDetail);

// Cache por 2 horas para contenido multimedia
videogameIDRouter.get("/:id/trailers", cacheMiddleware(7200000), get_videogameTrailers);
videogameIDRouter.get("/:id/screenshots", cacheMiddleware(7200000), get_videogameScreenshots);

// Cache por 1 hora para precios (CheapShark)
videogameIDRouter.get("/:id/prices", cacheMiddleware(3600000), getVideogamePrices);

module.exports = videogameIDRouter;
