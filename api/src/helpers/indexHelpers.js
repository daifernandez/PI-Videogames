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
  const videogamesApi = await urlApi.data.results.map(apiDataToVideogame);
  return videogamesApi;
};

const apiDataToVideogame = (apiObject) => {
  return {
    id: apiObject.id,
    name: apiObject.name,
    image: apiObject.background_image,
    rating: apiObject.rating,
    // platforms:,
    // genres:,
  };
};

const get_allVideogames = async () => {
  const infoApi = await get_videogame_api();
  const infoDB = await get_videogame_db();
  const infoTotal = infoApi.concat(infoDB);
  return infoTotal;
};

module.exports = { get_videogame_db, get_videogame_api, get_allVideogames };
