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

module.exports = {
  GetNotificationByVehicleUid,
};
