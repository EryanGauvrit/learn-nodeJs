const User = require('./user');
const Task = require('./task');
const sequelizeInstance = require ('../utils/sequelize.js');

User.hasMany(Task);
Task.belongsTo(User);

sequelizeInstance.sync();

module.exports = {
    User,
    Task
};