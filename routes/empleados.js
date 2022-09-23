const { Router } = require('express');
const { obtenerEmpleado, obtenerEmpleados, actualizarEmpleado, crearEmpleado, borrarEmpleado } = require('../controllers/empleado');
const { message } = require('../dictionary/dictionary');

const router = Router();

router.get('/', obtenerEmpleados);

router.get('/:id', [
], obtenerEmpleado);

router.post('/', [
], crearEmpleado);

router.put('/:id', [
], actualizarEmpleado);

router.delete('/:id', [
], borrarEmpleado);


module.exports = router;