const { Router } = require("express");
const videogamesRouter = Router();
const { Videogame, Genre } = require("../db");
const { validatorMiddleware } = require("../middlewares");
const {
  get_allVideogames,
  get_videogame_byName,
} = require("../helpers/videogamesHelpers.js");

//GET -> me responda con todos los videogames o busque
videogamesRouter.get("/", async (req, res) => {
  const { name } = req.query;
  if (name) {
    try {
      const videogamesByName = await get_videogame_byName(name);
      res.status(200).json(videogamesByName);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    let videogamesTotal = await get_allVideogames();
    res.status(200).json(videogamesTotal);
  }
});

//POST
videogamesRouter.post("/", validatorMiddleware, async (req, res) => {
  const { name, image, description, released, rating, platforms, genres } =
    req.body;
  if (name && description) {
    const videogameCreated = await Videogame.create({
      name: name,
      image: image,
      description: description,
      released: released,
      rating: rating,
      platforms: platforms,
      createdInDB: true,
    });

    let genresDb = await Genre.findAll({
      where: { name: genres },
    });

    for (const genre of genresDb) {
      videogameCreated.addGenre(genre);
    }

    res.status(200).send(videogameCreated);
  } else {
    return res.status(400).json({ error: "missing info" });
  }
});

module.exports = videogamesRouter;
