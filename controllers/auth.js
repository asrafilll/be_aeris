// var Model = require('../models/user.js')
// var User = Model.User
const db = require('../models');
const User = db.user;

var axios = require('axios')
var jwt = require('jsonwebtoken')
var util = require('util');
var futil = require('../config/utility.js');
const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require('crypto');


require('dotenv').config();

var Register = async function(req,res){
    // try
    futil.logger.debug('\n' + futil.shtm() + '- [ REGISTER ] | INFO ' + util.inspect(req.body));
    const user = await User.findAll({
        where: {
            [Op.or]: {
              username: req.body.username,
              email: req.body.email,
            },
          },
          raw:true
    });
    
    futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
    // res.send(user);
    var data = user

    if (data.length>0){
        // data sudah ada
        var result = {
            "status" : true,
            "message": 'success',
            "data"   : 'Data sudah ada'
        }

        res.setHeader("Content-Type", "application/json");
        //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
        // res.setHeader("token",token)
        res.writeHead(200);
        res.end(JSON.stringify(result, null, 3));
    }else{
        // register

        try {
            const user = await User.create(req.body);
            futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));

            var result = {
                "status" : true,
                "message": 'success',
                "data"   : ''
            }

            result.code = 200
            result.data = "New user created"
            res.send(result);
        } catch (err) {
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
            // result.code = 400
            // result.status ="failed"
            // result.data = "Insert data failed"
            // res.send(result);

            var result = {
                "status" : true,
                "message": 'success',
                "data"   : err
            }

            res.setHeader("Content-Type", "application/json");
            //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
            // res.setHeader("token",token)
            res.writeHead(200);
            res.end(JSON.stringify(result, null, 3));
        }

    }
}

