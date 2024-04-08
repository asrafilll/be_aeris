const db = require("../models");
const { Op } = require("sequelize");
const ModelTask = require("../models/task.js");
const Task = ModelTask.Task;
const ModelUser = require("../models/user.js");
const User = ModelUser.User;
const path = require("path");
const util = require("util");
const futil = require("../config/utility.js");

const result = {
  code: "",
  status: "",
  data: null,
};

/**
 * Membuat task baru.
 *
 * @param {Object} req - Objek permintaan, berisi detail task yang akan dibuat.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const Create = async function (req, res) {
  try {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ REQ PARAMS ] | INFO " +
        util.inspect(req.headers)
    );
    const task = await Task.create(req.body);
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ RESULT TASK CREATE] | QUERING " +
        util.inspect(task)
    );

    result.code = 200;
    result.status = "success";
    result.data = task;

    res.status(201).json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Insert data failed";

    res.status(500).json(result);
  }
};

/**
 * Mengembalikan daftar semua task.
 *
 * @param {Object} req - Objek permintaan.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const Read = async function (req, res) {
  try {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ REQ PARAMS ] | INFO " +
        util.inspect(req.headers)
    );

    const count = await Task.count();
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ RESULT COUNT ] | QUERING " +
        util.inspect(count)
    );

    await UpdateStatus();

    const tasks = await Task.findAll({
      raw: true,
      order: [["id", "ASC"]],
    });

    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT TASK] | QUERING " + util.inspect(tasks)
    );

    const page = req.headers.page || 1;
    const offset = (page - 1) * tasks.length;

    const j = offset + 1;

    tasks.forEach((task, i) => {
      let status;
      switch (task.task_status) {
        case "In Complete":
          status = 1;
          break;
        case "Overdue":
          status = 2;
          break;
        case "In Progress":
          status = 3;
          break;
        case "Complete":
          status = 4;
          break;
        default:
          status = 0;
      }

      task.status = status;
      task.no = j + i;
    });

    const response = { total: count, data: tasks };
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ RESULT RESPONSE] | QUERING " +
        util.inspect(response)
    );

    result.code = 200;
    result.status = "success";
    result.data = response;

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Gagal membaca data";

    res.status(500).json(result);
  }
};

/**
 * Mengembalikan total status per user.
 *
 * @param {Object} req - Objek permintaan, berisi ID pengguna.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const ReadTotalStatusPerUser = async function (req, res) {
  try {
    const task = await Task.findAll({
      group: ["task_status"],
      attributes: [
        "task_status",
        [sequelize.fn("COUNT", sequelize.col("task_status")), "total"],
      ],
      where: { userid: req.params.id },
    });

    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT ] | QUERING " + util.inspect(task)
    );

    result.code = 200;
    result.status = "success";
    result.data = task;

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Gagal membaca data";

    res.status(500).json(result);
  }
};

/**
 * Mengembalikan daftar task berdasarkan status.
 *
 * @param {Object} req - Objek permintaan, berisi status task yang diminta.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const ReadTaskByStatus = async function (req, res) {
  try {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ REQ PARAMS ] | INFO " +
        util.inspect(req.headers)
    );

    const count = await Task.count();
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ RESULT COUNT ] | QUERING " +
        util.inspect(count)
    );

    await UpdateStatus();

    const status = req.params.status;
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ TASK STATUS ] | QUERING " +
        util.inspect(status)
    );

    const tasks = await Task.findAll({
      raw: true,
      where: { task_status: status },
      order: [["id", "ASC"]],
    });

    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT TASK] | QUERING " + util.inspect(tasks)
    );

    const page = req.headers.page || 1;
    const offset = (page - 1) * tasks.length;

    const j = offset + 1;

    tasks.forEach((task, i) => {
      let status;
      switch (task.task_status) {
        case "In Complete":
          status = 1;
          break;
        case "Overdue":
          status = 2;
          break;
        case "In Progress":
          status = 3;
          break;
        case "Complete":
          status = 4;
          break;
        default:
          status = 0;
      }

      task.status = status;
      task.no = j + i;
    });

    const response = { total: count, data: tasks };
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ RESULT RESPONSE] | QUERING " +
        util.inspect(response)
    );

    result.code = 200;
    result.status = "success";
    result.data = response;

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Gagal membaca data";

    res.status(500).json(result);
  }
};

/**
 * Memfilter task berdasarkan kriteria tertentu.
 *
 * @param {Object} req - Objek permintaan, berisi ID pengguna dan kriteria filter.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const TaskFilter = async function (req, res) {
  try {
    const task = await Task.findAll({
      where: {
        userid: req.params.id,
        task_date: new Date(req.body.task_date),
        task_status: req.body.task_status,
        task_type: req.body.task_type,
      },
    });

    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT ] | QUERING " + util.inspect(task)
    );

    result.code = 200;
    result.status = "success";
    result.data = task;

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Gagal membaca data";

    res.status(500).json(result);
  }
};

/**
 * Mengembalikan daftar task untuk pengguna tertentu.
 *
 * @param {Object} req - Objek permintaan, berisi ID pengguna.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const ReadTaskUser = async function (req, res) {
  try {
    const task = await Task.findAll({
      where: { userid: req.params.id },
    });

    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT ] | QUERING " + util.inspect(task)
    );

    result.code = 200;
    result.status = "success";
    result.data = task;

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Gagal membaca data";

    res.status(500).json(result);
  }
};

/**
 * Memperbarui task berdasarkan ID.
 *
 * @param {Object} req - Objek permintaan, berisi ID task dan detail pembaruan.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const Update = async function (req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      // Update tanpa gambar
      futil.logger.debug("\n" + futil.shtm() + "- [ UPDATE TANPA IMAGE ]");

      await Task.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      result.code = 200;
      result.status = "success";
      result.data = "Update data berhasil";

      res.json(result);
    } else {
      const sampleFile = req.files.image_task;
      const uploadPath = path.join(
        __dirname,
        "../public/uploads/",
        sampleFile.name
      );

      futil.logger.debug(
        "\n" +
          futil.shtm() +
          "- [ UPLOAD PATH ] | INFO " +
          util.inspect(uploadPath)
      );

      await sampleFile.mv(uploadPath);

      req.body.path = uploadPath;
      req.body.filename = sampleFile.name;

      futil.logger.debug(
        "\n" + futil.shtm() + "- [ REQ BODY  ] | INFO " + util.inspect(req.body)
      );

      await Task.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      result.code = 200;
      result.status = "success";
      result.data = "Update data berhasil";

      res.json(result);
    }
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Update data gagal";

    res.status(500).json(result);
  }
};

/**
 * Memperbarui status task berdasarkan tanggal saat ini.
 *
 * @returns {Promise<void>}
 */
