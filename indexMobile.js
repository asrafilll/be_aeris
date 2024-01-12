var express = require ('express')
var bodyParser = require('body-parser');
var util = require('util');
var cors = require('cors');
var futil = require('./config/utility.js');
var con = require ('./config/database.js');
var indexRoute = require('./routes/index.js');

var Vehicle_User = require('./controllers/vehicle_user.js');
var Assets = require('./controllers/assets.js');
var Auth = require('./controllers/auth.js');

require('dotenv').config();

var app = express()

// app.use('/api/pattern',indexRoute)

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.options('*', cors())
// const corsOptions = {
//     exposedHeaders: 'token',
//   };
// app.use(cors(corsOptions));

app.get("/url", (req, res, next) => {
    res.json(["Tony","Lisa","Michael","Ginger","Food"]);
   });

// route not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
   });
  // log errors to console
   app.use(logErrors);
    //
   app.use(clientErrorHandler);
   app.use((error, req, res, next) => {
   res.status(error.status || 500);
     return res.json({
     status:error.status || 500,
     message: error.message,
     error: {
     error: error.message,
     },
   });
  });

// log errors to console
function logErrors(err, req, res, next) {
 console.error(err.stack);
 next(err);
}
// error handling for xhr request
function clientErrorHandler(err, req, res, next) {
 if (req.xhr) {
   //console.log('xhr request');
   res.status(400).send({status: 400, message: "Bad request from client", error: err.message });
 } else {
   next(err);
 }
}

let port = process.env.PORT || 8081;
app.listen(port, () => {
 console.log(`Listening on port ${port}`);
});


// app.listen(3000, () => {
//     console.log("Server running on port 3000");
//    });



// var server = app.listen(process.env.SERVER_PORT, function () {
//     var host = server.address().address;
//     var port = server.address().port;
    

//     futil.logger.debug('\n' + futil.shtm() + '- [ W A K E   U P ] | STARTING ' + util.inspect(process.env.TITLE));
//     futil.logger.debug(futil.shtm() + '- [ W A K E   U P ] | RUN AT PATH: /api/pattern, PORT: ' + port);

//     // Testing database connection 
//     try {
//         con.db.authenticate();
//         futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE U P ] | STARTING ' + util.inspect(process.env.DATABASE));
//     } catch (error) {
//         futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE ERROR] | STARTING ' + util.inspect(error));
//     }



// });
