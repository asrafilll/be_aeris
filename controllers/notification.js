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
    // Parse startDate and endDate from request query
    const { startDate, endDate } = req.query;

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
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        vehicleId: req.query.vehicleId,
        type: "geofence",
      },
      order: [["createdAt", "DESC"]],
    });

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
