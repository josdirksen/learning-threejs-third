function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  //        var canvasRenderer = new THREE.CanvasRenderer();
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;

  camera.lookAt(new THREE.Vector3(-20, 0, 0))


  document.getElementById("webgl-output").appendChild(renderer.domElement);

  createSprites();
  render();

  function createSprites() {
    var material = new THREE.SpriteMaterial({
      color: 0xff0000
    });


    for (var x = -5; x < 5; x++) {
      for (var y = -5; y < 5; y++) {
        var sprite = new THREE.Sprite(material);
        sprite.position.set(x * 10, y * 10, 0);
        scene.add(sprite);
      }
    }
  }

  function render() {
    stats.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}