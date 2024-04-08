import bodyParser from 'body-parser';
import con from './config/database.js';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import futil from './config/utility.js';
import routes from './routes/index.js';
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
app.use(routes.router);

/**
 * Mendengarkan port yang ditentukan di variabel lingkungan.
 * Menampilkan informasi startup server dan mencoba menghubungkan ke database.
 */
const server = app.listen(process.env.SERVER_PORT, () => {
    const port = server.address().port;

    futil.logger.debug('\n' + futil.shtm() + '- [ W A K E   U P ] | STARTING ' + util.inspect(process.env.TITLE));
    futil.logger.debug(futil.shtm() + '- [ W A K E   U P ] | RUN AT PATH: /api/pattern, PORT: ' + port);

    // Menguji koneksi database
    try {
        con.db.authenticate();
        futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE U P ] | STARTING ' + util.inspect(process.env.DATABASE));
    } catch (error) {
        futil.logger.debug('\n' + futil.shtm() + '- [ DATABASE ERROR] | STARTING ' + util.inspect(error));
    }
});
