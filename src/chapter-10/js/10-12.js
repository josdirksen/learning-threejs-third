function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));  
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  var gui = new dat.GUI();


  var loader = new THREE.ObjectLoader();
  var textureLoader = new THREE.TextureLoader();
  loader.load("../../assets/models/lightmap/lightmap.json", function (sceneGroup) {
    sceneGroup.scale.set(7,7,7);
    var plane = sceneGroup.getObjectByName("Plane")
    plane.geometry.faceVertexUvs.push(plane.geometry.faceVertexUvs[0]);
    plane.material = new THREE.MeshBasicMaterial({
      map: textureLoader.load("../../assets/textures/general/floor-wood.jpg"),
      lightMap: textureLoader.load("../../assets/textures/lightmap/lightmap.png"),
    });

    // add some color and a different material to the head
    var suzanne = sceneGroup.getObjectByName("Suzanne")
    suzanne.geometry.computeVertexNormals();
    suzanne.geometry.computeFaceNormals();
    suzanne.geometry.normalsNeedUpdate = true;
    suzanne.material = new THREE.MeshStandardMaterial({color: 0x445566});
    
    var controls = {
      lightMapIntensity: 1
    };

    gui.add(controls, "lightMapIntensity", 0, 5, 0.01).onChange(function(e) {plane.material.lightMapIntensity = e})
    // call the default render loop.
    loaderScene.render(sceneGroup, camera);
  });
}