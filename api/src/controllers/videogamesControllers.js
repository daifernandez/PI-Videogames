const { Videogame, Genre } = require("../db");

const {
  get_allVideogames,
  get_videogame_byName,
} = require("../helpers/videogamesHelpers.js");

//GET -> me responda con todos los videogames o busque
const get_videogames = async (req, res) => {
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
};

//POST
const create_videogame = async (req, res) => {
  const { name, image, description, released, rating, platforms, genres } =
    req.body;

  const videogameCreated = await Videogame.create({
    name: name,
    image: image,
    description: description,
    released: released === "" ? null : released,
    rating: rating,
    platforms: platforms,
    createdInDB: true,
  }).catch(function (error) {
    throw new Error(error.message);
  });

  let genresDb = await Genre.findAll({
    where: { name: genres },
  });

  for (const genre of genresDb) {
    videogameCreated.addGenre(genre);
  }

  res.status(200).send(videogameCreated);
};

module.exports = { create_videogame, get_videogames };
