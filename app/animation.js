/**
 * Created by 昕点陈 on 2018/6/9.
 */
/**
 Created by 何当当 on 2018/6/13
 */

module.exports = function () {
    var User = require("./user");
    var user;
    var container;

    var scene;

    function initScene() {
        scene = new THREE.Scene();
    }

    var renderer;

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
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 5000);
        camera.position.set(0, 200, -70);
        camera.rotation.y = Math.PI;
        //camera.lookAt(0,0,0);
    }

    var gui;

    function initGui() {
        //声明一个保存需求修改的相关数据的对象
        gui = {};
        var datGui = new dat.GUI();
        //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    }

    var light;

    function initLight() {
        light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(100, 100, 50);
        scene.add(light);
        var spotLight = new THREE.SpotLight(0xffffff, 1, 200, 20, 10);
        spotLight.position.set(0, 150, -100);
        scene.add(spotLight);
    }

    // add scene model
    function addSceneElement() {
        var helper = new THREE.AxesHelper(50);
        scene.add(helper);

        // Create a cube used to build the floor and walls
        var cube = new THREE.CubeGeometry(1400, 1, 1200);
        var ceilCube = new THREE.CubeGeometry(1400, 1, 1200);

        // create different materials
        var floorMat = new THREE.MeshLambertMaterial(
            {
                map: THREE.ImageUtils.loadTexture('/image/model/wall/floor.jpg'),
                side: THREE.DoubleSide
            });
        var wallMat = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/image/model/wall/wall.jpg'),
            side: THREE.DoubleSide
        });

        // Floor
        var floor = new THREE.Mesh(ceilCube, floorMat);
        scene.add(floor);

        // ceil
        var ceil = new THREE.Mesh(ceilCube, floorMat);
        ceil.rotation.x = Math.PI / 180 * 180;
        ceil.position.set(0, 700, 0);
        scene.add(ceil);

        // Back wall
        var backWall = new THREE.Mesh(cube, wallMat);
        backWall.rotation.x = Math.PI / 180 * 90;
        backWall.position.set(0, 500, -600);
        scene.add(backWall);

        // Left wall
        var leftWall = new THREE.Mesh(cube, wallMat);
        leftWall.rotation.x = Math.PI / 180 * 90;
        leftWall.rotation.z = Math.PI / 180 * 90;
        leftWall.position.set(-600, 500, 0);
        scene.add(leftWall);

        // Right wall
        var rightWall = new THREE.Mesh(cube, wallMat);
        rightWall.rotation.x = Math.PI / 180 * 90;
        rightWall.rotation.z = Math.PI / 180 * 90;
        rightWall.position.set(600, 500, 0);
        scene.add(rightWall);

        // front wall
        var frontWall = new THREE.Mesh(cube, wallMat);
        frontWall.rotation.x = Math.PI / 180 * 90;
        frontWall.position.set(0, 500, 600);
        scene.add(frontWall);
        //table
    new THREE.MTLLoader()
    .setPath('/image/model/table/')
    .load('table.mtl', function (materials) {
    materials.preload();
    new THREE.OBJLoader()
    .setPath('/image/model/table/')
    .setMaterials(materials)
    .load('table.obj', function (object) {
      object.position.y = 20;
      object.position.z = 200;
      object.position.x = 0;
      scene.add(object);
      },
      function () {
      console.log("success");
      }, function () {
      console.log("error");
      });
    });
        //door
    new THREE.MTLLoader()
    .setPath('/image/model/door/')
    .load('door.mtl', function (materials) {
    materials.preload();
    new THREE.OBJLoader()
    .setPath('/image/model/door/')
    .setMaterials(materials)
    .load('door.obj', function (object) {
      object.position.y = -80;
      object.position.z = 990;
      object.position.x = 0;
      object.rotation.y=Math.PI / 180 * 90;
      object.scale.set(50, 80, 60);

      // object.rotate.y=Math.PI / 180 * 90;
      scene.add(object);
      },
      function () {
      console.log("success");
      }, function () {
      console.log("error");
      });
    });

        //shoestore
    new THREE.MTLLoader()
    .setPath('/image/model/shoestore/')
    .load('small.mtl', function (materials) {
    materials.preload();
    new THREE.OBJLoader()
    .setPath('/image/model/shoestore/')
    .setMaterials(materials)
    .load('small.obj', function (object) {
      object.position.y = 50;
      object.position.z = -350;
      object.position.x = 0;

      object.scale.set(220, 100, 100);
      scene.add(object);
      },
      function () {
      console.log("success");
      }, function () {
      console.log("error");
      });
    });


        // bookstore
        new THREE.MTLLoader()
            .setPath('/image/model/bookstore/')
            .load('big.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bookstore/')
                    .setMaterials(materials)
                    .load('big.obj', function (object) {
                            object.position.y = 20;
                            object.position.z = -420;
                            object.position.x = -570;
                            object.scale.set(11, 5, 4);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/bookstore/')
            .load('big.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/bookstore/')
                    .setMaterials(materials)
                    .load('big.obj', function (object) {
                            object.position.y = 20;
                            object.position.z = -420;
                            object.position.x = -200;
                            object.scale.set(11, 5, 4);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        // light
        new THREE.MTLLoader()
            .setPath('/image/model/book_light/')
            .load('eb_ceiling_light_01.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/book_light/')
                    .setMaterials(materials)
                    .load('eb_ceiling_light_01.obj', function (object) {
                            object.position.y = 700;
                            object.position.z = 0;
                            object.position.x = 0;
                            object.scale.set(5, 5, 5);
                            scene.add(object);
                        },
                        function () {
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });

        var handLight = new THREE.PointLight(0xffffff, 1);
        handLight.position.y = 500;
        handLight.position.x = 0;
        handLight.position.z = 0;
        scene.add(handLight);

        // painting
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = 200;
                            object.position.x = 500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = -200;
                            object.position.x = 500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = 0;
                            object.position.x = 500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = 200;
                            object.position.x = -500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = -1 * Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = -200;
                            object.position.x = -500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = -1 * Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
        new THREE.MTLLoader()
            .setPath('/image/model/painting/')
            .load('painting.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setPath('/image/model/painting/')
                    .setMaterials(materials)
                    .load('painting.obj', function (object) {
                            object.position.y = 300;
                            object.position.z = 0;
                            object.position.x = -500;
                            object.scale.set(30, 30, 30);
                            object.rotation.y = -1 * Math.PI / 180 * 90;
                            scene.add(object);
                        },
                        function () {
                            console.log("add painting");
                            console.log("success");
                        }, function () {
                            console.log("error");
                        });
            });
    }

    var stats;

    function initStats() {
        stats = new Stats();
        document.body.appendChild(stats.dom);
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
                user.walk = true;
                user.speed = 10;
                break;

            case 37: // left arrow
            case 65: // A
                user.rSpeed = 0.1;
                user.speed = 1;
                break;

            case 83: // S
            case 40: // down arrow
                user.speed = -10;
                user.walk = true;
                break;

            case 68: // D
            case 39: // right arrow
                user.rSpeed = -0.1;
                user.speed = 1;
                break;

            case 82: // R head up
                camera.rotation.x -= 0.05;
                break;

            case 70: // F head down
                camera.rotation.x += 0.055;
                break;
        }
    });

    document.body.addEventListener('keyup', function (e) {
        switch (e.keyCode) {
            case 38:
            case 87: // w
                user.walk = false;
                user.speed = 0;
                break;
            case 37:
            case 65: // a
                user.rSpeed = 0;
                user.speed = 0;
                break;
            case 68: // d
            case 39:
                user.rSpeed = 0;
                user.speed = 0;
                break;
            case 83:
            case 40:
                user.walk = false;
                user.speed = 0;
                break;
        }
    });

    function draw() {
        //兼容性判断
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        initGui();
        initScene();
        initCamera();

        addSceneElement();

        initStats();
        initRender();
        window.onresize = onWindowResize;

    }

    function start() {
        animate();
    }

    function animate() {
        //var clock = new THREE.Clock();
        stats.update();
        //controls.update(clock.getDelta());
        user.tick(camera);
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    window.onload = function () {
        draw();
        user = new User({
            scene: scene,
            cb: start
        });
    }
};