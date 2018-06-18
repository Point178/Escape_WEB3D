const express = require('express');
const app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');


server.listen(3000);
io.sockets.on('connection', function (socket) {
    console.log("new connection");
    socket.on('room', (data) => {
        console.log("a room:");
        var roomId=data.room;
        console.log("roomID:"+roomId);
        socket.join(roomId);
    });
    socket.on('join', (data) => {
        console.log("a new player");
        socket.join(data.room);
        socketio.sockets.in(data.room).emit('system','hello,'+data.name+'加入了房间');//包括自己
    });
});


