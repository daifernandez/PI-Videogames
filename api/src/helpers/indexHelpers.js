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


const get_videogame_api = async () => {};


const apiDataVideogame = (data) => {
    // return {
    //   id: data.results.id ,
    //   name: data.results.name ,
    //   image: data.results.background_image,
    //   description:,
    //   rating: data.results.rating,
    //   platforms:,
    //   genres:,
    // };
  };

module.exports = { get_videogame_db, get_videogame_api, apiDataVideogame };
