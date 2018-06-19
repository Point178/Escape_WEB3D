/**
 * Created by 昕点陈 on 2018/6/9.
 */
/**
 Created by 何当当 on 2018/6/13
 */

module.exports = function () {
    var User = require("./user");
    var Basement = require("./room/basement");
    var user,scene, renderer, camera, basement;
    var container = document.getElementById('world');
    var instructions = document.getElementById('instructions');
    var objects = [];
    var controlsEnabled = false;
    var pitchObject;
    var yawObject;

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

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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

    function draw() {
        //兼容性判断
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        initScene();
        initCamera();
        initRender();
        window.onresize = onWindowResize;
    }

    function start() {
        document.body.addEventListener('mousemove', function (event) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
            yawObject.rotation.y -= movementX * 0.002;
            pitchObject.rotation.x -= movementY * 0.002;
            pitchObject.rotation.x = Math.max(-1 * Math.PI / 2, Math.min(Math.PI / 2, pitchObject.rotation.x));
        });
        animate();
    }

    function animate() {
        if (controlsEnabled === true) {
            user.tick(pitchObject, yawObject, objects);
            renderer.render(scene, camera);
        }
        requestAnimationFrame(animate);
    }

    function load() {
        user = new User({
            scene: scene,
            camera: camera,
            cb: start
        });
    }

    window.onload = function () {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (havePointerLock) {
            var element = document.body;
            var pointerlockchange = function (event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    controlsEnabled = true;
                } else {
                    instructions.style.display = '';
                }
            };

            var pointerlockerror = function (event) {
                instructions.style.display = '';
            };

            // Hook pointer lock state change events
            document.addEventListener('pointerlockchange', pointerlockchange, false);
            document.addEventListener('mozpointerlockchange', pointerlockchange, false);
            document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
            document.addEventListener('pointerlockerror', pointerlockerror, false);
            document.addEventListener('mozpointerlockerror', pointerlockerror, false);
            document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

            instructions.addEventListener('click', function (event) {
                instructions.style.display = 'none';
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
            }, false);
        } else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
        }

        draw();
        basement = new Basement({
            scene: scene,
            objects: objects,
            cb: load
        });
    };
}