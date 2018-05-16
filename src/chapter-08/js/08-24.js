function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  var loader = new THREE.GCodeLoader();

  // you can use slicer to convert the model
  loader.load("../../assets/models/benchy/benchy.gcode", function (object) {
    loaderScene.render(object, camera);
  });


}