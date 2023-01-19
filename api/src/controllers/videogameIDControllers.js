const {
  get_videogame_detail,
  delete_videogameDB,
} = require("../helpers/videogamesHelpers.js");

const get_videogameDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const videogame = await get_videogame_detail(id);
    res.status(200).send(videogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const delete_videogame = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVideogame = await delete_videogameDB(id);
    res.status(200).send(deletedVideogame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  get_videogameDetail,
  delete_videogame,
};
