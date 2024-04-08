import Assets from '../controllers/assets.js';
import Auth from '../controllers/auth.js';
import Task from '../controllers/task.js';
import Vehicle from '../controllers/vehicle.js';
import Vehicle_User from '../controllers/vehicle_user.js';
import express from 'express';
import futil from '../config/utility.js';
import util from 'util';

// Membuat router menggunakan express
const router = express.Router();

/**
 * @description Rute untuk menampilkan pesan selamat datang.
 */
router.get('/api/pattern', (req, res) => {
    res.send({ message: 'Welcome Pattern' });
});

/**
 * @description Rute untuk mendapatkan status terakhir berdasarkan sclId.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/latest_status/:sclId', Auth.authAccessToken, (req, res) => {
    Assets.LatestStatus(req, res);
});

/**
 * @description Rute untuk membaca informasi pengguna kendaraan.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/vehicle_user', Auth.authAccessToken, (req, res) => {
    Vehicle_User.Read(req, res);
});

/**
 * @description Rute untuk membaca kendaraan berdasarkan userid.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/vehicle_user/:userid', Auth.authAccessToken, (req, res) => {
    Vehicle_User.ReadVehicleByUser(req, res);
});

/**
 * @description Rute untuk mendapatkan alamat aset berdasarkan latitude dan longitude.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/asset_address/:lat/:lng', Auth.authAccessToken, (req, res) => {
    Assets.AssetAddress(req, res);
});

/**
 * @description Rute untuk login pengguna.
 */
router.post('/api/pattern/auth', (req, res) => {
    Auth.Login(req, res);
});

/**
 * @description Rute untuk registrasi pengguna baru.
 */
router.post('/api/pattern/register', (req, res) => {
    Auth.Register(req, res);
});

/**
 * @description Rute untuk mengubah password pengguna.
 */
router.post('/api/pattern/change_password', (req, res) => {
    Auth.ChangePassword(req, res);
});

/**
 * @description Rute untuk lupa password.
 */
router.post('/api/pattern/forgot_password', (req, res) => {
    Auth.ForgotPassword(req, res);
});

/**
 * @description Rute untuk membuat tugas baru.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.post('/api/pattern/tasks', Auth.authAccessToken, (req, res) => {
    futil.logger.debug(`\n${futil.shtm()} - [ REQ HEADERS ] | INFO ${util.inspect(req.headers)}`);
    futil.logger.debug(`\n${futil.shtm()} - [ REQ BODY ] | INFO ${util.inspect(req.body)}`);
    Task.Create(req, res);
});

/**
 * @description Rute untuk membaca tugas.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks', Auth.authAccessToken, (req, res) => {
    futil.logger.debug(`\n${futil.shtm()} - [ REQ HEADERS ] | INFO ${util.inspect(req.headers)}`);
    futil.logger.debug(`\n${futil.shtm()} - [ REQ BODY ] | INFO ${util.inspect(req.body)}`);
    Task.Read(req, res);
});

/**
 * @description Rute untuk membaca tugas berdasarkan status.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks/:status', Auth.authAccessToken, (req, res) => {
    Task.ReadTaskByStatus(req, res);
});

/**
 * @description Rute untuk membaca total status tugas per pengguna.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks/status/user/:id', Auth.authAccessToken, (req, res) => {
    Task.ReadTotalStatusPerUser(req, res);
});

/**
 * @description Rute untuk membaca tugas pengguna.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks/user/:id', Auth.authAccessToken, (req, res) => {
    Task.ReadTaskUser(req, res);
});

/**
 * @description Rute untuk filter tugas berdasarkan ID.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks/filter/:id', Auth.authAccessToken, (req, res) => {
    Task.TaskFilter(req, res);
});

/**
 * @description Rute untuk mengunduh gambar tugas.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/tasks/image/:filename', Auth.authAccessToken, (req, res) => {
    Task.Download(req, res);
});

/**
 * @description Rute untuk memperbarui tugas berdasarkan ID.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.put('/api/pattern/tasks/:id', Auth.authAccessToken, (req, res) => {
    futil.logger.debug(`\n${futil.shtm()} - [ REQ FILE ] | INFO ${util.inspect(req.files)}`);
    Task.Update(req, res);
});

/**
 * @description Rute untuk menghapus tugas berdasarkan ID.
 */
router.delete('/api/pattern/tasks/:id', (req, res) => {
    futil.logger.debug(`\n${futil.shtm()} - [ REQUEST HEADERS ] | INFO ${util.inspect(req.headers)}`);
    futil.logger.debug(`\n${futil.shtm()} - [ REQUEST PARAMS ] | INFO ${util.inspect(req.params)}`);
    Task.Delete(req, res);
});

/**
 * @description Rute untuk membaca data odometer kendaraan berdasarkan vehicleid.
 * @middleware Auth.authAccessToken: Middleware untuk autentikasi token akses.
 */
router.get('/api/pattern/vehicle/odometer/:vehicleid', Auth.authAccessToken, (req, res) => {
    Vehicle.ReadOdometer(req, res);
});

// Ekspor router menggunakan sintaks ES6
export { router };

