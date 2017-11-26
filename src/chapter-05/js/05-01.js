function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var plane = createMesh(new THREE.PlaneGeometry(10, 14, 4, 4));
  // add the sphere to the scene
  scene.add(plane);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  scene.add(spotLight);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial


    this.width = plane.children[0].geometry.parameters.width;
    this.height = plane.children[0].geometry.parameters.height;

    this.widthSegments = plane.children[0].geometry.parameters.widthSegments;
    this.heightSegments = plane.children[0].geometry.parameters.heightSegments;

    this.redraw = function () {
      // remove the old plane
      scene.remove(plane);
      // create a new one
      plane = createMesh(new THREE.PlaneGeometry(controls.width, controls.height, Math.round(controls
        .widthSegments), Math.round(controls.heightSegments)));
      // add it to the scene.
      scene.add(plane);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'width', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 10).onChange(controls.redraw);
  render();

  function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return plane;
  }

  function render() {
    stats.update();

    plane.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}