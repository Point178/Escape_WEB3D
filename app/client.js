/**
 * Created by 昕点陈 on 2018/6/9.
 */
const io = require('socket.io-client');

module.exports = function() {
    const socket = io('http://127.0.0.1:3000');

    var count = document.getElementById('root');
    socket.on('users', function (data) {
        console.log(data.number);
        count.innerText = data.number+"";
    });
    
};