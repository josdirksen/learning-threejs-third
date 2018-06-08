function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  var trackballControls = initTrackballControls(camera, renderer);
  camera.position.set(0, 0, 30);
  var clock = new THREE.Clock();

  var mixer = new THREE.AnimationMixer();
  var clipAction

  var controls
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }
  
  initDefaultLighting(scene);
  
  var manager = new THREE.LoadingManager();
  var textureLoader = new THREE.TextureLoader();
  var loader = new THREE.XLoader( manager, textureLoader );
  var animLoader = new THREE.XLoader( manager, textureLoader );

  // we could also queue this or use promises
  loader.load(["../../assets/models/x/SSR06_model.x"], function (result) {
    var mesh = result.models[0];
    animLoader.load(["../../assets/models/x/stand.x", { putPos: false, putScl: false }], function (anim) {      
      animLoader.assignAnimation(mesh);
      // at this point we've got a normal mesh, and can get the mixer and clipactio

      mixer = mesh.animationMixer;
      clipAction = mixer.clipAction( "stand" ).play();
      var clip = clipAction.getClip();

      var gui = new dat.GUI();
      var mixerFolder = gui.addFolder("AnimationMixer")
      mixerFolder.add(mixerControls, "time").listen()
      mixerFolder.add(mixerControls, "timeScale", 0, 20).onChange(function (timeScale) {mixer.timeScale = timeScale});
      mixerFolder.add(mixerControls, "stopAllAction").listen()

      controls = addClipActionFolder("ClipAction", gui, clipAction, clip);

      mesh.translateY(-6)
      mesh.rotateY(-0.7*Math.PI);
      scene.add(mesh)
    });
  });

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction) {
      mixer.update( delta );
      controls.time = mixer.time;
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}