
  function init() {

    // use the defaults
    var stats = initStats();
    var renderer = initRenderer();


    var camera = initCamera();
  
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // and add some simple default lights
    var scene = new THREE.Scene();
    var groundPlane = addLargeGroundPlane(scene)
    groundPlane.position.y = -10;

    initDefaultLighting(scene);
  
    // setup the control parts of the ui
    var controls = new function () {
      var self = this;
  
      // the start geometry and material. Used as the base for the settings in the control UI
      this.appliedMaterial = applyMeshNormalMaterial
      this.castShadow = true;
      this.groundPlaneVisible = true;

      this.radius = 4;
      this.thetaStart = 0.3 * Math.PI * 2;
      this.thetaLength = 0.3 * Math.PI * 2;
      this.segments = 10;
  
      // redraw function, updates the control UI and recreates the geometry.
      this.redraw = function () {
        redrawGeometryAndUpdateUI(gui, scene, controls, function() {
          return new THREE.CircleGeometry(self.radius, self.segments, self.thetaStart, self.thetaLength);
        });
      };
    };
  
    // create the GUI with the specific settings for this geometry
    var gui = new dat.GUI();
    gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'segments', 0, 40).onChange(controls.redraw);
    gui.add(controls, 'thetaStart', 0, 2 * Math.PI).onChange(controls.redraw);
    gui.add(controls, 'thetaLength', 0, 2 * Math.PI).onChange(controls.redraw);
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
