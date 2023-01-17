const { Videogame, Genre } = require("../db");

const {
  get_allVideogames,
  get_videogame_byName,
} = require("../helpers/videogamesHelpers.js");

let local_videogames = require("../helpers/local_videogames.json");

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
    // TODO: Remove!
    // res.status(200).json(local_videogames);
    let videogamesTotal = await get_allVideogames();
    res.status(200).json(videogamesTotal);
  }
};

//POST
const create_videogame = async (req, res) => {
  const { name, image, description, released, rating, platforms, genres } =
    req.body;

  // Creo el video juego con las propiedades pero sin relacion a generos.
  const videogame = await Videogame.create({
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

  // Busco los generos en la base de datos a partir de los nombres de los generos pasados por body.
  const genresDb = await Genre.findAll({ where: { name: genres } });
  // Creamos la relacion entre videogame y generos en la base de datos. Esto NO actualiza el objecto videogame.
  await videogame.addGenres(genresDb);

  // Traemos el videojuego CON relaciones de la base de datos para devolverlo.
  const videogameWithRelation = await Videogame.findByPk(videogame.id, {
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  }).catch(function (error) {
    throw new Error(error.message);
  });

  res.status(200).send({
    id: videogameWithRelation.id,
    name: videogameWithRelation.name,
    image: videogameWithRelation.image,
    description: videogameWithRelation.description,
    released: videogameWithRelation.released,
    rating: videogameWithRelation.rating,
    platforms: videogameWithRelation.platforms,
    genres: videogameWithRelation.genres.map((genres) => genres.name),
    createdInDB: videogameWithRelation.createdInDB,
  });
};

module.exports = { create_videogame, get_videogames };
