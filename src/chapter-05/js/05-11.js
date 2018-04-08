
function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  addLargeGroundPlane(scene).position.y = -10;

  // setup the control parts of the ui
  var controls = new function () {
    var self = this;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.radius = 10;
    this.detail = 0;
    this.type = 'Icosahedron';
    
    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        var polyhedron;
        switch (controls.type) {
                  case 'Icosahedron':
                    polyhedron = new THREE.IcosahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Tetrahedron':
                    polyhedron = new THREE.TetrahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Octahedron':
                    polyhedron = new THREE.OctahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Dodecahedron':
                    polyhedron = new THREE.DodecahedronGeometry(controls.radius, controls.detail);
                    break;
                  case 'Custom':
                    var vertices = [
                      1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
                    ];
          
                    var indices = [
                      2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
                    ];
          
                    polyhedron = new THREE.PolyhedronGeometry(vertices, indices, controls.radius, controls.detail);
                    break;
                }

        return polyhedron
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).step(1).onChange(controls.redraw);
  gui.add(controls, 'detail', 0, 3).step(1).onChange(controls.redraw);
  gui.add(controls, 'type', ['Icosahedron', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Custom']).onChange(controls.redraw);


  // add a material section, so we can switch between materials
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})

  // initialize the first redraw so everything gets initialized
  controls.redraw();
  var step = 0;
  // call the render function
  render();
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.01
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}