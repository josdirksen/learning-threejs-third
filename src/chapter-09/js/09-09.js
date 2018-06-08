function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  var mixer = new THREE.AnimationMixer();
  var clipAction
  var clipAction2
  var frameMesh
  var mesh
  
  initDefaultLighting(scene);

  function setupModel() {
    // initial cube
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterial = new THREE.MeshLambertMaterial({morphTargets: true, color: 0xff0000});

    // define morphtargets, we'll use the vertices from these geometries
    var cubeTarget1 = new THREE.BoxGeometry(2, 20, 2);
    var cubeTarget2 = new THREE.BoxGeometry(40, 2, 2);

    // define morphtargets and compute the morphnormal
    cubeGeometry.morphTargets[0] = {name: 't1', vertices: cubeGeometry.vertices};
    cubeGeometry.morphTargets[1] = {name: 't2', vertices: cubeTarget2.vertices};
    cubeGeometry.morphTargets[2] = {name: 't3', vertices: cubeTarget1.vertices};
    cubeGeometry.computeMorphNormals();

    var mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position the cube
    mesh.position.x = 0;
    mesh.position.y = 3;
    mesh.position.z = 0;

    // add the cube to the scene
    scene.add(mesh);
    mixer = new THREE.AnimationMixer( mesh );

    animationClip = THREE.AnimationClip.CreateFromMorphTargetSequence('first', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[1]], 1);
    animationClip2 = THREE.AnimationClip.CreateFromMorphTargetSequence('second', [cubeGeometry.morphTargets[0], cubeGeometry.morphTargets[2]], 1);
    clipAction = mixer.clipAction( animationClip ).play();  
    clipAction2 = mixer.clipAction( animationClip2 ).play();

    clipAction.setLoop(THREE.LoopRepeat);
    clipAction2.setLoop(THREE.LoopRepeat);
    // enable the controls
    enableControls()
  }

  // control which keyframe to show
  var controls1
  var controls2
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }

  function enableControls() {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(mixerControls, "time").listen()
    mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(mixerControls, "stopAllAction").listen()
    
    controls1 = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
    controls2 = addClipActionFolder("ClipAction 2", gui, clipAction2, animationClip2);
  }

  setupModel();  
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction) {
      mixer.update( delta );
      controls1.time = mixer.time;
      controls1.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls1.effectiveWeight = clipAction.getEffectiveWeight();

      controls2.time = mixer.time;
      controls2.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls2.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}
