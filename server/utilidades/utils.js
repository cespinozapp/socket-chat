const crearMensajeAAA = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };
};

module.export = {
    crearMensajeAAA
}