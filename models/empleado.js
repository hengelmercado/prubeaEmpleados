const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/config');

const Empleados = sequelize.define('empleado', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_2: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Empleados;


