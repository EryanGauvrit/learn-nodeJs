const { DataTypes } = require('sequelize');
const sequelizeInstance = require ('../utils/sequelize.js');
const bcrypt = require('bcrypt');

const User = sequelizeInstance.define(
      'user',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        display_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      }
    );
    
  User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND || ""));
    user.password = hash;
  })
  User.checkPassword = async (password, originel) => {
      return await bcrypt.compare(password, originel)
  }
module.exports = User;