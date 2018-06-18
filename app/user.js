/**
 * Created by 昕点陈 on 2018/6/14.
 */
function User(params) {
    var self = this;
    var user;
    var mtlLoader = new THREE.MTLLoader();

    this.speed = 0;
    this.flag = 0;
    
    this.dirRotation = 0; // 方向上的旋转

    // user
    mtlLoader.setPath('/image/model/male02/');
    mtlLoader.load('male02.mtl', function (materials) {
        materials.preload();
        new THREE.OBJLoader()
            .setPath('/image/model/male02/')
            .setMaterials(materials)
            .load('male02.obj', function (object) {
                    user = object;
                    user.position.y = 10;
                    user.position.x = 0;
                    user.position.z = 300;
                    params.scene.add(user);
                    self.user = user;
                    //user.parent = params.camera;
                },
                function () {
                    console.log("success");
                    params.cb();
                }, function () {
                    console.log("error");
                });
    });
}

User.prototype.tick = function (pitchObject, yawObject, objects) {
    if (this.speed === 0) {
        return;
    }

    this.user.rotation.y = yawObject.rotation.y - Math.PI;
    this.dirRotation = yawObject.rotation.y - Math.PI + (Math.PI / 2) * this.flag;

    var rotation = this.dirRotation;

    var speedX = Math.sin(rotation) * this.speed;
    var speedZ = Math.cos(rotation) * this.speed;

    var tempX = this.user.position.x + speedX;
    var tempZ = this.user.position.z + speedZ;
    
    //collision
    var intersections;
    for (var i = 0; i < Math.PI * 2; i += Math.PI / 2) {
        var y = 10;
        console.log("start check");
        for (; y < yawObject.position.y; y += 30) {
            var center = new THREE.Vector3(tempX, y, tempZ);
            var directory = new THREE.Vector3(Math.cos(i), 0, Math.sin(i));
            var ray = new THREE.Raycaster(center, directory, 0, 1000);
            intersections = ray.intersectObjects(objects, true);
            if (intersections.length > 0 && intersections[0].distance < 50) {
                console.log("collision");
                return;
            }
        }
    }
    
    this.user.position.z += speedZ;
    this.user.position.x += speedX;

    yawObject.position.x = this.user.position.x;
    yawObject.position.z = this.user.position.z;
};

module.exports = User;