function init() {

  // TODO: Remove the spacedPoints stuff

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();


  // position and point the camera to the center of the scene
  camera.position.x = -30;
  camera.position.y = 70;
  camera.position.z = 70;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var shape = createMesh(new THREE.ShapeGeometry(drawShape()));
  // add the sphere to the scene
  scene.add(shape);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  scene.add(spotLight);
  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {

    this.asGeom = function () {
      // remove the old plane
      scene.remove(shape);
      // create a new one
      shape = createMesh(new THREE.ShapeGeometry(drawShape()));
      // add it to the scene.
      scene.add(shape);
    };

    this.asPoints = function () {
      // remove the old plane
      scene.remove(shape);
      // create a new one
      shape = createLine(drawShape(), false);
      // add it to the scene.
      scene.add(shape);
    };

    this.asSpacedPoints = function () {
      // remove the old plane
      scene.remove(shape);
      // create a new one
      shape = createLine(drawShape(), true);
      // add it to the scene.
      scene.add(shape);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'asGeom');
  gui.add(controls, 'asPoints');
  gui.add(controls, 'asSpacedPoints');


  render();

  function drawShape() {

    // create a basic shape
    var shape = new THREE.Shape();

    // startpoint
    shape.moveTo(10, 10);

    // straight line upwards
    shape.lineTo(10, 40);

    // the top of the figure, curve to the right
    shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

    // spline back down
    shape.splineThru(
      [new THREE.Vector2(32, 30),
        new THREE.Vector2(28, 20),
        new THREE.Vector2(30, 10),
      ]);

    // curve at the bottom
    shape.quadraticCurveTo(20, 15, 10, 10);

    // add 'eye' hole one
    var hole1 = new THREE.Path();
    hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
    shape.holes.push(hole1);

    // add 'eye hole 2'
    var hole2 = new THREE.Path();
    hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
    shape.holes.push(hole2);

    // add 'mouth'
    var hole3 = new THREE.Path();
    hole3.absarc(20, 16, 2, 0, Math.PI, true);
    shape.holes.push(hole3);

    // return the shape
    return shape;
  }

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

  function createLine(shape, spaced) {
    var s = new THREE.Shape()

    if (!spaced) {
      var points = shape.getPoints(5)
      var mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({
        color: 0xff3333,
        linewidth: 2
      }));
      return mesh;
    } else {
      var points = shape.getPoints(5)
      var mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({
        color: 0xff3333,
        linewidth: 2
      }));
      return mesh;
    }

  }

  function render() {
    stats.update();

    shape.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}