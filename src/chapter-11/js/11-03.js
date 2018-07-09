function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var textureLoader = new THREE.TextureLoader();

  // create a scene and add a light
  var scene = new THREE.Scene();
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  var renderPass = new THREE.RenderPass(scene, camera);
  var glitchPass = new THREE.GlitchPass();
  var halftonePass = new THREE.HalftonePass();
  var outlinePass = new THREE.OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera, [earth]);
  var unrealBloomPass = new THREE.UnrealBloomPass();

  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  // define the composers
  var composer1 = new THREE.EffectComposer(renderer);
  composer1.addPass(renderPass);
  composer1.addPass(glitchPass);
  composer1.addPass(effectCopy);

  var composer2 = new THREE.EffectComposer(renderer);
  composer2.addPass(renderPass);
  composer2.addPass(halftonePass);
  composer2.addPass(effectCopy);

  var composer3 = new THREE.EffectComposer(renderer);
  composer3.addPass(renderPass);
  composer3.addPass(outlinePass);
  composer3.addPass(effectCopy);

  var composer4 = new THREE.EffectComposer(renderer);
  composer4.addPass(renderPass);
  composer4.addPass(unrealBloomPass);
  composer4.addPass(effectCopy);

  // setup controls
    // setup controls
  var gui = new dat.GUI();
  var controls = {};

  addGlitchPassControls(gui, controls, glitchPass, function(gp) {composer1.passes[1] = gp});
  addHalftonePassControls(gui, controls, halftonePass, function(htp) {
    composer2 = new THREE.EffectComposer(renderer);
    composer2.addPass(renderPass);
    composer2.addPass(htp);
    composer2.addPass(effectCopy);
  });
  addOutlinePassControls(gui, controls, outlinePass);
  addUnrealBloomPassControls(gui, controls, unrealBloomPass, function(ub) {
    composer4 = new THREE.EffectComposer(renderer);
    composer4.addPass(renderPass);
    composer4.addPass(ub);
    composer4.addPass(effectCopy);
  });
  
  // do the rendering to different parts
  var width = window.innerWidth;
  var height = window.innerHeight;
  var halfWidth = width / 2;
  var halfHeight = height / 2;
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    renderer.autoClear = false;
    renderer.clear();
    
    renderer.setViewport(0, 0, halfWidth, halfHeight);
    composer1.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    composer2.render(delta);
    
    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    composer3.render(delta);
    
    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer4.render(delta);

    requestAnimationFrame(render);
  }
}
