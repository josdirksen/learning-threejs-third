function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var loader = new THREE.AWDLoader();
  loader.load("../../assets/models/polarbear/PolarBear.awd", function (model) {

      model.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshLambertMaterial({
                  color: 0xaaaaaa
              });
          }
      });

      model.scale.set(0.1, 0.1, 0.1);
      loaderScene.render(model, camera);
  });

}