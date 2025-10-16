
var ModelVehicle = require('../models/vehicle.js')
var Vehicle = ModelVehicle.Vehicle
var ModelVehicleLogsRoadcast = require('../models/vehicle_logs_roadcast.js')
var VehicleLogsRoadcast = ModelVehicleLogsRoadcast.VehicleLogsRoadcast
var util = require('util');
var futil = require('../config/utility.js');
const { Op } = require('sequelize');

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


var GetVehicleHistory = async function(req, res) {
    try {
        futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE HISTORY ] | INFO ' + util.inspect(req.query));
        
        // Input validation
        const { startDate, endDate, deviceId } = req.query;
        
        // Validate required fields
        if (!startDate) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'startDate is required (format: YYYY-MM-DD)'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | startDate missing');
            return res.status(400).json(errorResult);
        }
        
        if (!endDate) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'endDate is required (format: YYYY-MM-DD)'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | endDate missing');
            return res.status(400).json(errorResult);
        }
        
        if (!deviceId) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'deviceId is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | deviceId missing');
            return res.status(400).json(errorResult);
        }
        
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate)) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'Invalid startDate format. Use YYYY-MM-DD'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | Invalid startDate format');
            return res.status(400).json(errorResult);
        }
        
        if (!dateRegex.test(endDate)) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'Invalid endDate format. Use YYYY-MM-DD'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | Invalid endDate format');
            return res.status(400).json(errorResult);
        }
        
        // Create date range for timestamp filtering
        // Since timestamp is stored as string, we need to handle it accordingly
        const startDateTime = `${startDate} 00:00:00`;
        const endDateTime = `${endDate} 23:59:59`;
        
        futil.logger.debug('\n' + futil.shtm() + '- [ DATE RANGE ] | Start: ' + startDateTime + ' | End: ' + endDateTime);
        futil.logger.debug('\n' + futil.shtm() + '- [ DEVICE ID ] | ' + deviceId);
        
        // Query vehicle logs
        const vehicleLogs = await VehicleLogsRoadcast.findAll({
            attributes: { exclude: ['id', 'deviceId', 'timestamp'] },
            where: {
                deviceId: deviceId,
                timestamp: {
                    [Op.between]: [startDateTime, endDateTime]
                }
            },
            order: [['timestamp', 'ASC']]
        });
        
        futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE LOGS COUNT ] | ' + vehicleLogs.length);
        futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE LOGS SAMPLE ] | ' + util.inspect(vehicleLogs.slice(0, 2)));
        
        // Success response
        const successResult = {
            code: 200,
            status: 'success',
            data: vehicleLogs
        };
        
        futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE HISTORY SUCCESS ] | Records found: ' + vehicleLogs.length);
        
        res.status(200).json(successResult);
        
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ VEHICLE HISTORY ERROR ] | ' + util.inspect(error));
        
        const errorResult = {
            code: 500,
            status: 'failed',
            message: 'Internal server error',
            error: error.message
        };
        
        res.status(500).json(errorResult);
    }
};

module.exports = {
    ReadOdometer,
    GetVehicleHistory
}