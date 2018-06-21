/**
 * Created by 昕点陈 on 2018/6/14.
 */
function User(params) {
    var self = this;
    var user;
    this.clock = new THREE.Clock();

    this.speed = 0;
    this.flag = 0;

    this.dirRotation = 0; // 方向上的旋转
    var mixer;
    var actions = [];

    // user
    /*new THREE.ObjectLoader().load('image/model/marine_anims_core.json', function (loadedObject) {
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
        mixer = new THREE.AnimationMixer(user);
        mixer.timeScale = 1.25;
        idleAction = mixer.clipAction('idle');
        walkAction = mixer.clipAction('walk');
        actions = [idleAction, walkAction];
        self.mixer = mixer;
        self.idleAction = idleAction;
        self.walkAction = walkAction;
        self.actions = actions;
        activateAllActions();
        self.prepareCrossFade(walkAction, idleAction, 1.0);
    },function () {
        params.cb();
    }, function () {
        console.log("error");
    });*/

    //load test
    var loader = new THREE.FBXLoader();
    loader.load("image/model/Walking.fbx", function (loadedObject) {
        //添加骨骼辅助
        loadedObject.traverse(function (child) {
            if (child.isMesh) {
                //this.mesh = child;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        user = loadedObject;
        //user = this.mesh;
        user.position.y = 10;
        user.position.x = 0;
        user.position.z = 350;
        //user.rotation.y = -1 * Math.PI;
        user.scale.set(1.2,1.2,1.2);
        self.user = user;

        params.scene.add(user);
        this.skeleton = new THREE.SkeletonHelper(user);
        //this.skeleton.visible = false;
        params.scene.add(skeleton);
        mixer = loadedObject.mixer = new THREE.AnimationMixer(loadedObject);
        //mixer.timeScale = 1.25;
        console.log(user);
        let actions = [];
        for(var i=0; i<loadedObject.animations.length; i++){
            actions[i] = mixer.clipAction(loadedObject.animations[i]);
        }
        self.actions = actions;
        self.mixer = mixer;
    },function () {
        params.cb();
    }, function () {
        console.log("error");
    });

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
    this.prepareCrossFade = function prepareCrossFade(startAction, endAction, duration) {
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
}

User.prototype.walk = function(){
    //this.prepareCrossFade(this.idleAction, this.walkAction, 0,5);
    for(let i=0; i<this.actions.length; i++){
        this.actions[i].stop();
    }
    this.actions[0].play();
};

User.prototype.stop = function(){
    //this.prepareCrossFade(this.walkAction, this.idleAction, 0.5);
    for(let i=0; i<this.actions.length; i++){
        this.actions[i].stop();
    }
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

    yawObject.position.x = this.user.position.x - Math.sin(this.user.rotation.y/* - Math.PI*/) * 70 ;
    yawObject.position.z = this.user.position.z - Math.cos(this.user.rotation.y/* - Math.PI*/) * 70 ;
};


module.exports = User;