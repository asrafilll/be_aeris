// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const UsersDetail = con.db.define(
  "users_detail",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    features: {
      type: DataTypes.STRING,
    },
    alerts: {
      type: DataTypes.STRING,
    },
    timezone: {
      type: DataTypes.STRING,
    },
    location: {
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
  UsersDetail,
};