const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const searchHistories = sequelize.define('searchHistories', {
  query: DataTypes.STRING,
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = searchHistories;