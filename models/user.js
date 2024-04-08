module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    // Atribut model di sini
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    level: {
      type: DataTypes.STRING,
    },
    ph_number: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
  }, {
    // Opsi model lainnya di sini
    freezeTableName: true,
  });

  User.associate = function(models) {
    // Asosiasi User -> Task
    User.hasMany(models.Task, {
      foreignKey: 'userid',
      as: 'tasks'
    });

    // Asosiasi User <-> Vehicle melalui VehicleUser
    User.belongsToMany(models.Vehicle, {
      through: models.VehicleUser,
      foreignKey: 'userid',
      otherKey: 'vehicleid',
      as: 'vehicles'
    });
  };

  return User;
};
