const { get_videogame_api } = require("../helpers/videogamesHelpers.js");


//GET -> me responda con todos los videogames o busque
const get_videogames = async (req, res) => {
  const { name } = req.query;
  if (name) {
    return res.send(`Buscar por nombre: ${name}`);
  } else {
    const videogames = await get_videogame_api();
    res.status(200).json(videogames);
  }
};

//GET ID -> /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
const get_videogame = async (req, res) => {
  const { id } = req.params;
  res.send(`RUTA PARA BUSCAR UN VIDEOGAME POR ${id}`);
};


//POST
const create_videogame = async (req, res) => {
  const { name, image, description, realeased, rating, platforms } = req.body;
  res.json(name, image, description, realeased, rating, platforms);
};

//DELETE
const delete_videogame = async (req, res) => {};

module.exports = {
  create_videogame,
  get_videogames,
  get_videogame,
  delete_videogame,
};
