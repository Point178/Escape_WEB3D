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
var gameuser = {};
//io.sockets.on('connection', function (socket) {
  io.on('connection', function(socket) {
      console.log("A user connected!");

      socket.on('room', function(data){
          console.log("a room:");
          var roomId = data.room;
          console.log("roomID:" + roomId);
          //socket.join(roomId);
          map[roomId] = {
              isKey: true,
              isCandle: true,
              keyUser: null,
              candleUser: null,
              hintUser: null,
              codeUser: null,
              isStart: false,
              isCode: false
          };
          gameuser[roomId] = {};
      });

      socket.on('join', function(data){
        console.log(data);
        var roomid = data.room;
        var username = data.user;
        socket.join(data.room);
        //map[roomid];
        //var g = gameuser[roomid];
        var joindata = {
            user: data.user,
            gender: data.gender,
            position: data.position,
            rotation:data.rotation
        };
        gameuser[roomid][username] = joindata;
        var score = 0;
        socket.broadcast.to(data.room).emit('connection', joindata);
        for(var k in g){
            if(k !== username){
                socket.emit('connection', gameuser[roomid][k]);
            }
        }


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
                if(number===3 && map[roomid].isStart===false){
                    map[roomid].isStart = true;
                    socket.broadcast.to(data.room).emit('start',map[roomid].isStart);
                }
            }
        });


        socket.on('update', (data) => {
            var updatedata = {
                position: data.position,
                rotation: data.rotation,
                username: data.user
            };
            if(map[roomid].isStart === false){
                gameuser[roomid][data.user].position = data.position;
                gameuser[roomid][data.user].rotation = data.rotation;
            }
            socket.broadcast.to(roomid).emit('update',updatedata);
        });
       
       
        socket.on('key',(data)=>{
            if(map[roomid].isKey === true && map[roomid].keyUser == null){
                map[roomid].isKey = false;
                map[roomid].keyUser = data;
               if(map[roomid].keyUser === username) {
                   score = score + 10;
               }
               socket.broadcast.to(roomid).emit('key',map[roomid].keyUser);
            }
        });


        socket.on('candle',(data)=>{
            if(map[roomid].isCandle === true && map[roomid].candleUser == null){
                map[roomid].isCandle = false;
                map[roomid].candleUser = data;
                if(map[roomid].candleUser === username) {
                    score = score + 10;
                }
               socket.broadcast.to(roomid).emit('candle',map[roomid].candleUser);
            }
        });

        socket.on('code',(data)=>{
            if(map[roomid].codeUser == null && map[roomid].isCode === false){
                map[roomid].codeUser = data;
                map[roomid].isCode = true;
                if(map[roomid].codeUser === username) {
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
            if(data.content==="compliance will be rewarded"){
                io.sockets.in(roomid).emit('hint',"Code is 1783");
                if(map[roomid].hintUser == null){
                    map[roomid].hintUser = data.user;
                    if(map[roomid].hintUser === username) {
                        score = score + 10;
                    }
                }
            }
            socket.broadcast.to(roomid).emit('chat',chatdata);
        });

        socket.on('door',(data)=>{
            if(map[roomid].isCode === true){
               if(data === map[roomid].keyUser){
                  var windata={
                      user:username,
                      score:score
                  };
                socket.broadcast.to(roomid).emit('win',windata.user+":"+ windata.score);
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
                                    delete gameuser[roomid][data.user];
                                }
                            });
                            break;
                        case user2:
                            con.query(sql2, function (err) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    delete gameuser[roomid][data.user];
                                    }
                            });
                            break;
                        case user3:
                            con.query(sql3, function (err) {
                                if (err) {
                                    console.log('err');
                                }else{
                                    socket.leave(data.room);
                                    delete gameuser[roomid][data.user];
                                }
                            });
                            break;
                    }
                    if (number===1) {
                        con.query(deleteSQl, function (err){
                            if (err) {
                                console.log('err');
                                delete gameuser[roomid];
                                delete map[roomid];
                            }
                        });
                    }

                }
            });
            console.log("与服务器断开");
            socket.broadcast.to(data.room).emit('disconnection',data.user);
            
        });//包括自己
    });


});



