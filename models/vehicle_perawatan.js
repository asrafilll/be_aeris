// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const VehiclePerawatan = con.db.define(
  "vehicle_perawatan",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING,
    },
    vehicleId: {
      type: DataTypes.STRING,
    },
    plat_number: {
      type: DataTypes.STRING,
    },
    stnk: {
      type: DataTypes.DATE,
    },
    stnk_perpanjang: {
      type: DataTypes.DATE,
    },
    odometer: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    ban: {
      type: DataTypes.STRING,
    },
    service: {
      type: DataTypes.STRING,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model
module.exports = {
  VehiclePerawatan,
};