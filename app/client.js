/**
 * Created by 昕点陈 on 2018/6/9.
 */
module.exports = function() {
    var url = decodeURI(window.location.href);

    var argsIndex = url.split("?name=");
    var arg = argsIndex[1];
    var argsIndex = arg.split("&user=");
    var roomName=argsIndex[0];
    var userName=argsIndex[1];
    const io = require('socket.io-client');
    var socket = io('http://127.0.0.1:3000');
    var joinData={
        room:roomName,
        user:userName
    };
    socket.emit('join',joinData);
    //socket.emit(roomName);
    var data={msg:"this is a message."};
    socket.emit('sendMsg', data);

    socket.on('system',(data)=>{
        alert(data);
    })
    //var count = document.getElementById('root');
    socket.on('receiveMsg', (data) => {

    })



};