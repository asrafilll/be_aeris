import { AssetAddress, LatestStatus } from "../controllers/assets.js";
import {
    ChangePassword,
    ForgotPassword,
    Login,
    Register,
    authAccessToken,
} from "../controllers/auth.js";
import {
    Create,
    Delete,
    Download,
    Read,
    ReadTaskByStatus,
    ReadTaskUser,
    ReadTotalStatusPerUser,
    TaskFilter,
    Update,
} from "../controllers/task.js";
import {
    getAllVehicleUsers,
    getLatestVehicleUserByUserId
} from "../controllers/vehicle_user.js";
import { logger, shtm } from "../config/utility.js";

import { ReadOdometer } from "../controllers/vehicle.js";
import express from "express";
import util from "util";

// Membuat router menggunakan express
const router = express.Router();

/**
 * @swagger
 * /api/pattern:
 *   get:
 *     summary: Menampilkan pesan selamat datang
 *     responses:
 *       200:
 *         description: Pesan selamat datang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome Pattern
 */
router.get("/api/pattern", (req, res) => {
    res.send({ message: "Welcome Pattern" });
  });
  
  /**
   * @swagger
   * /api/pattern/latest_status/{sclId}:
   *   get:
   *     summary: Mendapatkan status terakhir berdasarkan sclId
   *     parameters:
   *       - in: path
   *         name: sclId
   *         required: true
   *         description: ID scl
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Status terakhir berhasil didapatkan
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/latest_status/:sclId", authAccessToken, (req, res) => {
    LatestStatus(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/vehicle_user:
   *   get:
   *     summary: Membaca informasi pengguna kendaraan
   *     responses:
   *       200:
   *         description: Informasi pengguna kendaraan berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/vehicle_user", authAccessToken, (req, res) => {
    getAllVehicleUsers(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/vehicle_user/{userid}:
   *   get:
   *     summary: Membaca kendaraan berdasarkan userid
   *     parameters:
   *       - in: path
   *         name: userid
   *         required: true
   *         description: ID pengguna
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Kendaraan berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/vehicle_user/:userid", authAccessToken, (req, res) => {
    getLatestVehicleUserByUserId(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/asset_address/{lat}/{lng}:
   *   get:
   *     summary: Mendapatkan alamat aset berdasarkan latitude dan longitude
   *     parameters:
   *       - in: path
   *         name: lat
   *         required: true
   *         description: Latitude
   *         schema:
   *           type: number
   *       - in: path
   *         name: lng
   *         required: true
   *         description: Longitude
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Alamat aset berhasil didapatkan
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get(
    "/api/pattern/asset_address/:lat/:lng",
    authAccessToken,
    (req, res) => {
      AssetAddress(req, res);
    }
  );
  
  /**
   * @swagger
   * /api/pattern/auth:
   *   post:
   *     summary: Login pengguna
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login berhasil
   *       401:
   *         description: Tidak terautentikasi
   */
  router.post("/api/pattern/auth", (req, res) => {
    Login(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/register:
   *   post:
   *     summary: Registrasi pengguna baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Registrasi berhasil
   *       400:
   *         description: Kesalahan registrasi
   */
  router.post("/api/pattern/register", (req, res) => {
    Register(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/change_password:
   *   post:
   *     summary: Mengubah password pengguna
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               oldPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password berhasil diubah
   *       400:
   *         description: Kesalahan perubahan password
   */
  router.post("/api/pattern/change_password", (req, res) => {
    ChangePassword(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/forgot_password:
   *   post:
   *     summary: Lupa password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Email reset password terkirim
   *       400:
   *         description: Kesalahan lupa password
   */
  router.post("/api/pattern/forgot_password", (req, res) => {
    ForgotPassword(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks:
   *   post:
   *     summary: Membuat tugas baru
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tugas berhasil dibuat
   *       401:
   *         description: Tidak terautentikasi
   */
  router.post("/api/pattern/tasks", authAccessToken, (req, res) => {
    logger.debug(
      `\n${shtm()} - [ REQ HEADERS ] | INFO ${util.inspect(req.headers)}`
    );
    logger.debug(`\n${shtm()} - [ REQ BODY ] | INFO ${util.inspect(req.body)}`);
    Create(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks:
   *   get:
   *     summary: Membaca tugas
   *     responses:
   *       200:
   *         description: Tugas berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/tasks", authAccessToken, (req, res) => {
    logger.debug(
      `\n${shtm()} - [ REQ HEADERS ] | INFO ${util.inspect(req.headers)}`
    );
    logger.debug(`\n${shtm()} - [ REQ BODY ] | INFO ${util.inspect(req.body)}`);
    Read(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks/{status}:
   *   get:
   *     summary: Membaca tugas berdasarkan status
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         description: Status tugas
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tugas berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/tasks/:status", authAccessToken, (req, res) => {
    ReadTaskByStatus(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks/status/user/{id}:
   *   get:
   *     summary: Membaca total status tugas per pengguna
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID pengguna
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Total status tugas berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get(
    "/api/pattern/tasks/status/user/:id",
    authAccessToken,
    (req, res) => {
      ReadTotalStatusPerUser(req, res);
    }
  );
  
  /**
   * @swagger
   * /api/pattern/tasks/user/{id}:
   *   get:
   *     summary: Membaca tugas pengguna
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID pengguna
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tugas pengguna berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/tasks/user/:id", authAccessToken, (req, res) => {
    ReadTaskUser(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks/filter/{id}:
   *   get:
   *     summary: Filter tugas berdasarkan ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID tugas
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tugas berhasil difilter
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get("/api/pattern/tasks/filter/:id", authAccessToken, (req, res) => {
    TaskFilter(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks/image/{filename}:
   *   get:
   *     summary: Mengunduh gambar tugas
   *     parameters:
   *       - in: path
   *         name: filename
   *         required: true
   *         description: Nama file gambar
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Gambar berhasil diunduh
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get(
    "/api/pattern/tasks/image/:filename",
    authAccessToken,
    (req, res) => {
      Download(req, res);
    }
  );
  
  /**
   * @swagger
   * /api/pattern/tasks/{id}:
   *   put:
   *     summary: Memperbarui tugas berdasarkan ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID tugas
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Tugas berhasil diperbarui
   *       401:
   *         description: Tidak terautentikasi
   */
  router.put("/api/pattern/tasks/:id", authAccessToken, (req, res) => {
    logger.debug(`\n${shtm()} - [ REQ FILE ] | INFO ${util.inspect(req.files)}`);
    Update(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/tasks/{id}:
   *   delete:
   *     summary: Menghapus tugas berdasarkan ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID tugas
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Tugas berhasil dihapus
   */
  router.delete("/api/pattern/tasks/:id", (req, res) => {
    logger.debug(
      `\n${shtm()} - [ REQUEST HEADERS ] | INFO ${util.inspect(req.headers)}`
    );
    logger.debug(
      `\n${shtm()} - [ REQUEST PARAMS ] | INFO ${util.inspect(req.params)}`
    );
    Delete(req, res);
  });
  
  /**
   * @swagger
   * /api/pattern/vehicle/odometer/{vehicleid}:
   *   get:
   *     summary: Membaca data odometer kendaraan berdasarkan vehicleid
   *     parameters:
   *       - in: path
   *         name: vehicleid
   *         required: true
   *         description: ID kendaraan
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Data odometer berhasil dibaca
   *       401:
   *         description: Tidak terautentikasi
   */
  router.get(
    "/api/pattern/vehicle/odometer/:vehicleid",
    authAccessToken,
    (req, res) => {
      ReadOdometer(req, res);
    }
  );

// Ekspor router menggunakan sintaks ES6
export { router };

