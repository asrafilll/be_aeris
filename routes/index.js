// Import express
var express = require("express");
// Init express router
var router = express.Router();
var Vehicle_User = require("../controllers/vehicle_user.js");
var Assets = require("../controllers/assets.js");
var Auth = require("../controllers/auth.js");
var Task = require("../controllers/task.js");
var Vehicle = require("../controllers/vehicle.js");
var Notification = require("../controllers/notification.js");
var Setting = require("../controllers/setting.js");
var CameraPlayback = require("../controllers/camera_playback.js");
var Intercom = require("../controllers/intercom.js");
var util = require("util");
var futil = require("../config/utility.js");
const path = require("path");
const fileUpload = require("express-fileupload");

router.get("/api/pattern", function (req, res, next) {
  res.send({ message: "Welcome Patern" });
  res.end();
});

router.get(
  "/api/pattern/latest_status/:sclId",
  Auth.authAccessToken,
  function (req, res) {
    Assets.LatestStatus(req, res);
  }
);

router.get(
  "/api/pattern/vehicle_user",
  Auth.authAccessToken,
  function (req, res) {
    Vehicle_User.Read(req, res);
  }
);

router.get(
  "/api/pattern/vehicle_user/:userid",
  Auth.authAccessToken,
  function (req, res) {
    Vehicle_User.ReadVehicleByUser(req, res);
  }
);

router.get(
  "/api/pattern/asset_address/:lat/:lng",
  Auth.authAccessToken,
  function (req, res) {
    Assets.AssetAddress(req, res);
  }
);

//  Login
router.post("/api/pattern/auth", function (req, res) {
  Auth.Login(req, res);
});

// Register

router.post("/api/pattern/register", function (req, res) {
  Auth.Register(req, res);
});

router.post("/api/pattern/change_password", function (req, res) {
  Auth.ChangePassword(req, res);
});

//  Forgot Password
router.post("/api/pattern/forgot_password", function (req, res) {
  Auth.ForgotPassword(req, res);
});
//  Logout

// Task

// Task ===============================================================
router.post("/api/pattern/tasks", Auth.authAccessToken, function (req, res) {
  futil.logger.debug(
    "\n" +
      futil.shtm() +
      "- [ REQ HEADERS ] | INFO " +
      util.inspect(req.headers)
  );
  futil.logger.debug(
    "\n" + futil.shtm() + "- [ REQ BODY ] | INFO " + util.inspect(req.body)
  );
  // futil.logger.debug('\n' + futil.shtm() + '- [ REQ FILE ] | INFO ' + util.inspect(req.file));
  Task.Create(req, res);
});

router.get("/api/pattern/tasks", Auth.authAccessToken, function (req, res) {
  futil.logger.debug(
    "\n" +
      futil.shtm() +
      "- [ REQ HEADERS ] | INFO " +
      util.inspect(req.headers)
  );
  futil.logger.debug(
    "\n" + futil.shtm() + "- [ REQ BODY ] | INFO " + util.inspect(req.body)
  );
  Task.Read(req, res);
});

router.get(
  "/api/pattern/tasks/:status",
  Auth.authAccessToken,
  function (req, res) {
    Task.ReadTaskByStatus(req, res);
  }
);

router.get(
  "/api/pattern/tasks/status/user/:id",
  Auth.authAccessToken,
  function (req, res) {
    Task.ReadTotalStatusPerUser(req, res);
  }
);

router.get(
  "/api/pattern/tasks/user/:id",
  Auth.authAccessToken,
  function (req, res) {
    Task.ReadTaskUser(req, res);
  }
);

router.get(
  "/api/pattern/tasks/filter/:id",
  Auth.authAccessToken,
  function (req, res) {
    Task.TaskFilter(req, res);
  }
);

router.get(
  "/api/pattern/tasks/image/:filename",
  Auth.authAccessToken,
  function (req, res) {
    Task.Download(req, res);
  }
);

router.put("/api/pattern/tasks/:id", Auth.authAccessToken, function (req, res) {
  futil.logger.debug(
    "\n" + futil.shtm() + "- [ REQ FILE ] | INFO " + util.inspect(req.files)
  );
  Task.Update(req, res);
});

router.delete("/api/pattern/tasks/:id", function (req, res) {
  futil.logger.debug(
    "\n" +
      futil.shtm() +
      "- [ REQUEST HEADERS ] | INFO " +
      util.inspect(req.headers)
  );
  futil.logger.debug(
    "\n" +
      futil.shtm() +
      "- [ REQUEST PARAMS ] | INFO " +
      util.inspect(req.params)
  );
  // futil.logger.debug('\n' + futil.shtm() + '- [ REQUEST BODY ] | INFO ' + util.inspect(req.body));
  Task.Delete(req, res);
});

// Notification ===============================================================

router.get(
  "/api/pattern/notification/:vehicleSclId",
  Auth.authAccessToken,
  function (req, res) {
    Notification.GetNotificationByVehicleUid(req, res);
  }
);

router.get(
  "/api/pattern/notification/recent/:vehicleSclId",
  Auth.authAccessToken,
  function (req, res) {
    Notification.GetRecentNotificationsByVehicleUid(req, res);
  }
);

router.get("/api/pattern/history", Auth.authAccessToken, function (req, res) {
  Notification.GetHistory(req, res);
});

// ============================= ODOMETER ============================================================

router.get(
  "/api/pattern/vehicle/odometer/:vehicleid",
  Auth.authAccessToken,
  function (req, res) {
    Vehicle.ReadOdometer(req, res);
  }
);

// ============================= PROFILE ============================================================

router.get(
  "/api/pattern/vehicle/:sclid/users",
  Auth.authAccessToken,
  function (req, res) {
    Vehicle_User.GetProfileData(req, res);
  }
);

router.post(
  "/api/pattern/editProfile/:userId",
  Auth.authAccessToken,
  function (req, res) {
    Vehicle_User.UpdateUserProfile(req, res);
  }
);

// ============================= SETTING  ============================================================

router.get(
  "/api/pattern/setting/whatsapp",
  Auth.authAccessToken,
  function (req, res) {
    Setting.GetWhatsappNumber(req, res);
  }
);

// ============================= CAMERA PLAYBACK ============================================================

router.post(
  "/api/pattern/camera/playback",
  Auth.authAccessToken,
  function (req, res) {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ CAMERA PLAYBACK REQ HEADERS ] | INFO " +
        util.inspect(req.headers)
    );
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ CAMERA PLAYBACK REQ BODY ] | INFO " + util.inspect(req.body)
    );
    CameraPlayback.GetCameraPlayback(req, res);
  }
);

// ============================= INTERCOM ============================================================

router.post(
  "/api/pattern/intercom",
  Auth.authAccessToken,
  function (req, res) {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ INTERCOM REQ HEADERS ] | INFO " +
        util.inspect(req.headers)
    );
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ INTERCOM REQ BODY ] | INFO " + util.inspect(req.body)
    );
    Intercom.GetIntercom(req, res);
  }
);

module.exports.router = router;
