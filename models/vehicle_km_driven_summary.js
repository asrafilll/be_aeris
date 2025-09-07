// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const VehicleKmDrivenSummary = con.db.define(
  "vehicle_km_driven_summary",
  {
    // Define attributes
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    assetUid: {
      type: DataTypes.STRING,
    },
    vehicleSclId: {
      type: DataTypes.STRING,
    },
    totalKmDriven: {
      type: DataTypes.FLOAT,
    },
    totalTimeVehicleMovingSec: {
      type: DataTypes.BIGINT,
    },
    totalTimeVehicleUsedMSec: {
      type: DataTypes.BIGINT,
    },
    totalTimeVehicleIdleSec: {
      type: DataTypes.BIGINT,
    },
    segments: {
      type: DataTypes.INTEGER,
    },
    firstON: {
      type: DataTypes.BIGINT,
    },
    lastON: {
      type: DataTypes.BIGINT,
    },
    startLat: {
      type: DataTypes.STRING,
    },
    startLong: {
      type: DataTypes.STRING,
    },
    endLat: {
      type: DataTypes.STRING,
    },
    endLong: {
      type: DataTypes.STRING,
    },
    maxSpeed: {
      type: DataTypes.FLOAT,
    },
    timestamp: {
      type: DataTypes.BIGINT,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model
module.exports = {
  VehicleKmDrivenSummary,
};