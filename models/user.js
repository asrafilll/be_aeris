module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
    // Define attributes
    username: {
      type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
      },
    email:{
      type: DataTypes.STRING
    },
    level: {
      type: DataTypes.STRING
    },
    ph_number:{
      type: DataTypes.STRING
    },
    area:{
      type:DataTypes.STRING
    },
    createdBy:{
      type:DataTypes.INTEGER
    }
  },{
    // Freeze Table Name
    freezeTableName: true
  });

  // User.associate = function(models) {
  //   User.belongsTo(models.Task,{
  //       foreignKey: 'userid',
  //       as:'users'
  //   })
  // }
  return User;
}