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

    this.radiusTop = 20;
    this.radiusBottom = 20;
    this.height = 20;
    this.radialSegments = 8;
    this.heightSegments = 8;
    this.openEnded = false;
    
    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return new THREE.CylinderGeometry(controls.radiusTop, controls.radiusBottom,
                  controls.height, controls.radialSegments, controls.heightSegments, controls.openEnded
                )
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'radiusTop', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'radiusBottom', -40, 40).onChange(controls.redraw);
  gui.add(controls, 'height', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'radialSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'heightSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'openEnded').onChange(controls.redraw);

  // add a material section, so we can switch between materials
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)

  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})

  // initialize the first redraw so everything gets initialized
  controls.redraw();
  var step = 0;
  // call the render function
  render();
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.01
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}