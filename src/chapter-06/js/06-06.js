function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  // position and point the camera to the center of the scene
  // camera.position.set(-80, 80, 80);
  // camera.lookAt(new THREE.Vector3(60, -60, 0));

  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;

  // call the render function
  var step = 0;

  klein = function (u, v, optionalTarget) {

    var result = optionalTarget || new THREE.Vector3();

    u *= Math.PI;
    v *= 2 * Math.PI;

    u = u * 2;
    var x, y, z;
    if (u < Math.PI) {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
      z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }

    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    return result.set( x, y, z );
  };

  radialWave = function (u, v, optionalTarget) {

    var result = optionalTarget || new THREE.Vector3();
    var r = 50;

    var x = Math.sin(u) * r;
    var z = Math.sin(v / 2) * 2 * r;
    var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

    return result.set( x, y, z );
  };

  // setup the control gui
  var controls = new function () {
    this.appliedMaterial = applyMeshNormalMaterial
    this.castShadow = true;
    this.groundPlaneVisible = true;
    this.slices = 50;
    this.stacks = 50;

    this.renderFunction = "radialWave"

    this.redraw = function () {
      redrawGeometryAndUpdateUI(gui, scene, controls, function() {
        switch (controls.renderFunction) {
          case "radialWave":
            var geom  = new THREE.ParametricGeometry(radialWave, controls.slices, controls.stacks);
            geom.center();
            return geom;
    
          case "klein":
            var geom = new THREE.ParametricGeometry(klein, controls.slices, controls.stacks);
            geom.center();
            return geom;

        }
      });
    }
  };
  var gui = new dat.GUI();
  gui.add(controls, 'renderFunction', ["radialWave", "klein"]).onChange(controls.redraw);
  gui.add(controls, 'appliedMaterial', {
    meshNormal: applyMeshNormalMaterial, 
    meshStandard: applyMeshStandardMaterial
  }).onChange(controls.redraw)
  
  gui.add(controls, 'slices', 10, 120, 1).onChange(controls.redraw);
  gui.add(controls, 'stacks', 10, 120, 1).onChange(controls.redraw);
  gui.add(controls, 'castShadow').onChange(function(e) {controls.mesh.castShadow = e})
  gui.add(controls, 'groundPlaneVisible').onChange(function(e) {groundPlane.material.visible = e})

  var step = 0;
  controls.redraw();
  render();
  
  function render() {
    stats.update();
    controls.mesh.rotation.y = step+=0.005
    controls.mesh.rotation.x = step
    controls.mesh.rotation.z = step

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}