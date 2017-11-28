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
  var hullMesh;

  generatePoints();

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.redraw = function () {
      scene.remove(spGroup);
      scene.remove(hullMesh);
      generatePoints();
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'redraw');

  render();

  function generatePoints() {
    // add 10 random spheres
    var points = [];
    for (var i = 0; i < 20; i++) {
      var randomX = -15 + Math.round(Math.random() * 30);
      var randomY = -15 + Math.round(Math.random() * 30);
      var randomZ = -15 + Math.round(Math.random() * 30);

      points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

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
    var hullGeometry = new THREE.ConvexGeometry(points);
    hullMesh = createMesh(hullGeometry);
    scene.add(hullMesh);
  }

  function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.2
    });
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

    return mesh;
  }

  function render() {
    stats.update();

    spGroup.rotation.y = step;
    hullMesh.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}