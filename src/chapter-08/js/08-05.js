function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  var loader = new THREE.JSONLoader();
  loader.load('../../assets/models/house/house.json', function (geometry, mat) {

    var mesh = new THREE.Mesh(geometry, mat[0]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // call the default render loop.
    loaderScene.render(mesh, camera);
  });
}