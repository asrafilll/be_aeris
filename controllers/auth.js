import * as jwt from "jsonwebtoken";

import { logger, setEnvValue, shtm } from '../config/utility.js';

import Sequelize from "sequelize";
import axios from "axios";
import crypto from "crypto";
import db from "../models/index.cjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import util from "util";

const User = db.user;
const Op = Sequelize.Op;

dotenv.config();

/**
 * Menangani permintaan pendaftaran pengguna.
 * Fungsi ini memeriksa apakah pengguna dengan nama pengguna atau email yang diberikan sudah ada di dalam database.
 * Jika pengguna sudah ada, ia mengembalikan kode status 400 yang menunjukkan permintaan tidak valid dengan pesan bahwa data sudah ada.
 * Jika tidak ada pengguna yang ditemukan, ia membuat pengguna baru dengan data yang diberikan dalam badan permintaan, mencatat aksi tersebut, dan mengembalikan kode status 201 yang menunjukkan bahwa pengguna baru telah berhasil dibuat.
 *
 * @param {Object} req - Objek permintaan yang mengandung detail pengguna di dalam badannya.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 */

const Register = async (req, res) => {
  try {
    logger.debug(
      "\n" + shtm() + "- [ REGISTER ] | INFO " + util.inspect(req.body)
    );
    const user = await User.findAll({
      where: {
        [Op.or]: {
          username: req.body.username,
          email: req.body.email,
        },
      },
      raw: true,
    });

    logger.debug(
      "\n" + shtm() + "- [ RESULT ] | QUERING " + util.inspect(user)
    );

    if (user.length > 0) {
      res.status(400).json({
        status: false,
        message: "Data already exists",
      });
    } else {
      const newUser = await User.create(req.body);
      logger.debug(
        "\n" + shtm() + "- [ RESULT ] | QUERING " + util.inspect(newUser)
      );

      res.status(201).json({
        status: true,
        message: "New user created",
      });
    }
  } catch (err) {
    logger.debug(
      "\n" + shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Menangani permintaan login pengguna.
 * Ini mencari pengguna dengan nama pengguna dan kata sandi yang cocok yang diberikan dalam badan permintaan.
 * Jika tidak ada pengguna yang cocok ditemukan, itu mengembalikan kode status 401 yang menunjukkan akses tidak sah.
 * Jika pengguna yang cocok ditemukan, itu menghasilkan token JWT, masuk ke sistem lain menggunakan axios untuk melakukan permintaan POST HTTP, memperbarui variabel lingkungan dengan token yang diterima, dan mengembalikan respons sukses dengan token JWT yang dihasilkan.
 *
 * @param {Object} req - Objek permintaan yang mengandung kredensial login.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 */

const Login = async (req, res) => {
  try {
    logger.debug(
      "\n" + shtm() + "- [ LOGIN ] | INFO " + util.inspect(req.body)
    );

    const user = await User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
      raw: true,
    });

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const response = await axios.post(process.env.URL_LOGIN_AERTRACK, {
      username: process.env.AERTRACK_USERNAME,
      password: process.env.AERTRACK_PASSWORD,
    });

    const accessToken = response.data.token;
    setEnvValue("TOKEN_AERTRAK", accessToken);

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    logger.debug(
      "\n" + shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Menangani permintaan lupa kata sandi.
 * Fungsi ini mencari pengguna dengan nama pengguna atau email yang diberikan.
 * Jika tidak ada pengguna yang ditemukan, itu mengembalikan kode status 404 yang menunjukkan pengguna tidak ditemukan.
 * Jika pengguna ditemukan, itu menghasilkan teks sandi dari nama pengguna, membangun email dengan tautan reset kata sandi yang mengandung teks sandi, mengirim email ke alamat email pengguna, dan mengembalikan respons sukses yang menunjukkan email telah dikirim.
 *
 * @param {Object} req - Objek permintaan yang berisi nama pengguna atau email pengguna.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 */

const ForgotPassword = async (req, res) => {
  try {
    logger.debug(
      "\n" +
        shtm() +
        "- [ FORGOT PASSWORD ] | INFO " +
        util.inspect(req.body)
    );

    const user = await User.findOne({
      where: {
        [Op.or]: {
          username: req.body.param,
          email: req.body.param,
        },
      },
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PW
      },
    });

    const plainText = user.username;
    const key = process.env.SECRET_KEY
    const algorithm = "aes-256-cbc";
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const mailOptions = {
      from: "adm.korlantas@gmail.com",
      to: user.email,
      subject: "Lupa Password",
      text: "Harap klik link dibawah untuk lupa password",
      html: `<p>Click <a href="http://147.139.144.120:3001/lupa_password/${encrypted}">here</a> to reset your password</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: true,
      message: "Email sent",
    });
  } catch (err) {
    logger.debug(
      "\n" + shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Menangani permintaan untuk mengubah kata sandi.
 * Fungsi ini mendekripsi teks nama pengguna yang terenkripsi yang diterima dalam badan permintaan, memperbarui kata sandi pengguna dengan kata sandi baru yang diberikan, dan mengembalikan respons sukses yang menunjukkan kata sandi telah berhasil diperbarui.
 * Jika tidak ada pengguna yang cocok ditemukan atau dekripsi gagal, itu mengembalikan kode status 404 yang menunjukkan pengguna tidak ditemukan atau respons kesalahan untuk setiap pengecualian.
 *
 * @param {Object} req - Objek permintaan yang mengandung nama pengguna terenkripsi dan kata sandi baru.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 */

const ChangePassword = async (req, res) => {
  try {
    logger.debug(
      "\n" +
        shtm() +
        "- [ CHANGE PASSWORD ] | INFO " +
        util.inspect(req.body)
    );

    const encryptedText = req.body.data;
    const password = req.body.password;
    const key = process.env.SECRET_KEY
    const algorithm = "aes-256-cbc";
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    const [updatedRows] = await User.update(
      { password },
      {
        where: {
          username: decrypted,
        },
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    logger.debug(
      "\n" + shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/**
 * Middleware untuk memverifikasi token akses.
 * Fungsi ini memeriksa token yang disediakan dalam header permintaan, memverifikasi token menggunakan rahasia yang didefinisikan dalam variabel lingkungan, dan menetapkan payload ke objek permintaan jika token valid.
 * Jika token tidak valid, itu mengembalikan kode status 401 dengan pesan yang menunjukkan token tidak valid.
 *
 * @param {Object} req - Objek permintaan yang mengandung header dengan token.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 * @param {Function} next - Fungsi callback untuk melanjutkan ke middleware berikutnya.
 */

const authAccessToken = async (req, res, next) => {
  try {
    logger.debug(
      "\n" + shtm() + "- [ HEADERS ] | INFO " + util.inspect(req.headers)
    );
    const token = req.headers.token;

    logger.debug(
      "\n" + shtm() + "- [ TOKEN ] | INFO " + util.inspect(token)
    );

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    logger.debug(
      "\n" + shtm() + "- [ ERROR ] | AUTH " + util.inspect(err)
    );
    res.status(401).json({
      status: false,
      message: "Invalid token",
    });
  }
};

export { ChangePassword, ForgotPassword, Login, Register, authAccessToken };

