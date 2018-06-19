/**
 * Created by 昕点陈 on 2018/6/14.
 */
function User(params) {
    var self = this;
    var user;
    var mtlLoader = new THREE.MTLLoader();
    this.clock = new THREE.Clock();
    var url = './image/model/marine_anims_core.json';

    this.speed = 0;
    this.flag = 0;

    this.dirRotation = 0; // 方向上的旋转

    // user
    /*mtlLoader.setPath('/image/model/male02/');
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
     });*/
    new THREE.ObjectLoader().load('image/model/marine_anims_core.json', function (loadedObject) {
        loadedObject.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh) {
                this.mesh = child;
            }
        });
        user = this.mesh;
        user.position.y = 10;
        user.position.x = 0;
        user.position.z = 350;
        user.rotation.y = -1 * Math.PI;
        self.user = user;

        params.scene.add(user);
        this.skeleton = new THREE.SkeletonHelper(user);
        this.skeleton.visible = false;
        params.scene.add(skeleton);
        this.mixer = new THREE.AnimationMixer(user);
        this.mixer.timeScale = 1.25;
        this.idleAction = mixer.clipAction('idle');
        this.walkAction = mixer.clipAction('walk');
        this.actions = [idleAction, walkAction];
        //activateAllActions();
        //prepareCrossFade(walkAction, idleAction);
    },function () {
        console.log("success");
        params.cb();
    }, function () {
        console.log("error");
    });
}

User.prototype.walk = function(){
    prepareCrossFade(this.walkAction, this.idleAction, 1.0);
};

User.prototype.stop = function(){
    prepareCrossFade(this.idleAction, this.walkAction, 0.5);
};

User.prototype.tick = function (pitchObject, yawObject, objects) {
    //this.idleWeight = this.idleAction.getEffectiveWeight();
    //this.walkWeight = this.walkAction.getEffectiveWeight();

    //var mixerUpdateDelta = this.clock.getDelta();
    //this.mixer.update(mixerUpdateDelta);

    if (this.speed === 0) {
        return;
    }
    this.user.rotation.y = yawObject.rotation.y;
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

    yawObject.position.x = this.user.position.x - Math.sin(rotation) * 70;
    yawObject.position.z = this.user.position.z - Math.cos(rotation) * 70;
};

function activateAllActions() {
    setWeight(idleAction, 0.0);
    setWeight(walkAction, 1.0);
    actions.forEach(function (action) {
        action.play();
    });
}

function unPauseAllActions() {
    actions.forEach(function (action) {
        action.paused = false;
    });
}
function prepareCrossFade(startAction, endAction) {
    var duration = 3.5;
    unPauseAllActions();
    if (startAction === idleAction) {
        executeCrossFade(startAction, endAction, duration);
    } else {
        synchronizeCrossFade(startAction, endAction, duration);
    }
}
function synchronizeCrossFade(startAction, endAction, duration) {
    mixer.addEventListener('loop', onLoopFinished);
    function onLoopFinished(event) {
        if (event.action === startAction) {
            mixer.removeEventListener('loop', onLoopFinished);
            executeCrossFade(startAction, endAction, duration);
        }
    }
}
function executeCrossFade(startAction, endAction, duration) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    setWeight(endAction, 1);
    endAction.time = 0;
    // Crossfade with warping - you can also try without warping by setting the third parameter to false
    startAction.crossFadeTo(endAction, duration, true);
}
function setWeight(action, weight) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight(weight);
}



module.exports = User;