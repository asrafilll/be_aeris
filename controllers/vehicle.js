
var ModelVehicle = require('../models/vehicle.js')
var Vehicle = ModelVehicle.Vehicle
var util = require('util');
var futil = require('../config/utility.js');

var result = {  
    "status":false,
    "message": ''
}


var ReadOdometer = async function(req,res){
    try {    

        futil.logger.debug('\n' + futil.shtm() + '- [ REQ HEADERS] | INFO ' + util.inspect(req.headers));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS] | INFO ' + util.inspect(req.params));
        // var vehicleid = req.params.vehicleid
        
        
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  page] | INFO ' + util.inspect(req.headers.page));
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  rows] | INFO ' + util.inspect(req.headers.rows));
        // futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS  offset] | INFO ' + util.inspect(req.headers.offset));
        futil.logger.debug('\n' + futil.shtm() + '- [ REQ PARAMS vehicleid] | INFO ' + util.inspect(req.params.vehicleid));

        const count = await Vehicle.count({
            where: {
                vehicleid: req.params.vehicleid
            }
        });

        futil.logger.debug('\n' + futil.shtm() + '- [ RESULT COUNT VEHICLE ] | QUERING ' + util.inspect(count));
        
        // var limit = parseInt(req.headers.rows)
        // var offset = parseInt(req.headers.offset)
        // var page = parseInt(req.headers.page)

        var resp = await Vehicle.findAll({ raw:true,
            where: {
                vehicleid: req.params.vehicleid
            },
            order: [
                ['id', 'ASC'],
                ]
            });

            futil.logger.debug('\n' + futil.shtm() + '- [ RESULT VEHICLE ALL] | QUERING ' + util.inspect(resp));
            futil.logger.debug('\n' + futil.shtm() + '- [ RESULT VEHICLE ALL] | QUERING ' + util.inspectresp.init_odometer)
            // var rows_data = []
            // rows_data.push(result)
            var j=1
            // if (offset == 0 ){
            //     j=1
            // }else{
            //     j= (offset * (page-1))+1
            // }

            // for (i=0;i<=resp.length-1;i++){
            //     resp[i].no = j
            //     j++
            // }

            var response = {"total":count,"rows":resp}   
            futil.logger.debug('\n' + futil.shtm() + '- [ RESULT RESPONSE] | QUERING ' + util.inspect(response));  
            result.code = 200
            result.status ="success"
            result.data = response
            res.send(result);

    } catch (err){

        futil.logger.debug('\n' + futil.shtm() + '- [ ERROR ] | QUERING ' + util.inspect(err));
        result.code = 400
        result.status ="failed"
        result.data = "Read data failed"
        res.send(result);
    }
}


module.exports = {
    ReadOdometer
}