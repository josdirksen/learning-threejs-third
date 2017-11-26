function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var sphere = createMesh(new THREE.SphereGeometry(4, 10, 10));
  // add the sphere to the scene
  scene.add(sphere);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial
    this.radius = sphere.children[0].geometry.parameters.radius;
    this.widthSegments = sphere.children[0].geometry.parameters.widthSegments;
    this.heightSegments = sphere.children[0].geometry.parameters.heightSegments;
    this.phiStart = 0;
    this.phiLength = Math.PI * 2;
    this.thetaStart = 0;
    this.thetaLength = Math.PI;


    this.redraw = function () {
      // remove the old plane
      scene.remove(sphere);
      // create a new one
      sphere = createMesh(new THREE.SphereGeometry(controls.radius, controls.widthSegments, controls.heightSegments,
        controls.phiStart, controls.phiLength, controls.thetaStart, controls.thetaLength));
      // add it to the scene.
      scene.add(sphere);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'widthSegments', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);


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

    sphere.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}