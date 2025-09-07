// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const Devices = con.db.define(
  "devices",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deviceId: {
      type: DataTypes.STRING,
    },
    make: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    simId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model
module.exports = {
  Devices,
};