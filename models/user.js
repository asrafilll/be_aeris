module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      // Define attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      level: {
        type: DataTypes.STRING,
      },
      ph_number: {
        type: DataTypes.STRING(25),
      },
      area: {
        type: DataTypes.STRING(25),
      },
      email: {
        type: DataTypes.STRING,
      },
      createdBy: {
        type: DataTypes.INTEGER,
      },
      parent_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      features: {
        type: DataTypes.STRING,
      },
      alerts: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      npm: {
        type: DataTypes.STRING,
      },
      jk: {
        type: DataTypes.STRING,
      },
      tgl_lahir: {
        type: DataTypes.DATEONLY,
      },
      mulai_tugas: {
        type: DataTypes.INTEGER,
      },
      satuan: {
        type: DataTypes.STRING,
      },
      unit: {
        type: DataTypes.STRING,
      },
      vehicle_tag: {
        type: DataTypes.TEXT,
      },
    },
    {
      // Freeze Table Name
      freezeTableName: true,
    }
  );

  // User.associate = function(models) {
  //   User.belongsTo(models.Task,{
  //       foreignKey: 'userid',
  //       as:'users'
  //   })
  // }
  return User;
};
