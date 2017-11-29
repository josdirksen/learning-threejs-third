function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  camera.position.set(0, 0, 150);
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  createParticles();
  render();

  function createParticles() {

    var geom = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
      size: 4,
      vertexColors: true,
      color: 0xffffff
    });

    for (var x = -5; x < 5; x++) {
      for (var y = -5; y < 5; y++) {
        var particle = new THREE.Vector3(x * 10, y * 10, 0);
        geom.vertices.push(particle);
        geom.colors.push(new THREE.Color(Math.random() * 0x00ffff));
      }
    }

    var cloud = new THREE.PointCloud(geom, material);
    scene.add(cloud);
  }


  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}