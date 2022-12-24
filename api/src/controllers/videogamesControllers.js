const {
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
} = require("../helpers/videogamesHelpers.js");
const { Videogame, Genre } = require("../db");

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

//GET ID -> /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
const get_videogameDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const videogame = await get_videogame_detail(id);
    res.status(200).send(videogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//POST
const create_videogame = async (req, res) => {
  const { name, image, description, released, rating, platforms, genres } =
    req.body;
  if (name && description) {
    const platformsArray = platforms.split(",");
    const videogameCreated = await Videogame.create({
      name: name,
      image: image,
      description: description,
      released: released,
      rating: rating,
      platforms: platformsArray,
      createdInDB: true,
    });

    const genresArray = genres.split(",");
    let genresDb = await Genre.findAll({
      where: { name: genresArray },
    });

    for (const genre of genresDb) {
      videogameCreated.addGenre(genre);
    }

    res.status(200).send(videogameCreated);
  } else {
    return res.status(400).json({ error: "missing info" });
  }
};

//DELETE
const delete_videogame = async (req, res) => {};

//PUT
const put_videogame = async (req, res) => {};

module.exports = {
  create_videogame,
  get_videogames,
  get_videogameDetail,
  delete_videogame,
  put_videogame,
};
