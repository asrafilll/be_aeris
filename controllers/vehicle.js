import { logger, shtm } from '../config/utility.js';

import Vehicle  from '../models/vehicle.js';
import { inspect } from 'util';

/**
 * Menangani permintaan membaca data odometer kendaraan.
 * Fungsi ini mencari data kendaraan berdasarkan ID kendaraan yang diberikan.
 * Jika tidak ada data kendaraan yang ditemukan, itu mengembalikan kode status 404 yang menunjukkan data tidak ditemukan.
 * Jika data kendaraan ditemukan, itu mengembalikan respons sukses yang berisi total jumlah data dan data kendaraan yang ditemukan.
 *
 * @param {Object} req - Objek permintaan yang berisi ID kendaraan.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan respons HTTP kembali.
 */
const ReadOdometer = async (req, res) => {
  try {
    logger.debug(`\n${shtm()}- [ REQ HEADERS ] | INFO ${inspect(req.headers)}`);
    logger.debug(`\n${shtm()}- [ REQ PARAMS ] | INFO ${inspect(req.params)}`);
    logger.debug(`\n${shtm()}- [ REQ PARAMS vehicleid ] | INFO ${inspect(req.params.vehicleid)}`);

    const count = await Vehicle.count({
      where: {
        vehicleid: req.params.vehicleid,
      },
    });

    logger.debug(`\n${shtm()}- [ RESULT COUNT VEHICLE ] | QUERYING ${inspect(count)}`);

    const resp = await Vehicle.findAll({
      raw: true,
      where: {
        vehicleid: req.params.vehicleid,
      },
      order: [['id', 'ASC']],
    });

    logger.debug(`\n${shtm()}- [ RESULT VEHICLE ALL ] | QUERYING ${inspect(resp)}`);
    logger.debug(`\n${shtm()}- [ RESULT VEHICLE ALL ] | QUERYING ${inspect(resp.init_odometer)}`);

    const response = { total: count, rows: resp };

    logger.debug(`\n${shtm()}- [ RESULT RESPONSE ] | QUERYING ${inspect(response)}`);

    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (err) {
    logger.debug(`\n${shtm()}- [ ERROR ] | QUERYING ${inspect(err)}`);
    res.status(400).json({
      status: 'failed',
      data: 'Read data failed',
    });
  }
};

export { ReadOdometer };