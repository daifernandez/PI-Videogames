const {
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  delete_videogameDB,
  updateVideogame,
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
};

//DELETE
const delete_videogame = async (req, res) => {
  const { id } = req.params;
  try {
    await delete_videogameDB(id);
    res.status(200).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//PUT
const put_videogame = async (req, res) => {
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
};

module.exports = {
  create_videogame,
  get_videogames,
  get_videogameDetail,
  delete_videogame,
  put_videogame,
};
