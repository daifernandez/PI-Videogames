const { Router } = require("express");
// Importar todos los routers;
const videogamesRouter = require("./videogamesRouter.js");
const genresRouter = require("./genresRouter.js");
const videogameIDRouter = require("./videogameIDRouter.js");

const router = Router();

// Configurar los routers

router.use("/videogames", videogamesRouter);
router.use("/genres", genresRouter);
router.use("/videogame", videogameIDRouter);

module.exports = router;