const UpdateStatus = async function () {
  try {
    const tasks = await Task.findAll();
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ RESULT ] | QUERING " + util.inspect(tasks)
    );

    const currentDate = futil.currentDate();
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ CURRENT DATE ] | INFO " +
        util.inspect(currentDate)
    );

    const date1 = new Date(currentDate);

    for (const task of tasks) {
      const taskDate = task.task_date;
      const date2 = new Date(taskDate);
      const days = futil.dayDiffrence(date1, date2);
      futil.logger.debug(
        "\n" + futil.shtm() + "- [ DAYS ] | INFO " + util.inspect(days)
      );

      const { user_lat, user_lon, vehicle_lat, vehicle_lon, userid, id } = task;

      if (userid && days > 0 && task.task_status !== "Overdue") {
        if (!user_lat && !user_lon && !vehicle_lat && !vehicle_lon) {
          await Task.update({ task_status: "Overdue" }, { where: { id } });
        } else {
          await Task.update({ task_status: "Complete" }, { where: { id } });
        }
      }
    }
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );
  }
};

/**
 * Menghapus task berdasarkan ID.
 *
 * @param {Object} req - Objek permintaan, berisi ID task yang akan dihapus.
 * @param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
 * @returns {Promise<void>}
 */
const Delete = async function (req, res) {
  try {
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ REQUEST PARAM ] | INFO " +
        util.inspect(req.params)
    );
    futil.logger.debug(
      "\n" +
        futil.shtm() +
        "- [ REQUEST BODY ] | INFO " +
        util.inspect(req.body)
    );
    await Task.destroy({
      where: {
        id: req.params.id,
      },
    });

    result.code = 200;
    result.status = "success";
    result.data = "Hapus data berhasil";

    res.json(result);
  } catch (err) {
    futil.logger.debug(
      "\n" + futil.shtm() + "- [ ERROR ] | QUERING " + util.inspect(err)
    );

    result.code = 500;
    result.status = "failed";
    result.data = "Hapus data gagal";

    res.status(500).json(result);
  }
};

/**

Mengunduh file berdasarkan nama file.
@param {Object} req - Objek permintaan, berisi nama file yang akan diunduh.
@param {Object} res - Objek respons yang digunakan untuk mengirimkan hasil operasi ke pengguna.
@returns {void} */ const Download = function (req, res) {
  const fileName = req.params.filename;
  const downloadPath = path.join(__dirname, "../public/uploads/");
  res.download(downloadPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({ message: "Tidak dapat mengunduh file. " + err });
    }
  });
};
module.exports = {
  Create,
  Read,
  ReadTaskByStatus,
  ReadTotalStatusPerUser,
  ReadTaskUser,
  TaskFilter,
  Update,
  Delete,
  Download,
};
