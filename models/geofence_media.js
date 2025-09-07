// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const GeofenceMedia = con.db.define(
  "geofence_media",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    placeUid: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
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
  GeofenceMedia,
};