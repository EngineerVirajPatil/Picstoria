const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const Users = sequelize.define('users', {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
});

module.exports = Users;