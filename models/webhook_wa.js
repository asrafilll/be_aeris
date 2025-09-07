// import sequelize
var sequelize = require("sequelize");
// import connection
var con = require("../config/database.js");

const { DataTypes } = sequelize;

// Define schema
const WebhookWa = con.db.define(
  "webhook_wa",
  {
    // Define attributes
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    from: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.STRING,
    },
    timestamp: {
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
  WebhookWa,
};