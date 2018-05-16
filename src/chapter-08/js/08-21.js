function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  var loader = new THREE.PlayCanvasLoader();
  loader.load("../../assets/models/statue/Statue_1.json", function (group) {
    group.scale.set(1, 1, 1);
    var material = new THREE.MeshNormalMaterial();
    material.side = THREE.DoubleSide;

    setMaterialGroup(material, group);
    loaderScene.render(group, camera);
  });


}