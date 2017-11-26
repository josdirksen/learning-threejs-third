function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();
  var renderer = initRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var polyhedron = createMesh(new THREE.IcosahedronGeometry(10, 0));
  // add the sphere to the scene
  scene.add(polyhedron);

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {
    // we need the first child, since it's a multimaterial
    this.radius = 10;
    this.detail = 0;
    this.type = 'Icosahedron';


    this.redraw = function () {
      // remove the old plane
      scene.remove(polyhedron);
      // create a new one

      switch (controls.type) {
        case 'Icosahedron':
          polyhedron = createMesh(new THREE.IcosahedronGeometry(controls.radius, controls.detail));
          break;
        case 'Tetrahedron':
          polyhedron = createMesh(new THREE.TetrahedronGeometry(controls.radius, controls.detail));
          break;
        case 'Octahedron':
          polyhedron = createMesh(new THREE.OctahedronGeometry(controls.radius, controls.detail));
          break;
        case 'Dodecahedron':
          polyhedron = createMesh(new THREE.DodecahedronGeometry(controls.radius, controls.detail));
          break;
        case 'Custom':
          var vertices = [
            1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
          ];

          var indices = [
            2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
          ];

          polyhedron = createMesh(new THREE.PolyhedronGeometry(vertices, indices, controls.radius,
            controls.detail));
          break;
      }

      // add it to the scene.
      scene.add(polyhedron);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
  gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
  gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(
    controls.redraw);


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
    polyhedron.rotation.y = step += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}