const { Router } = require("express");
const {
  create_videogame,
  get_videogames,
} = require("../controllers/videogamesControllers");
const { validatorMiddleware } = require("../middlewares");

const videogamesRouter = Router();

//GET -> me responda con todos los videogames o busque
videogamesRouter.get("/", get_videogames);

//POST /videogames -> me cree un videogame nuevo
videogamesRouter.post("/", validatorMiddleware, create_videogame);

module.exports = recipesRouter;
