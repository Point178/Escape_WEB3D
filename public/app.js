/**
 * Created by apple on 2018/6/13.
 */
var express = require('express');
var app = express();
var http = require('http')

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
/*app.get('/game.html',function (req,res) {
    res.sendFile(__dirname + "/" + "game.html" );
})*/
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
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
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
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})

app.get('/json',function(req,res,next){
    console.log('ajax');
    var selectSQL = "select id,number,status from room";

    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('err');
        }
        //console.log(rs);
        var string=JSON.stringify(rs);
        var data = JSON.parse(string);
        var result = {
            data:data
        }
        //console.log(result);
        res.send(result);
    });
});

app.post('/password', function (req, res) {
    var newpwd = req.body.newpassword;
    var selectSQL = "update users set password = '" + newpwd + "' where userName = '" + req.session.userName + "'";
    connection.query(selectSQL, function (err, rs) {
        if (err) {
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
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
    var room = {id: roomid, number: 1, user1: req.session.userName};
    connection.query('insert into room set ?', room, function (err, rs) {
        if (err) {
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length == 0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
            } else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/game.html?name=' + roomid);
            }
        }
    })

})

app.get('/hall.html/add', function (req, res) {
    var url = req.url;
    console.log('djiaf');
    var argsIndex = url.split("?name=");
    var id = argsIndex[1];
    var number;
    var sql = "select * from room where id = '"+id+"'";
    var selectSQL2 = "update room set number = 2,user2='" + req.session.userName + "' where id = '" + id + "'";
    var selectSQL3 = "update room set number = 3,user3='" + req.session.userName + "',status=1 where id = '" + id + "'";
    connection.query(sql, function (err, rs) {
        if (err) {
            console.log('err');
        }else{
            number = rs[0].number;
            console.log(number);
            switch(number){
                case 1:
                    connection.query(selectSQL2, function (err, rs) {
                        if (err) {
                            console.log('err');
                        }else{
                            console.log('hello8');
                            res.redirect(301, 'http://localhost:8888/game.html?name=' + id);
                        }
                    })
                    break;
                case 2:
                    connection.query(selectSQL3, function (err, rs) {
                        if (err) {
                            console.log('err');
                        }else{
                            console.log('hello');
                            res.redirect(301, 'http://localhost:8888/game.html?name=' + id);
                        }
                    })
                    break;
                default:
                    console.log('hello9');
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
        //res.sendFile(__dirname + "/" + "chooseCharacter.html" );
    })
})
app.get('/logout', function (req, res) {
    delete req.session.userName; // 删除session
    res.redirect(301, 'http://localhost:8888/login.html');
});

var server = http.createServer(app).listen(8888, function () {
    console.log("start");
})
