const { Videogame, Genre } = require("../db");
const axios = require("axios");
const { Op } = require("sequelize");

const get_allVideogames = async () => {
  try {
    const apiVideogames = await get_videogame_api();
    const dbVideogames = await get_videogame_db();
    const allVideogames = [...apiVideogames, ...dbVideogames];
    return allVideogames;
  } catch (error) {
    throw new Error(error.message);
  }
};

const get_videogame_db = async () => {
  try {
    const videogames = await Videogame.findAll({
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
      attributes: [
        'id',
        'name',
        'image',
        'images',
        'video',
        'description',
        'released',
        'rating',
        'platforms',
        'createdInDB'
      ]
    });

    return videogames.map((videogame) => {
      const baseGame = {
        ...videogame.dataValues,
        genres: videogame.genres.map((genres) => genres.name),
      };

      const optionalFields = ['website', 'trailers', 'screenshots', 'esrb_rating', 'publishers', 'developers'];
      optionalFields.forEach(field => {
        if (videogame.dataValues[field] !== undefined) {
          baseGame[field] = videogame.dataValues[field];
        }
      });

      return baseGame;
    });
  } catch (error) {
    console.error('Error al obtener videojuegos de la base de datos:', error);
    throw new Error(`Error al obtener videojuegos de la base de datos: ${error.message}`);
  }
};

const get_videogame_api = async () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no configurada. Por favor, configure la variable de entorno API_KEY.");
  }

  const pagesToFetch = [
    {
      pageSize: 40,
      page: 1,
    },
    {
      pageSize: 40,
      page: 2,
    },
    {
      pageSize: 20,
      page: 5,
    },
  ];

  try {
    var allVideogames = [];
    for (const pageData of pagesToFetch) {
      try {
        const response = await axios.get(
          `https://api.rawg.io/api/games`,
          {
            params: {
              key: process.env.API_KEY,
              page_size: pageData.pageSize,
              page: pageData.page
            }
          }
        );

        if (response.data && response.data.results) {
          allVideogames = allVideogames.concat(response.data.results);
        } else {
          console.error("Respuesta inesperada de la API:", response.data);
          throw new Error("Formato de respuesta inválido de la API de RAWG");
        }
      } catch (pageError) {
        console.error(`Error al obtener la página ${pageData.page}:`, pageError.message);
        if (pageError.response?.status === 401) {
          throw new Error("API_KEY inválida o expirada");
        }
        throw pageError;
      }
    }

    const videogamesApi = allVideogames.map((apiObject) => {
      try {
        return api_videogameParse(apiObject);
      } catch (parseError) {
        console.error("Error al parsear videojuego:", parseError);
        return null;
      }
    }).filter(game => game !== null);

    return videogamesApi;
  } catch (error) {
    throw new Error(`Error al obtener videojuegos: ${error.message}`);
  }
};

const api_videogameParse = (apiObject) => {
  const platformNames = apiObject.platforms.map((element) => {
    return element.platform.name;
  });

  const genresApi = apiObject.genres.map((el) => {
    return el.name;
  });

  const publishers = apiObject.publishers?.map(pub => pub.name) || [];
  const developers = apiObject.developers?.map(dev => dev.name) || [];
  const screenshots = apiObject.screenshots?.map(screen => screen.image) || [];

  return {
    id: apiObject.id,
    name: apiObject.name,
    image: apiObject.background_image,
    rating: apiObject.rating,
    released: apiObject.released,
    platforms: platformNames,
    genres: genresApi,
    description: apiObject.description,
    website: apiObject.website,
    esrb_rating: apiObject.esrb_rating?.name,
    publishers: publishers,
    developers: developers,
    screenshots: screenshots,
    trailers: apiObject.movies || []
  };
};

const get_videogame_byName = async (name) => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY no configurada");
    }

    // Búsqueda en la API
    const videogameApiSearch = await axios.get(
      `https://api.rawg.io/api/games`,
      {
        params: {
          key: process.env.API_KEY,
          search: name,
          search_exact: true,
          page_size: 15 // Limitamos a 15 resultados
        }
      }
    );

    if (!videogameApiSearch.data || !videogameApiSearch.data.results) {
      console.error("Respuesta inesperada de la API:", videogameApiSearch.data);
      throw new Error("Formato de respuesta inválido de la API de RAWG");
    }

    // Búsqueda en la DB
    const videogameDBSearch = await get_videogame_db_byName(name);

    // Procesamos los resultados de la API
    const videogamesApi = videogameApiSearch.data.results.map((apiObject) => {
      try {
        return api_videogameParse(apiObject);
      } catch (parseError) {
        console.error("Error al parsear videojuego:", parseError);
        return null;
      }
    }).filter(game => game !== null);

    // Combinamos y limitamos resultados
    const allResults = [...videogamesApi, ...videogameDBSearch];
    return allResults.slice(0, 15); // Limitamos el total a 15 resultados

  } catch (error) {
    console.error("Error en get_videogame_byName:", error);
    
    if (error.response?.status === 401) {
      throw new Error("API_KEY inválida o expirada");
    }
    
    if (error.response?.status === 404) {
      throw new Error("No se encontraron videojuegos con ese nombre");
    }
    
    if (error.message.includes("RAWG")) {
      throw new Error("Error al comunicarse con el servicio externo");
    }
    
    throw new Error(`Error al buscar videojuegos: ${error.message}`);
  }
};

