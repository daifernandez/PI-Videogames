const { Genre } = require("../db");
const axios = require("axios");

const get_genres = async () => {
  const apiGenres = await axios.get(
    `https://api.rawg.io/api/genres?key=${process.env.API_KEY}`
  );
  const genres = apiGenres.data.results.map((el) => el.name);
  genres.forEach((el) => {
    Genre.findOrCreate({
      where: { name: el },
    });
  });
  const allGenres = await Genre.findAll();
  res.send(allGenres);
};

module.export = { get_genres };
