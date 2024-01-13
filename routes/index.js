// Import express
var express = require ('express');
 // Init express router
var router = express.Router();
var Vehicle_User = require('../controllers/vehicle_user.js');
var Assets = require('../controllers/assets.js');
var Auth = require('../controllers/auth.js');


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



router.post('/api/pattern/auth',function (req, req) {
    Auth.Login(req,res)
})

module.exports.router = router

