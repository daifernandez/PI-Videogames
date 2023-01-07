const { Router } = require("express");
const videogameIDRouter = Router();
const {
  get_videogame_detail,
  delete_videogameDB,
  updateVideogame,
} = require("../helpers/videogamesHelpers.js");

//GET ID -> /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
videogameIDRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const videogame = await get_videogame_detail(id);
    res.status(200).send(videogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE
videogameIDRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await delete_videogameDB(id);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//PUT
videogameIDRouter.put("/:id", async (req, res) => {
  const { name, image, description, released, rating, platforms, genres, id } =
    req.body;
  //esto es solo las requeridas o tiene que ser todo?
  if (!name || !description || !released || !platforms || !genres)
    return res.status(400).json({ error: "missing info" });

  const updatedVideogame = updateVideogame(
    id,
    name,
    image,
    description,
    released,
    rating,
    platforms,
    genres
  );

  if (updatedVideogame[error]) return res.status(400).json(updatedVideogame);
  else res.status(200).json(updatedVideogame);
});

module.exports = videogameIDRouter;
