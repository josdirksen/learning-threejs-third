function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var torus = createMesh(new THREE.RingGeometry());
  // add the sphere to the scene
  scene.add(torus);

  // call the render function
  var step = 0;
  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.innerRadius = 0;
    this.outerRadius = 50;
    this.thetaSegments = 8;
    this.phiSegments = 8;
    this.thetaStart = 0;
    this.thetaLength = Math.PI * 2;

    this.redraw = function () {
      // remove the old plane
      scene.remove(torus);
      // create a new one

      torus = createMesh(new THREE.RingGeometry(controls.innerRadius, controls.outerRadius, controls.thetaSegments,
        controls.phiSegments, controls.thetaStart, controls.thetaLength));
      // add it to the scene.
      scene.add(torus);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'innerRadius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'outerRadius', 0, 100).onChange(controls.redraw);
  gui.add(controls, 'thetaSegments', 1, 40).step(1).onChange(controls.redraw);
  gui.add(controls, 'phiSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'thetaStart', 0, Math.PI * 2).onChange(controls.redraw);
  gui.add(controls, 'thetaLength', 0, Math.PI * 2).onChange(controls.redraw);


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

    torus.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}