
var mesh, skeleton, mixer;
var idleAction, walkAction;
var idleWeight, walkWeight;
var actions;
var clock = new THREE.Clock();
var url = './image/model/marine_anims_core.json';

// Load skinned mesh
new THREE.ObjectLoader().load('image/model/marine_anims_core.json', function (loadedObject) {
    loadedObject.traverse(function (child) {
        if (child instanceof THREE.SkinnedMesh) {
            mesh = child;
        }
    });
    // Add mesh and skeleton helper to scene
    mesh.rotation.y = -135 * Math.PI / 180;
    scene.add(mesh);
    skeleton = new THREE.SkeletonHelper(mesh);
    skeleton.visible = false;
    scene.add(skeleton);
    // Initialize camera and camera controls
    var radius = mesh.geometry.boundingSphere.radius;
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 1, 10000);
    camera.position.set(0.0, radius, radius * 3.5);
    
    // Initialize mixer and clip actions
    mixer = new THREE.AnimationMixer(mesh);
    mixer.timeScale = 1.25;
    idleAction = mixer.clipAction('idle');
    walkAction = mixer.clipAction('walk');
    actions = [idleAction, walkAction];
    activateAllActions();
    // Listen on window resizing and start the render loop
    window.addEventListener('resize', onWindowResize, false);
    animate();
});

function activateAllActions() {
    setWeight(idleAction, 0.0);
    setWeight(walkAction, 1.0);
    actions.forEach(function (action) {
        action.play();
    });
}
function pauseContinue() {
    prepareCrossFade(walkAction, idleAction, 1.0);
    prepareCrossFade(idleAction, walkAction, 0.5);
}

function unPauseAllActions() {
    actions.forEach(function (action) {
        action.paused = false;
    });
}
function prepareCrossFade(startAction, endAction, defaultDuration) {
    // Switch default / custom crossfade duration (according to the user's choice)
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
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    idleWeight = idleAction.getEffectiveWeight();
    walkWeight = walkAction.getEffectiveWeight();
    
    var mixerUpdateDelta = clock.getDelta();
    mixer.update(mixerUpdateDelta);
    renderer.render(scene, camera);
}