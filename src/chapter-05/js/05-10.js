function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var knot = createMesh(new THREE.TorusKnotGeometry(10, 1, 64, 8, 2, 3));
  // add the sphere to the scene
  scene.add(knot);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial
    this.radius = knot.children[0].geometry.parameters.radius;
    this.tube = 0.3;
    this.radialSegments = knot.children[0].geometry.parameters.radialSegments;
    this.tubularSegments = knot.children[0].geometry.parameters.tubularSegments;
    this.p = knot.children[0].geometry.parameters.p;
    this.q = knot.children[0].geometry.parameters.q;
    this.heightScale = 1;

    this.redraw = function () {
      // remove the old plane
      scene.remove(knot);
      // create a new one

      knot = createMesh(new THREE.TorusKnotGeometry(controls.radius, controls.tube, Math.round(
        controls.radialSegments), Math.round(controls.tubularSegments), Math.round(
        controls.p), Math.round(controls.q)));
      // add it to the scene.
      scene.add(knot);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 0, 400).step(1).onChange(controls.redraw);
  gui.add(controls, 'tubularSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'p', 1, 10).step(1).onChange(controls.redraw);
  gui.add(controls, 'q', 1, 15).step(1).onChange(controls.redraw);
  // gui.add(controls, 'heightScale', 0, 5).onChange(controls.redraw);


  render();

  function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial({});
    meshMaterial.side = THREE.DoubleSide;

    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

    return mesh;
  }

  function render() {
    stats.update();

    knot.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}