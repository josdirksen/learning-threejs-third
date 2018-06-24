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
  scene.add(new THREE.AmbientLight(0x888888));

  var pointLight = new THREE.PointLight("#ffffff");
  scene.add(pointLight);
  var sphereLight = new THREE.SphereGeometry(0.2);
  var sphereLightMaterial = new THREE.MeshStandardMaterial({color: 0xff5808});
  var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
  scene.add(sphereLightMesh);
  
  var gui = new dat.GUI();
  var controls = {
    normalScaleX: 1,
    normalScaleY: 1
  };

  var urls = [
      '../../assets/textures/cubemap/car/right.png',
      '../../assets/textures/cubemap/car/left.png',
      '../../assets/textures/cubemap/car/top.png',
      '../../assets/textures/cubemap/car/bottom.png',
      '../../assets/textures/cubemap/car/front.png',
      '../../assets/textures/cubemap/car/back.png'
  ];

  var cubeLoader = new THREE.CubeTextureLoader();
  scene.background = cubeLoader.load(urls);

  // var alternativeMap = textureLoader.load("../../assets/textures/cubemap/2294472375_24a3b8ef46_o.jpg")
  // alternativeMap.mapping = THREE.EquirectangularReflectionMapping;
  // alternativeMap.magFilter = THREE.LinearFilter;
  // alternativeMap.minFilter = THREE.LinearMipMapLinearFilter;
  // scene.background = alternativeMap;

  var sphere = new THREE.SphereGeometry(8, 50, 50)
  // var sphere = new THREE.CubeGeometry(12, 12, 12)
  var cubeMaterial = new THREE.MeshStandardMaterial({
      envMap: scene.background,
      // envMap: alternativeMap,
      color: 0xffffff,
      metalness: 1,
      roughness: 0.5
  });

  var cubeMaterialWithMetalMap = cubeMaterial.clone();
  cubeMaterialWithMetalMap.metalnessMap = textureLoader.load("../../assets/textures/engraved/roughness-map.jpg")

  var cubeMaterialWithRoughnessMap = cubeMaterial.clone();
  cubeMaterialWithRoughnessMap.roughnessMap = textureLoader.load("../../assets/textures/engraved/roughness-map.jpg")

  var cube1 = addGeometryWithMaterial(scene, sphere, 'metal', gui, controls, cubeMaterialWithMetalMap);
  cube1.position.x = -10;
  cube1.rotation.y = 1/3*Math.PI;

  var cube2 = addGeometryWithMaterial(scene, sphere, 'rough', gui, controls, cubeMaterialWithRoughnessMap);
  cube2.position.x = 10;
  cube2.rotation.y = -1/3*Math.PI;

  render();
  var invert = 1;
  var phase = 0;
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (phase > 2 * Math.PI) {
      invert = invert * -1;
      phase -= 2 * Math.PI;
    } else {
      phase += 0.02;
    }

    sphereLightMesh.position.z = +(21 * (Math.sin(phase)));
    sphereLightMesh.position.x = -14 + (14 * (Math.cos(phase)));
    sphereLightMesh.position.y = 5;

    if (invert < 0) {
        var pivot = 0;
        sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
    }
    pointLight.position.copy(sphereLightMesh.position);
  }
}
