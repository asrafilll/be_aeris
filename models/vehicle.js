// import sequelize 
var sequelize = require('sequelize')
// import connection 
var con = require('../config/database.js')

const { DataTypes } = sequelize;

// Define schema
const Vehicle = con.db.define('vehicles', {
    // Define attributes
    vehicleid: {
      type: DataTypes.STRING
    },
    vehicle_brand: {
        type: DataTypes.STRING
      },
    vehicle_type: {
      type: DataTypes.STRING
    },
    vehicle_condition: {
        type: DataTypes.STRING
    },
    power_status: {
        type: DataTypes.STRING
    },
    ign_status: {
      type: DataTypes.STRING
    },
    speed: {
      type: DataTypes.STRING
    },
    operating_time: {
      type: DataTypes.DATE
    },
    tagging:{
        type: DataTypes.STRING
    },
    assignment:{
        type: DataTypes.INTEGER
    },
    simId:{
        type:DataTypes.STRING
    },
    init_odometer:{
        type:DataTypes.INTEGER
    },
    odometer:{
        type:DataTypes.INTEGER
    }
  },{
    // Freeze Table Name
    freezeTableName: true
  });
   
  // Export model Product
  module.exports = { 
    Vehicle
  }