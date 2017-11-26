function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var cylinder = createMesh(new THREE.CylinderGeometry(20, 20, 20));
  // add the sphere to the scene
  scene.add(cylinder);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.radiusTop = 20;
    this.radiusBottom = 20;
    this.height = 20;

    this.radialSegments = 8;
    this.heightSegments = 8;

    this.openEnded = false;

    this.redraw = function () {
      // remove the old plane
      scene.remove(cylinder);
      // create a new one

      cylinder = createMesh(new THREE.CylinderGeometry(controls.radiusTop, controls.radiusBottom,
        controls.height, controls.radialSegments, controls.heightSegments, controls.openEnded
      ));
      // add it to the scene.
      scene.add(cylinder);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radiusTop', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'radiusBottom', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'openEnded').onChange(controls.redraw);


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

    cylinder.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}