const { Router } = require("express");
const {
  create_videogame,
  get_videogames,
  get_media,
  get_upcoming_games
} = require("../controllers/videogamesControllers");
const { validatorMiddleware } = require("../middlewares");

const videogamesRouter = Router();

videogamesRouter.get("/", get_videogames);
videogamesRouter.post("/", validatorMiddleware, create_videogame);
videogamesRouter.get("/upcoming", get_upcoming_games);
videogamesRouter.get("/:id/:type", get_media);

module.exports = videogamesRouter;
