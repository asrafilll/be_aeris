var axios = require('axios');
var util = require('util');
var futil = require('../config/utility.js');
var moment = require('moment');

require('dotenv').config();

// Helper function to generate default time range (current day)
var generateDefaultTimeRange = function() {
    const today = moment().format('YYYY-MM-DD');
    const startTime = `${today} 00:00:00`;
    const endTime = `${today} 23:59:59`;
    
    return { startTime, endTime };
};

// Helper function to validate date format
var validateDateFormat = function(dateString) {
    if (!dateString) return true; // Optional field
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    return dateRegex.test(dateString);
};

// Function to make single channel API call to external service
var makeChannelApiCall = async function(channel, deviceId, startTime, endTime, token) {
    const apiUrl = `${process.env.API_WEB_URL}/api/patern/video/monitors-playback`;
    
    const requestBody = {
        channel: channel,
        deviceId: deviceId,
        startTime: startTime,
        endTime: endTime
    };

    const headers = {
        'Content-Type': 'application/json',
        'token': token
    };

    futil.logger.debug('\n' + futil.shtm() + '- [ EXTERNAL API CALL ] | Channel: ' + channel + ' | URL: ' + apiUrl);
    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST HEADERS ] | ' + util.inspect(headers));
    futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST BODY ] | ' + util.inspect(requestBody));

    try {
        const response = await axios.post(apiUrl, requestBody, { 
            headers: headers,
            timeout: 10000 // 10 second timeout
        });
        
        futil.logger.debug('\n' + futil.shtm() + '- [ EXTERNAL API RESPONSE ] | Channel: ' + channel + ' | ' + util.inspect(response.data));
        
        return {
            success: true,
            channel: channel,
            data: response.data
        };
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ EXTERNAL API ERROR ] | Channel: ' + channel + ' | ' + util.inspect(error.message));
        
        let errorMessage = 'External API error';
        if (error.response) {
            errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
            futil.logger.debug('\n' + futil.shtm() + '- [ EXTERNAL API ERROR RESPONSE ] | ' + util.inspect(error.response.data));
        } else if (error.request) {
            errorMessage = 'Network error - no response received';
        }
        
        return {
            success: false,
            channel: channel,
            error: errorMessage
        };
    }
};

// Function to aggregate responses from all 3 channels
var aggregateChannelResponses = function(channelResults) {
    const channelNames = { 1: 'front', 2: 'driver', 3: 'rear' };
    const aggregatedData = {};
    let hasAnySuccess = false;
    
    channelResults.forEach(result => {
        const channelName = channelNames[result.channel];
        
        if (result.success && result.data && result.data.data) {
            aggregatedData[channelName] = result.data.data;
            hasAnySuccess = true;
        } else {
            // Include failed channels with error info
            aggregatedData[channelName] = {
                error: result.error || 'Unknown error',
                webrtcUrl: null,
                rtmpUrl: null,
                webUrl: null,
                webFlvUrl: null
            };
        }
    });
    
    return {
        hasAnySuccess: hasAnySuccess,
        data: aggregatedData
    };
};

// Main camera playback controller function
var GetCameraPlayback = async function(req, res) {
    try {
        futil.logger.debug('\n' + futil.shtm() + '- [ CAMERA PLAYBACK ] | INFO ' + util.inspect(req.body));
        
        // Input validation
        const { deviceId, startTime, endTime, token } = req.body;
        
        // Validate required fields
        if (!deviceId) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'deviceId is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | deviceId missing');
            return res.status(400).json(errorResult);
        }
        
        if (!token) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'token is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | token missing');
            return res.status(400).json(errorResult);
        }
        
        // Validate date formats if provided
        if (!validateDateFormat(startTime)) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'Invalid startTime format. Use YYYY-MM-DD HH:mm:ss'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | Invalid startTime format');
            return res.status(400).json(errorResult);
        }
        
        if (!validateDateFormat(endTime)) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'Invalid endTime format. Use YYYY-MM-DD HH:mm:ss'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ VALIDATION ERROR ] | Invalid endTime format');
            return res.status(400).json(errorResult);
        }
        
        // Use provided times or generate defaults
        let finalStartTime, finalEndTime;
        if (startTime && endTime) {
            finalStartTime = startTime;
            finalEndTime = endTime;
        } else {
            const defaultTimes = generateDefaultTimeRange();
            finalStartTime = startTime || defaultTimes.startTime;
            finalEndTime = endTime || defaultTimes.endTime;
        }
        
        futil.logger.debug('\n' + futil.shtm() + '- [ TIME RANGE ] | Start: ' + finalStartTime + ' | End: ' + finalEndTime);
        
        // Check if API_WEB_URL is configured
        if (!process.env.API_WEB_URL) {
            const errorResult = {
                code: 500,
                status: 'failed',
                message: 'API_WEB_URL not configured'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ CONFIG ERROR ] | API_WEB_URL missing');
            return res.status(500).json(errorResult);
        }
        
        // Make parallel API calls for all 3 channels
        futil.logger.debug('\n' + futil.shtm() + '- [ PARALLEL API CALLS ] | Starting calls for channels 1, 2, 3');
        
        const channelPromises = [
            makeChannelApiCall(1, deviceId, finalStartTime, finalEndTime, token), // Front
            makeChannelApiCall(2, deviceId, finalStartTime, finalEndTime, token), // Driver
            makeChannelApiCall(3, deviceId, finalStartTime, finalEndTime, token)  // Rear
        ];
        
        const channelResults = await Promise.all(channelPromises);
        
        futil.logger.debug('\n' + futil.shtm() + '- [ PARALLEL API RESULTS ] | ' + util.inspect(channelResults));
        
        // Aggregate responses
        const aggregatedResult = aggregateChannelResponses(channelResults);
        
        if (!aggregatedResult.hasAnySuccess) {
            // All channels failed
            const errorResult = {
                code: 500,
                status: 'failed',
                message: 'All camera channels failed to load',
                data: aggregatedResult.data
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ ALL CHANNELS FAILED ] | ' + util.inspect(errorResult));
            return res.status(500).json(errorResult);
        }
        
        // Success response (even if some channels failed)
        const successResult = {
            code: 200,
            status: 'success',
            data: aggregatedResult.data
        };
        
        futil.logger.debug('\n' + futil.shtm() + '- [ CAMERA PLAYBACK SUCCESS ] | ' + util.inspect(successResult));
        
        res.status(200).json(successResult);
        
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ CAMERA PLAYBACK ERROR ] | ' + util.inspect(error));
        
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
    GetCameraPlayback
};