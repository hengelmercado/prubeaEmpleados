const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { message } = require('../dictionary/dictionary');
const { obtenerDepartamentos, crearDepartamento, actualizarDepartamento, obtenerDepartamento, borrarDepartamento } = require('../controllers/departamento');

const router = Router();

router.get('/', obtenerDepartamentos);

router.get('/:id', [
    check('id', 'No es un id valido').not().isEmpty(),
    check('id', 'No es un id valido').isInt(),
    validarCampos,
], obtenerDepartamento);

router.post('/', [
    check('nombre', 'El nombre no puede ser nulo').not().isEmpty(),
    validarCampos,
], crearDepartamento);

router.put('/:id', [
    check('id', 'No es un id valido').not().isEmpty(),
    validarCampos,
], actualizarDepartamento);

router.delete('/:id', [
    check('id', 'No agrego el id').not().isEmpty(),
    validarCampos,
], borrarDepartamento);


module.exports = router;