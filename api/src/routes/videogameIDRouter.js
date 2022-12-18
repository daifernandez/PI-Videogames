const { Router } = require("express");
const {
  get_videogameID,
} = require("../controllers/videogameControllers");

const videogameRouter = Router();

//GET /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
videogameRouter.get("/:id", get_videogameID);