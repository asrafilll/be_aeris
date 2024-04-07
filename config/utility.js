var moment = require("moment");
var util = require("util");
var momenttz = require("moment-timezone");
var crypto = require("crypto");
var winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
var fs = require("fs");
const os = require("os");
require("dotenv").config();

var timezone = process.env.TIMEZONE;

/**
 * Mengembalikan waktu saat ini dalam format 'DD MMM YYYY HH:mm:ss' sesuai dengan zona waktu yang ditentukan.
 * @returns {string} Waktu saat ini dalam format 'DD MMM YYYY HH:mm:ss'.
 */
var shtm = function () {
  return momenttz().tz(timezone).format("DD MMM YYYY HH:mm:ss") + " ";
  // return moment().format('DD MMM YYYY HH:mm:ss') + ' ';
};
module.exports.shtm = shtm;

/*LOGGER*/
/**
 * Konfigurasi opsi untuk logger Winston.
 * @type {Object}
 */
var options = {
  /**
   * Konfigurasi untuk transport file.
   * @type {Object}
   */
  file: {
    level: "debug", // Level logging untuk file
    name: "file.info", // Nama transport file
    filename: process.env.LOGFILE_FOLDER, // Lokasi penyimpanan file log
    handleExceptions: true, // Menangani exception dan mencatatnya ke file
    json: true, // Format log dalam bentuk JSON
    maxsize: 5242880, // Ukuran maksimum file log (5MB)
    // maxFiles: 100, // Jumlah maksimum file log (tidak digunakan)
    colorize: true, // Mewarnai output log
  },
  /**
   * Konfigurasi untuk transport file error.
   * @type {Object}
   */
  errorFile: {
    level: "error", // Level logging untuk file error
    name: "file.error", // Nama transport file error
    filename: process.env.LOGFILE_FOLDER, // Lokasi penyimpanan file log error
    handleExceptions: true, // Menangani exception dan mencatatnya ke file error
    json: true, // Format log dalam bentuk JSON
    maxsize: 5242880, // Ukuran maksimum file log error (5MB)
    maxFiles: 100, // Jumlah maksimum file log error
    colorize: true, // Mewarnai output log error
  },
  /**
   * Konfigurasi untuk transport console.
   * @type {Object}
   */
  console: {
    level: "debug", // Level logging untuk console
    handleExceptions: true, // Menangani exception dan mencatatnya ke console
    json: true, // Format log dalam bentuk JSON
    colorize: true, // Mewarnai output log di console
  },
  /**
   * Konfigurasi untuk transport daily rotate file.
   * @type {Object}
   */
  dailyfile: {
    prepend: true, // Menambahkan timestamp di awal setiap log
    level: "debug", // Level logging untuk daily rotate file
    colorize: false, // Tidak mewarnai output log
    timestamp: false, // Tidak menambahkan timestamp (sudah ditambahkan oleh prepend)
    filename: process.env.LOGFILE_FOLDER, // Lokasi penyimpanan file log harian
    maxSize: 5242880, // Ukuran maksimum file log harian (5MB)
    json: false, // Format log bukan dalam bentuk JSON
    prettyPrint: true, // Format log dalam bentuk yang mudah dibaca
  },
};

/**
 * Konfigurasi logger Winston untuk pencatatan log.
 * @type {winston.Logger}
 */
// your centralized logger object
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.errorFile),
    // new (winston.transports.File)(options.file),
    // new (winston.transports.File)(options.file),
    new DailyRotateFile(options.file),
  ],
  exitOnError: false, // do not exit on handled exceptions
});
module.exports.logger = logger;

/**
 * Mengubah nilai variabel lingkungan dalam file .env.
 * @param {string} key - Kunci variabel lingkungan yang akan diubah.
 * @param {string} value - Nilai baru untuk variabel lingkungan.
 */
function setEnvValue(key, value) {
  // read file from hdd & split if from a linebreak to a array
  const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);

  // find the env we want based on the key
  const target = ENV_VARS.indexOf(
    ENV_VARS.find((line) => {
      return line.match(new RegExp(key));
    })
  );

  // replace the key/value with the new value
  ENV_VARS.splice(target, 1, `${key}=${value}`);

  // write everything back to the file system
  fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
}

module.exports.setEnvValue = setEnvValue;

/**
 * Mengembalikan substring dari sebuah string.
 * @param {string} str - String yang akan diambil substringnya.
 * @param {number} index - Indeks awal substring.
 * @param {number} length - Panjang substring yang diinginkan.
 * @returns {string|undefined} Substring dari string jika string valid, undefined jika tidak valid.
 */
function substring(str, index, length) {
  if (typeof str === "string") {
    let substring = str.substr(index, length);
    return substring;
  } else {
    console.log("The object is not a valid string");
  }
}
module.exports.substring = substring;

/**
 * Mengembalikan tanggal saat ini dalam format 'YYYY-MM-DD'.
 * @returns {string} Tanggal saat ini dalam format 'YYYY-MM-DD'.
 */
function currentDate() {
  var todayDate = new Date().toISOString().slice(0, 10);

  return todayDate;
}

module.exports.currentDate = currentDate;

/**
 * Menghitung selisih hari antara dua tanggal.
 * @param {Date} date1 - Tanggal pertama.
 * @param {Date} date2 - Tanggal kedua.
 * @returns {number} Selisih hari antara dua tanggal.
 */
function dayDiffrence(date1, date2) {
  let difference = date1.getTime() - date2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}
module.exports.dayDiffrence = dayDiffrence;
