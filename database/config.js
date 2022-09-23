const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(
    'prueba',
    'postgres',
    'abc56789',
{
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = {
    sequelize
}