'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: 'Must be a valid email'}
      }
    }, 
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};