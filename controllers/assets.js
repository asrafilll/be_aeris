import axios from 'axios';
import { config } from 'dotenv';
import futil from '../config/utility.js';
import util from 'util';

config(); // Mengaktifkan dotenv untuk mengelola variabel lingkungan

/**
 * Mengambil detail asset berdasarkan ID.
 * @param {Object} req - Objek request yang mengandung informasi permintaan.
 * @param {Object} res - Objek response untuk mengirimkan balasan.
 */
const AssetByID = async (req, res) => {
  const accessToken = process.env.TOKEN_AERTRAK;
  const urlAssets = `${process.env.URL_ASSET_AERTRACK}/${req.params.sclId}`;

  futil.logger.debug(`${futil.shtm()} - [ ASSETS ] | INFO ${util.inspect('ASSETS')}`);
  futil.logger.debug(`${futil.shtm()} - [ URL ASSETS ] | INFO ${util.inspect(urlAssets)}`);

  try {
    const config = {
      headers: {
        token: accessToken
      }
    };
    const responseAssets = await axios.get(urlAssets, config);
    futil.logger.debug(`${futil.shtm()} - [ RESPONSE BODY] | INFO ${util.inspect(responseAssets.data)}`);

    const result = {
      status: true,
      message: "success",
      data: responseAssets.data
    };

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    handleAxiosError(error, res);
  }
};


/**
 * Menangani error yang terjadi pada request axios.
 * @param {Object} error - Objek error yang diterima dari axios.
 * @param {Object} res - Objek response untuk mengirimkan balasan.
 */
const handleAxiosError = (error, res) => {
  if (error.response) {
    futil.logger.debug(`${futil.shtm()} - [ ERROR RESPONSE DATA ]  ${util.inspect(error.response.data)}`);
    futil.logger.debug(`${futil.shtm()} - [ ERROR RESPONSE STATUS ]  ${util.inspect(error.response.status)}`);
    futil.logger.debug(`${futil.shtm()} - [ ERROR RESPONSE HEADER ]  ${util.inspect(error.response.headers)}`);
  } else if (error.request) {
    futil.logger.debug(`${futil.shtm()} - [ ERROR REQUEST ]  ${util.inspect(error.request)}`);
  } else {
    futil.logger.debug(`${futil.shtm()} - [ ERROR ]  ${util.inspect(error.message)}`);
  }

  const result = {
    status: false,
    message: 'ERROR CONNECTION',
    error: error.response ? error.response.data : error.message
  };

  res.setHeader("Content-Type", "application/json");
  res.status(error.response ? error.response.status : 500).json(result);
};



/**
 * Mengambil semua aset.
 * @param {Object} req - Objek permintaan yang mengandung informasi permintaan.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const AllAssets1 = async (req, res) => {
/*   let movingCounter = 0;
  let stoppedCounter = 0;
  let offlineCounter = 0; */

  const accessToken = process.env.TOKEN_AERTRAK;
  const urlAssets = process.env.URL_ASSET_AERTRACK;

  futil.logger.debug(`${futil.shtm()} - [ ASET ] | INFO ${util.inspect('ASET')}`);
  futil.logger.debug(`${futil.shtm()} - [ URL ASET ] | INFO ${util.inspect(urlAssets)}`);

  try {
    const responseAssets = await axios.get(urlAssets, {
      headers: {
        token: accessToken,
      },
    });
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON] | INFO ${util.inspect(responseAssets.data)}`);

    // Logika untuk menghitung status aset

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: responseAssets.data,
    });
  } catch (error) {
    handleAxiosError(error, res);
  }
};


/**
 * Mengambil status terbaru dari sebuah aset.
 * @param {Object} req - Objek permintaan yang mengandung informasi permintaan.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const LatestStatus = async (req, res) => {
  const accessToken = process.env.TOKEN_AERTRAK;
  const accountId = process.env.ACCOUNTID;
  const sclId = req.params.sclId;
  const urlLatestStatus = `${process.env.URL_LATEST_STATUS_AERTRACK}accountId=${accountId}&includeHierarchy=false&sclId=${sclId}`;

  futil.logger.debug(`${futil.shtm()} - [ STATUS ASET TERBARU ] | INFO `);
  futil.logger.debug(`${futil.shtm()} - [ URL STATUS ASET TERBARU ] | INFO ${util.inspect(urlLatestStatus)}`);

  try {
    const responseLatestStatus = await axios.get(urlLatestStatus, {
      headers: {
        token: accessToken,
      },
    });
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON] | INFO ${util.inspect(responseLatestStatus.data)}`);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: responseLatestStatus.data,
    });
  } catch (error) {
    handleAxiosError(error, res);
  }
};



