function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  renderer.setClearColor(0xEEEEEE);

  var camera = initCamera();
  // position and point the camera to the center of the scene
  camera.position.set(-80, 80, 80);
  camera.lookAt(new THREE.Vector3(60, -60, 0));


  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var shape = createMesh(new THREE.ShapeGeometry(drawShape()));
  // add the sphere to the scene
  scene.add(shape);


  var spotLight = new THREE.DirectionalLight(0xffffff);
  spotLight.position = new THREE.Vector3(70, 170, 70);
  spotLight.intensity = 0.7;

  spotLight.target = shape;

  scene.add(spotLight);

  // call the render function
  var step = 0;


  // setup the control gui
  var controls = new function () {

    this.amount = 2;
    this.bevelThickness = 2;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;

    this.asGeom = function () {
      // remove the old plane
      scene.remove(shape);
      // create a new one

      var options = {
        amount: controls.amount,
        bevelThickness: controls.bevelThickness,
        bevelSize: controls.bevelSize,
        bevelSegments: controls.bevelSegments,
        bevelEnabled: controls.bevelEnabled,
        curveSegments: controls.curveSegments,
        steps: controls.steps
      };

      shape = createMesh(new THREE.ExtrudeGeometry(drawShape(), options));
      // add it to the scene.
      scene.add(shape);
    };

  };

  var gui = new dat.GUI();
  gui.add(controls, 'amount', 0, 20).onChange(controls.asGeom);
  gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);
  gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);
  gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);
  gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);
  gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);
  gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);

  controls.asGeom();
  render();

  function drawShape() {

    var svgString = document.querySelector("#batman-path").getAttribute("d");

    var shape = transformSVGPathExposed(svgString);

    // return the shape
    return shape;
  }

  function createMesh(geom) {

    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-390, -74, 0));


    // assign two materials
    var meshMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.3
    });
    var mesh = new THREE.Mesh(geom, meshMaterial);
    mesh.scale.x = 0.1;
    mesh.scale.y = 0.1;

    mesh.rotation.z = Math.PI;
    mesh.rotation.x = -1.1;
    return mesh;
  }


  function render() {
    stats.update();

    shape.rotation.y = step += 0.005;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}