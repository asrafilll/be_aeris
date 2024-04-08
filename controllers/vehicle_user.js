import { logger, shtm } from "../config/utility.js";

import  Vehicle_Use from "../models/vehicle_user.js";
import util from "util";

/**
 * Membuat data vehicle user baru.
 * Fungsi ini menerima data vehicle user dari request body dan menyimpannya ke database.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 201 dan pesan sukses.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi data vehicle user.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const createVehicleUser = async (req, res) => {
  try {
    const vehicleUser = await Vehicle_User.create(req.body);
    logger.debug(
      `\n${shtm()}- [ RESULT ] | QUERYING ${util.inspect(vehicleUser)}`
    );
    res.status(201).json({
      code: 201,
      status: "success",
      data: "Vehicle user created successfully",
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to create vehicle user",
    });
  }
};

/**
 * Mengambil semua data vehicle user.
 * Fungsi ini mengambil semua data vehicle user dari database.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan data vehicle user.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const getAllVehicleUsers = async (req, res) => {
  try {
    const vehicleUsers = await Vehicle_User.findAll();
    logger.debug(
      `\n${shtm()}- [ RESULT ] | QUERYING ${util.inspect(vehicleUsers)}`
    );
    res.status(200).json({
      code: 200,
      status: "success",
      data: vehicleUsers,
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to retrieve vehicle user data",
    });
  }
};

/**
 * Mengambil data vehicle user berdasarkan vehicle ID.
 * Fungsi ini mengambil data vehicle user dari database berdasarkan vehicle ID yang diberikan.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan data vehicle user.
 * Jika tidak ditemukan, fungsi akan mengembalikan response dengan kode status 404 dan pesan error.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi vehicle ID.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const getVehicleUserByVehicleId = async (req, res) => {
  try {
    const vehicleUser = await Vehicle_User.findAll({
      where: {
        vehicleid: req.params.vehicleid,
      },
    });
    if (vehicleUser.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        data: "Vehicle user not found",
      });
    }
    logger.debug(
      `\n${shtm()}- [ RESULT ] | QUERYING ${util.inspect(vehicleUser)}`
    );
    res.status(200).json({
      code: 200,
      status: "success",
      data: vehicleUser,
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to retrieve vehicle user data",
    });
  }
};

/**
 * Mengambil data vehicle user terbaru berdasarkan vehicle ID.
 * Fungsi ini mengambil data vehicle user terbaru dari database berdasarkan vehicle ID yang diberikan.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan data vehicle user.
 * Jika tidak ditemukan, fungsi akan mengembalikan response dengan kode status 404 dan pesan error.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi vehicle ID.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const getLatestVehicleUserByVehicleId = async (req, res) => {
  try {
    const vehicleUser = await Vehicle_User.findOne({
      where: {
        vehicleid: req.params.vehicleid,
      },
      order: [["createdAt", "DESC"]],
    });
    if (!vehicleUser) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        data: "Vehicle user not found",
      });
    }
    logger.debug(
      `\n${shtm()}- [ RESULT ] | QUERYING ${util.inspect(vehicleUser)}`
    );
    res.status(200).json({
      code: 200,
      status: "success",
      data: vehicleUser,
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to retrieve vehicle user data",
    });
  }
};

/**
 * Mengambil data vehicle user terbaru berdasarkan user ID.
 * Fungsi ini mengambil data vehicle user terbaru dari database berdasarkan user ID yang diberikan.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan data vehicle user.
 * Jika tidak ditemukan, fungsi akan mengembalikan response dengan kode status 404 dan pesan error.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi user ID.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const getLatestVehicleUserByUserId = async (req, res) => {
  try {
    const vehicleUser = await Vehicle_User.findOne({
      where: {
        userid: req.params.userid,
      },
      order: [["createdAt", "DESC"]],
    });
    if (!vehicleUser) {
      return res.status(404).json({
        code: 404,
        status: "failed",
        data: "Vehicle user not found",
      });
    }
    logger.debug(
      `\n${shtm()}- [ RESULT ] | QUERYING ${util.inspect(vehicleUser)}`
    );
    res.status(200).json({
      code: 200,
      status: "success",
      data: vehicleUser,
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to retrieve vehicle user data",
    });
  }
};

/**
 * Memperbarui data vehicle user berdasarkan ID.
 * Fungsi ini memperbarui data vehicle user di database berdasarkan ID yang diberikan.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan pesan sukses.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi ID vehicle user dan data yang akan diperbarui.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const updateVehicleUser = async (req, res) => {
  try {
    await Vehicle_User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      code: 200,
      status: "success",
      data: "Vehicle user updated successfully",
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to update vehicle user data",
    });
  }
};

/**
 * Menghapus data vehicle user berdasarkan ID.
 * Fungsi ini menghapus data vehicle user dari database berdasarkan ID yang diberikan.
 * Jika berhasil, fungsi akan mengembalikan response dengan kode status 200 dan pesan sukses.
 * Jika gagal, fungsi akan mengembalikan response dengan kode status 500 dan pesan error.
 *
 * @param {Object} req - Objek request yang berisi ID vehicle user yang akan dihapus.
 * @param {Object} res - Objek response yang akan dikirimkan kembali ke client.
 */
const deleteVehicleUser = async (req, res) => {
  try {
    await Vehicle_User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      code: 200,
      status: "success",
      data: "Vehicle user deleted successfully",
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${util.inspect(err)}`);
    res.status(500).json({
      code: 500,
      status: "failed",
      data: "Failed to delete vehicle user data",
    });
  }
};

export {
  createVehicleUser,
  deleteVehicleUser,
  getAllVehicleUsers,
  getLatestVehicleUserByUserId,
  getLatestVehicleUserByVehicleId,
  getVehicleUserByVehicleId,
  updateVehicleUser,
};
