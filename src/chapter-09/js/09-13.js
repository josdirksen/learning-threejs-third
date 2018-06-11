function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 70, 100);
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  var mixer = new THREE.AnimationMixer();
  var clipAction1
  var clipAction2
  var clipAction3
  var animationClip1
  var animationClip2
  var animationClip3
  var selectedClipAction

  var mesh
  var controls1
  var controls2
  var controls3
  var mixerControls = {
    time: 0,
    timeScale: 1,
    stopAllAction: function() {mixer.stopAllAction()},
  }
  
  initDefaultLighting(scene);
  var textureLoader = new THREE.TextureLoader();
  var loader = new THREE.MD2Loader();
  loader.load('../../assets/models/ogre/ogro.md2', function (result) {

    var mat = new THREE.MeshStandardMaterial(
      { morphTargets: true, 
        color: 0xffffff,
        metalness: 0,
        map: textureLoader.load('../../assets/models/ogre/skins/skin.jpg')
    })

    var mat2 = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(result, mat);
    scene.add(mesh);

    // // setup the mixer
    mixer = new THREE.AnimationMixer(mesh);
    animationClip1 = result.animations[7];
    clipAction1 = mixer.clipAction( animationClip1 ).play();    
    animationClip2 = result.animations[9];
    clipAction2 = mixer.clipAction( animationClip2 );
    animationClip3 = result.animations[10];
    clipAction3 = mixer.clipAction( animationClip3 );

    // add the animation controls
    enableControls(result);
  });

  function enableControls(geometry) {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(mixerControls, "time").listen()
    mixerFolder.add(mixerControls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(mixerControls, "stopAllAction").listen()
    
    controls1 = addClipActionFolder("ClipAction 1", gui, clipAction1, animationClip1);
    controls2 = addClipActionFolder("ClipAction 2", gui, clipAction2, animationClip2);
    controls3 = addClipActionFolder("ClipAction 3", gui, clipAction3, animationClip3);

    var animationsArray = geometry.animations.map(function(e) { 
      return e.name;
    });
    animationsArray.push("none")
    var animationMap = geometry.animations.reduce(function(res, el) { 
      res[el.name] = el
      return res;
    }, {"none" : undefined});

    gui.add({animation: "none"}, "animation", animationsArray).onChange(function(selection) {
      clipAction1.stop();
      clipAction2.stop();
      clipAction3.stop();

      if (selectedClipAction) selectedClipAction.stop();
      if (selection != "none") {
        selectedClipAction = mixer.clipAction( animationMap[selection] ).play();    
      }
    });
  }

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction1 && controls1) {
      mixer.update( delta );
      controls1.time = mixer.time;
      controls1.effectiveTimeScale = clipAction1.getEffectiveTimeScale();
      controls1.effectiveWeight = clipAction1.getEffectiveWeight();

      controls2.time = mixer.time;
      controls2.effectiveTimeScale = clipAction2.getEffectiveTimeScale();
      controls2.effectiveWeight = clipAction2.getEffectiveWeight();

      controls3.time = mixer.time;
      controls3.effectiveTimeScale = clipAction3.getEffectiveTimeScale();
      controls3.effectiveWeight = clipAction3.getEffectiveWeight();

    }
  }   
}