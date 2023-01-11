const { Router } = require("express");
const {
  create_videogame,
  get_videogames,
} = require("../controllers/videogamesControllers");
const { validatorMiddleware } = require("../middlewares");

const videogamesRouter = Router();

videogamesRouter.get("/", get_videogames);
videogamesRouter.post("/", validatorMiddleware, create_videogame);

module.exports = videogamesRouter;
