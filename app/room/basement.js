/**
 * Created by 昕点陈 on 2018/6/17.
 */
function Basement(params) {
    var scene = params.scene;
    
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
    params.objects.push(floor);

    // ceil
    var ceil = new THREE.Mesh(ceilCube, floorMat);
    ceil.rotation.x = Math.PI / 180 * 180;
    ceil.position.set(0, 700, 0);
    scene.add(ceil);
    params.objects.push(ceil);

    // Back wall
    var backWall = new THREE.Mesh(cube, wallMat);
    backWall.rotation.x = Math.PI / 180 * 90;
    backWall.position.set(0, 500, -600);
    scene.add(backWall);
    params.objects.push(backWall);

    // Left wall
    var leftWall = new THREE.Mesh(cube, wallMat);
    leftWall.rotation.x = Math.PI / 180 * 90;
    leftWall.rotation.z = Math.PI / 180 * 90;
    leftWall.position.set(-600, 500, 0);
    scene.add(leftWall);
    params.objects.push(leftWall);

    // Right wall
    var rightWall = new THREE.Mesh(cube, wallMat);
    rightWall.rotation.x = Math.PI / 180 * 90;
    rightWall.rotation.z = Math.PI / 180 * 90;
    rightWall.position.set(600, 500, 0);
    scene.add(rightWall);
    params.objects.push(rightWall);

    // front wall
    var frontWall = new THREE.Mesh(cube, wallMat);
    frontWall.rotation.x = Math.PI / 180 * 90;
    frontWall.position.set(0, 500, 600);
    scene.add(frontWall);
    params.objects.push(frontWall);

    // door
    var doorCube = new THREE.CubeGeometry(200, 5, 300);
    var doorMat = new THREE.MeshLambertMaterial(
        {
            map: THREE.ImageUtils.loadTexture('/image/model/door.jpg'),
            side: THREE.DoubleSide
        });
    var door = new THREE.Mesh(doorCube, doorMat);
    door.rotation.x = Math.PI / 180 * 90;
    door.position.set(0, 150, 595);
    scene.add(door);
    params.objects.push(door);

    //desk
    new THREE.MTLLoader()
        .setPath('/image/model/desk/')
        .load('desk.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/desk/')
                .setMaterials(materials)
                .load('desk.obj', function (object) {
                        object.position.y = 90;
                        object.position.z = 0;
                        object.position.x = 30;
                        object.scale.set(16, 12, 16);
                        scene.add(object);
                        params.objects.push(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //chair
    new THREE.MTLLoader()
        .setPath('/image/model/chair/')
        .load('chair.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/chair/')
                .setMaterials(materials)
                .load('chair.obj', function (object) {
                        object.position.y = 10;
                        object.position.z = -30;
                        object.position.x = 0;
                        object.scale.set(12, 15, 12);
                        object.rotation.y = Math.PI / 180 * 90;
                        scene.add(object);
                        params.objects.push(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //notebook
    new THREE.MTLLoader()
        .setPath('/image/model/notebook/')
        .load('Lowpoly_Notebook_2.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/notebook/')
                .setMaterials(materials)
                .load('Lowpoly_Notebook_2.obj', function (object) {
                        object.rotation.y = -1 * Math.PI / 180 * 90;
                        object.position.y = 110;
                        object.position.z = 20;
                        object.position.x = 0;
                        object.scale.set(13, 13, 13);
                        scene.add(object);
                        params.objects.push(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //key
    new THREE.MTLLoader()
        .setPath('/image/model/key/')
        .load('key.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/key/')
                .setMaterials(materials)
                .load('key.obj', function (object) {
                        object.rotation.z = -1 * Math.PI / 180 * 90;
                        object.position.y = 30;
                        object.position.z = -550;
                        object.position.x = 200;
                        object.scale.set(0.2, 0.2, 0.2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //lock
    new THREE.MTLLoader()
        .setPath('/image/model/lock/')
        .load('lock.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/lock/')
                .setMaterials(materials)
                .load('lock.obj', function (object) {
                        object.rotation.y = Math.PI / 180 * 90;
                        object.position.y = 200;
                        object.position.z = 600;
                        object.position.x = 180;
                        object.scale.set(20, 20, 20);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //candle
    new THREE.MTLLoader()
        .setPath('/image/model/candle/')
        .load('CandleStick.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/candle/')
                .setMaterials(materials)
                .load('CandleStick.obj', function (object) {
                        //object.rotation.y = Math.PI / 180 * 90;
                        object.position.y = 110;
                        object.position.z = 90;
                        object.position.x = -60;
                        object.scale.set(3, 3, 3);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //book1
    new THREE.MTLLoader()
        .setPath('/image/model/book/')
        .load('objBook.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book/')
                .setMaterials(materials)
                .load('objBook.obj', function (object) {
                        object.position.y = 140;
                        object.position.z = -470;
                        object.position.x = -120;
                        object.scale.set(3, 3, 3);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    //book2
    new THREE.MTLLoader()
        .setPath('/image/model/book1/')
        .load('book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book1/')
                .setMaterials(materials)
                .load('book.obj', function (object) {
                        object.position.y = 140;
                        object.position.z = -470;
                        object.position.x = -170;
                        object.scale.set(10, 20, 10);
                        scene.add(object);
                        // object.position.x=-190;
                        // scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });

    //book3
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 0;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -160;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -150;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -140;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -250;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -240;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -230;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -220;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -260;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -210;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -200;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = -190;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 10;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 20;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 30;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 40;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 50;
                        object.scale.set(2, 3, 2);
                        scene.add(object);
                    },
                    function () {
                        console.log("success");
                    }, function () {
                        console.log("error");
                    });
        });
    new THREE.MTLLoader()
        .setPath('/image/model/book3/')
        .load('Sample_Book.mtl', function (materials) {
            materials.preload();
            new THREE.OBJLoader()
                .setPath('/image/model/book3/')
                .setMaterials(materials)
                .load('Sample_Book.obj', function (object) {
                        object.position.y = 115;
                        object.position.z = -470;
                        object.position.x = 60;
                        object.scale.set(2, 3, 2);
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
                        object.position.y = 10;
                        object.position.z = -420;
                        object.position.x = -570;
                        object.scale.set(11, 5, 4);
                        scene.add(object);
                        params.objects.push(object);
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
                        object.position.y = 10;
                        object.position.z = -420;
                        object.position.x = -200;
                        object.scale.set(11, 5, 4);
                        scene.add(object);
                        params.objects.push(object);
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
                        object.position.x = 580;
                        object.scale.set(30, 30, 30);
                        object.rotation.y = Math.PI / 180 * 90;
                        scene.add(object);
                    },
                    function () {
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
                        object.position.x = 580;
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
                        object.position.x = 580;
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
                        object.position.x = -580;
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
                        object.position.x = -580;
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
                        object.position.x = -580;
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

module.exports = Basement;