function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.VTKLoader();
  loader.load("../../assets/models/moai/moai_fixed.vtk", function (geometry) {
    var mat = new THREE.MeshNormalMaterial();

    geometry.center();
    geometry.computeVertexNormals();

    var group = new THREE.Mesh(geometry, mat);
    group.scale.set(25, 25, 25);

    loaderScene.render(group, camera);
  });
}