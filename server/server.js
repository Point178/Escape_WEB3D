const express = require('express');
const app = express();

var server = require('http').createServer(app),
    io = require('socket.io').listen(server)

/*var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'escape',
    port: '3306'
});
con.connect();*/
var neo4j = require('node-neo4j');
db = new neo4j('http://neo4j:123456@localhost:7474');

server.listen(3000);
var map = {};
var gameuser = {};
//io.sockets.on('connection', function (socket) {
io.on('connection', function (socket) {
    console.log("A user connected!");

    socket.on('room', function (data) {
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

    socket.on('join', function (data) {
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
            rotation: data.rotation
        };
        gameuser[roomid][username] = joindata;
        var score = 0;
        socket.broadcast.to(data.room).emit('connection', joindata);
        for (var k in gameuser[roomid]) {
            if (k !== username) {
                socket.emit('connection', gameuser[roomid][k]);
            }
        }


        var user;
        var user2;
        var user3;
        var number;
       //var sql = "select * from room where id = '" + data.room + "'";
        /*var sql1 = "update room set user1= null, num=num-1 where id = '" + data.room + "'";
        var sql2 = "update room set user2= null, num=num-1 where id = '" + data.room + "'";
        var sql3 = "update room set user3= null, num=num-1 where id = '" + data.room + "'";
        var deleteSQl = "delete from room where id = '" + data.room + "'";*/

        db.cypherQuery(
            'match(n:Room) where n.id={id} return n.num',
            {
                id:data.room
            },
            function (err, rs) {
                if (err) {
                    console.log("err");
                } else {
                    number = rs.data[0];
                    if(number==3 && map[roomid].isStart===false){
                        map[roomid].isStart = true;
                        io.to(data.room).emit('start',map[roomid].isStart);
                        //socket.broadcast.to(data.room).emit('start',map[roomid].isStart);
                    }
                }
            }
        );
        /*con.query(sql,function(err,rs){
            if (err) {
                console.log('err');
            }else{
                number = rs[0].num;
                if(number===3 && map[roomid].isStart===false){
                    map[roomid].isStart = true;
                    socket.broadcast.to(data.room).emit('start',map[roomid].isStart);
                }
            }
        });*/


        socket.on('update', (data) => {
            var updatedata = {
                position: data.position,
                rotation: data.rotation,
                username: username
            };
            if (map[roomid].isStart === false) {
                gameuser[roomid][username].position = data.position;
                gameuser[roomid][username].rotation = data.rotation;
            }
            socket.broadcast.to(roomid).emit('update', updatedata);
        });


        socket.on('key', (data) => {
            if (map[roomid].isKey === true && map[roomid].keyUser == null) {
                map[roomid].isKey = false;
                map[roomid].keyUser = data;
                console.log("key:"+map[roomid].keyUser);
                if (map[roomid].keyUser === username) {
                    score = score + 10;
                }
                io.to(roomid).emit('key', map[roomid].keyUser);
            }
        });


        socket.on('candle', (data) => {
            if (map[roomid].isCandle === true && map[roomid].candleUser == null) {
                map[roomid].isCandle = false;
                map[roomid].candleUser = data;
                if (map[roomid].candleUser === username) {
                    score = score + 10;
                }
                io.to(roomid).emit('candle', map[roomid].candleUser);
            }
        });

        socket.on('code', (data) => {
            if (map[roomid].codeUser == null && map[roomid].isCode === false) {
                map[roomid].codeUser = data;
                map[roomid].isCode = true;
                if (map[roomid].codeUser === username) {
                    score = score + 10;
                }
                io.to(roomid).emit('code', map[roomid].codeUser);
           }

        });

        socket.on('chat', (data) => {
            var chatdata = {
                user:username,
                content:data
            };
            if (data === "compliance will be rewarded" && map[roomid].isStart === true) {
                io.to(roomid).emit('hint', "Code is 1783");
                if (map[roomid].hintUser == null) {
                    map[roomid].hintUser = username;
                    score = score + 10;
                }
            }
            console.log('receive chat message:'+ data);
            socket.broadcast.to(roomid).emit('chat', chatdata);
        });

        socket.on('door', (data) => {
            if (map[roomid].isCode === true) {
                if (data === map[roomid].keyUser) {
                    var windata = {
                        user: username,
                        score: score
                    };
                    io.to(roomid).emit('win', windata.user + ":" + windata.score);
                }
            }
        });


        socket.on('disconnect', function () {
            db.cypherQuery(
                'match(n:Room) where n.id={id} return n.user1,n.user2,n.user3,n.num',
                {
                    id:roomid
                },
                function (err, rs) {
                    if (err) {
                        console.log("err");
                    } else {
                        var str=rs.data[0];
                        console.log("disconnect str:"+str);
                        var strs=str.toString().split(',');
                        user=strs[0];
                        user2=strs[1];
                        user3=strs[2];
                        number=parseInt(strs[3]);
                        var newNum=number-1;
                        //console.log('user:'+strs[0]);
                        //console.log('user2'+strs[1]);
                        //console.log('user3'+strs[2]);
                        //console.log('number'+strs[3]);

                        switch (data.user) {
                            case user:
                                db.cypherQuery(
                                    'match(room:Room) where room.id={id} set room.user1=null,room.num={num}',
                                    {
                                        id:roomid,
                                        num:newNum
                                    },
                                    function (err1) {
                                        if (err1) {
                                            console.log("err1");
                                            console.log(err1);

                                        }
                                        else {
                                            socket.leave(data.room);
                                            if (gameuser[roomid]!=null)
                                                delete gameuser[roomid][data.user];
                                        }
                                    }
                                );
                                break;
                            case user2:
                                db.cypherQuery(
                                    'match(room:Room) where room.id={id} set room.user2=null,room.num={num}',
                                    {
                                        id:roomid,
                                        num:newNum
                                    },
                                    function (err2) {
                                        if (err2) {
                                            console.log("err2");
                                        }
                                        else {
                                            socket.leave(data.room);
                                            if (gameuser[roomid]!=null)
                                                delete gameuser[roomid][data.user];
                                        }
                                    }
                                );
                                break;
                            case user3:
                                db.cypherQuery(
                                    'match(room:Room) where room.id={id} set room.user3=null,room.num={num}',
                                    {
                                        id:roomid,
                                        num:newNum

                                    },
                                    function (err3) {
                                        if (err3) {
                                            console.log("err3");
                                        }
                                        else {
                                            socket.leave(data.room);
                                            if (gameuser[roomid]!=null)
                                                delete gameuser[roomid][data.user];
                                        }
                                    }
                                );
                                break;
                        }
                        if (number === 1||number==="1") {
                            db.cypherQuery(
                                'match(room:Room) where room.id={id} delete room',
                                {
                                    id:roomid,
                                },
                                function (err) {
                                    if (err) {
                                        console.log('delete err');

                                    }
                                    else {
                                        delete gameuser[roomid];
                                        delete map[roomid];
                                    }
                                }
                            );
                        }

                    }
                }
            );
            /*con.query(sql, function (err, rs) {
                if (err) {
                    console.log('err');
                } else {
                    user = rs[0].user1;
                    user2 = rs[0].user2;
                    user3 = rs[0].user3;
                    number = rs[0].num;
                    switch (data.user) {
                        case user:
                            con.query(sql1, function (err) {
                                if (err) {
                                    console.log('err');
                                } else {
                                    socket.leave(data.room);
                                    delete gameuser[roomid][data.user];
                                }
                            });
                            break;
                        case user2:
                            con.query(sql2, function (err) {
                                if (err) {
                                    console.log('err');
                                } else {
                                    socket.leave(data.room);
                                    delete gameuser[roomid][data.user];
                                }
                            });
                            break;
                        case user3:
                            con.query(sql3, function (err) {
                                if (err) {
                                    console.log('err');
                                } else {
                                    socket.leave(data.room);
                                    delete gameuser[roomid][data.user];
                                }
                            });
                            break;
                    }
                    if (number === 1) {
                        con.query(deleteSQl, function (err) {
                            if (err) {
                                console.log('err');
                                delete gameuser[roomid];
                                delete map[roomid];
                            }
                        });
                    }

                }
            });*/
            console.log("与服务器断开");
            socket.broadcast.to(data.room).emit('disconnection', data.user);

        });//包括自己
    });


});



