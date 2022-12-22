const { Router } = require("express");
const {
  delete_videogame,
  put_videogame,
  get_videogameDetail,
} = require("../controllers/videogamesControllers");

const videogameRouter = Router();

//GET
videogameRouter.get("/:id", get_videogameDetail);
videogameRouter.delete("/:id", delete_videogame);
videogameRouter.put("/:id", put_videogame);

module.exports = videogameRouter;
