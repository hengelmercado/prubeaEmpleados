

const capitalizar = (nombre = '') => {

    return nombre.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}


module.exports = {
    capitalizar
}