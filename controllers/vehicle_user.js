var Model = require('../models/vehicle_user.js')
var Vehicle_User = Model.Vehicle_User
var util = require('util');
var futil = require('../config/utility.js');
var result = {
    "code":"",
    "status":""
}

var Create = async function(req,res){
    try {
        const vehicle_user = await Vehicle_User.create(req.body);
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(vehicle_user));
        result.code = 200
        result.status ="success"
        result.data = "New data inserted"
        res.send(result);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Insert data failed"
        res.send(result);
    }
}


var Read = async function(req,res){
    try {
        const vehicle_user = await Vehicle_User.findAll();
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(vehicle_user));
        result.code = 200
        result.status ="success"
        result.data = vehicle_user
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var ReadVehicleUsed = async function(req,res){
    try {
        const vehicle_user = await Vehicle_User.findAll({
            where: {
                vehicleid: req.params.vehicleid
            }
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(vehicle_user));
        result.code = 200
        result.status ="success"
        result.data = vehicle_user
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var ReadUserVehicle = async function(req,res){
    try {
        const vehicle_user = await Vehicle_User.findOne({
            where: {
                vehicleid: req.params.vehicleid
            },
            order: [ [ 'createdAt', 'DESC' ]]
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(vehicle_user));
        result.code = 200
        result.status ="success"
        result.data = vehicle_user
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var ReadVehicleByUser = async function(req,res){
    try {
        const vehicle_user = await Vehicle_User.findOne({
            where: {
                userid: req.params.userid
            },
            order: [ [ 'createdAt', 'DESC' ]]
        });
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(vehicle_user));
        result.code = 200
        result.status ="success"
        result.data = vehicle_user
        res.send(result);
        // res.status(200).send(task);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}

var Update = async function (req,res){
    try {
        const vehicle_user = await Vehicle_User.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        result.code = 200
        result.status ="success"
        result.data = "Update data success"
        res.send(result);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Update data failed"
        res.send(result);
    }
}

var Delete = async function (req,res){
    try {
        await Vehicle_User.destroy({
            where: {
                id: req.params.id
            }
        });
        result.code = 200
        result.status ="success"
        result.data = "Delete data success"
        res.send(result);
    } catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Delete data failed"
        res.send(result);
    }
}

module.exports = {
    Create,
    Read,
    ReadVehicleUsed,
    ReadVehicleByUser,
    ReadUserVehicle,
    Update,
    Delete
}