const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const User = sequelize.define('user', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = User;