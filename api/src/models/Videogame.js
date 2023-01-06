const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "videogame",
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      released: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DOUBLE, // INT segun el PI-EXPERT
        allowNull: true,
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      createdInDB: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: true,
      },
    },
    { timestamps: false }
  );
};
