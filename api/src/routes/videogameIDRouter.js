const { Router } = require("express");
const { get_videogameID } = require("../controllers/videogamesControllers");

const videogameRouter = Router();

//GET 
videogameRouter.get("/:id", get_videogameID);

module.exports = videogameRouter;
