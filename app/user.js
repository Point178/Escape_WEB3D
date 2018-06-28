/**
 * Created by 昕点陈 on 2018/6/14.
 */
function User(params) {
    var self = this;
    var user;
    this.username = params.username;
    this.gender = params.gender;
    this.clock = new THREE.Clock();

    this.speed = 0;
    this.flag = 0;

    this.dirRotation = 0; // 方向上的旋转
    var mixer;
    this.actions = [];

    let url;
    if(this.gender == 0){
        url = "image/model/red_hat.fbx";
    }else{
        url = "image/model/Walking.fbx";
    }

    //load test
    var loader = new THREE.FBXLoader();
    loader.load(url, function (loadedObject) {
        //添加骨骼辅助
        loadedObject.traverse(function (child) {
            if (child.isMesh) {
                //this.mesh = child;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        user = loadedObject;
        user.position.y = params.position[1];
        user.position.x = params.position[0];
        user.position.z = params.position[2];
        user.rotation.x = params.rotation[0];
        user.rotation.y = params.rotation[1];
        user.rotation.z = params.rotation[2];
        user.scale.set(1.2, 1.2, 1.2);
        self.user = user;

        params.scene.add(user);
        this.skeleton = new THREE.SkeletonHelper(user);
        this.skeleton.visible = false;
        params.scene.add(skeleton);
        mixer = loadedObject.mixer = new THREE.AnimationMixer(loadedObject);
        //mixer.timeScale = 1.25;
        let actions = [];
        for (var i = 0; i < loadedObject.animations.length; i++) {
            actions[i] = mixer.clipAction(loadedObject.animations[i]);
        }
        self.actions = actions;
        self.mixer = mixer;
        actions[0].clampWhenFinished = true;
        actions[0].enabled = true;
        actions[0].setEffectiveTimeScale(1);
        actions[0].setEffectiveWeight(1.0);
        console.log(loadedObject);

        if (params.cb !== "") {
            params.cb();
        }
    }, function () {
        console.log("success");
    }, function () {
        console.log("error");
    });
}

User.prototype.walk = function () {
    if (this !== undefined && this.actions.length > 0) {
        this.actions[0].paused = false;
        this.actions[0].play();
    }
};

User.prototype.stop = function () {
    if (this !== undefined && this.actions.length > 0) {
        this.actions[0].paused = true;
    }
};

User.prototype.playerTick = function(){
    var mixerUpdateDelta = this.clock.getDelta();
    this.mixer.update(mixerUpdateDelta);
};

User.prototype.tick = function (pitchObject, yawObject, objects) {
    var mixerUpdateDelta = this.clock.getDelta();
    this.mixer.update(mixerUpdateDelta);

    this.user.rotation.y = yawObject.rotation.y - Math.PI;
    if (this.speed === 0) {
        return;
    }
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
        for (; y < yawObject.position.y; y += 30) {
            var center = new THREE.Vector3(tempX, y, tempZ);
            var directory = new THREE.Vector3(Math.cos(i), 0, Math.sin(i));
            var ray = new THREE.Raycaster(center, directory, 0, 1000);
            intersections = ray.intersectObjects(objects, true);
            if (intersections.length > 0 && intersections[0].distance < 50) {
                return;
            }
        }
    }

    this.user.position.z += speedZ;
    this.user.position.x += speedX;

    yawObject.position.x = this.user.position.x - Math.sin(this.user.rotation.y/* - Math.PI*/) * 70;
    yawObject.position.z = this.user.position.z - Math.cos(this.user.rotation.y/* - Math.PI*/) * 70;
};

User.prototype.setLocation = function (position, rotation) {
    this.user.position.x = position[0];
    this.user.position.y = position[1];
    this.user.position.z = position[2];
    this.user.rotation.x = rotation[0];
    this.user.rotation.y = rotation[1];
    this.user.rotation.z = rotation[2];
};

module.exports = User;