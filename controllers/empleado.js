
const { response } = require("express");
const Departamento = require("../models/departamento");
const Empleados = require('../models/empleado');

const obtenerEmpleados = async(req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { habilitado: true }

    const [total, datos] = await Promise.all([
       Empleados.count(query),
       Empleados.findAll(query)
    ]);

    res.json({
        total,
        datos
    });
}

const obtenerEmpleado = async(req, res = response) => {
    const { id } = req.params;

    const empleado = await Empleados.findByPk(id);
    if(!empleado){
        return res.status(404).json({
            ok: false,
            msg: `Empleado con id: ${id} no existe`
        })
    }

    res.json({
        ok: true,
        empleado
    });
}

const crearEmpleado = async(req, res = response) => {
    let datos = req.body;
    datos.nombre = datos.nombre.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const datoDB = await Empleados.findOne({where:{nombre: datos.nombre}});
    if(datoDB) {
        return res.status(400).json({
            msg: `Empleado ya existe - ${datoDB.nombre}`
        });
    }
    const empleado = await Empleados.create(datos);

    res.json({
        ok: true,
        empleado
    });
}

const actualizarEmpleado = async(req, res = response) => {
    const {id} = req.params;
    const { _id, ...datos } = req.body;
    if(datos.nombre){
        datos.nombre = datos.nombre.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }

    const datoDB = await Empleados.findOne({where:{nombre: datos.nombre}});
    if(datoDB) {
        return res.status(400).json({
            msg: `Nombre ya existe - ${datoDB.nombre}`
        });
    }
    const empleado = await Empleados.update(datos, {where: {codigo: id}});

    res.json({
        ok: true,
        empleado
    });
}

const borrarEmpleado = async(req, res = response) => {
    const {id} = req.params;

    const empleadoDB = await Empleados.findByPk(id);
    if(!empleadoDB){
        return res.status(404).json({
            ok: false,
            msg: `No existe el empleado con id: ${id}`
        });
    }
    
    const empleado = await Empleados.destroy({where:{codigo: id}});

    res.json({
        ok: true,
        empleado
    });
}


module.exports = {
    actualizarEmpleado,
    borrarEmpleado,
    crearEmpleado,
    obtenerEmpleado,
    obtenerEmpleados,
}