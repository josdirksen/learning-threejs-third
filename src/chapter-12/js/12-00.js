function init() {

  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(10, 10, 10));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 / 60});
  scene.setGravity(new THREE.Vector3(0, -10, 0));

  initDefaultLighting(scene);

  

  scene.simulate();
  
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    scene.simulate(undefined, 1);
  }
}

