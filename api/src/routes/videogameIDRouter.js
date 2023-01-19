const { Router } = require("express");
const {
  delete_videogame,
  get_videogameDetail,
} = require("../controllers/videogameIDControllers.js");

const videogameIDRouter = Router();

videogameIDRouter.get("/:id", get_videogameDetail);
videogameIDRouter.delete("/:id", delete_videogame);

module.exports = videogameIDRouter;
