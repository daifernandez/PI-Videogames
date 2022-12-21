const { Router } = require("express");
const { get_videogame } = require("../controllers/videogamesControllers");

const videogameRouter = Router();

//GET 
videogameRouter.get("/:id", get_videogame);

module.exports = videogameRouter;
