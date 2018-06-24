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
  initDefaultLighting(scene);

  var gui = new dat.GUI();
  var controls = {
    normalScaleX: 1,
    normalScaleY: 1
  };

  var urls = [
      '../../assets/textures/cubemap/colloseum/right.png',
      '../../assets/textures/cubemap/colloseum/left.png',
      '../../assets/textures/cubemap/colloseum/top.png',
      '../../assets/textures/cubemap/colloseum/bottom.png',
      '../../assets/textures/cubemap/colloseum/front.png',
      '../../assets/textures/cubemap/colloseum/back.png'
  ];

  var cubeLoader = new THREE.CubeTextureLoader();
  var textureLoader = new THREE.TextureLoader();
  var cubeMap = cubeLoader.load(urls);
  scene.background = cubeMap;

  var cubeMaterial = new THREE.MeshStandardMaterial({
      envMap: cubeMap,
      color: 0xffffff,
      metalness: 1,
      roughness: 0,
  });

  var sphereMaterial = cubeMaterial.clone();
  sphereMaterial.normalMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg");
  sphereMaterial.aoMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg");
  sphereMaterial.shininessMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg");

  var cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
  scene.add(cubeCamera);

  var cube = new THREE.CubeGeometry(26, 22, 12)
  var cube1 = addGeometryWithMaterial(scene, cube, 'cube', gui, controls, cubeMaterial);
  cube1.position.x = -15;
  cube1.rotation.y = -1/3*Math.PI;
  cubeCamera.position.copy(cube1.position);
  cubeMaterial.envMap = cubeCamera.renderTarget;

  var sphere = new THREE.SphereGeometry(5, 50, 50)
  var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);
  sphere1.position.x = 15;

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    cube1.visible = false;
    cubeCamera.updateCubeMap(renderer, scene);
    cube1.visible = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    cube1.rotation.y += 0.01;
    sphere1.rotation.y -= 0.01;
  }
}
