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
  var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);  
  effectFilm.renderToScreen = true;
  var bloomPass = new THREE.BloomPass();    
  var dotScreenPass = new THREE.DotScreenPass();   
  var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  effectCopy.renderToScreen = true;

  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectCopy);

  // reuse the rendered scene from the composer
  var renderedScene = new THREE.TexturePass(composer.renderTarget2); 

  // define the composers
  var effectFilmComposer = new THREE.EffectComposer(renderer);
  effectFilmComposer.addPass(renderedScene);
  effectFilmComposer.addPass(effectFilm);

  var bloomComposer = new THREE.EffectComposer(renderer);
  bloomComposer.addPass(renderedScene);
  bloomComposer.addPass(bloomPass);
  bloomComposer.addPass(effectCopy);

  var dotScreenComposer = new THREE.EffectComposer(renderer);
  dotScreenComposer.addPass(renderedScene);
  dotScreenComposer.addPass(dotScreenPass);
  dotScreenComposer.addPass(effectCopy);

  // setup controls
    // setup controls
  var gui = new dat.GUI();
  var controls = {};
  
  addFilmPassControls(gui, controls, effectFilm);
  addDotScreenPassControls(gui, controls, dotScreenPass);
  addBloomPassControls(gui, controls, bloomPass, function(updated) {bloomComposer.passes[1] = updated;});
  
  // do the basic rendering, since we render to multiple parts of the screen
  // determine the 
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
    effectFilmComposer.render(delta);

    renderer.setViewport(0, halfHeight, halfWidth, halfHeight);
    bloomComposer.render(delta);
    
    renderer.setViewport(halfWidth, 0, halfWidth, halfHeight);
    dotScreenComposer.render(delta);
    
    renderer.setViewport(halfWidth, halfHeight, halfWidth, halfHeight);
    composer.render(delta);

    requestAnimationFrame(render);
  }
}
