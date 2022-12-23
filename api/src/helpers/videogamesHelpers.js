const { Videogame, Genre } = require("../db");
const axios = require("axios");

const get_videogame_db = async () => {
  const videogames = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });

  return videogames.map((videogame) => {
    return {
      id: videogame.id,
      name: videogame.name,
      image: videogame.image,
      description: videogame.description,
      released: videogame.released,
      rating: videogame.rating,
      platforms: videogame.platforms,
      genres: videogame.genres.map((genres) => genres.name),
    };
  });
};

const get_videogame_api = async () => {
  const urlApi = await axios.get(
    `https://api.rawg.io/api/games?key=${process.env.API_KEY}`
  );

  const videogamesApi = await urlApi.data.results.map((apiObject) => {
    return {
      id: apiObject.id,
      name: apiObject.name,
      image: apiObject.background_image,
      rating: apiObject.rating,
      // platforms:,
      // genres:,
    };
  });

  return videogamesApi;
};

const get_allVideogames = async () => {
  const apiVideogames = await get_videogame_api();
  const dbVideogames = await get_videogame_db();
  const allVideogames = [...apiVideogames, ...dbVideogames];
  return allVideogames;
};

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

module.exports = {
  get_videogame_db,
  get_videogame_api,
  get_allVideogames,
  get_all_genres_helper,
};
