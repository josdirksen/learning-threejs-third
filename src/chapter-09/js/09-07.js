function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  // Don't use the default lights, since that's a spotlight
  scene.add(new THREE.AmbientLight(0x222222));
  var dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(50, 10, 0);
  scene.add(dirLight);

  var orbitControls = new THREE.OrbitControls(camera);
  orbitControls.autoRotate = true;

  var planetTexture = new THREE.TextureLoader().load("../../assets/textures/mars/mars_1k_color.jpg");
  var normalTexture = new THREE.TextureLoader().load("../../assets/textures/mars/mars_1k_normal.jpg");
  var planetMaterial = new THREE.MeshLambertMaterial({map: planetTexture, normalMap: normalTexture});

  scene.add(new THREE.Mesh(new THREE.SphereGeometry(20, 40, 40), planetMaterial))

  render();
  function render() {
    stats.update();
    orbitControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
