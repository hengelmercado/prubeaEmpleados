const {DataTypes} = require('sequelize');
const {sequelize} = require('../database/config');
const Empleados = require('./empleado');

const Departamento = sequelize.define('departamento', {
    codigo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    presupuesto: {
        type:DataTypes.DOUBLE
    }
});

Departamento.hasMany(Empleados,{
    foreignKey: 'codigo_departamento',
    sourceKey: 'codigo'
});

Empleados.belongsTo(Departamento,{
    foreignKey: 'codigo_departamento',
    targetKey: 'codigo'
})

module.exports = Departamento;


