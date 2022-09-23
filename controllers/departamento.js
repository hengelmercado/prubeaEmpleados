
const { response } = require('express');
const { where } = require('sequelize');
const { capitalizar } = require('../helpers/capitalizar');
const Departamento = require('../models/departamento');
const Empleados = require('../models/empleado');


const obtenerDepartamentos = async(req, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = { habilitado: true };

    const [total, datos] = await Promise.all([
        Departamento.count(query),
        Departamento.findAll(query)
    ]);

    res.json({
        ok: true,
        total,
        datos
    });
}

const obtenerDepartamento = async(req, res = response) => {

    const { id } = req.params;
    console.log(id);

    const datos = await Departamento.findOne({codigo: id});

    res.json({
        ok: true,
        datos
    });
}

const crearDepartamento = async(req, res = response) => {

    let { _id, estado, ...datos } = req.body;
    
    datos.nombre = capitalizar(datos.nombre)

    const departamentoDB = await Departamento.findOne({where: {nombre: datos.nombre}});
    if(departamentoDB){
        return res.status(400).json({
            msg: `nombre ya existe- ${departamentoDB.nombre}`
        });
    }

    const departamento = await Departamento.create(datos);

    //await departamento.save();

    res.json({
        ok: true,
        departamento
    });
}

const actualizarDepartamento = async(req, res = response) => {

    const { id } = req.params;
    const { _id, habilitado, ...datos } = req.body;

    if(datos.nombre){
        datos.nombre = datos.nombre.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    }
    const departamentoDB = await Departamento.findOne({where:{nombre: datos.nombre}});
    console.log(departamentoDB);
    if(departamentoDB){
        return res.status(400).json({
            msg: `Ya existe - ${departamentoDB.nombre}`
        });
    }

    const departamento = await Departamento.update(datos, {where: {codigo: id}});

    res.json({ok: true, datos});
}

const borrarDepartamento = async(req, res = response) => {

    const { id } = req.params;

    const departamentoDB = await Departamento.findByPk(id);
    if(!departamentoDB){
        return res.status(404).json({
            ok: false,
            msg: `No existe departamento con el id: ${id}`
        });
    }else{
        const empleados = await Empleados.findOne({where: {codigo_departamento: departamentoDB.codigo}});
        if(empleados){
            return res.status(400).json({
                ok: false,
                msg: `Tiene empleados asociados a este departamento`
            });
        }
    }

    //const departamento = await Departamento.destroy({where: {codigo: id}});

    res.json({
        ok: true,
        departamento: departamentoDB
    });
}

module.exports = {
    obtenerDepartamentos,
    obtenerDepartamento,
    crearDepartamento,
    actualizarDepartamento,
    borrarDepartamento
}
