/**
 * Created by 昕点陈 on 2018/6/9.
 */
module.exports = function () {
    var renderer, container;

    function initRender() {
        container = document.getElementById('world');
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.sortObjects = false;
        //告诉渲染器需要阴影效果
        container.appendChild(renderer.domElement);
    }

    var camera;

    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-15, 30, 25);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    var scene;

    function initScene() {
        scene = new THREE.Scene();
    }

    var gui;

    function initGui() {
        //声明一个保存需求修改的相关数据的对象
        gui = {};
        var datGui = new dat.GUI();
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    }

    var spotLight1;
    var spotLight2;
    var spotLight3;

    function initLight() {
        spotLight1 = new THREE.SpotLight(0xffff00, 1);
        spotLight1.position.x = 40;
        spotLight1.position.y = 30;
        spotLight1.position.z = 30;
        scene.add(spotLight1);
        spotLight2 = new THREE.SpotLight(0xffff00, 1);
        scene.add(spotLight2);
        spotLight2.position.x = -15;
        spotLight2.position.y = 30;
        spotLight2.position.z = 25;

    }

    function initModel() {
        var path = "/image/RiverSide/";
        var format = '.BMP';
        var urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];

        var reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.format = THREE.RGBFormat;
        var refractionCube = new THREE.CubeTextureLoader().load(urls);
        refractionCube.mapping = THREE.CubeRefractionMapping;
        refractionCube.format = THREE.RGBFormat;

        scene.background = reflectionCube;

        // room
        new THREE.MTLLoader()
            .setPath('/image/model/bedroom/')
            .load('Bedroom.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bedroom/')
                    .setMaterials(materials)
                    .load('Bedroom.obj', function (object) {
                            //object.position.y = 0;
                            //object.position.z = 0;
                            //object.position.x = 0;
                            //object.scale.set(5,5,5);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        //light
        new THREE.MTLLoader()
            .setPath('/image/model/bedroom/')
            .load('light.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bedroom/')
                    .setMaterials(materials)
                    .load('light.obj', function (object) {
                            //object.position.y = 0;
                            //object.position.z = 0;
                            //object.position.x = 0;
                            //object.scale.set(5,5,5);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        //bed
        new THREE.MTLLoader()
            .setPath('/image/model/bedroom/')
            .load('bed.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bedroom/')
                    .setMaterials(materials)
                    .load('bed.obj', function (object) {
                            //object.position.y = 0;
                            //object.position.z = 0;
                            //object.position.x = 0;
                            //object.scale.set(5,5,5);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        //desk
        new THREE.MTLLoader()
            .setPath('/image/model/bedroom/')
            .load('desk.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bedroom/')
                    .setMaterials(materials)
                    .load('desk.obj', function (object) {
                            //object.position.y = 0;
                            //object.position.z = 0;
                            //object.position.x = 0;
                            //object.scale.set(5,5,5);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        // add player
        new THREE.MTLLoader()
            .setPath('/image/model/male02/')
            .load('male02.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/male02/')
                    .setMaterials(materials)
                    .load('male02.obj', function (object) {
                            scene.add(object);
                            object.position.y = 30;
                            object.position.x = -20;
                            object.position.z = 25;
                            object.scale.set(0.5, 0.5, 0.5);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
    }

    var controls;

    function initControls() {
        controls = new THREE.FirstPersonControls(camera);
        controls.lookSpeed = 0.2; //鼠标移动查看的速度
        controls.movementSpeed = 20; //相机移动速度
        controls.noFly = true;
        controls.lon = -100; //进入初始视角x轴的角度
        controls.lat = 0; //初始视角进入后y轴的角度
    }

    var moveX = 0;
    var moveY = 0;
    var moveZ = 0;

    function render() {
        //camera.position.x += moveX;
        //camera.position.y += moveY;
        //camera.position.z += moveZ;
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    var clock = new THREE.Clock();

    function animate() {
        //更新控制器
        render();
        //controls.update(clock.getDelta());
        requestAnimationFrame(animate);
    }

    function draw() {
        //兼容性判断
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        initGui();
        initRender();
        initScene();
        initCamera();
        initLight();
        initModel();
        //initControls();

        animate();
        window.onresize = onWindowResize;
    }

    draw();

    document.addEventListener( 'keydown', onKeyDown, false );

    function onKeyDown(ev) {
        switch (ev.keyCode) {
            case 38:
                moveZ = -0.5;
                camera.position.z += moveZ;
                break;
            case 37:
                moveX = -0.5;
                camera.position.x += moveX;
                break;
            case 40:
                moveZ = +0.5;
                camera.position.z += moveZ;
                break;
            case 39:
                moveX = 0.5;
                camera.position.x += moveX;
                break;
            case 82:
                moveY = 0.5;
                camera.position.y += moveY;
                break;
            case 70:
                moveY = -0.5;
                camera.position.y += moveY;
                console.log("aaa");
                break;
        }
    };
};