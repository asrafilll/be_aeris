// Import express
var express = require ('express');
 // Init express router
const router = express.Router();
var Vehicle_User = require('../controllers/vehicle_user.js')
var Assets = require('../controllers/assets.js')
var Auth = require('../controllers/auth.js')

router.get('/', function (req, res) {
    console.log("Router Working");
    res.send({message:'Router Working'})
    res.end();
})

router.get('/api/pattern',function (req, res) {
    res.send({message:'Welcome Patern'})
    res.end()
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



router.post('/api/patern/auth',function (req, req) {
    Auth.Login(req,res)
})

module.exports.router = router

