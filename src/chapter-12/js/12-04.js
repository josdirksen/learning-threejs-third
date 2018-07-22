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

  ground_material = Physijs.createMaterial(new THREE.MeshStandardMaterial(), 0, 0);

  // Bar
  ground = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 100), ground_material, 0);
  ground.receiveShadow = true;

  scene.add(ground);
  scene.simulate();
  createPointToPoint(scene);
  
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

function createPointToPoint(scene) {

  var beads = [];
  var rangeMin = -10;
  var rangeMax = 10;
  var count = 20;
  var scale = chroma.scale(['red', 'yellow']);

  for (var i = 0 ; i < count ; i++) {
    var bead = new THREE.SphereGeometry(0.5);
    var physBead = new Physijs.SphereMesh(bead, Physijs.createMaterial(new THREE.MeshStandardMaterial({color: scale(Math.random()).hex()}), 0, 0)); 
    physBead.position.set(i * (-rangeMin + rangeMax)/count + rangeMin, 10, Math.random()/2);
    scene.add(physBead);
    if (i != 0) {
      var beadConstraint = new Physijs.PointConstraint(beads[i-1], physBead, physBead.position);
      scene.addConstraint(beadConstraint);
    }
    physBead.castShadow = true;
    beads.push(physBead);
  }
}