const get_videogame_db_byName = async (name) => {
  try {
    const dbVideogameName = await Videogame.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`, // Cambiamos a iLike para búsqueda insensible a mayúsculas/minúsculas
        },
      },
      include: {
        model: Genre,
        attributes: ["name"],
        through: { attributes: [] },
      },
      limit: 15 // Limitamos a 15 resultados
    });

    return dbVideogameName.map((videogame) => {
      const baseGame = {
        ...videogame.dataValues,
        genres: videogame.genres.map((genres) => genres.name),
      };

      // Agregamos campos opcionales si existen
      const optionalFields = ['website', 'trailers', 'screenshots', 'esrb_rating', 'publishers', 'developers'];
      optionalFields.forEach(field => {
        if (videogame.dataValues[field] !== undefined) {
          baseGame[field] = videogame.dataValues[field];
        }
      });

      return baseGame;
    });
  } catch (error) {
    console.error("Error en get_videogame_db_byName:", error);
    throw new Error(`Error al buscar en la base de datos: ${error.message}`);
  }
};

const get_videogame_detail = async (id) => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY no configurada");
    }

    if (id.includes("-")) {
      const videogameDBFind = await Videogame.findByPk(id, {
        include: {
          model: Genre,
          attributes: ["name"],
          through: { attributes: [] },
        },
      });

      if (!videogameDBFind) {
        throw new Error("Videojuego no encontrado en la base de datos");
      }

      const baseGame = {
        ...videogameDBFind.dataValues,
        genres: videogameDBFind.genres.map((genres) => genres.name),
      };

      // Agregamos campos opcionales si existen
      const optionalFields = ['website', 'esrb_rating', 'publishers', 'developers'];
      optionalFields.forEach(field => {
        if (videogameDBFind.dataValues[field] !== undefined) {
          baseGame[field] = videogameDBFind.dataValues[field];
        }
      });

      // Procesamos screenshots y trailers
      baseGame.screenshots = [
        ...(videogameDBFind.dataValues.screenshots || []),
        ...(videogameDBFind.dataValues.images || [])
      ];

      // Procesamos el video como trailer si existe
      if (videogameDBFind.dataValues.video) {
        const videoUrl = videogameDBFind.dataValues.video;
        const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
        let processedUrl = videoUrl;

        if (isYoutube) {
          // Extraer el ID del video de YouTube
          const youtubeMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (youtubeMatch) {
            processedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
          }
        }

        baseGame.trailers = [
          ...(videogameDBFind.dataValues.trailers || []),
          {
            id: 'custom-video',
            name: 'Video del juego',
            url: processedUrl,
            preview: videoUrl,
            isYoutube: isYoutube
          }
        ];
      } else {
        baseGame.trailers = videogameDBFind.dataValues.trailers || [];
      }

      return baseGame;

    } else {
      // Obtener detalles básicos del juego
      const [gameDetails, screenshots, trailers] = await Promise.all([
        axios.get(`https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`),
        axios.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.API_KEY}`),
        axios.get(`https://api.rawg.io/api/games/${id}/movies?key=${process.env.API_KEY}`)
      ]);



      // Procesar la respuesta principal
      const gameData = gameDetails.data;
      
      // Extraer screenshots
      const screenshotUrls = screenshots.data.results
        ? screenshots.data.results.map(s => s.image)
        : [];

      // Extraer trailers y procesar la data correctamente
      const trailerData = trailers.data.results
        ? trailers.data.results.map(trailer => {
            // Encontrar la mejor calidad disponible
            const videoData = trailer.data;
            let videoUrl = '';
            
            // Si tenemos datos de video, buscar la mejor calidad
            if (videoData) {
              // Primero intentar con YouTube
              if (trailer.external_id && trailer.external_id.includes('youtube')) {
                videoUrl = `https://www.youtube.com/embed/${trailer.external_id}`;
              } else {
                // Buscar la mejor calidad disponible
                const qualities = ['max', '1080p', '720p', '480p', '360p', '240p'];
                for (const quality of qualities) {
                  if (videoData[quality]) {
                    videoUrl = videoData[quality];
                    break;
                  }
                }

                // Si no encontramos ninguna calidad estándar, buscar cualquier URL disponible
                if (!videoUrl) {
                  const availableQualities = Object.keys(videoData);
                  if (availableQualities.length > 0) {
                    videoUrl = videoData[availableQualities[0]];
                  }
                }
              }
            }

            // Si no tenemos URL de video, intentar obtener el video de YouTube del preview
            if (!videoUrl && trailer.preview) {
              const youtubeMatch = trailer.preview.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
              if (youtubeMatch) {
                videoUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
              }
            }

            return {
              id: trailer.id,
              name: trailer.name || 'Trailer',
              preview: trailer.preview,
              url: videoUrl || null,
              thumbnail: trailer.preview,
              external_id: trailer.external_id,
              isYoutube: videoUrl?.includes('youtube.com/embed/')
            };
          }).filter(trailer => trailer.url)
        : [];

      // Combinar toda la información
      return {
        id: gameData.id,
        name: gameData.name,
        image: gameData.background_image,
        description: gameData.description,
        released: gameData.released,
        rating: gameData.rating,
        platforms: gameData.platforms.map(p => p.platform.name),
        genres: gameData.genres.map(g => g.name),
        website: gameData.website,
        esrb_rating: gameData.esrb_rating?.name,
        publishers: gameData.publishers?.map(p => p.name) || [],
        developers: gameData.developers?.map(d => d.name) || [],
        screenshots: screenshotUrls,
        trailers: trailerData
      };
    }
  } catch (error) {
    console.error("Error en get_videogame_detail:", error);
    
    if (error.response?.status === 401) {
      throw new Error("API_KEY inválida o expirada");
    }
    
    if (error.response?.status === 404) {
      throw new Error("Videojuego no encontrado");
    }
    
    throw new Error(`Error al obtener detalles del videojuego: ${error.message}`);
  }
};

