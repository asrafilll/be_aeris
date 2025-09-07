// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const PlaceOuts = con.db.define(
  "place_outs",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    out_code: {
      type: DataTypes.STRING,
    },
    vehicleUid: {
      type: DataTypes.STRING,
    },
    place: {
      type: DataTypes.STRING,
    },
    out_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model
module.exports = {
  PlaceOuts,
};