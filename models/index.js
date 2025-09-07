const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const db = {};

require('dotenv').config();

let sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USER,process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.User = require("./user.js")(sequelize, Sequelize);
db.Task = require("./task.js").Task;
db.Vehicle = require("./vehicle.js").Vehicle;
db.VehicleUser = require("./vehicle_user.js").Vehicle_User;
db.Notification = require("./notification.js").Notification;
db.NotificationLogs = require("./notification_logs.js").NotificationLogs;
db.Setting = require("./setting.js").Setting;
db.Address = require("./address.js").Address;
db.ApiKey = require("./api_key.js").ApiKey;
db.Chats = require("./chats.js").Chats;
db.Devices = require("./devices.js").Devices;
db.Geofences = require("./geofences.js").Geofences;
db.GeofenceMedia = require("./geofence_media.js").GeofenceMedia;
db.PlaceIns = require("./place_ins.js").PlaceIns;
db.PlaceOuts = require("./place_outs.js").PlaceOuts;
db.UsersDetail = require("./users_detail.js").UsersDetail;
db.VehicleDetail = require("./vehicle_detail.js").VehicleDetail;
db.VehicleKmDrivenSummary = require("./vehicle_km_driven_summary.js").VehicleKmDrivenSummary;
db.VehicleLogsAeris = require("./vehicle_logs_aeris.js").VehicleLogsAeris;
db.VehicleLogsRoadcast = require("./vehicle_logs_roadcast.js").VehicleLogsRoadcast;
db.VehiclePerawatan = require("./vehicle_perawatan.js").VehiclePerawatan;
db.VehicleRoadcast = require("./vehicle_roadcast.js").VehicleRoadcast;
db.SentWa = require("./sent_wa.js").SentWa;
db.TempVehicles = require("./temp_vehicles.js").TempVehicles;
db.WebhookWa = require("./webhook_wa.js").WebhookWa;

// Define associations
// User associations
db.User.hasMany(db.Task, { 
  foreignKey: "userid",
  as: "tasks"
});
db.Task.belongsTo(db.User, {
  foreignKey: "userid",
  as: "user",
});

db.User.hasMany(db.VehicleUser, { 
  foreignKey: "userid",
  as: "vehicleAssignments"
});
db.VehicleUser.belongsTo(db.User, {
  foreignKey: "userid",
  as: "user",
});

db.User.hasOne(db.UsersDetail, { 
  foreignKey: "user_id",
  as: "details"
});
db.UsersDetail.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

// Vehicle associations
db.Vehicle.hasMany(db.VehicleUser, { 
  foreignKey: "vehicleid",
  sourceKey: "vehicleid",
  as: "userAssignments"
});
db.VehicleUser.belongsTo(db.Vehicle, {
  foreignKey: "vehicleid",
  targetKey: "vehicleid",
  as: "vehicle",
});

db.Vehicle.hasOne(db.VehicleDetail, { 
  foreignKey: "vehicleId",
  sourceKey: "vehicleid",
  as: "details"
});
db.VehicleDetail.belongsTo(db.Vehicle, {
  foreignKey: "vehicleId",
  targetKey: "vehicleid",
  as: "vehicle",
});

db.Vehicle.hasMany(db.Task, { 
  foreignKey: "vehicleid",
  sourceKey: "vehicleid",
  as: "tasks"
});
db.Task.belongsTo(db.Vehicle, {
  foreignKey: "vehicleid",
  targetKey: "vehicleid",
  as: "vehicle",
});

db.Vehicle.hasMany(db.VehicleLogsAeris, { 
  foreignKey: "deviceId",
  sourceKey: "deviceId",
  as: "aerisLogs"
});
db.VehicleLogsAeris.belongsTo(db.Vehicle, {
  foreignKey: "deviceId",
  targetKey: "deviceId",
  as: "vehicle",
});

db.Vehicle.hasMany(db.VehicleLogsRoadcast, { 
  foreignKey: "deviceId",
  sourceKey: "deviceId",
  as: "roadcastLogs"
});
db.VehicleLogsRoadcast.belongsTo(db.Vehicle, {
  foreignKey: "deviceId",
  targetKey: "deviceId",
  as: "vehicle",
});

db.Vehicle.hasMany(db.VehicleKmDrivenSummary, { 
  foreignKey: "vehicleSclId",
  sourceKey: "vehicleSclId",
  as: "kmSummaries"
});
db.VehicleKmDrivenSummary.belongsTo(db.Vehicle, {
  foreignKey: "vehicleSclId",
  targetKey: "vehicleSclId",
  as: "vehicle",
});

// Geofence associations
db.Geofences.hasMany(db.GeofenceMedia, { 
  foreignKey: "placeUid",
  sourceKey: "placeUid",
  as: "media"
});
db.GeofenceMedia.belongsTo(db.Geofences, {
  foreignKey: "placeUid",
  targetKey: "placeUid",
  as: "geofence",
});

// Chat associations
db.User.hasMany(db.Chats, { 
  foreignKey: "from_userid",
  as: "sentChats"
});
db.User.hasMany(db.Chats, { 
  foreignKey: "to_userid",
  as: "receivedChats"
});
db.Chats.belongsTo(db.User, {
  foreignKey: "from_userid",
  as: "sender",
});
db.Chats.belongsTo(db.User, {
  foreignKey: "to_userid",
  as: "receiver",
});

module.exports = db