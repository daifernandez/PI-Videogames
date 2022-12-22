const { get_allVideogames } = require("../helpers/videogamesHelpers.js");
const { Videogame, Genre } = require("../db");

//GET -> me responda con todos los videogames o busque
const get_videogames = async (req, res) => {
  const { name } = req.query;
  let videogamesTotal = await get_allVideogames();

  if (name) {
    let videogameName = videogamesTotal.filter((el) =>
      el.name.toLowerCase().includes(name.toLowerCase())
    );
    videogameName.length
      ? res.status(200).send(videogameName)
      : res.status(404).send("Videogame not found");
  } else {
    res.status(200).json(videogamesTotal);
  }

  // hara falta un try/catch????
};

//GET ID -> /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
const get_videogameDetail = async (req, res) => {
  const { id } = req.params;
  const totalVideogames = await get_allVideogames();

  if (id) {
    let videogameID = totalVideogames.filter((el) => el.id == id);
    videogameID.length
      ? res.status(200).json(videogameID)
      : res.status(404).send("Videogame not found");
  }
};

//POST
const create_videogame = async (req, res) => {
  const { name, image, description, realeased, rating, platforms } = req.body;
  if (name && description) {
    const videogameCreated = await Videogame.create({
      name,
      image,
      description,
      realeased,
      rating,
      platforms,
      createdInDB,
    });

    let genreDb = await Genre.findAll({
      where: { name: Genre },
    });
    videogameCreated.addGenre(genreDb);
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
