const db = require("../models");
var sequelize = require("sequelize");
const { Op } = require("sequelize");
var ModelSetting = require("../models/setting.js");
var Setting = ModelSetting.Setting;

var util = require("util");
var futil = require("../config/utility.js");
var result = {
  code: "",
  status: "",
};

const GetWhatsappNumber = async (req, res) => {
  try {
    // Fetch data from the database based on the provided criteria
    const phoneNumber = await Setting.findAll({
      attributes: ["value"],
      where: {
        key: "wa_mobile",
      },
    });

    res.json({
      code: 200,
      status: "success",
      data: phoneNumber,
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
  GetWhatsappNumber,
};
