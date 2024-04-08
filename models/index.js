import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import sequelizeInstance from '../config/database';

const models = {};

/**
 * Membaca dan memuat semua definisi model dari file di direktori saat ini,
 * kecuali file `index.js`, kemudian menentukan asosiasi antar model.
 */

// Membaca semua file dalam direktori saat ini, kecuali `index.js`.
fs.readdirSync(path.resolve(__dirname))
  .filter(file => file !== 'index.js')
  .forEach(file => {
    // Mengimpor definisi model dari setiap file dan inisialisasi model tersebut.
    const model = import(path.resolve(__dirname, file)).then(m => m.default(sequelizeInstance, Sequelize.DataTypes));

    // Menyimpan model yang diimpor ke dalam objek `models` dengan nama model sebagai kunci.
    model.then(m => {
      models[m.name] = m;
    });
  });

// Menunggu semua model dimuat sebelum menentukan asosiasi.
Promise.all(Object.values(models)).then(() => {
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      // Menentukan asosiasi (hubungan) antar model jika ada.
      models[modelName].associate(models);
    }
  });
});

// Menambahkan instance Sequelize dan Sequelize library ke dalam objek `models`.
models.sequelizeInstance = sequelizeInstance;
models.Sequelize = Sequelize;

// Mengekspor objek `models` untuk digunakan di bagian lain aplikasi.
export default models;
