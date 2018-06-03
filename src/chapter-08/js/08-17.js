function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera, false);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.BabylonLoader();
  var group = new THREE.Object3D();
  loader.load("../../assets/models/skull/skull.babylon", function (loadedScene) {

      // babylon loader contains a complete scene.
      console.log(loadedScene.children[1].material = new THREE.MeshLambertMaterial());
      loaderScene.render(loadedScene, camera);

  });
}