/**
 * Created by apple on 2018/6/13.
 */
var  express=require('express');
var  app=express();
var mysql=require('mysql');
var session = require('express-session');
var bodyparser = require('body-parser');
/**
 * 配置MySql
 */
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '970511',
    database : 'escape',
    port:'3306'
});
connection.connect();
app.use(bodyparser.json()); // 使用bodyparder中间件，
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 3// 设置 session 的有效时间，单位毫秒
    }
}));
app.use(express.static(__dirname));
app.get('/',function (req,res) {
    res.sendFile(__dirname + "/" + "register.html"   );
})


app.get('/login.html',function (req,res) {
    res.render(__dirname + "/" + "login.html" );
})
app.get('/register.html',function (req,res) {
    res.render(__dirname + "/" + "register.html"  );
})

app.get('/register',function (req,res) {
    var  name=req.query.username;
    var  pwd=req.query.password;
    var  user={userName:name,password:pwd};
    req.session.userName = req.query.username;
    connection.query('insert into users set ?',user,function (err,rs) {
        if (err){
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            console.log('ok');
            res.redirect(301, 'http://localhost:8888/chooseCharacter.html?name=' + name);


        }
        //res.sendFile(__dirname + "/" + "chooseCharacter.html");
        //res.send(name);
    })
})

app.get('/male',function (req,res){
    var selectSQL = "update users set gender = 0 where userName = '"+req.session.userName+"'";
    connection.query(selectSQL,function (err,rs) {
        if (err){
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length==0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
            }else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})
app.get('/female',function (req,res){
    console.log(req.session.userName);
    var selectSQL = "update users set gender = 1 where userName = '"+req.session.userName+"'";
    connection.query(selectSQL,function (err,rs) {
        if (err){
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length==0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
            }else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})
app.post('/password',function (req,res){
    var newpwd = req.body.newpassword;
    var selectSQL = "update users set password = '"+newpwd+"' where userName = '"+req.session.userName+"'";
    connection.query(selectSQL,function (err,rs) {
        if (err){
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/register.html?state=fail');
        }
        else {
            if (rs.length==0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/register.html?state=fail');
            }else {
                console.log('OK');
                res.redirect(301, 'http://localhost:8888/hall.html?name=' + req.session.userName);
            }
        }
    })

})
app.post('/login',function (req,res) {
    var name=req.body.username;
    var pwd=req.body.password;
    req.session.userName = req.body.username;
    var selectSQL = "select * from users where userName = '"+name+"' and password = '"+pwd+"'";
    connection.query(selectSQL,function (err,rs) {

        if (err){
            console.log('fail');
            res.redirect(301, 'http://localhost:8888/login.html?state=fail');
        }
        else {
            if (rs.length==0) {
                console.log('fail');
                res.redirect(301, 'http://localhost:8888/login.html?state=fail');
            }else {
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

var server=app.listen(8888,function () {
    console.log("start");
})

