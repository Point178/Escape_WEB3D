const express = require('express');
const app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');


var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'escape',
    port: '3306'
});
con.connect();
server.listen(3000);
io.sockets.on('connection', function (socket) {
    console.log("new connection");
    socket.on('room', (data) => {
        console.log("a room:");
        var roomId = data.room;
        console.log("roomID:"+roomId);
        socket.join(roomId);
    });
    socket.on('join', (data) => {
        console.log("a new player");
        socket.join(data.room);
        io.sockets.in(data.room).emit('system',data.user+'加入了房间');
        var user;
        var user2;
        var user3;
        var sql = "select * from room where id = '"+data.room+"'";
        var sql1 = "delete from room where id='"+data.room+"'";
        var sql2 = "update room set user2= null, number=number-1 where id = '" + data.room + "'";
        var sql3 = "update room set user3= null, number=number-1 where id = '" + data.room + "'";

        socket.on('disconnect', function() {
            con.query(sql, function (err, rs) {
                if (err) {
                    console.log('err');
                } else {
                    user = rs[0].user1;
                    user2 = rs[0].user2;
                    user3 = rs[0].user3;
                    switch (data.user){
                        case user:
                            con.query(sql1, function (err, rs) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    //res.redirect(301, 'http://localhost:8888/login.html');
                                }
                            })
                            break;
                        case user2:
                            con.query(sql2, function (err, rs) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    //res.redirect(301, 'http://localhost:8888/login.html');
                                    }
                            })
                            break;
                        case user3:
                            con.query(sql3, function (err, rs) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    //res.redirect(301, 'http://localhost:8888/login.html');
                                }
                            })
                            break;
                    }
                }
            })
            console.log("与服务器断开");
            io.sockets.in(data.room).emit('system',data.user+'离开了房间');
            
        });//包括自己
    });

});