/**
 * Mengambil status terbaru dari semua aset.
 * @param {Object} req - Objek permintaan yang mengandung informasi permintaan.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const LatestStatus1 = async (req, res) => {
  const accessToken = process.env.TOKEN_AERTRAK;
  const accountId = process.env.ACCOUNTID;
  const urlLatestStatus = `${process.env.URL_LATEST_STATUS_AERTRACK}accountId=${accountId}&includeHierarchy=false`;

  futil.logger.debug(`${futil.shtm()} - [ STATUS TERBARU ASET ] | INFO`);
  futil.logger.debug(`${futil.shtm()} - [ URL STATUS TERBARU ASET ] | INFO ${util.inspect(urlLatestStatus)}`);

  try {
    const response = await axios.get(urlLatestStatus, {
      headers: {
        token: accessToken,
      },
    });
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON ] | INFO ${util.inspect(response.data)}`);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: response.data,
    });
  } catch (error) {
    handleAxiosError(error, res);
  }
};


/**
 * Mendapatkan alamat aset berdasarkan koordinat latitud dan longitud.
 * @param {Object} req - Objek permintaan yang mengandung informasi permintaan.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const AssetAddress = async (req, res) => {
  const lat = req.params.lat;
  const lng = req.params.lng;
  const apiKey = process.env.MAP_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON] | INFO ${util.inspect(response)}`);

    const validAddress = response.data.results[0].formatted_address;

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: validAddress,
    });
  } catch (error) {
    console.log(error);
    futil.logger.debug(`${futil.shtm()} - [ KESALAHAN ] | INFO ${util.inspect(error)}`);

    res.setHeader("Content-Type", "application/json");
    res.status(400).json({
      status: false,
      pesan: "gagal",
    });
  }
};


/**
 * Mengambil riwayat aset berdasarkan ID.
 * @param {Object} req - Objek permintaan yang mengandung informasi permintaan seperti ID aset dan rentang waktu.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const History = async (req, res) => {
  const token = process.env.TOKEN_AERTRAK;
  const sclId = req.body.sclId;
  const createdBefore = req.body.createdBefore;
  const createdAfter = req.body.createdAfter;
  const accountId = process.env.ACCOUNTID;
  const urlHistory = `${process.env.URL_ASSET_HISTORY}${sclId}/data?createdBefore=${createdBefore}&createdAfter=${createdAfter}&accountId=${accountId}`;

  futil.logger.debug(`${futil.shtm()} - [ RIWAYAT ASET ] | INFO`);
  futil.logger.debug(`${futil.shtm()} - [ URL RIWAYAT ASET ] | INFO ${util.inspect(urlHistory)}`);

  try {
    const responseAssets = await axios.get(urlHistory, {
      headers: {
        token: token,
      },
    });
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON ] | INFO ${util.inspect(responseAssets.data)}`);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: responseAssets.data,
    });
  } catch (error) {
    handleAxiosError(error, res);
  }
};


/**
 * Menghitung jumlah aset berdasarkan statusnya.
 * @param {Object} req - Objek permintaan.
 * @param {Object} res - Objek respons untuk mengirim balasan.
 */
const StatusCount = async (req, res) => {
  const urlStatusCount = process.env.URL_STATUS_COUNT_AERTRACK;
  const token = process.env.TOKEN_AERTRAK;

  futil.logger.debug(`${futil.shtm()} - [ JUMLAH STATUS ASET ] | INFO`);
  futil.logger.debug(`${futil.shtm()} - [ URL JUMLAH STATUS ASET ] | INFO ${util.inspect(urlStatusCount)}`);

  try {
    const responseAssets = await axios.get(urlStatusCount, {
      headers: {
        token: token,
      },
    });
    futil.logger.debug(`${futil.shtm()} - [ ISI RESPON ] | INFO ${util.inspect(responseAssets.data)}`);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({
      status: true,
      pesan: "sukses",
      data: responseAssets.data,
    });
  } catch (error) {
    handleAxiosError(error, res);
  }
};


export {
  AssetByID,
  AllAssets1,
  AssetAddress,
  LatestStatus,
  LatestStatus1,
  StatusCount,
  History
};
