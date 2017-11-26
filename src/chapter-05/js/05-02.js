function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();
  var scene = new THREE.Scene();


  var circle = createMesh(new THREE.CircleGeometry(4, 10, 0.3 * Math.PI * 2, 0.3 * Math.PI * 2));
  // add the sphere to the scene
  scene.add(circle);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  scene.add(spotLight);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial
    this.radius = 4;

    this.thetaStart = 0.3 * Math.PI * 2;
    this.thetaLength = 0.3 * Math.PI * 2;
    this.segments = 10;

    this.redraw = function () {
      // remove the old plane
      scene.remove(circle);
      // create a new one
      circle = createMesh(new THREE.CircleGeometry(controls.radius, controls.segments, controls.thetaStart,
        controls.thetaLength));
      // add it to the scene.
      scene.add(circle);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'segments', 0, 40).onChange(controls.redraw);
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

    circle.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}