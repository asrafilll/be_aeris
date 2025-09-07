// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const Geofences = con.db.define(
  "geofences",
  {
    // Define attributes
    placeUid: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.UUIDV4,
    },
    placeId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING(50),
    },
    address: {
      type: DataTypes.TEXT,
    },
    coordinates: {
      type: DataTypes.TEXT,
    },
    customerId: {
      type: DataTypes.STRING(50),
    },
    creationTime: {
      type: DataTypes.BIGINT,
    },
    lastModifiedTime: {
      type: DataTypes.BIGINT,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false,
  }
);

// Export model
module.exports = {
  Geofences,
};