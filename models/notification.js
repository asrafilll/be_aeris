// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const Notification = con.db.define(
  "notifications",
  {
    // Define attributes
    uId: {
      type: DataTypes.STRING,
    },
    vehicleUid: {
      type: DataTypes.STRING,
    },
    vehicleId: {
      type: DataTypes.STRING,
    },
    severity: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    generatedMessage: {
      type: DataTypes.STRING,
    },
    send_date: {
      type: DataTypes.DATE,
    },
    speed: {
      type: DataTypes.STRING,
    },
    actualValue: {
      type: DataTypes.STRING,
    },
    plcUId: {
      type: DataTypes.STRING,
    },
    plcSclId: {
      type: DataTypes.STRING,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
  }
);

// Export model Product
module.exports = {
  Notification,
};
