const { validationResult } = require("express-validator")

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({
            ok: false,
            errors
        });
    }

    next();
}

module.exports = {
    validarCampos
}