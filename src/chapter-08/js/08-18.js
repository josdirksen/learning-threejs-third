function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  var loader = new THREE.TDSLoader();
  loader.load("../../assets/models/chair/Eames_chair_DSW.3DS", function (group) {
    group.scale.set(0.3, 0.3, 0.3);
    loaderScene.render(group, camera);
  });
}