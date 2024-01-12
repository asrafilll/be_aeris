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

db.user = require("./user.js")(sequelize, Sequelize);
// db.task = require("./task.js")(sequelize, Sequelize);
// db.device = require ("./device.js")(sequelize, Sequelize);
// db.vehicle = require ("./vehicle.js")(sequelize, Sequelize);


// db.user.hasMany(db.task, { as: "users" });
// db.task.belongsTo(db.user, {
//   foreignKey: "userid",
//   as: "users",
// });

module.exports = db