function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();
  var scene = new THREE.Scene();

  var cube = createMesh(new THREE.BoxGeometry(10, 10, 10, 1, 1, 1));
  // add the sphere to the scene
  scene.add(cube);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  scene.add(spotLight);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {

    this.width = cube.children[0].geometry.parameters.width;
    this.height = cube.children[0].geometry.parameters.height;
    this.depth = cube.children[0].geometry.parameters.depth;

    this.widthSegments = cube.children[0].geometry.parameters.widthSegments;
    this.heightSegments = cube.children[0].geometry.parameters.heightSegments;
    this.depthSegments = cube.children[0].geometry.parameters.depthSegments;


    this.redraw = function () {
      // remove the old plane
      scene.remove(cube);
      // create a new one
      cube = createMesh(new THREE.BoxGeometry(controls.width, controls.height, controls.depth, Math.round(
        controls.widthSegments), Math.round(controls.heightSegments), Math.round(
        controls.depthSegments)));
      // add it to the scene.
      scene.add(cube);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'depth', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'depthSegments', 0, 10).onChange(controls.redraw);
  render();

  function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
  }

  function render() {
    stats.update();
    cube.rotation.y = step += 0.01;
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}