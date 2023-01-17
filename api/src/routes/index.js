const { Router } = require("express");
const videogamesRouter = require("./videogamesRouter.js");
const videogameIDRouter = require("./videogameIDRouter.js");
const genresRouter = require("./genresRouter.js");

const router = Router();

router.use("/videogames", videogamesRouter);
router.use("/videogame", videogameIDRouter);
router.use("/genres", genresRouter);

module.exports = router;
