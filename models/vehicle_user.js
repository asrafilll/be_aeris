// import sequelize 
var sequelize = require('sequelize')
// import connection 
var con = require('../config/database.js')

const { DataTypes } = sequelize;

// Define schema
const Vehicle_User = con.db.define('vehicle_users', {
    // Define attributes
    vehicleid: {
      type: DataTypes.STRING
    },
    userid: {
        type: DataTypes.INTEGER
      },
    sclid: {
        type: DataTypes.STRING
    }
  },{
    // Freeze Table Name
    freezeTableName: true
  });
   
  // Export model Product
  module.exports = { 
    Vehicle_User
  }