var Login = async function(req,res){
    // try {
        futil.logger.debug('\n' + futil.shtm() + '- [ LOGIN ] | INFO ' + util.inspect(req.body));

        const user = await User.findAll({
            where: {
                username: req.body.username,
                password: req.body.password
              },
              raw:true
        });
        
        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        var data = user

        if (data.length>0){
            // Get vehicle information for the logged-in user
            const userId = data[0].id;
            
            try {
                // Import vehicle models
                var ModelVehicleUser = require("../models/vehicle_user.js");
                var VehicleUser = ModelVehicleUser.Vehicle_User;
                var ModelVehicle = require("../models/vehicle.js");
                var Vehicle = ModelVehicle.Vehicle;

                // Find user's vehicle assignment
                const vehicleAssignment = await VehicleUser.findOne({
                    where: {
                        userid: userId
                    },
                    order: [["createdAt", "DESC"]],
                    raw: true
                });

                let vehicleInfo = null;
                if (vehicleAssignment) {
                    // Get vehicle details
                    const vehicle = await Vehicle.findOne({
                        where: {
                            vehicleid: vehicleAssignment.vehicleid
                        },
                        attributes: ['vin', 'deviceId', 'vehicleSclId', 'dashcamId', 'vehicleid', 'name', 'license_plate'],
                        raw: true
                    });
                    
                    if (vehicle) {
                        vehicleInfo = vehicle;
                    }
                }

                // Add vehicle info to user data
                const enhancedData = data.map(userData => ({
                    ...userData,
                    vehicle: vehicleInfo
                }));

                var result = {
                    "status" : true,
                    "message": 'success',
                    "data"   : enhancedData
                }
                
                futil.logger.debug('\n' + futil.shtm() + '- [ ENHANCED LOGIN RESULT ] | ' + util.inspect(result));
                
            } catch (vehicleError) {
                futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE INFO ERROR ] | ' + util.inspect(vehicleError));
                // If vehicle info fails, continue with original user data
                var result = {
                    "status" : true,
                    "message": 'success',
                    "data"   : data
                }
            }
    
            const jwtKey = process.env.TOKEN_SECRET
            const jwtExpirySeconds = '1d'
    
            var username = data[0].username
            // console.log(username)
    
            const token = jwt.sign({ username }, jwtKey, {
                algorithm: "HS256",
                // expiresIn: jwtExpirySeconds,
            })
    
            console.log("token:", token)

            var url = process.env.URL_LOGIN_AERTRACK
            var username = process.env.AERTRACK_USERNAME
            var password = process.env.AERTRACK_PASSWORD
         
            var body ={
             username: username,
             password: password
            }
     
           
            futil.logger.debug('\n' + futil.shtm() + '- [ URL ]  ' + util.inspect(url));
            futil.logger.debug('\n' + futil.shtm() + '- [ BODY REQUEST]  ' + util.inspect(body));
     
            axios.post(url,body).then(function (response) {

                futil.logger.debug('\n' + futil.shtm() + '- [ RESPONSE DATA ]  ' + util.inspect(response.data));
                var access_token = response.data.token
                futil.setEnvValue("TOKEN_AERTRAK",access_token)
                
                res.setHeader("Content-Type", "application/json");
                //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
                res.setHeader("token",token)
                res.writeHead(200);
                res.end(JSON.stringify(result, null, 3));


            }).catch(function (error) {
                
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE DATA ]  ' + util.inspect(error.response.data));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE STATUS ]  ' + util.inspect(error.response.status));
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR RESPONSE HEADER ]  ' + util.inspect(error.response.headers));
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR REQUEST ]  ' + util.inspect(error.request));
                // console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                // console.log('Error', error.message);
                futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ]  ' + util.inspect(error.message));
              }
              futil.logger.debug('\n' + futil.shtm() + '- [ ERROR CONFIG]  ' + util.inspect(error.config));
            //   console.log(error.config);
            var result = {  

                "status":false,
                "message": 'ERROR CONNECTION'
            }
            res.setHeader("Content-Type", "application/json");
            res.writeHead(400);
            res.end(JSON.stringify(result,null,3));
         })
    
           
        }else{
            futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect('DATA NOT FOUND'));
                
                var result = {  "status":false,
                                "message":"data not found"
                             }
                res.setHeader("Content-Type", "application/json");
                res.writeHead(400);
                res.end(JSON.stringify(result, null, 3));
        }
        


 
}

