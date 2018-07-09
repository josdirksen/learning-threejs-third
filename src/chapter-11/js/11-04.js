function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var textureLoader = new THREE.TextureLoader();
  renderer.autoClear = false;

  // create the scenes
  var sceneEarth = new THREE.Scene();
  var sceneMars = new THREE.Scene();
  var sceneBG = new THREE.Scene();

  // create all the scenes we'll be rendering.
  sceneBG.background = textureLoader.load("../../assets/textures/bg/starry-deep-outer-space-galaxy.jpg");
  var earthAndLight = addEarth(sceneEarth);
  sceneEarth.translateX(-16);
  sceneEarth.scale.set(1.2, 1.2, 1.2);
  var marsAndLight = addMars(sceneMars);
  sceneMars.translateX(12);
  sceneMars.translateY(6);
  sceneMars.scale.set(0.2, 0.2, 0.2);

  // setup passes. First the main renderpasses. Note that
  // only the bgRenderpass clears the screen.
  var bgRenderPass = new THREE.RenderPass(sceneBG, camera);
  var earthRenderPass = new THREE.RenderPass(sceneEarth, camera);
  earthRenderPass.clear = false;
  var marsRenderPass = new THREE.RenderPass(sceneMars, camera);
  marsRenderPass.clear = false;

  // setup the mask
  var clearMask = new THREE.ClearMaskPass();
  var earthMask = new THREE.MaskPass(sceneEarth, camera);
  var marsMask = new THREE.MaskPass(sceneMars, camera);

  // setup some effects to apply
  var effectSepia = new THREE.ShaderPass(THREE.SepiaShader);
  effectSepia.uniforms['amount'].value = 0.8;
  var effectColorify = new THREE.ShaderPass(THREE.ColorifyShader);
  effectColorify.uniforms['color'].value.setRGB(0.5, 0.5, 1);

  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;
  
  var composer = new THREE.EffectComposer(renderer);
  composer.renderTarget1.stencilBuffer = true;
  composer.renderTarget2.stencilBuffer = true;
  composer.addPass(bgRenderPass);
  composer.addPass(earthRenderPass);
  composer.addPass(marsRenderPass);
  composer.addPass(marsMask);
  composer.addPass(effectColorify);
  composer.addPass(clearMask);
  composer.addPass(earthMask);
  composer.addPass(effectSepia);
  composer.addPass(clearMask);
  composer.addPass(effectCopy);

  // setup controls
  var gui = new dat.GUI();
  var controls = {};
  addSepiaShaderControls(gui, controls, effectSepia);
  addColorifyShaderControls(gui, controls, effectColorify);
  
  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    earthAndLight.earth.rotation.y += 0.001;
    earthAndLight.pivot.rotation.y += -0.0003;
    marsAndLight.mars.rotation.y += -0.001;
    marsAndLight.pivot.rotation.y += +0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
