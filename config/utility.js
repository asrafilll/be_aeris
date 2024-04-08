import { createLogger, format, transports } from 'winston';

import DailyRotateFile from 'winston-daily-rotate-file';
import dotenv from 'dotenv';
import fs from 'fs';
import momenttz from 'moment-timezone';
import os from 'os';

dotenv.config();

  // Mendefinisikan zona waktu dari variabel lingkungan
  const timezone = process.env.TIMEZONE;

  /**
   * Fungsi untuk mendapatkan waktu saat ini berdasarkan zona waktu yang dikonfigurasi.
   * @returns {string} Waktu saat ini dalam format 'DD MMM YYYY HH:mm:ss'.
   */
  const shtm = () => momenttz.tz(timezone).format('DD MMM YYYY HH:mm:ss') + ' ';

  /**
   * Opsi konfigurasi untuk logger Winston.
   * @type {Object}
   */
  const options = {
    file: {
      level: 'debug', // Level log untuk file
      filename: `${process.env.LOGFILE_FOLDER}/app-%DATE%.log`, // Pola nama file untuk log
      handleExceptions: true, // Menangani eksepsi secara otomatis
      json: true, // Format log dalam JSON
      maxsize: 5242880, // Ukuran maksimum file sebelum dilakukan rotasi (5MB)
      colorize: false, // Tidak menggunakan warna dalam file log
    },
    errorFile: {
      level: 'error', // Hanya mencatat log dengan level 'error'
      filename: `${process.env.LOGFILE_FOLDER}/errors-%DATE%.log`, // Pola nama file untuk error log
      handleExceptions: true,
      json: true,
      maxsize: 5242880,
      colorize: false,
    },
    console: {
      level: 'debug', // Level log untuk output konsol
      handleExceptions: true,
      json: false, // Dalam konsol, log tidak dalam format JSON untuk kemudahan pembacaan
      colorize: true, // Menggunakan warna untuk membedakan level log
    },
    dailyRotateFile: {
      filename: `${process.env.LOGFILE_FOLDER}/app-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Arsip file log setiap hari dalam format zip
      maxSize: '20m', // Maksimal ukuran file sebelum dilakukan pemisahan
      maxFiles: '14d', // Menyimpan file log selama 14 hari
    },
  };

  /**
   * Membuat instance logger Winston untuk pencatatan log aplikasi.
   * @type {winston.Logger}
   */
  const logger = createLogger({
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json()
    ),
    transports: [
      new transports.Console(options.console),
      new transports.File(options.errorFile),
      new DailyRotateFile(options.dailyRotateFile),
    ],
    exitOnError: false, // Tidak menghentikan aplikasi ketika terjadi eksepsi yang ditangani
  });

  /**
   * Mengubah nilai variabel lingkungan dalam file .env.
   * @param {string} key - Kunci dari variabel lingkungan yang akan diubah.
   * @param {string} value - Nilai baru untuk variabel lingkungan tersebut.
   */
  const setEnvValue = (key, value) => {
    const envVars = fs.readFileSync('./.env', 'utf8').split(os.EOL);
    const targetIndex = envVars.findIndex((line) => line.startsWith(key));
    if (targetIndex !== -1) {
      envVars[targetIndex] = `${key}=${value}`;
    } else {
      envVars.push(`${key}=${value}`);
    }
    fs.writeFileSync('./.env', envVars.join(os.EOL));
  };

  /**
   * Fungsi untuk mengambil substring dari sebuah string.
   * @param {string} str - String sumber.
   * @param {number} index - Indeks awal untuk substring.
   * @param {number} length - Panjang substring yang diinginkan.
   * @returns {string|undefined} Substring yang dihasilkan atau undefined jika input tidak valid.
   */
  const substring = (str, index, length) => {
    if (typeof str === 'string') {
      // Check if `length` is undefined to handle both cases
      if (typeof length === 'undefined') {
        return str.slice(index);
      } else {
        return str.slice(index, index + length);
      }
    }
    console.log('Objek yang diberikan bukan string yang valid.');
    return undefined;
  };


  /**
   * Mengembalikan tanggal saat ini dalam format 'YYYY-MM-DD'.
   * @returns {string} Tanggal saat ini.
   */
  const currentDate = () => new Date().toISOString().slice(0, 10);

  /**
   * Menghitung selisih hari antara dua tanggal.
   * @param {Date} date1 - Tanggal pertama.
   * @param {Date} date2 - Tanggal kedua.
   * @returns {number} Selisih hari antara dua tanggal.
   */
  const dayDifference = (date1, date2) => {
    const difference = date1.getTime() - date2.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  // Mengekspor fungsi dan objek yang telah didefinisikan agar dapat digunakan di bagian lain aplikasi
  export { currentDate, dayDifference, logger, setEnvValue, shtm, substring };

