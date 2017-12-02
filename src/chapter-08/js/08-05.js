// When updating this example. 
// Also explain how to first export the image separately, that if we don't
// do this the exporter fails.
// example from https://www.blendswap.com/blends/view/6447
function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer({
    antialias: true
  });
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 40, 80));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // add spotlight for the shadows
  var keyLight = new THREE.SpotLight(0xffffff);
  keyLight.position.set(00, 80, 80);
  keyLight.intensity = 2;
  keyLight.lookAt(new THREE.Vector3(0, 15, 0));
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.mapSize.width = 2048;

  scene.add(keyLight);

  var backlight1 = new THREE.SpotLight(0xaaaaaa);
  backlight1.position.set(150, 40, -20);
  backlight1.intensity = 0.5;
  backlight1.lookAt(new THREE.Vector3(0, 15, 0));
  scene.add(backlight1);

  var backlight2 = new THREE.SpotLight(0xaaaaaa);
  backlight2.position.set(-150, 40, -20);
  backlight2.intensity = 0.5;
  backlight2.lookAt(new THREE.Vector3(0, 15, 0));
  scene.add(backlight2);

  // call the render function
  var step = 0;

  var mesh;
  var loader = new THREE.JSONLoader();
  loader.load('../../assets/models/house/house.json', function (geometry, mat) {

    var m1 = new THREE.MeshLambertMaterial({
      color: 0xff0000
    });

    mesh = new THREE.Mesh(geometry, mat[0]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
  });

  render();


  function render() {
    stats.update();

    if (mesh) {
      mesh.rotation.y += 0.002;
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}