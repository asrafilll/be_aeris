// Import express
var express = require ('express');
 // Init express router
var router = express.Router();
var Vehicle_User = require('../controllers/vehicle_user.js');
var Assets = require('../controllers/assets.js');
var Auth = require('../controllers/auth.js');
var Task = require('../controllers/task.js')
var Vehicle = require('../controllers/vehicle.js')
var util = require('util');
var futil = require('../config/utility.js');
const path = require("path");
const fileUpload = require('express-fileupload');



router.get('/api/pattern',function (req, res,next) {
    res.send({message:'Welcome Patern'})
    res.end();
})

router.get('/api/pattern/latest_status/:sclId',Auth.authAccessToken,function (req, res){
    Assets.LatestStatus(req,res)
})

router.get('/api/pattern/vehicle_user',Auth.authAccessToken,function (req, res){
    Vehicle_User.Read(req,res)
})

router.get('/api/pattern/vehicle_user/:userid',Auth.authAccessToken,function (req, res){
    Vehicle_User.ReadVehicleByUser(req,res)
})

router.get('/api/pattern/asset_address/:lat/:lng',Auth.authAccessToken,function (req, res){
    Assets.AssetAddress(req,res)
})


//  Login
router.post('/api/pattern/auth',function (req, res) {
    Auth.Login(req,res)
})

// Register

router.post('/api/pattern/register',function (req, res) {
    Auth.Register(req,res)
})

router.post('/api/pattern/change_password',function(req,res){
    Auth.ChangePassword(req,res)
})

//  Forgot Password
router.post('/api/pattern/forgot_password',function (req, res) {
    Auth.ForgotPassword(req,res)
})
//  Logout

// Task

// Task ===============================================================
router.post('/api/pattern/tasks',Auth.authAccessToken,function(req,res){

    futil.logger.debug('\n' + futil.shtm() + '- [ REQ HEADERS ] | INFO ' + util.inspect(req.headers));
    futil.logger.debug('\n' + futil.shtm() + '- [ REQ BODY ] | INFO ' + util.inspect(req.body));
    // futil.logger.debug('\n' + futil.shtm() + '- [ REQ FILE ] | INFO ' + util.inspect(req.file));
    Task.Create(req,res)
})

router.get('/api/pattern/tasks',Auth.authAccessToken,function (req, res){
    futil.logger.debug('\n' + futil.shtm() + '- [ REQ HEADERS ] | INFO ' + util.inspect(req.headers));
    futil.logger.debug('\n' + futil.shtm() + '- [ REQ BODY ] | INFO ' + util.inspect(req.body));
    Task.Read(req,res)
})

router.get('/api/pattern/tasks/:status',Auth.authAccessToken,function (req, res){
    Task.ReadTaskByStatus(req,res)
})

router.get('/api/pattern/tasks/status/user/:id',Auth.authAccessToken,function (req, res){
    Task.ReadTotalStatusPerUser(req,res)
})

router.get('/api/pattern/tasks/user/:id',Auth.authAccessToken,function (req, res){
    Task.ReadTaskUser(req,res)
})

router.get('/api/pattern/tasks/filter/:id',Auth.authAccessToken,function (req, res){
    Task.TaskFilter(req,res)
})

router.get('/api/pattern/tasks/image/:filename',Auth.authAccessToken,function (req, res){
    Task.Download(req,res)
})

router.put('/api/pattern/tasks/:id',Auth.authAccessToken,function (req, res){
    futil.logger.debug('\n' + futil.shtm() + '- [ REQ FILE ] | INFO ' + util.inspect(req.files));
    Task.Update(req,res)
})

router.delete('/api/pattern/tasks/:id',function (req, res){
    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADERS ] | INFO ' + util.inspect(req.headers));
    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST PARAMS ] | INFO ' + util.inspect(req.params));
    // futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST BODY ] | INFO ' + util.inspect(req.body));
    Task.Delete(req,res)
})

// ============================= ODOMETER ============================================================

router.get('/api/pattern/vehicle/odometer/:vehicleid',Auth.authAccessToken,function (req, res){
    Vehicle.ReadOdometer(req,res)
})



module.exports.router = router

