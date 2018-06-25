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
  var groundPlane = addLargeGroundPlane(scene, true)
  groundPlane.position.y = -8;

  initDefaultLighting(scene);

  var canvas = document.createElement("canvas");
  canvas.height = 256;
  canvas.height = 256;
  document.getElementById('canvas-output').appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var date = new Date();
  var pn = new Perlin('rnd' + date.getTime());

  fillWithPerlin(pn, ctx);
  function fillWithPerlin(perlin, ctx) {
      for (var x = 0; x < 300; x++) {
          for (var y = 0; y < 300; y++) {
              var base = new THREE.Color(0xffffff);
              var value = perlin.noise(x / 10, y / 10, 0);
              base.multiplyScalar(value);
              ctx.fillStyle = "#" + base.getHexString();
              ctx.fillRect(x, y, 1, 1);
          }
      }
  }

  var textureLoader = new THREE.TextureLoader();
  document.getElementById('canvas-output').appendChild(canvas);
  var cube = new THREE.CubeGeometry(23, 10, 16)
  var cubeMaterial = new THREE.MeshStandardMaterial({
      bumpMap: new THREE.Texture(canvas),
      metalness: 0,
      roughness: 1,
      color: 0xffffff,
      bumpScale: 3,
      map: textureLoader.load('../../assets/textures/general/wood-2.jpg')
  });

  groundPlane.receiveShadow = true;
  sphereMesh = new THREE.Mesh(cube, cubeMaterial);
  sphereMesh.castShadow = true;

  scene.add(sphereMesh);

  sphereMesh.material.bumpMap.needsUpdate = true;

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    sphereMesh.rotation.y += 0.01;
    
  }
}
