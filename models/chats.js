// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const Chats = con.db.define(
  "chats",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    from_userid: {
      type: DataTypes.INTEGER,
    },
    to_userid: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.STRING,
    },
    media: {
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
  Chats,
};