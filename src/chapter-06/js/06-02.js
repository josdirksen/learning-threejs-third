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
  var latheMesh;

  generatePoints(12, 2, 2 * Math.PI);

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial

    this.segments = 12;
    this.phiStart = 0;
    this.phiLength = 2 * Math.PI;

    this.redraw = function () {
      scene.remove(spGroup);
      scene.remove(latheMesh);
      generatePoints(controls.segments, controls.phiStart, controls.phiLength);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'segments', 0, 50).step(1).onChange(controls.redraw);
  gui.add(controls, 'phiStart', 0, 2 * Math.PI).onChange(controls.redraw);
  gui.add(controls, 'phiLength', 0, 2 * Math.PI).onChange(controls.redraw);


  render();

  function generatePoints(segments, phiStart, phiLength) {
    // add 10 random spheres
    var points = [];
    var height = 5;
    var count = 30;
    for (var i = 0; i < count; i++) {
      points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) +
        count / 2));
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

    // use the same points to create a LatheGeometry
    var latheGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    latheMesh = createMesh(latheGeometry);

    scene.add(latheMesh);
  }

  function createMesh(geom) {

    // assign two materials
    //  var meshMaterial = new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.6});
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

    spGroup.rotation.x = step;
    latheMesh.rotation.x = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}