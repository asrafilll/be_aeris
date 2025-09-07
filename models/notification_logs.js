// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const NotificationLogs = con.db.define(
  "notification_logs",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleUid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    severity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    generatedMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actualValue: {
      type: DataTypes.STRING,
    },
    plcSclId: {
      type: DataTypes.STRING,
    },
    plcUId: {
      type: DataTypes.STRING,
    },
    speed: {
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
  NotificationLogs,
};