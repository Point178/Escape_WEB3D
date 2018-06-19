/**
 * Created by 昕点陈 on 2018/6/9.
 */
/**
 Created by 何当当 on 2018/6/13
 */

module.exports = function () {
    let User = require("./user");
    let Basement = require("./room/basement");
    let user, scene, renderer, camera, basement;
    let container = document.getElementById('world');
    let instructions = document.getElementById('instructions');
    let objects = [];
    let controlsEnabled = false;
    let pitchObject;
    let yawObject;
    let pickObject = []; // 0-book; 1-key; 2-lock; 3-candle, 4-basement_door;
    let basement_pass = false;

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
            for (let i = 0; i < 4; i++) {
                let hit = pickRay.intersectObject(pickObject[i], true);
                if (hit.length > 0) {
                    number = i;
                    if(number ===0){
                        console.log("hit");
                    }
                    break;
                }
            }
            switch (number) {
                // 0-book; 1-key; 2-lock; 3-candle;
                case 0:
                    showDiary();
                    break;
                case 1:
                    break;
                case 2:
                    inputCode();
                    break;
                case 3:
                    break;
            }
        });
        animate();
    }

    function animate() {
        if (controlsEnabled === true) {
            user.tick(pitchObject, yawObject, objects);
            TWEEN.update();
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    function load() {
        user = new User({
            scene: scene,
            cb: start
        });
    }

    function inputCode() {
        document.getElementById("bg").style.display ="block";
        document.getElementById("inputCodeBox").style.display="block";
    }

    function showDiary(){
        document.getElementById("bg").style.display ="block";
        document.getElementById("diaryBox").style.display="block";
    }

    document.getElementById("confirm").onclick = function(){
        if(!basement_pass) {
            let code1 = document.getElementById("code1").value;
            let code2 = document.getElementById("code2").value;
            let code3 = document.getElementById("code3").value;
            let code4 = document.getElementById("code4").value;
            if (code1 === "0" && code2 === "0" && code3 === "0" && code4 === "0") {
                //开门
                new TWEEN.Tween(pickObject[4].rotation).to({
                    z : Math.PI / 2}, 2000).easing( TWEEN.Easing.Elastic.Out).start();

                //pickObject[4].rotation.z = Math.PI / 2;
                basement_pass = true;
            }
        }
        document.getElementById("bg").style.display = "none";
        document.getElementById("inputCodeBox").style.display = "none";
    };

    document.getElementById("close").onclick = function(){
        document.getElementById("bg").style.display = "none";
        document.getElementById("diaryBox").style.display = "none";
    };

    window.onload = function () {
        instructions.addEventListener('click', function (event) {
            instructions.style.display = 'none';
            controlsEnabled = true;
        }, false);
        draw();
        basement = new Basement({
            scene: scene,
            objects: objects,
            pick: pickObject,
            cb: load
        });
    };

};