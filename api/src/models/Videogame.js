const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
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
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      platforms: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trailers: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
      },
      screenshots: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      esrb_rating: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publishers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      developers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      createdInDB: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    { timestamps: false }
  );
};
