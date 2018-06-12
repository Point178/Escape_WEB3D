/**
 * Created by apple on 2018/6/13.
 */
var  express=require('express');
var  app=express();
var mysql=require('mysql');

/**
 * 配置MySql
 */
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'escape',
    port:'3306'
});
connection.connect();

app.get('/',function (req,res) {
    res.sendfile(__dirname + "/" + "register.html" );
})


app.get('/login.html',function (req,res) {
    res.sendfile(__dirname + "/" + "login.html" );
})
app.get('/register.html',function (req,res) {
    res.sendfile(__dirname + "/" + "register.html" );
})

app.get('/register',function (req,res) {
    var  name=req.query.username;
    var  pwd=req.query.password;
    var  user={userName:name,password:pwd};
    connection.query('insert into users set ?',user,function (err,rs) {
        if (err) throw  err;
        console.log('ok');
        res.sendfile(__dirname + "/" + "hall.html" );
    })
})

app.post('/login',function (req,res) {
    var name=req.query.username;
    var pwd=req.query.password;

    var selectSQL = "select * from users where userName = '"+name+"' and password = '"+pwd+"'";
    connection.query(selectSQL,function (err,rs) {
        if (err) throw err;
        console.log(rs);
        console.log('OK');
        res.sendfile(__dirname + "/" + "hall.html" );
    })
})

var server=app.listen(8888,function () {
    console.log("start");
})

