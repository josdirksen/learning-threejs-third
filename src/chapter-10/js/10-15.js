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
  var spotLight = scene.getObjectByName("spotLight");
  spotLight.intensity = 0.1;
  scene.remove(scene.getObjectByName("ambientLight"))

  var gui = new dat.GUI();
  var controls = {
    lightIntensity: 0.1
  };

  var cubeMaterial = new THREE.MeshStandardMaterial({
      emissive: 0xffffff,
      emissiveMap: textureLoader.load("../../assets/textures/emissive/lava.png"),
      normalMap: textureLoader.load("../../assets/textures/emissive/lava-normals.png"),
      metalnessMap: textureLoader.load("../../assets/textures/emissive/lava-smoothness.png"),
      metalness: 1,
      roughness: 0.4,
      normalScale: new THREE.Vector2(4,4)
  });

  var cube = new THREE.BoxGeometry(16, 16, 16)
  var cube1 = addGeometryWithMaterial(scene, cube, 'cube', gui, controls, cubeMaterial);
  cube1.rotation.y = 1/3*Math.PI;
  cube1.position.x = -12;

  var sphere = new THREE.SphereGeometry(9, 50, 50)
  var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, cubeMaterial.clone());
  sphere1.rotation.y = 1/6*Math.PI;
  sphere1.position.x = 15;

  gui.add(controls, "lightIntensity", 0, 1, 0.01).onChange(function(e) {
    spotLight.intensity = e
  });
  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;
  }
}
