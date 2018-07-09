function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene and add a light
  var scene = new THREE.Scene();
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  var renderPass = new THREE.RenderPass(scene, camera);
  var customGrayScale = new THREE.ShaderPass(THREE.CustomGrayScaleShader);
  var customBit = new THREE.ShaderPass(THREE.CustomBitShader);
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;


  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(customGrayScale);
  composer.addPass(customBit);
  composer.addPass(effectCopy);

  // setup controls
  var gui = new dat.GUI();
  addShaderControl(gui, "CustomGray", customGrayScale, { floats: [{ key: "rPower", from: 0, to: 1, step: 0.01 }, { key: "gPower", from: 0, to: 1, step: 0.01 }, { key: "bPower", from: 0, to: 1, step: 0.01 }]});
  addShaderControl(gui, "CustomBit", customBit, { floats: [{ key: "bitSize", from: 1, to: 16, step: 1 }]});
  
  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
