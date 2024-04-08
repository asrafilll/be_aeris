import { DataTypes } from 'sequelize';
import db from '../config/database.js';

// Define schema
const Task = db.define('tasks', {
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
   
export { Task };
