const { Router } = require("express");
// Importar todos los routers;
const videogamesRouter = require("../controllers/videogamesControllers.js");
const videogameIDRouter = require("../controllers/videogameIDControllers.js");
const genresRouter = require("../controllers/genresControllers.js");

const router = Router();

// Configurar los routers

router.use("/videogames", videogamesRouter);
router.use("/videogame", videogameIDRouter);
router.use("/genres", genresRouter);

module.exports = router;
