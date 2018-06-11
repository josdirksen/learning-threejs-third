function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 70, 70);
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  var mixer = new THREE.AnimationMixer();
  var clipAction
  var animationClip
  var mesh
  var controls
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }
  
  initDefaultLighting(scene);
  var loader = new THREE.JSONLoader();
  loader.load('../../assets/models/hand/hand-8.json', function (result) {

    var mesh = new THREE.SkinnedMesh(result, new THREE.MeshNormalMaterial({skinning: true}));
    mesh.scale.set(18, 18, 18)
    scene.add(mesh);

    // setup the mixer
    mixer = new THREE.AnimationMixer( mesh );
    animationClip = mesh.geometry.animations[0];
    clipAction = mixer.clipAction( animationClip ).play();    
    animationClip = clipAction.getClip();

    // add the animation controls
    enableControls();
  });

  function enableControls() {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(mixerControls, "time").listen()
    mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(mixerControls, "stopAllAction").listen()
    
    controls = addClipActionFolder("ClipAction 1", gui, clipAction, animationClip);
  }

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction && controls) {
      mixer.update( delta );
      controls.time = mixer.time;
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}