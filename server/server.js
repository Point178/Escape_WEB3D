const express = require('express');
const app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server)

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
var map = {};
io.sockets.on('connection', function (socket) {
    console.log("new connection");

    socket.on('room', (data) => {
        console.log("a room:");
        var roomId = data.room;
        console.log("roomID:"+roomId);
        socket.join(roomId);
        map[roomId]={
            isKey:true,
            isCandle:true,
            keyUser: null,
            candleUser:null,
            hintUser:null,
            codeUser:null,
            isStart:false,
            isCode:false
        };
    });

    socket.on('join', (data) => {

        var roomid = data.room;
        var username = data.user;
        console.log("a new player");
        socket.join(data.room);
        var m = map[roomid];

        var joindata = {
            user: data.user,
            gender: data.gender,
            position: data.position,
            rotation:data.rotation
        };
        var score = 0;
        io.sockets.in(data.room).emit('connect',joindata);

        var user;
        var user2;
        var user3;
        var number;
        var sql = "select * from room where id = '"+data.room+"'";
        var sql1 = "update room set user1= null, num=num-1 where id = '" + data.room + "'";
        var sql2 = "update room set user2= null, num=num-1 where id = '" + data.room + "'";
        var sql3 = "update room set user3= null, num=num-1 where id = '" + data.room + "'";
        var deleteSQl="delete from room where id = '"+data.room+"'";
        
        con.query(sql,function(err,rs){
            if (err) {
                console.log('err');
            }else{
                number = rs[0].num;
                if(number==3 && m.isStart==false){
                    m.isStart = true;
                    io.sockets.in(data.room).emit('start',m.isStart);
                }
            }
        });


        socket.on('update', (data) => {
            var updatedata = {
                position: data.position,
                rotation: data.rotation,
                username: data.user
            };
            io.sockets.in(roomid).emit('update',updatedata);
        });
       
       
        socket.on('key',(data)=>{
            if(m.isKey == true && m.keyUser == null){
               m.isKey = false;
               m.keyUser = data;
               if(m.keyUser == username) {
                   score = score + 10;
               }
               io.sockets.in(roomid).emit('key',m.keyUser);
            }
        });


        socket.on('candle',(data)=>{
            if(m.isCandle == true && m.candleUser == null){
                m.isCandle = false;
                m.candleUser = data;
                if(m.candleUser == username) {
                    score = score + 10;
                }
               io.sockets.in(roomid).emit('candle',m.candleUser);
            }
        });

        socket.on('code',(data)=>{
            if(m.codeUser == null && m.isCode == false){
                m.codeUser = data;
                m.isCode = true;
                if(m.codeUser == username) {
                    score = score + 10;
                }
            }
            //io.sockets.in(roomid).emit('',data);
       });

        socket.on('chat',(data)=>{
            var chatdata = {
                user: data.user,
                content: data.content
            };
            if(data.content=="compliance will be rewarded"){
                io.sockets.in(roomid).emit('hint',"Code is 1783");
                if(m.hintUser == null){
                    m.hintUser = data.user;
                    if(m.hintUser == username) {
                        score = score + 10;
                    }
                }
            }
            io.sockets.in(roomid).emit('chat',chatdata);
        });

        socket.on('door',(data)=>{
            if(m.isCode == true){
               if(data == m.keyUser){
                  var windata={
                      user:username,
                      score:score
                  };
                io.sockets.in(roomid).emit('win',windata.user+":"+ windata.score);
               }
            }
        });


        socket.on('disconnect', function() {
            con.query(sql, function (err, rs) {
                if (err) {
                    console.log('err');
                } else {
                    user = rs[0].user1;
                    user2 = rs[0].user2;
                    user3 = rs[0].user3;
                    number=rs[0].num;
                    switch (data.user){
                        case user:
                            con.query(sql1, function (err) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                }
                            });
                            break;
                        case user2:
                            con.query(sql2, function (err) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    }
                            });
                            break;
                        case user3:
                            con.query(sql3, function (err) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                }
                            });
                            break;
                    }
                    if (number==1) {
                        con.query(deleteSQl, function (err){
                            if (err) {
                                console.log('err');
                            }
                        });
                    }

                }
            });
            console.log("与服务器断开");
            io.sockets.in(data.room).emit('disconnection',data.user);
            
        });//包括自己
    });


});



