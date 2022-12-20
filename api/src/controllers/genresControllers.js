const { Genre } = require("../db");

const get_genres = async (req, res) => {
  // const genres = await Genre.findAll();
  // if (genres.length > 0) {
  //   res.send(200).send(genres);
  // } else {
  //   const apiGenres = await axios.get("https://api.rawg.io/api/genres");
  // }
};

module.exports = { get_genres };
