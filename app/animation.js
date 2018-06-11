/**
 * Created by 昕点陈 on 2018/6/9.
 */
module.exports = function () {
    var camera, controls;
    var renderer;
    var scene;
    var pointLight;
    var man;
    init();
    render();

    function init() {
        var container = document.getElementById('world');

        camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 500);
        camera.position.z = 100;
        camera.position.x = 30;
        camera.position.y = 30;
        camera.lookAt(0, 0, 0);

        controls = new THREE.OrbitControls(camera);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI / 4;
        controls.maxPolarAngle = Math.PI / 1.5;

        /*var path = "/image/RiverSide/";
         var format = '.BMP';
         var urls = [
         path + 'px' + format, path + 'nx' + format,
         path + 'py' + format, path + 'ny' + format,
         path + 'pz' + format, path + 'nz' + format
         ];

         var reflectionCube = new THREE.CubeTextureLoader().load( urls );
         reflectionCube.format = THREE.RGBFormat;
         var refractionCube = new THREE.CubeTextureLoader().load( urls );
         refractionCube.mapping = THREE.CubeRefractionMapping;
         refractionCube.format = THREE.RGBFormat;
         */
        scene = new THREE.Scene();
        //scene.background = reflectionCube;

        var ambient = new THREE.AmbientLight(0xffffff);
        scene.add(ambient);
        pointLight = new THREE.PointLight(0xffffff, 2);
        scene.add(pointLight);

        // texture
        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
        var textureLoader = new THREE.TextureLoader(manager);
        var texture = textureLoader.load('/image/model/IMG_0271.JPG');

        var loader = new THREE.OBJLoader(manager);
        loader.load('/image/model/trail.obj', function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                });

                object.position.y = 0;
                object.position.z = 0;
                object.position.x = 0;

                object.scale.set(10, 10, 10);
                scene.add(object);
            },
            function () {
                console.log("success");
            }, function () {
                console.log("error");
            });

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

//window.addEventListener('resize', onWindowResize, false);
    }

    /*function onWindowResize() {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
     }*/

    function render() {
        //camera.position.x += 0.5;
        //camera.position.z += 0.5
        //camera.rotation.y += 0.01;
        //camera.rotation.x -= 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
}
;