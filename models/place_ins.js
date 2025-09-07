// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const PlaceIns = con.db.define(
  "place_ins",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    in_code: {
      type: DataTypes.STRING,
    },
    vehicleUid: {
      type: DataTypes.STRING,
    },
    place: {
      type: DataTypes.STRING,
    },
    in_date: {
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
  PlaceIns,
};