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
  groundPlane.receiveShadow = true;

  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  var gui = new dat.GUI();
  var controls = {
    displacementScale: 1,
    displacementBias: 0,
  };

  var textureLoader = new THREE.TextureLoader();
  var material = new THREE.MeshStandardMaterial({
    map: textureLoader.load("../../assets/textures/uv/ash_uvgrid01.jpg"),
    metalness: 0.02,
    roughness: 0.07,
    color: 0xffffff
  });

  var jsonLoader = new THREE.JSONLoader();
  // jsonLoader.load("../../assets/models/uv/uv-changed.json", function(model) {
  jsonLoader.load("../../assets/models/uv/uv-standard.json", function(model) {
    var mesh = new THREE.Mesh(model, material)
    mesh.scale.set(8, 8, 8);
    mesh.rotation.y += 0.3*Math.PI;
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
