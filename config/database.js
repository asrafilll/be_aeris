import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Inisialisasi koneksi database menggunakan Sequelize.
 */
const db = new Sequelize(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

export default db;
