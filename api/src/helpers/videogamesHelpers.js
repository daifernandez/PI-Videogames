const { Videogame, Genre } = require("../db");
const axios = require("axios");
let local_videogames = require("./local_videogames.json");

const get_videogame_db = async () => {
  const videogames = await Videogame.findAll({
    include: {
      model: Genre,
      attributes: ["name"],
      through: { attributes: [] },
    },
  });

  return videogames.map((videogame) => {
    console.log(videogame.genres);
    return {
      id: videogame.id,
      name: videogame.name,
      image: videogame.image,
      description: videogame.description,
      released: videogame.released,
      rating: videogame.rating,
      platforms: videogame.platforms,
      genres: videogame.genres.map((genres) => genres.name),
      createdInDB: videogame.createdInDB,
    };
  });
};

const api_videogameParse = (apiObject) => {
  const platformNames = apiObject.platforms.map((element) => {
    return element.platform.name;
  });

  const genresApi = apiObject.genres.map((el) => {
    return el.name;
  });

  return {
    id: apiObject.id,
    name: apiObject.name,
    image: apiObject.background_image,
    rating: apiObject.rating,
    released: apiObject.released,
    platforms: platformNames,
    genres: genresApi,
    description: apiObject.description,
  };
};

const get_videogame_api = async () => {
  const pagesToFetch = [1, 2, 3];
  // var allVideogames = [];
  var allVideogames = local_videogames;
  // for (pageNumber of pagesToFetch) {
  //   console.log(pageNumber);
  //   const urlApi = await axios.get(
  //     `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page_size=40&page=${pageNumber}`
  //   );

  //   allVideogames = allVideogames.concat(urlApi.data.results);
  // }

  const videogamesApi = allVideogames.map((apiObject) => {
    return api_videogameParse(apiObject);
  });

  return videogamesApi;
};

const get_allVideogames = async () => {
  const apiVideogames = await get_videogame_api();
  const dbVideogames = await get_videogame_db();
  const allVideogames = [...apiVideogames, ...dbVideogames];
  return allVideogames;
};

const get_videogame_byName = async (name) => {
  const videogameSearch = await axios
    .get(
      `https://api.rawg.io/api/games?search=${name}&key=${process.env.API_KEY}`
    )
    .catch(function (error) {
      throw new Error(error.message);
    });

  const videogamesApi = videogameSearch.data.results
    .slice(0, 15)
    .map((apiObject) => {
      return api_videogameParse(apiObject);
    });

  return videogamesApi;
};

const get_videogame_detail = async (id) => {
  if (parseInt(id)) {
    const videogameDetail = await axios
      .get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`)
      .catch(function (error) {
        throw new Error(error.message);
      });

    const result = api_videogameParse(videogameDetail.data);
    return result;
  } else {
    const videogameDBFind = await Videogame.findByPk(id, {
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
    });
    if (videogameDBFind) {
      return {
        id: videogameDBFind.id,
        name: videogameDBFind.name,
        image: videogameDBFind.image,
        description: videogameDBFind.description,
        released: videogameDBFind.released,
        rating: videogameDBFind.rating,
        platforms: videogameDBFind.platforms,
        genres: videogameDBFind.genres.map((genres) => genres.name),
        createdInDB: videogameDBFind.createdInDB,
      };
    }
  }
};

const delete_videogameDB = async (id) => {
  const videogameToDelete = await Videogame.findByPk(id);
  if (videogameToDelete) {
    videogameToDelete.destroy().catch(function (error) {
      throw new Error(error.message);
    });
  } else {
    throw new Error("Videogame not found");
  }
};

const updateVideogame = async (
  name,
  image,
  description,
  released,
  rating,
  platforms,
  genres
) => {
  // const videogame = users.find(user => user.id === parseInt(id));
  // if(!user) return {error: "User not found"};
  // user.name= name;
  // user.surname= surname;
  // user.mail= mail;
  // user.age= age;
  // return user;
};

module.exports = {
  get_videogame_db,
  get_videogame_api,
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  delete_videogameDB,
};