var ForgotPassword = async function  (req,res){
    futil.logger.debug('\n' + futil.shtm() + '- [ FORGOT PASSWORD ] | INFO ' + util.inspect(req.body));

    // cek username atau email memang ada, jika ada kirim email berupa link untuk ubah password

    futil.logger.debug('\n' + futil.shtm() + '- [ FORGOT PASSWORD ] | INFO ' + util.inspect(req.body));
    try{
        const user = await User.findAll({
            where: {
                [Op.or]: {
                  username: req.body.param,
                  email: req.body.param,
                },
              },
              raw:true
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT ] | QUERING ' + util.inspect(user));
        // res.send(user);
        var data = await user;

        if (data.length>0){
            console.log(data)
            // data sudah ada
            // kirim email

            // console.log('email',data[0].email);

            var email = data[0].email;
            console.log('email1',email)

            if (email.length>0){
                
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: false,
                auth: {
                  user: "bosskorlantas@gmail.com",
                  pass: "hjiu sdzg zaox gpzb",
                },
              });

              console.log('transpoter',transporter)

              console.log('email2',email)

                // plain text
                const plainText = data[0].username;

                // encryption key
                const key = 'mysecretkey';

                // encryption algorithm
                const algorithm = 'aes-256-cbc';

                // create a cipher object
                const cipher = crypto.createCipher(algorithm, key);

                // encrypt the plain text
                let encrypted = cipher.update(plainText, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                console.log(encrypted);

            //     var mailOptions = {
            //     from: "adm.korlantas@gmail.com",
            //     to: email,
            //     subject: "Lupa Password",
            //     text: "Harap klik link dibawah untuk lupa password",
            //     html: '<p>Click <a href="http://147.139.144.120:3001/lupa_password/' + encrypted + '">here</a> to reset your password</p>'
            //   };

            var mailOptions = {
                from: "adm.korlantas@gmail.com",
                to: email,
                subject: "Lupa Password",
                text: "Harap klik link dibawah untuk lupa password",
                html: '<p>Click <a href="http://147.139.144.120:3001/lupa_password/' + encrypted + '">here</a> to reset your password</p>'
              };
              

              console.log('mailOptions',mailOptions)
          

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email: ", error);
                } else {
                  console.log("Email sent: ", info.response);
                  var result = {
                    "status" : true,
                    "message": 'success',
                    "data"   : 'email terkirim'
                    
                }

                res.setHeader("Content-Type", "application/json");
                //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
                // res.setHeader("token",token)
                res.writeHead(200);
                res.end(JSON.stringify(result, null, 3));
        
                }
              });
            }

        }else{
            var result = {
                "status" : true,
                "message": 'success',
                "data"   : 'akun tidak ditemukan'
            }
    
            res.setHeader("Content-Type", "application/json");
            //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
            // res.setHeader("token",token)
            res.writeHead(200);
            res.end(JSON.stringify(result, null, 3));
        }
    }catch (err) {
        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        // result.code = 400
        // result.status ="failed"
        // result.data = "Insert data failed"
        // res.send(result);

        var result = {
            "status" : true,
            "message": 'success',
            "data"   : err
        }

        res.setHeader("Content-Type", "application/json");
        //res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 })
        // res.setHeader("token",token)
        res.writeHead(200);
        res.end(JSON.stringify(result, null, 3));
    }
    
    
    
    

}

var ChangePassword = async function(req,res){
    futil.logger.debug('\n' + futil.shtm() + '- [ CHANGE PASSWORD ] | INFO ' + util.inspect(req.body));

    // encrypted text
const encryptedText = req.body.data;
const password = req.body.password

// encryption key
const key = 'mysecretkey';

// encryption algorithm
const algorithm = 'aes-256-cbc';

// create a decipher object
const decipher = crypto.createDecipher(algorithm, key);

// decrypt the encrypted text
let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
decrypted += decipher.final('utf8');
// console.log(decrypted);
futil.logger.debug('\n' + futil.shtm() + '- [ CHANGE PASSWORD ] | INFO ' + util.inspect(decrypted));

var username = decrypted

//change password

try {
    const user = await User.update({password:password}, {
        where: {
            username: username
        }
    });
    var result = {}

    result.status = true
    result.message= 'success'
    result.data = "Update data success"
    res.send(result);
} catch (err) {
    futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
    var result = {}
    result.status =false
    result.message='failed'
    result.data = "Update data failed"
    res.send(result);
}

}

var authAccessToken = async function (req,res,next){

    futil.logger.debug('\n' + futil.shtm() + '- [ HEADERS ] | INFO ' + util.inspect(req.headers));
    const token = req.headers.token
    // console.log(token)
    // const params = req.params
    // var page = req.headers.page
    // var rows = req.headers.rows
    // var offset = req.headers.offset

    futil.logger.debug('\n' + futil.shtm() + '- [ TOKEN ] | INFO ' + util.inspect(token));

    const jwtKey = process.env.TOKEN_SECRET

    try{
        var payload = jwt.verify(token, jwtKey)
        // console.log(payload)
        var result = {
                      "status":true,
                      "message":"success",
                      "data":payload.username
                    }

      
        next()

    }catch (err){

        // futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | AUTH ' + util.inspect(err));

        var result = {  "status":false,
                        "message":"token is expired"
                     }
        res.setHeader("Content-Type", "application/json");
        res.writeHead(400);
        res.end(JSON.stringify(result,null,3));   
    }
}


module.exports = {
    Login,
    Register,
    ForgotPassword,
    ChangePassword,
    authAccessToken
}