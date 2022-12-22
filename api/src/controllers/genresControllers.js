const { Genre } = require("../db");
const {get_genres}=  require("../helpers/genresHelpers.js")

const get_genres = async (req, res) => {
  const genres = await Genre.findAll();
  if (genres.length > 0) {
    res.send(200).send(genres);
  } else {
   
  }

};

module.exports = { get_genres };


