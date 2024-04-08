import { DataTypes } from 'sequelize';
import db from '../config/database.js';

/**
 * Mendefinisikan skema untuk tabel 'vehicle_users'.
 * 
 * Tabel ini bertujuan untuk menyimpan relasi antara kendaraan dan pengguna,
 * memungkinkan sistem untuk melacak kendaraan mana yang digunakan oleh pengguna tertentu.
 * Setiap record merepresentasikan sebuah kendaraan yang dikaitkan dengan seorang pengguna.
 *
 * @attribute vehicleid {String} - ID unik untuk kendaraan.
 * @attribute userid {Integer} - ID pengguna yang menggunakan kendaraan.
 * @attribute sclid {String} - Kode unik yang mungkin digunakan untuk mengidentifikasi sesi atau konfigurasi tertentu.
 */
const Vehicle_User = db.define('vehicle_users', {
  vehicleid: {
    type: DataTypes.STRING
  },
  userid: {
    type: DataTypes.INTEGER
  },
  sclid: {
    type: DataTypes.STRING
  }
}, {
  // Opsi untuk mencegah Sequelize otomatis menamai ulang tabel
  freezeTableName: true
});

// Mengekspor model Vehicle_User agar dapat digunakan di bagian lain aplikasi
export { Vehicle_User };
