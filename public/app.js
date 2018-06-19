/**
 * Created by apple on 2018/6/13.
 */

var express = require('express');
var app = express();
var http = require('http');


var mysql = require('mysql');
var session = require('express-session');
var bodyparser = require('body-parser');

/**
 * 配置MySql
 */
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '970511',
    database: 'escape',
    port: '3306'
});
connection.connect();
app.use(bodyparser.json()); // 使用bodyparder中间件，
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3// 设置 session 的有效时间，单位毫秒
    }
}));
app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "register.html");
})


app.get('/login.html', function (req, res) {
    res.render(__dirname + "/" + "login.html");
})
app.get('/register.html', function (req, res) {
    res.render(__dirname + "/" + "register.html");
})

app.get('/register', function (req, res) {
    var name = req.query.username;
    var pwd = req.query.password;
    var user = {userName: name, password: pwd};
    req.session.userName = req.query.username;
    connection.query('insert into users set ?', user, function (err, rs) {
        if (err) {
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            console.log('ok');
            res.redirect(301, 'http://localhost:8888/chooseCharacter.html?name=' + name);
        }

    })
})

app.get('/chooseCharacter.html/male', function (req, res) {
    var selectSQL = "update users set gender = 0 where userName = '" + req.session.userName + "'";
    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})
app.get('/chooseCharacter.html/female', function (req, res) {
    console.log(req.session.userName);
    var selectSQL = "update users set gender = 1 where userName = '" + req.session.userName + "'";
    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})

app.get('/json', function (req, res, next) {
    console.log('ajax');
    var selectSQL = "select id,num,status from room";

    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('err');
        }
        var string = JSON.stringify(rs);
        var data = JSON.parse(string);
        var result = {
            data: data
        }
        res.send(result);
    });
});

app.post('/password', function (req, res) {
    var newpwd = req.body.newpassword;
    var selectSQL = "update users set password = '" + newpwd + "' where userName = '" + req.session.userName + "'";
    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})
app.post('/start', function (req, res) {
    var roomid = req.body.roomid;
    req.session.id = req.body.roomid;
    var room = {id: roomid, num: 1, user1: req.session.userName};
    var gsql = "select * from users where userName = '" + req.session.userName + "'";
    var gender;
    connection.query(gsql, function (err, rs) {
        if (err) {
            console.log('fail');
        } else {
            gender=rs[0].gender;
        }
    })
    connection.query('insert into room set ?', room, function (err, rs) {
        if (err) {
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/startroom.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/startroom.html?state=fail');
            } else {
                console.log('OK');
                const io = require('socket.io-client');
                var socket = io('http://127.0.0.1:3000');
                var data = {room: roomid};
                socket.emit('room', data);
                res.redirect(301, 'http://127.0.0.1:8888/game.html?name=' + roomid + '&user=' + req.session.userName + '&gender=' + gender);
            }
        }
    })

})

app.get('/hall.html/add', function (req, res) {
    var url = req.url;
    var argsIndex = url.split("?name=");
    var id = argsIndex[1];
    var number;
    var gender;
    req.session.id = id;
    var sql = "select * from room where id = '" + id + "'";
    var querySQL1 = "select * from room where user1 is null and id ='"+id+"'";
    var querySQL2 = "select * from room where user2 is null and id ='"+id+"'";
    var gsql = "select * from users where userName = '" + req.session.userName + "'";
    connection.query(gsql, function (err, rs) {
        if (err) {
            console.log('fail');
        } else {
            gender=rs[0].gender;
        }
    })
    connection.query(sql, function (err, rs) {
        if (err) {
            console.log('err');
        } else {
            number = rs[0].num;
            var newNumber = number + 1;
            var updateSQL1 = "update room set num = '" + newNumber + "',user1='" + req.session.userName + "' where id = '" + id + "'";
            var updateSQL2 = "update room set num = '" + newNumber + "',user2='" + req.session.userName + "' where id = '" + id + "'";
            var updateSQL3 = "update room set num = '" + newNumber + "',user3='" + req.session.userName + "' where id = '" + id + "'";
            var updateSQL="update room set status=1 where id ='"+id+"'";


            console.log(number);
            if (number < 3) {
                connection.query(querySQL1, function (err, rs1) {
                    if (err)
                        console.log("query1 err");
                    else {
                        if (rs1.length==0) {   //房间里有user1
                            connection.query(querySQL2, function (err, rs2) {
                                if (err) {
                                    console.log('query2 err');
                                } else {
                                    console.log("length:"+rs2.length);
                                    if (rs2.length==0) {      //房间里有user2
                                        connection.query(updateSQL3, function (err, rs){
                                            if (err) {
                                                console.log('update3 err');
                                            } else {
                                                if (newNumber==3) {
                                                    connection.query(updateSQL, function (err, rs2) {
                                                        if (err) {
                                                            console.log('update status err');
                                                        }
                                                    })
                                                }
                                                res.redirect(301, 'http://127.0.0.1:8888/game.html?name=' + id + '&user=' + req.session.userName + '&gender=' + gender);
                                            }
                                        })
                                    }
                                    else {                  //房间里没有user2
                                        connection.query(updateSQL2, function (err, rs){
                                            if (err) {
                                                console.log('update2 err');
                                            } else {
                                                if (newNumber==3) {
                                                    connection.query(updateSQL, function (err, rs2) {
                                                        if (err) {
                                                            console.log('update status err');
                                                        }
                                                    })
                                                }
                                                res.redirect(301, 'http://127.0.0.1:8888/game.html?name=' + id + '&user=' + req.session.userName + '&gender=' + gender);
                                            }
                                        })
                                    }
                                }
                            })
                        } else {             //房间里没有user1
                            connection.query(updateSQL1, function (err, rs) {
                                if (err) {
                                    console.log('update1 err');
                                } else {
                                    if (newNumber==3) {
                                        connection.query(updateSQL, function (err, rs2) {
                                            if (err) {
                                                console.log('update status err');
                                            }
                                        })
                                    }
                                    res.redirect(301, 'http://127.0.0.1:8888/game.html?name=' + id + '&user=' + req.session.userName + '&gender=' + gender);
                                }
                            })
                        }
                    }
                })

            }else {
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }

        }
    })
})


app.post('/login', function (req, res) {
    var name = req.body.username;
    var pwd = req.body.password;
    req.session.userName = req.body.username;
    var selectSQL = "select * from users where userName = '" + name + "' and password = '" + pwd + "'";
    connection.query(selectSQL, function (err, rs) {

        if (err) {
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/login.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/login.html?state=fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + name);
            }
        }

    })
})
app.get('/logout', function (req, res) {
    delete req.session.id;
    delete req.session.userName; // 删除session
    res.redirect(301, 'http://localhost:8888/login.html');
});

var server = http.createServer(app).listen(8888, function () {
    console.log("start");
})
