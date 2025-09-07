// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const Vehicle = con.db.define(
  "vehicles",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicleid: {
      type: DataTypes.STRING,
    },
    vehicle_brand: {
      type: DataTypes.STRING,
    },
    vehicle_type: {
      type: DataTypes.STRING,
    },
    vehicle_condition: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    vin: {
      type: DataTypes.STRING,
    },
    license_plate: {
      type: DataTypes.STRING,
    },
    deviceId: {
      type: DataTypes.STRING,
    },
    power_status: {
      type: DataTypes.STRING,
    },
    ign_status: {
      type: DataTypes.STRING,
    },
    speed: {
      type: DataTypes.STRING,
    },
    operating_time: {
      type: DataTypes.DATE,
    },
    tagging: {
      type: DataTypes.STRING,
    },
    assignment: {
      type: DataTypes.INTEGER,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    simId: {
      type: DataTypes.STRING,
    },
    init_odometer: {
      type: DataTypes.INTEGER,
    },
    vehicleSclId: {
      type: DataTypes.STRING,
    },
    dashcamId: {
      type: DataTypes.STRING,
    },
    lastday_odometer: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastday_odometer_period: {
      type: DataTypes.DATE,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model Product
module.exports = {
  Vehicle,
};
