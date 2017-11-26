function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var torus = createMesh(new THREE.TorusGeometry(10, 10, 8, 6, Math.PI * 2));
  // add the sphere to the scene
  scene.add(torus);

  // call the render function
  var step = 0;


  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.radius = torus.children[0].geometry.parameters.radius;
    this.tube = torus.children[0].geometry.parameters.tube;
    this.radialSegments = torus.children[0].geometry.parameters.radialSegments;
    this.tubularSegments = torus.children[0].geometry.parameters.tubularSegments;
    this.arc = torus.children[0].geometry.parameters.arc;

    this.redraw = function () {
      // remove the old plane
      scene.remove(torus);
      // create a new one

      torus = createMesh(new THREE.TorusGeometry(controls.radius, controls.tube, Math.round(controls.radialSegments),
        Math.round(controls.tubularSegments), controls.arc));
      // add it to the scene.
      scene.add(torus);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'tubularSegments', 1, 20).onChange(controls.redraw);
  gui.add(controls, 'arc', 0, Math.PI * 2).onChange(controls.redraw);


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