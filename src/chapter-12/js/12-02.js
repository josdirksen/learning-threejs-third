function init() {

  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(50, 80, 90));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var scene = new Physijs.Scene;
  initDefaultLighting(scene, new THREE.Vector3(50,50,60));

  var colors = [0x66ff00, 0x6600ff, 0x0066ff, 0xff6600, 0xff0066];

  // Materials
  ground_material = Physijs.createMaterial(new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../../assets/textures/general/floor-wood.jpg')}), 0.9, 0.6);
  ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
  ground_material.map.repeat.set(4, 8);

  // Ground
  ground = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 130), ground_material, 0);
  ground.receiveShadow = true;
  ground.castShadow = true;

  var borderLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 130), ground_material, 0);
  borderLeft.position.x = -31;
  borderLeft.position.y = 2;
  borderLeft.receiveShadow = true;
  borderLeft.castShadow = true;

  ground.add(borderLeft);

  var borderRight = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 6, 130), ground_material, 0);
  borderRight.position.x = 31;
  borderRight.position.y = 2;

  ground.add(borderRight);

  var borderBottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 6, 2), ground_material, 0);
  borderBottom.position.z = 65;
  borderBottom.position.y = 2;
  ground.add(borderBottom);

  var borderTop = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 6, 2), ground_material, 0);
  borderTop.position.z = -65;
  borderTop.position.y = 2;
  ground.add(borderTop);
  scene.add(ground);

  var meshes = [];

  var controls = new function () {
    this.cubeRestitution = 0.4;
    this.cubeFriction = 0.4;
    this.sphereRestitution = 0.9;
    this.sphereFriction = 0.1;

    this.clearMeshes = function () { 
      meshes.forEach(function (e) { scene.remove(e);});
      meshes = [];
    };

    this.addSpheres = function () {
      var colorSphere = colors[Math.floor(Math.random() * 5)];
      for (var i = 0; i < 5; i++) {

        var sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(2, 20), Physijs.createMaterial(new THREE.MeshStandardMaterial({ color: colorSphere }), controls.sphereFriction, controls.sphereRestitution));
        sphere.position.set(Math.random() * 50 - 25, 20 + Math.random() * 5, Math.random() * 50 - 25);

        meshes.push(sphere);
        scene.add(sphere);
      }
    };

    this.addCubes = function () {
      var colorBox = colors[Math.floor(Math.random() * 5)];
      for (var i = 0; i < 5; i++) {
        box = new Physijs.BoxMesh(new THREE.BoxGeometry(4, 4, 4),
        Physijs.createMaterial(new THREE.MeshStandardMaterial({color: colorBox}), controls.cubeFriction, controls.cubeRestitution));
        box.position.set(Math.random() * 50 - 25, 20 + Math.random() * 5, Math.random() * 50 - 25);
        box.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

        meshes.push(box);
        scene.add(box);
      }
    }
  };

  var gui = new dat.GUI();
  gui.add(controls, 'cubeRestitution', 0, 1);
  gui.add(controls, 'cubeFriction', 0, 1);
  gui.add(controls, 'sphereRestitution', 0, 1);
  gui.add(controls, 'sphereFriction', 0, 1);
  gui.add(controls, 'addCubes');
  gui.add(controls, 'addSpheres');
  gui.add(controls, 'clearMeshes');

  scene.simulate();
  
  var direction = 1;
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);

    ground.rotation.x += 0.003 * direction;

    if (ground.rotation.x < -0.5) direction = 1;
    if (ground.rotation.x > 0.5) direction = -1;
    ground.__dirtyRotation = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    scene.simulate(undefined, 1);
  }
}