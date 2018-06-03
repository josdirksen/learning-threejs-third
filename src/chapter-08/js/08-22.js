function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  THREE.DRACOLoader.setDecoderPath('../../libs/other/draco/');
	THREE.DRACOLoader.setDecoderConfig({type: 'js'});
  var loader = new THREE.DRACOLoader();

  loader.load("../../assets/models/bunny/bunny.drc", function (geometry) {

    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();

    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());

    mesh.scale.set(150, 150, 150)
    loaderScene.render(mesh, camera);
  });


}