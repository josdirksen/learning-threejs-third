function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  var textureLoader = new THREE.TextureLoader();
  var groundPlane = addLargeGroundPlane(scene, true)
  groundPlane.position.y = -8;

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  var gui = new dat.GUI();
  var controls = {
    displacementScale: 1,
    displacementBias: 0,
  };

  var sphere = new THREE.SphereGeometry(8, 180, 180)
  var sphereMaterial = new THREE.MeshStandardMaterial({
      map: textureLoader.load("../../assets/textures/w_c.jpg"),
      displacementMap: textureLoader.load("../../assets/textures/w_d.png"),
      metalness: 0.02,
      roughness: 0.07,
      color: 0xffffff
  });

  
  groundPlane.receiveShadow = true;
  sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
  sphereMesh.castShadow = true;

  // addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);

  scene.add(sphereMesh);

  gui.add(controls, "displacementScale", -5, 5, 0.01).onChange(function(e) {sphereMaterial.displacementScale = e});
  gui.add(controls, "displacementBias", -5, 5, 0.01).onChange(function(e) {sphereMaterial.displacementBias = e});

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    sphereMesh.rotation.y += 0.01;
  }
}
