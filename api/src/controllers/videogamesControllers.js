const { Videogame } = require("../db");

//POST
const create_videogame = async (req, res) => {
  const { name, image, description, realeased, rating, platforms } = req.body;
  res.json(name, image, description, realeased, rating, platforms);
};

//GET -> me responda con todos los videogames o busque
const get_videogames = async (req, res) => {
  const { name } = req.query;
  if (name) {
    return res.send(`Buscar por nombre: ${name}`);
  } else {
    res.send("Buscar todos los videogames");
  }
};

//GET ID -> /videogame/{idvideogame} -> me traiga el detalle de un videogame por id
const get_videogameID = async (req, res) => {
  const { id } = req.params;
  res.send(`RUTA PARA BUSCAR UN VIDEOGAME POR ${id}`);
};

//DELETE
const delete_videogame = async (req, res) => {};

module.exports = {
  create_videogame,
  get_videogames,
  get_videogameID,
  delete_videogame,
};
