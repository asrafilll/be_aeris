// import sequelize 
var sequelize = require('sequelize')
// import connection 
var con = require('../config/database.js')

const { DataTypes } = sequelize;

// Define schema
const Task = con.db.define('tasks', {
    // Define attributes
    task: {
      type: DataTypes.STRING
    },
    task_date: {
        type: DataTypes.DATE
      },
    task_time: {
        type: DataTypes.TIME
      },
    task_address: {
      type: DataTypes.STRING
    },
    task_lat: {
        type: DataTypes.STRING
    },
    task_lon: {
        type: DataTypes.STRING
    },
    task_status: {
      type: DataTypes.STRING
    },
    task_type: {
      type: DataTypes.STRING
    },
    userid: {
      type: DataTypes.INTEGER
    },
    user_lat:{
      type: DataTypes.STRING
    },
    user_lon:{
      type: DataTypes.STRING
    },
    vehicleid:{
      type: DataTypes.STRING
    },
    vehicle_lat:{
      type: DataTypes.STRING
    },
    vehicle_lon:{
      type: DataTypes.STRING
    },
    path:{
      type: DataTypes.TEXT
    },
    filename:{
      type: DataTypes.STRING
    }
  },{
    // Freeze Table Name
    freezeTableName: true
  });
   
  // Export model Product
  module.exports = { 
    Task
  }

// module.exports = (sequelize, DataTypes) => {
//     const Task = sequelize.define('tasks', {
//     // Define attributes
//     task: {
//       type: DataTypes.STRING
//     },
//     task_date: {
//         type: DataTypes.DATE
//       },
//     task_time: {
//         type: DataTypes.TIME
//       },
//     task_address: {
//       type: DataTypes.STRING
//     },
//     task_lat: {
//         type: DataTypes.STRING
//     },
//     task_lon: {
//         type: DataTypes.STRING
//     },
//     task_status: {
//       type: DataTypes.STRING
//     },
//     task_type: {
//       type: DataTypes.STRING
//     },
//     userid: {
//       type: DataTypes.INTEGER
//     },
//     user_lat:{
//       type: DataTypes.STRING
//     },
//     user_lon:{
//       type: DataTypes.STRING
//     },
//     vehicleid:{
//       type: DataTypes.STRING
//     },
//     vehicle_lat:{
//       type: DataTypes.STRING
//     },
//     vehicle_lon:{
//       type: DataTypes.STRING
//     },
//     desc:{
//       type: DataTypes.STRING
//     },
//     path:{
//       type: DataTypes.STRING
//     },
//     filename:{
//       type: DataTypes.STRING
//     },
//     recurrent:{
//       type:DataTypes.STRING
//     },
//     createdBy:{
//       type:DataTypes.INTEGER
//     }
//   },{
//     // Freeze Table Name
//     freezeTableName: true
//   });
//   // Task.associate = function(models) {
//   //     Task.hasMany(models.User),{
//   //       foreignKey: 'id',
//   //       as: 'users',
//   //     }
//   // }
//   return Task;
// }