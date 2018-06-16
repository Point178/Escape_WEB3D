/**
 * Created by 昕点陈 on 2018/6/14.
 */
function User(params) {
    var self = this;
    var user;
    var mtlLoader = new THREE.MTLLoader();
    var camera = params.scene.camera;

    this.speed = 0;
    this.rSpeed = 0;
    this.walk = false;

    this.realRotation = 0; // 真实的旋转
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
                    user.position.z = 0;
                    params.scene.add(user);
                    self.user = user;
                    params.cb();
                    //object.scale.set(0.5, 0.5, 0.5);
                },
                function () {
                    console.log("success");
                }, function () {
                    console.log("error");
                });
    });
}

User.prototype.tick = function (camera) {
    if (this.speed === 0) {
        return;
    }
    this.dirRotation += this.rSpeed;
    this.realRotation += this.rSpeed;

    var rotation = this.dirRotation;

    var speedX = Math.sin(rotation) * this.speed;
    var speedZ = Math.cos(rotation) * this.speed;

    var tempX = this.user.position.x + speedX;
    var tempZ = this.user.position.z + speedZ;

    this.user.rotation.y = this.realRotation;
    this.user.position.z += speedZ;
    this.user.position.x += speedX;
    
    camera.rotation.y = rotation + Math.PI;
    camera.position.x = this.user.position.x - Math.sin(rotation) * 70;
    camera.position.z = this.user.position.z - Math.cos(rotation) * 70;
};

module.exports = User;