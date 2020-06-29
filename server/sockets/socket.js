const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');

const usuarios = new Usuarios();

const crearMensaje = (nombre, mensaje) => {

    return {
        nombre,
        mensaje,
        fecha: new Date().getTime()
    };
};

io.on('connection', (client) => {

    console.log('Usuario conectado');

    // Escuchar el cliente
    client.on('entrarChat', (data, callback) => {

        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        callback(usuarios.getPersonasPorSala(data.sala));

    });

    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
    });


    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje)
        console.log(mensaje);
    });

    client.on('disconnect', () => {

        let usuarioBorrado = usuarios.borrarPersona(client.id);

        client.broadcast.to(usuarioBorrado.sala).emit('crearMensaje', crearMensaje('Administrador', `${ usuarioBorrado.nombre } abandono el chat`));
        client.broadcast.to(usuarioBorrado.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuarioBorrado.sala));

        console.log('Usuario desconectado ' + usuarioBorrado.nombre);
        console.log(crearMensaje('test', 'mensaje test'));

    });

});