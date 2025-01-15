require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const pg = require("pg");
const { DB_CONNECTION } = process.env;

const sequelize = new Sequelize(DB_CONNECTION, {
  logging: false,
  native: false,
  dialectModule: pg,
});
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const { Videogame, Genre } = sequelize.models;

Videogame.belongsToMany(Genre, { through: "Videogame_Genre" });
Genre.belongsToMany(Videogame, { through: "Videogame_Genre" });

// Función para sincronizar la base de datos
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
    throw error;
  }
};

module.exports = {
  ...sequelize.models, 
  conn: sequelize,
  syncDatabase
};
