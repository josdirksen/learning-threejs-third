function init() {

  // setup the scene for rendering
  var loaderScene = new BaseLoaderScene();
  var camera = initCamera(new THREE.Vector3(35, 35, 35));
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  // load the model
  var loader = new THREE.ColladaLoader();
  loader.load("../../assets/models/medieval/Medieval_building.DAE", function (result) {
    var sceneGroup = result.scene;

    sceneGroup.children.forEach(function (child) {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      } else {
        // remove any lighting sources from the model
        sceneGroup.remove(child);
      }
    });

    // correctly scale and position the model
    sceneGroup.rotation.z = 0.5 * Math.PI;
    sceneGroup.scale.set(8, 8, 8);

    // call the default render loop.
    loaderScene.render(sceneGroup, camera);
  });
}