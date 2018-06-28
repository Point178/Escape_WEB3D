/**
 * Created by 昕点陈 on 2018/6/9.
 */
module.exports = function () {
    let isStart = false;
    let User = require("./user");
    let Basement = require("./room/basement");
    let user, scene, renderer, camera, basement;
    let container = document.getElementById('world');
    let instructions = document.getElementById('instructions');
    let objects = [];
    let controlsEnabled = false;
    let pitchObject, yawObject;
    let pickObject = []; // 0-book; 1-key; 2-lock; 3-candle, 4-basement_door;

    var url = decodeURI(window.location.href);
    var argsIndex = url.split("?name=");
    var arg = argsIndex[1];
    argsIndex = arg.split("&user=");
    var roomName = argsIndex[0];
    arg = argsIndex[1];
    argsIndex = arg.split("&gender=");
    var userName = argsIndex[0];
    var gender = argsIndex[1];
    const io = require('socket.io-client');
    var socket = io('http://127.0.0.1:3000/');

    let players = [];
    let isKey = false;
    let isCandle = false;
    let code_pass = false;

    let isFloatDisplay;
    let isChatDisplay;
    let t;

    function initScene() {
        scene = new THREE.Scene();
    }

    function initRender() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        //告诉渲染器需要阴影效果
        container.appendChild(renderer.domElement);
    }

    function initCamera() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
        pitchObject = new THREE.Object3D();
        pitchObject.add(camera);

        yawObject = new THREE.Object3D();
        yawObject.add(pitchObject);
        yawObject.rotation.y = Math.PI;
        yawObject.position.set(0, 200, 280);
        scene.add(yawObject);
    }

    document.body.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 38: // up arrow
            case 87: // W
                user.speed = 3;
                user.walk();
                break;

            case 37: // left arrow
            case 65: // A
                user.flag = 1;
                user.speed = 3;
                user.walk();
                break;

            case 83: // S
            case 40: // down arrow
                user.speed = -3;
                user.walk();
                break;

            case 68: // D
            case 39: // right arrow
                user.flag = -1;
                user.speed = 3;
                user.walk();
                break;

            case 9: // tab
                if(isChatDisplay){
                    document.getElementById("chat").style.display = "none";
                    isChatDisplay = false;
                }else {
                    document.getElementById("chat").style.display = "block";
                    isChatDisplay = true;
                    if(isFloatDisplay){
                        window.clearTimeout(t);
                    }
                }
                break;

            case 13://enter
                console.log("enter");
                if(document.getElementById("message").value.length > 0){
                    addMsg(userName, document.getElementById("message").value);
                    socket.emit('chat', document.getElementById("message").value);
                    console.log(document.getElementById("message").value);
                    document.getElementById("message").value = "";
                }
                break;
        }
    });

    document.body.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 38:
            case 87: // w
                user.speed = 0;
                user.stop();
                break;
            case 37:
            case 65: // a
                user.flag = 0;
                user.speed = 0;
                user.stop();
                break;
            case 68: // d
            case 39:
                user.flag = 0;
                user.speed = 0;
                user.stop();
                break;
            case 83:
            case 40:
                user.speed = 0;
                user.stop();
                break;
        }
    });

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function draw() {
        //兼容性判断
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        initScene();
        initCamera();
        initRender();
        window.onresize = onWindowResize;
    }

    function start() {
        //join the room
        var joinData = {
            room: roomName,
            user: userName,
            gender: gender,
            position: [user.user.position.x, user.user.position.y, user.user.position.z],
            rotation: [user.user.rotation.x, user.user.rotation.y, user.user.rotation.z]
        };
        console.log(joinData);
        socket.emit('join', joinData);
        container.addEventListener('mousemove', function (event) {
            let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            yawObject.rotation.y -= movementX * 0.002;
            pitchObject.rotation.x -= movementY * 0.002;
            pitchObject.rotation.x = Math.max(-1 * Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
        });

        container.addEventListener('mousedown', function (e) {
            e.preventDefault();

            let mouse = new THREE.Vector2();
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            let pickRay = new THREE.Raycaster();
            pickRay.setFromCamera(mouse, camera);
            let number = -1;
            for (let i = 0; i < 5; i++) {
                let hit = pickRay.intersectObject(pickObject[i], true);
                if (hit.length > 0) {
                    number = i;
                    break;
                }
            }
            if (controlsEnabled === true && isStart) {
                switch (number) {
                    // 0-book; 1-key; 2-lock; 3-candle;
                    case 0:
                        showDiary();
                        break;
                    case 1:
                        socket.emit('key', userName);
                        break;
                    case 2:
                        inputCode();
                        break;
                    case 3:
                        socket.emit('candle', userName);
                        break;
                    case 4:
                        console.log('aa');
                        if (isKey) {
                            console.log('op4n the door');
                            socket.emit('door', userName);
                        }
                        break;
                }
            }
        });

        animate();
    }

    function animate() {
        if (controlsEnabled === true) {
            user.tick(pitchObject, yawObject, objects);
            for(var i = 0; i < players.length; i++){
                if(players[i].user !== undefined){
                    players[i].playerTick();
                }
            }
            TWEEN.update();
            renderer.render(scene, camera);

            var updateData = {
                position: [user.user.position.x, user.user.position.y, user.user.position.z],
                rotation: [user.user.rotation.x, user.user.rotation.y, user.user.rotation.z]
            };
            socket.emit('update', updateData);
        }
        requestAnimationFrame(animate);
    }

    function load() {
        user = new User({
            scene: scene,
            username: userName,
            gender: gender,
            position:[0, 10, 350],
            rotation:[0,0,0],
            //players:"",
            cb: start
        });
    }

    function inputCode() {
        document.getElementById("bg").style.display = "block";
        document.getElementById("inputCodeBox").style.display = "block";
        if (code_pass) {
            document.getElementById("confirm").innerText = "Opened";
            document.getElementById("code1").value = 1;
            document.getElementById("code2").value = 7;
            document.getElementById("code3").value = 8;
            document.getElementById("code4").value = 3;
        }
    }

    function showDiary() {
        document.getElementById("bg").style.display = "block";
        document.getElementById("diaryBox").style.display = "block";
        if (isCandle) {
            document.getElementById("diary").src = "/image/model/diary.jpg";
        } else {
            document.getElementById("diary").src = "/image/model/empty.jpg";
        }
    }

    function pickupKey() {
        scene.remove(pickObject[1]);
    }

    function pickupCandle(){
        scene.remove(pickObject[3]);
    }

    function addMsg(name, content){
        var oDiv = document.createElement('div');
        oDiv.innerHTML = name + ": " + content;
        oDiv.setAttribute("class", "d-flex p-2 float-left rounded oDiv");
        var father = document.getElementById("content");
        father.appendChild(oDiv);
        father.scrollTop = father.scrollHeight;
    }

    document.getElementById("confirm").onclick = function () {
        if (!code_pass) {
            let code1 = document.getElementById("code1").value;
            let code2 = document.getElementById("code2").value;
            let code3 = document.getElementById("code3").value;
            let code4 = document.getElementById("code4").value;
            if (code1 === "1" && code2 === "7" && code3 === "8" && code4 === "3") {
                //开门
                socket.emit('code', userName);
            }
        }
        document.getElementById("bg").style.display = "none";
        document.getElementById("inputCodeBox").style.display = "none";
    };

    document.getElementById("close").onclick = function () {
        document.getElementById("bg").style.display = "none";
        document.getElementById("diaryBox").style.display = "none";
    };

    window.onload = function () {
        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';
            document.getElementById("waiting").style.display = 'block';
            document.getElementById("packet").style.display = 'block';
            controlsEnabled = true;

            basement = new Basement({
                scene: scene,
                objects: objects,
                pick: pickObject,
                cb: load
            });
        }, false);
        draw();
        document.getElementById("inputGroup-sizing-default").innerText = userName;
    };

    function showMessage(name, content){
        if(!isChatDisplay) {
            if(isFloatDisplay){
                window.clearTimeout(t);
            }
            document.getElementById("chat_float").innerText = name + ": " + content;
            document.getElementById("chat_float").setAttribute("class", "d-inline-flex p-2 float-left rounded visible");
            t = window.setTimeout("document.getElementById('chat_float').setAttribute('class', 'd-inline-flex p-2 float-left rounded invisible');", 3000);
        }
    }

    socket.on('start', (data) => {
        if (data === true) {
            isStart = true;
            document.getElementById("waiting").style.display = 'none';
            showMessage("SYSTEM", "Start game!");
            addMsg("SYSTEM", "Start game!");
        }
    });

    socket.on('connection', (obj) => {
        var player = new User({
            scene: scene,
            username: obj.user,
            gender: obj.gender,
            position:obj.position,
            rotation:obj.rotation,
            cb: ""
        });
        players.push(player);
        player.walk();
        //objects.push(player.user);
        showMessage("SYSTEM", "Player " + obj.user +" enters the room!");
        addMsg("SYSTEM", "Player " + obj.user +" enters the room!");
    });

    socket.on('update', (obj) => {
        var i = 0;
        while (i < players.length) {
            if (players[i].username === obj.username) {
                if(players[i].user !== undefined) {
                    if (obj.position[0] === players[i].user.position.x && obj.position[1] ===
                        players[i].user.position.y && obj.position[2] === players[i].user.position.z) {
                        players[i].stop();
                    } else {
                        players[i].setLocation(obj.position, obj.rotation);
                        players[i].walk();
                    }
                }
                break;
            }
            i++;
        }
    });

    socket.on('disconnection', (data) => {
        var i = 0;
        while (i < players.length) {
            if (players[i].username === data) {
                showMessage("SYSTEM", "Player " + data +" leaves the room!");
                addMsg("SYSTEM", "Player " + data +" leaves the room!");
                scene.remove(players[i].user);
                players.splice(i,1);
            }
        }
    });

    socket.on('win', (data) => {
        new TWEEN.Tween(pickObject[4].rotation).to({
            z: Math.PI / 2
        }, 2000).easing(TWEEN.Easing.Elastic.Out).start();

        //TODO display as message
        showMessage("SYSTEM", "WIN!!");
        addMsg("SYSTEM", "WIN!!");
    });

    socket.on('hint', (data) =>{
        showMessage("SYSTEM", data);
        addMsg("SYSTEM", data);
    });

    socket.on('key', (data) => {
        pickupKey();
        if (data === userName) {
            isKey = true;
            document.getElementById("key").src = "/image/model/key.png";
        }
        showMessage("SYSTEM", "Player " + data +" finds a key!");
        addMsg("SYSTEM", "Player " + data +" finds a key!");
    });

    socket.on('chat', (data) => {
        var name = data.user;
        var content = data.content;
        showMessage(name, content);
        addMsg(name, content);
        console.log('receive chat message');
    });

    socket.on('candle', (data) =>{
        pickupCandle();
        if (data === userName) {
            isCandle = true;
            document.getElementById("candle").src = "/image/model/candle.png";
        }
        showMessage("SYSTEM", "Player " + data +" finds a candle!");
        addMsg("SYSTEM", "Player " + data +" finds a candle!");
    });

    socket.on('code', (data) =>{
        showMessage("SYSTEM", "Player " + data +" opens the coded lock!");
        addMsg("SYSTEM", "Player " + data +" opens the coded lock!");
        code_pass = true;
    });
};