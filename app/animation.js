/**
 * Created by 昕点陈 on 2018/6/9.
 */
/**
 Created by 何当当 on 2018/6/13
 */

module.exports = function () {
    var User = require("./user");
    var Basement = require("./room/basement");
    var user, controls, scene, renderer, camera, basement;
    var container = document.getElementById('world');
    var instructions = document.getElementById('instructions');
    var objects = [];

    var ray = [];
    ray.push(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, 1), 10, 1000));
    ray.push(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 10, 1000));
    ray.push(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 10, 1000));
    ray.push(new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(-1, 0, 0), 10, 1000));

    var controlsEnabled = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var prevTime = performance.now();
    var velocity = new THREE.Vector3();
    var direction = new THREE.Vector3();
    var vertex = new THREE.Vector3();

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
        camera.position.set(0, 160, 200);
        camera.rotation.y = Math.PI;
        controls = new THREE.PointerLockControls(camera);
        scene.add(controls.getObject());
        //camera.lookAt(0,0,0);
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
                //user.walk = true;
                //user.speed = 10;
                moveForward = true;
                break;

            case 37: // left arrow
            case 65: // A
                //user.rSpeed = 0.1;
                //user.speed = 1;
                moveLeft = true;
                break;

            case 83: // S
            case 40: // down arrow
                //user.speed = -10;
                //user.walk = true;
                moveBackward = true;
                break;

            case 68: // D
            case 39: // right arrow
                //user.rSpeed = -0.1;
                //user.speed = 1;
                moveRight = true;
                break;
        }
    });

    document.body.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 38:
            case 87: // w
                //user.walk = false;
                //user.speed = 0;
                moveForward = false;
                break;
            case 37:
            case 65: // a
                //user.rSpeed = 0;
                //user.speed = 0;
                moveLeft = false;
                break;
            case 68: // d
            case 39:
                //user.rSpeed = 0;
                //user.speed = 0;
                moveRight = false;
                break;
            case 83:
            case 40:
                //user.walk = false;
                //user.speed = 0;
                moveBackward = false;
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
        animate();
    }

    function animate() {
        //user.tick(camera);
        requestAnimationFrame(animate);
        var intersections;
        var isCollision = false;
        if (controlsEnabled === true) {
            for(var i = 0; i < 4; i++){
                ray[i].ray.origin.copy(controls.getObject().position);
                intersections = ray[i].intersectObjects(objects, true);
                //if((intersections.length > 0 && intersections[0].distance < 50)){
                    //console.log(intersections[0].distance + "  length  " + i);
                //}
                isCollision = isCollision && (intersections.length > 0 && intersections[0].distance < 50);
            }

            //var onObject = (intersections.length > 0 && intersections[0].distance > 40);
            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;
            velocity.x = 0;
            velocity.z = 0;
            velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveLeft) - Number(moveRight);
            direction.normalize(); // this ensures consistent movements in all directions
            if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
            if (isCollision) {
                //velocity.y = Math.max(0, velocity.y);
                velocity.x = 0;
                velocity.z = 0;
            }
            controls.getObject().translateX(velocity.x * delta);
            controls.getObject().translateY(velocity.y * delta);
            controls.getObject().translateZ(velocity.z * delta);
            if (controls.getObject().position.y < 10) {
                velocity.y = 0;
                controls.getObject().position.y = 10;
            }
            prevTime = time;
        }
        renderer.render(scene, camera);
    }

    window.onload = function () {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (havePointerLock) {
            var element = document.body;
            var pointerlockchange = function (event) {
                if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                    controlsEnabled = true;
                    controls.enabled = true;
                } else {
                    controls.enabled = false;
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
            objects : objects
        });

        user = new User({
            scene: scene,
            camera:camera,
            cb: start
        });
    }
};