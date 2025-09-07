// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const VehicleDetail = con.db.define(
  "vehicle_detail",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicleId: {
      type: DataTypes.STRING,
    },
    imei: {
      type: DataTypes.STRING,
    },
    tagging: {
      type: DataTypes.STRING,
    },
    stnk: {
      type: DataTypes.DATE,
    },
    stnk_perpanjang: {
      type: DataTypes.DATE,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model
module.exports = {
  VehicleDetail,
};