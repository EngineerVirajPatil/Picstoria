const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const PhotoImage = sequelize.define('PhotoImages', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  altDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.TEXT, 
    allowNull: false,
    get() {
      const tags = this.getDataValue('tags');
      return tags ? JSON.parse(tags) : []; 
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value)); 
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = PhotoImage;
