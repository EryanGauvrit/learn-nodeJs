const { Sequelize } = require('sequelize');

sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
})

// sequelizeInstance.sync().then(() => {
//     console.log('Database connexion success');
// })


module.exports = sequelizeInstance;