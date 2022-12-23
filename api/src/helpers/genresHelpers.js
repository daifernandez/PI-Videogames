const { Genre } = require("../db");
const axios = require("axios");

const get_all_genres_helper = async () => {
  const allGenres = await Genre.findAll();
  if (allGenres.length > 0) {
    return allGenres;
  } else {
    const apiGenres = await axios
      .get(`https://api.rawg.io/api/genres?key=${process.env.API_KEY}`)
      .catch(function (error) {
        throw new Error(error.message);
      });
    const genres = apiGenres.data.results.map((el) => el.name);

    genres.forEach((el) => {
      Genre.findOrCreate({
        where: { name: el },
      });
    });

    const all = await Genre.findAll();
    return all;
  }
};

module.exports = { get_all_genres_helper };
