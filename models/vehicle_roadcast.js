// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const VehicleRoadcast = con.db.define(
  "vehicle_roadcast",
  {
    // Define attributes (no primary key as per SQL structure)
    device_id: {
      type: DataTypes.STRING,
    },
    internal_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    uniqueid: {
      type: DataTypes.STRING,
    },
    network: {
      type: DataTypes.STRING,
    },
    protocol: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
    },
    last_update: {
      type: DataTypes.STRING,
    },
    model: {
      type: DataTypes.STRING,
    },
    added_om: {
      type: DataTypes.STRING,
    },
    expiry: {
      type: DataTypes.STRING,
    },
    reason: {
      type: DataTypes.STRING,
    },
    license_end: {
      type: DataTypes.STRING,
    },
    operator: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    no_data: {
      type: DataTypes.STRING,
    },
    expired: {
      type: DataTypes.STRING,
    },
    troubleshooting: {
      type: DataTypes.STRING,
    },
  },
  {
    // Freeze Table Name
    freezeTableName: true,
    timestamps: false,
  }
);

// Export model
module.exports = {
  VehicleRoadcast,
};