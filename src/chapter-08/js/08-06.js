function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  var loader = new THREE.OBJLoader();
  loader.load('../../assets/models/pinecone/pinecone.obj', function (mesh) {

    var material = new THREE.MeshLambertMaterial({
      color: 0x5C3A21
    });

    // loadedMesh is a group of meshes. For 
    // each mesh set the material, and compute the information 
    // three.js needs for rendering.
    mesh.children.forEach(function (child) {
      child.material = material;
      child.geometry.computeVertexNormals();
      child.geometry.computeFaceNormals();
    });

    mesh.scale.set(120,120,120)

    // call the default render loop.
    loaderScene.render(mesh, camera);
  });
}