const delete_videogameDB = async (id) => {
  const videogameToDelete = await Videogame.findByPk(id);
  if (videogameToDelete) {
    await videogameToDelete.destroy().catch(function (error) {
      throw new Error(error.message);
    });
    return videogameToDelete;
  } else {
    throw new Error("Videogame not found");
  }
};

const get_upcoming_games_api = async () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no configurada");
  }

  try {
    const currentDate = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearDate = nextYear.toISOString().split('T')[0];

    const response = await axios.get(
      `https://api.rawg.io/api/games`,
      {
        params: {
          key: process.env.API_KEY,
          dates: `${currentDate},${nextYearDate}`,
          ordering: 'released',
          page_size: 20,
          platforms: "187,186,18,16,15,27,19,17,1,14,80,83"
        }
      }
    );

    if (!response.data || !response.data.results) {
      console.error("Respuesta inesperada de la API:", response.data);
      throw new Error("Formato de respuesta inválido de la API de RAWG");
    }

    const upcomingGames = response.data.results
      .filter(game => {
        const releaseDate = new Date(game.released);
        const currentDate = new Date();
        return releaseDate > currentDate && !isNaN(releaseDate.getTime()) && game.platforms;
      })
      .map(apiObject => {
        try {
          return {
            id: apiObject.id,
            name: apiObject.name,
            image: apiObject.background_image,
            rating: apiObject.rating,
            released: apiObject.released,
            platforms: apiObject.platforms?.map(p => p.platform.name) || [],
            genres: apiObject.genres?.map(g => g.name) || []
          };
        } catch (parseError) {
          console.error("Error al parsear videojuego:", parseError);
          return null;
        }
      })
      .filter(game => game !== null && game.image && game.platforms.length > 0)
      .slice(0, 6);

    return upcomingGames;
  } catch (error) {
    console.error("Error en get_upcoming_games_api:", error);
    
    if (error.response?.status === 401) {
      throw new Error("API_KEY inválida o expirada");
    }
    
    throw new Error(`Error al obtener próximos lanzamientos: ${error.message}`);
  }
};

const get_recent_games_api = async () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY no configurada");
  }

  try {
    const currentDate = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const formattedThreeMonthsAgo = threeMonthsAgo.toISOString().split('T')[0];

    const response = await axios.get(
      `https://api.rawg.io/api/games`,
      {
        params: {
          key: process.env.API_KEY,
          dates: `${formattedThreeMonthsAgo},${formattedCurrentDate}`,
          ordering: '-released',
          page_size: 12
        }
      }
    );

    if (!response.data || !response.data.results) {
      throw new Error("Formato de respuesta inválido de la API de RAWG");
    }

    const recentGames = response.data.results.map(game => api_videogameParse(game));
    return recentGames;

  } catch (error) {
    console.error("Error al obtener juegos recientes:", error);
    if (error.response?.status === 401) {
      throw new Error("API_KEY inválida o expirada");
    }
    throw new Error(`Error al obtener juegos recientes: ${error.message}`);
  }
};

module.exports = {
  get_videogame_db,
  get_videogame_api,
  get_allVideogames,
  get_videogame_byName,
  get_videogame_detail,
  delete_videogameDB,
  get_upcoming_games_api,
  get_recent_games_api
};
