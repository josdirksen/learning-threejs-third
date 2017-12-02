function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(50, 40, 50));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var keyLight = new THREE.SpotLight(0xffffff);
  keyLight.position.set(00, 80, 80);
  keyLight.intensity = 2;
  keyLight.lookAt(new THREE.Vector3(0, 15, 0));
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.mapSize.width = 2048;

  scene.add(keyLight);

  var backlight1 = new THREE.SpotLight(0xaaaaaa);
  backlight1.position.set(150, 40, -20);
  backlight1.intensity = 0.5;
  backlight1.lookAt(new THREE.Vector3(0, 15, 0));
  scene.add(backlight1);

  var backlight2 = new THREE.SpotLight(0xaaaaaa);
  backlight2.position.set(-150, 40, -20);
  backlight2.intensity = 0.5;
  backlight2.lookAt(new THREE.Vector3(0, 15, 0));
  scene.add(backlight2);

  // call the render function
  var step = 0;

  var mesh;
  var loader = new THREE.OBJLoader();
  loader.load('../../assets/models/pinecone/pinecone.obj', function (loadedMesh) {
    var material = new THREE.MeshLambertMaterial({
      color: 0x5C3A21
    });

    // loadedMesh is a group of meshes. For
    // each mesh set the material, and compute the information
    // three.js needs for rendering.
    loadedMesh.children.forEach(function (child) {
      child.material = material;
      child.geometry.computeFaceNormals();
      child.geometry.computeVertexNormals();
    });

    mesh = loadedMesh;
    loadedMesh.scale.set(100, 100, 100);
    loadedMesh.rotation.x = -0.3;
    scene.add(loadedMesh);
  });

  render();

  function render() {
    stats.update();

    if (mesh) {
      mesh.rotation.y += 0.006;
      mesh.rotation.x += 0.006;
    }
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

}