// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const VehicleLogsAeris = con.db.define(
  "vehicle_logs_aeris",
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
    timestamp: {
      type: DataTypes.STRING,
    },
    deviceBatteryVoltage: {
      type: DataTypes.STRING,
    },
    vehicleBatteryVoltage: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    heading: {
      type: DataTypes.STRING,
    },
    gpsSpeed: {
      type: DataTypes.DOUBLE,
    },
    speed: {
      type: DataTypes.DOUBLE,
    },
    ignitionStatus: {
      type: DataTypes.STRING,
    },
    fuelRawValue: {
      type: DataTypes.STRING,
    },
    assetBatteryVoltage: {
      type: DataTypes.STRING,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['deviceId']
      },
      {
        fields: ['timestamp']
      }
    ]
  }
);

// Export model
module.exports = {
  VehicleLogsAeris,
};