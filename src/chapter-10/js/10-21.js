function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and
  // lights. and add some simple default lights
  var scene = new THREE.Scene();
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  var textureLoader = new THREE.TextureLoader();

  var cubeMesh;
  var sphereMesh;
  var polyhedronMesh;
  var gui = new dat.GUI();

  var controls = {
    repeatX: 1,
    repeatY: 1,
    repeatWrapping: true,

    updateRepeat: function (e) {

      cubeMesh.material.map.repeat.set(controls.repeatX, controls.repeatY)
      sphereMesh.material.map.repeat.set(controls.repeatX, controls.repeatY)
      polyhedronMesh.material.map.repeat.set(controls.repeatX, controls.repeatY)

      if (controls.repeatWrapping) {
        cubeMesh.material.map.wrapS = THREE.RepeatWrapping;
        cubeMesh.material.map.wrapT = THREE.RepeatWrapping;
        sphereMesh.material.map.wrapS = THREE.RepeatWrapping;
        sphereMesh.material.map.wrapT = THREE.RepeatWrapping;
        polyhedronMesh.material.map.wrapS = THREE.RepeatWrapping;
        polyhedronMesh.material.map.wrapT = THREE.RepeatWrapping;
      } else {
        cubeMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        cubeMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
        sphereMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        sphereMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
        polyhedronMesh.material.map.wrapS = THREE.ClampToEdgeWrapping;
        polyhedronMesh.material.map.wrapT = THREE.ClampToEdgeWrapping;
      }

      cubeMesh.material.map.needsUpdate = true;
      sphereMesh.material.map.needsUpdate = true;
      polyhedronMesh.material.map.needsUpdate = true;
    }
  };

  var polyhedron = new THREE.IcosahedronGeometry(8, 0);
  polyhedronMesh = addGeometry(scene, polyhedron, 'polyhedron', textureLoader.load('../../assets/textures/general/metal-rust.jpg'), gui, controls);
  polyhedronMesh.position.x = 20;

  var sphere = new THREE.SphereGeometry(5, 20, 20)
  sphereMesh = addGeometry(scene, sphere, 'sphere', textureLoader.load('../../assets/textures/general/floor-wood.jpg'), gui, controls);

  var cube = new THREE.BoxGeometry(10, 10, 10)
  cubeMesh = addGeometry(scene, cube, 'cube', textureLoader.load('../../assets/textures/general/brick-wall.jpg'), gui, controls);
  cubeMesh.position.x = -20;

  

  gui
    .add(controls, "repeatX", -4, 4)
    .onChange(controls.updateRepeat);
  gui
    .add(controls, "repeatY", -4, 4)
    .onChange(controls.updateRepeat);
  gui
    .add(controls, "repeatWrapping")
    .onChange(controls.updateRepeat);

  

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    polyhedronMesh.rotation.x += 0.01;
    sphereMesh.rotation.y += 0.01;
    cubeMesh.rotation.z += 0.01;
  }
}
