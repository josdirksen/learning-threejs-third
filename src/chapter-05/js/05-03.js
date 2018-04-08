function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -10;

  // setup the control parts of the ui
  var controls = new function () {
    var self = this;

    // the start geometry and material. Used as the base for the settings in the control UI
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;

    this.innerRadius = 3;
    this.outerRadius = 10;
    this.thetaSegments = 8;
    this.phiSegments = 8;
    this.thetaStart = 0;
    this.thetaLength = Math.PI * 2;
    
    // redraw function, updates the control UI and recreates the geometry.
    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        return new THREE.RingGeometry(controls.innerRadius, controls.outerRadius, controls.thetaSegments,
                  controls.phiSegments, controls.thetaStart, controls.thetaLength)
      });
    };
  };

  // create the GUI with the specific settings for this geometry
  var gui = new dat.GUI();
  gui.add(controls, 'innerRadius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'outerRadius', 0, 100).onChange(controls.redraw);
  gui.add(controls, 'thetaSegments', 1, 40).step(1).onChange(controls.redraw);
  gui.add(controls, 'phiSegments', 1, 20).step(1).onChange(controls.redraw);
  gui.add(controls, 'thetaStart', 0, Math.PI * 2).onChange(controls.redraw);
  gui.add(controls, 'thetaLength', 0, Math.PI * 2).onChange(controls.redraw);

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