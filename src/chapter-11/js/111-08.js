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

  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectFilm);

  // setup controls
  var gui = new dat.GUI();
  var controls = {};
  addFilmPassControls(gui, controls, effectFilm);
  
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
