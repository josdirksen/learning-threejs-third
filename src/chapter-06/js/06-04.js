function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // call the render function
  var step = 0;

  // the points group
  var spGroup;
  // the mesh
  var tubeMesh;

  // setup the control gui
  var controls = new function () {

    this.numberOfPoints = 5;
    this.segments = 64;
    this.radius = 1;
    this.radiusSegments = 8;
    this.closed = false;
    this.points = [];
    // we need the first child, since it's a multimaterial

    this.newPoints = function () {
      var points = [];
      for (var i = 0; i < controls.numberOfPoints; i++) {
        var randomX = -20 + Math.round(Math.random() * 50);
        var randomY = -15 + Math.round(Math.random() * 40);
        var randomZ = -20 + Math.round(Math.random() * 40);

        points.push(new THREE.Vector3(randomX, randomY, randomZ));
      }
      controls.points = points;
      controls.redraw();
    };

    this.redraw = function () {
      scene.remove(spGroup);
      scene.remove(tubeMesh);
      generatePoints(controls.points, controls.segments, controls.radius, controls.radiusSegments,
        controls.closed);
    };

  };

  var gui = new dat.GUI();
  gui.add(controls, 'newPoints');
  gui.add(controls, 'numberOfPoints', 2, 15).step(1).onChange(controls.newPoints);
  gui.add(controls, 'segments', 0, 200).step(1).onChange(controls.redraw);
  gui.add(controls, 'radius', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'radiusSegments', 0, 100).step(1).onChange(controls.redraw);
  gui.add(controls, 'closed').onChange(controls.redraw);


  controls.newPoints();


  render();

  function generatePoints(points, segments, radius, radiusSegments, closed) {
    // add n random spheres


    spGroup = new THREE.Object3D();
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: false
    });
    points.forEach(function (point) {

      var spGeom = new THREE.SphereGeometry(0.2);
      var spMesh = new THREE.Mesh(spGeom, material);
      spMesh.position.copy(point);
      spGroup.add(spMesh);
    });
    // add the points as a group to the scene
    scene.add(spGroup);

    // use the same points to create a convexgeometry

    // TODO: Somewhere also explain the possible curves
    var tubeGeometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radiusSegments,
      closed);
    tubeMesh = createMesh(tubeGeometry);
    scene.add(tubeMesh);
  }

  function createMesh(geom) {

    // assign two materials
    //var meshMaterial = new THREE.MeshNormalMaterial();
    var meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.2
    });

    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
  }

  function render() {
    stats.update();

    spGroup.rotation.y = step;
    tubeMesh.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}