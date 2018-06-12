exports.reg = function (action,name,pass){
    var mysql  = require('mysql');

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        port: '8888',
        database: 'escape',
    });

    connection.connect();

    var modSql = "insert into users (userName,password) values ('"+name+"','"+pass+"')";

    connection.query(modSql,function (err, result) {
        if(err){
            console.log('[UPDATE ERROR] - ',err.message);
            return;
        }
    });
    connection.end();
}