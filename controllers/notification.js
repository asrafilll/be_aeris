const db = require("../models");
var sequelize = require("sequelize");
const { Op } = require("sequelize");
var ModelNotification = require("../models/notification.js");
var Notification = ModelNotification.Notification;
var ModelUser = require("../models/user.js");
const path = require("path");

var util = require("util");
var futil = require("../config/utility.js");
var result = {
  code: "",
  status: "",
};

var GetNotificationByVehicleUid = async function (req, res) {
  try {
    const notifications = await Notification.findAll({
      where: { vehicleUid: req.params.vehicleSclId },
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order
      limit: 10, // Limit the result to 10 notifications
    });

    result.code = 200;
    result.status = "success";
    result.data = notifications;
    res.send(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    result.code = 400;
    result.status = "failed";
    result.data = "Read data failed";
    res.send(result);
  }
};

const GetRecentNotificationsByVehicleUid = async (req, res) => {
  try {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

    const notifications = await Notification.findAll({
      where: {
        vehicleUid: req.params.vehicleSclId,
        createdAt: {
          [Op.between]: [twoMinutesAgo, now],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    result.code = 200;
    result.status = "success";
    result.data = notifications;
    res.send(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    result.code = 400;
    result.status = "failed";
    result.data = "Read data failed";
    res.send(result);
  }
};

const GetHistory = async (req, res) => {
  try {
    console.log("=== GetHistory Debug Info ===");
    console.log("Request query:", req.query);
    
    // Extract username from JWT token
    const token = req.headers.token;
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    const username = payload.username;
    console.log("Username from token:", username);
    
    // Get user's actual sclId from token
    const User = require("../models").User;
    const Vehicle_User = require("../models/vehicle_user.js").Vehicle_User;
    
    const user = await User.findOne({ where: { username } });
    console.log("User found:", user ? user.id : "not found");
    
    const vehicleAssignment = await Vehicle_User.findOne({
      where: { userid: user.id },
      order: [["createdAt", "DESC"]]
    });
    console.log("Vehicle assignment:", vehicleAssignment ? {
      sclid: vehicleAssignment.sclid,
      vehicleid: vehicleAssignment.vehicleid
    } : "not found");
    
    const userVehicleUid = vehicleAssignment?.sclid; // Use sclid instead of vehicleid
    console.log("Using vehicleUid for query:", userVehicleUid);
    
    // Parse startDate and endDate from request query
    let { startDate, endDate } = req.query;
    console.log("Date range (raw):", { startDate, endDate });
    
    // Normalize date format (ensure YYYY-MM-DD)
    if (startDate && startDate.length < 10) {
      const dateParts = startDate.split('-');
      if (dateParts.length === 3) {
        startDate = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
      }
    }
    if (endDate && endDate.length < 10) {
      const dateParts = endDate.split('-');
      if (dateParts.length === 3) {
        endDate = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
      }
    }
    
    // Convert to proper Date objects to ensure full day coverage
    const startDateTime = new Date(startDate + "T00:00:00.000Z");
    const endDateTime = new Date(endDate + "T23:59:59.999Z");
    console.log("Date range (normalized and converted):", { startDate, endDate, startDateTime, endDateTime });

    // Fetch data from the database based on the provided criteria
    const history = await Notification.findAll({
      attributes: [
        "latitude",
        "longitude",
        "createdAt",
        "speed",
        "actualValue",
      ],
      where: {
        send_date: {
          [Op.between]: [startDateTime, endDateTime],
        },
        vehicleUid: userVehicleUid, // Use vehicleUid instead of vehicleId
        type: "geofence",
      },
      order: [["createdAt", "DESC"]],
    });

    console.log("Query result count:", history.length);
    console.log("First few results:", history.slice(0, 2));
    
    // Debug: Check what data exists for this vehicleUid
    const debugQuery = await Notification.findAll({
      attributes: ["vehicleUid", "vehicleId", "type", "createdAt"],
      where: { vehicleUid: userVehicleUid },
      limit: 5,
      order: [["createdAt", "DESC"]]
    });
    console.log("Debug - All records for this vehicleUid:", debugQuery);
    
    // Debug: Check geofence records regardless of date
    const geofenceQuery = await Notification.findAll({
      attributes: ["vehicleUid", "vehicleId", "type", "createdAt"],
      where: { 
        vehicleUid: userVehicleUid,
        type: "geofence"
      },
      limit: 5,
      order: [["createdAt", "DESC"]]
    });
    console.log("Debug - Geofence records for this vehicleUid:", geofenceQuery);
    
    console.log("=== End Debug Info ===");

    res.json({
      code: 200,
      status: "success",
      data: history,
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching history:", error);
    res.status(500).json({
      code: 500,
      status: "failed",
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  GetNotificationByVehicleUid,
  GetRecentNotificationsByVehicleUid,
  GetHistory,
};
