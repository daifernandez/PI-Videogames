const { Router } = require("express");
const { get_genres } = require('../controllers/genresControllers')

const genresRouter = Router();

// GET genres
genresRouter.get("/", get_genres);

module.exports = genresRouter;
