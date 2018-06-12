/**
 * Created by 昕点陈 on 2018/6/9.
 */
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs');

app.listen(8888);

function handler (req, res) {
    res.writeHead(200,{"Content-Type":'text/plain','charset':'utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS'});
    //解析URL参数
    var params = url.parse(req.url,true).query;
    mysql.reg(params.action,params.username,params.password);
    res.write("注册成功");
    res.end();

    /*fs.readFile(__dirname + '/game.html',function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading game.html');
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });*/
}

var count = 0;
io.sockets.on('connection', function (socket) {
    count++;
    socket.emit('users', {number:count});
    socket.broadcast.emit('users', { number: count });
    socket.on('disconnect',function(){
        count--;
        console.log('User disconnected');
        socket.broadcast.emit('users',{number:count});
    });
});