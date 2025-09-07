var axios = require('axios');
var util = require('util');
var futil = require('../config/utility.js');

require('dotenv').config();

// Function to make intercom API call to external service
var makeIntercomApiCall = async function(channel, deviceId, token) {
    const apiUrl = `${process.env.API_WEB_URL}/api/patern/video/intercom`;
    
    const requestBody = {
        channel: channel,
        deviceId: deviceId
    };

    const headers = {
        'Content-Type': 'application/json',
        'token': token
    };

    futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM EXTERNAL API CALL ] | URL: ' + apiUrl);
    futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM REQUEST HEADERS ] | ' + util.inspect(headers));
    futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM REQUEST BODY ] | ' + util.inspect(requestBody));

    try {
        const response = await axios.post(apiUrl, requestBody, { 
            headers: headers,
            timeout: 10000 // 10 second timeout
        });
        
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM EXTERNAL API RESPONSE ] | ' + util.inspect(response.data));
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM EXTERNAL API ERROR ] | ' + util.inspect(error.message));
        
        let errorMessage = 'External intercom service error';
        let errorDetails = error.message;
        
        if (error.response) {
            errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
            errorDetails = error.response.data || error.response.statusText;
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM EXTERNAL API ERROR RESPONSE ] | ' + util.inspect(error.response.data));
        } else if (error.request) {
            errorMessage = 'Network error - no response received';
            errorDetails = 'Connection timeout or network issue';
        }
        
        return {
            success: false,
            error: errorMessage,
            details: errorDetails
        };
    }
};

// Main intercom controller function
var GetIntercom = async function(req, res) {
    try {
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM ] | INFO ' + util.inspect(req.body));
        
        // Input validation
        const { deviceId, channel, token } = req.body;
        
        // Validate required fields
        if (!deviceId) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'deviceId is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM VALIDATION ERROR ] | deviceId missing');
            return res.status(400).json(errorResult);
        }
        
        if (!token) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'token is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM VALIDATION ERROR ] | token missing');
            return res.status(400).json(errorResult);
        }
        
        // Validate channel (must be 1 for intercom)
        if (channel === undefined || channel === null) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'channel is required'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM VALIDATION ERROR ] | channel missing');
            return res.status(400).json(errorResult);
        }
        
        if (channel !== 1) {
            const errorResult = {
                code: 400,
                status: 'failed',
                message: 'channel must be 1 for intercom'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM VALIDATION ERROR ] | invalid channel: ' + channel);
            return res.status(400).json(errorResult);
        }
        
        // Check if API_WEB_URL is configured
        if (!process.env.API_WEB_URL) {
            const errorResult = {
                code: 500,
                status: 'failed',
                message: 'API_WEB_URL not configured'
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM CONFIG ERROR ] | API_WEB_URL missing');
            return res.status(500).json(errorResult);
        }
        
        // Make intercom API call
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM API CALL ] | Starting call to external service');
        
        const result = await makeIntercomApiCall(channel, deviceId, token);
        
        if (!result.success) {
            // External API call failed
            const errorResult = {
                code: 500,
                status: 'failed',
                message: result.error,
                details: result.details
            };
            futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM API FAILED ] | ' + util.inspect(errorResult));
            return res.status(500).json(errorResult);
        }
        
        // Success - direct pass-through of external API response
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM SUCCESS ] | ' + util.inspect(result.data));
        
        res.status(200).json(result.data);
        
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ INTERCOM ERROR ] | ' + util.inspect(error));
        
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
    GetIntercom
};