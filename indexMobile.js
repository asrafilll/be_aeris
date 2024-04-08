import { logger, shtm } from './config/utility.js';

import bodyParser from 'body-parser';
import cors from 'cors';
import db from './config/database.js';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import { router } from './routes/index.js';
import swaggerSpec from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import util from 'util';

dotenv.config();

const app = express();

/**
 * Konfigurasi dan inisialisasi server Express.
 * Termasuk middleware untuk parsing JSON dan URL-encoded data,
 * konfigurasi CORS, dan file upload.
 */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.options('*', cors());
const corsOptions = {
    exposedHeaders: 'token',
};
app.use(cors(corsOptions));

app.use(fileUpload());
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Mendengarkan port yang ditentukan di variabel lingkungan.
 * Menampilkan informasi startup server dan mencoba menghubungkan ke database.
 */
// ...

/** 
 * Mendengarkan port yang ditentukan di variabel lingkungan.
 * Menampilkan informasi startup server dan mencoba menghubungkan ke database.
 */
const startServer = async () => {
    const server = app.listen(4321, () => {
      const port = server.address().port;
      console.log(port);
      logger.debug('\n' + shtm() + '- [ W A K E U P ] | STARTING ' + util.inspect(process.env.TITLE));
      logger.debug(shtm() + '- [ W A K E U P ] | RUN AT PATH: /api/pattern, PORT: ' + port);
    });
  
    // Menguji koneksi database
    try {
      await db.authenticate();
      logger.debug('\n' + shtm() + '- [ DATABASE U P ] | STARTING ' + util.inspect(process.env.DATABASE));
    } catch (error) {
      console.error('Database connection error:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack trace:', error.stack);
      logger.debug('\n' + shtm() + '- [ DATABASE ERROR] | STARTING ' + util.inspect(error));
    }
  };
  
  startServer();