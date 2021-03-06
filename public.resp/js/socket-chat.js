var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre o sala son necesarios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // Enviar información
    socket.emit('entrarChat', usuario, function(resp) {
        console.log('respuesta server: ', resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Cuando un usuario entra o sale del chat
socket.on('listaPersona', function(personas) {

    console.log('Personas en el Chat:', personas);

});

// Cuando un usuario entra o sale del chat
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje privado:', mensaje);

});