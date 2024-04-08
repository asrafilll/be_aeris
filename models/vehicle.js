import { DataTypes } from 'sequelize';
import db from '../config/database.js';

/**
 * Mendefinisikan skema untuk tabel 'vehicles'.
 * 
 * Tabel ini menyimpan data kendaraan, termasuk id, merek, tipe, kondisi, status daya,
 * status ignisi, kecepatan, waktu operasional, penandaan, penugasan, id SIM,
 * odometer awal, dan odometer saat ini.
 */
const Vehicle = db.define('vehicles', {
  vehicleid: {
    type: DataTypes.STRING
  },
  vehicle_brand: {
    type: DataTypes.STRING
  },
  vehicle_type: {
    type: DataTypes.STRING
  },
  vehicle_condition: {
    type: DataTypes.STRING
  },
  power_status: {
    type: DataTypes.STRING
  },
  ign_status: {
    type: DataTypes.STRING
  },
  speed: {
    type: DataTypes.STRING
  },
  operating_time: {
    type: DataTypes.DATE
  },
  tagging: {
    type: DataTypes.STRING
  },
  assignment: {
    type: DataTypes.INTEGER
  },
  simId: {
    type: DataTypes.STRING
  },
  init_odometer: {
    type: DataTypes.INTEGER
  },
  odometer: {
    type: DataTypes.INTEGER
  }
}, {
  // Menetapkan nama tabel agar tidak berubah
  freezeTableName: true
});

// Mengekspor model Vehicle agar dapat digunakan di bagian lain aplikasi
export { Vehicle };

