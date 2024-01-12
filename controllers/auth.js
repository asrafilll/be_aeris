// var Model = require('../models/user.js')
// var User = Model.User
const db = require('../models');
const User = db.user;

var axios = require('axios')
var jwt = require('jsonwebtoken')
var util = require('util');
var futil = require('../config/utility.js');


require('dotenv').config();

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
        // res.send(user);
        var data = user

        if (data.length>0){
            var result = {
                "status" : true,
                "message": 'success',
                "data"   : data
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
    authAccessToken
}