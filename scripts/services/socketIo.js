app.service('SocketIo', function() {
    var socketIo = {};

    socketIo.socket = io.connect('http://192.168.0.14:8080/');

    return socketIo;

})