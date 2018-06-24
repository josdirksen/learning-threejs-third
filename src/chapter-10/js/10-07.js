function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  // and add some simple default lights
  var scene = new THREE.Scene();
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -10;
  initDefaultLighting(scene);
  scene.add(new THREE.AmbientLight(0x444444));

  var gui = new dat.GUI();
  var controls = {};

  // images from: http://www.anyhere.com/gward/hdrenc/pages/originals.html
  var hdrTextureLoader = new THREE.RGBELoader();
  hdrTextureLoader.load('../../assets/textures/hdr/dani_cathedral_oBBC.hdr', function(texture, metadata) {
    texture.encoding = THREE.RGBEEncoding;
    texture.flipY = true;

    // add a simple plane to show the texture
    var plane = new THREE.PlaneGeometry(20, 20)
    var planeMesh = addGeometry(scene, plane, 'plane', texture, gui, controls);
    planeMesh.material.side = THREE.DoubleSide;

    // we add the webgl folder. When the tonemapping changes, we need
    // to update the material.
    addWebglFolder(gui, renderer, function() {
      planeMesh.material.needsUpdate = true;
    });

  });
  

  /**
   * Adds the folder to the menu to control some tonemapping settings
   * 
   * @param {*} gui 
   * @param {*} renderer 
   * @param {*} onToneMappingChange 
   */
  function addWebglFolder(gui, renderer, onToneMappingChange) {

    var folder = gui.addFolder("WebGL Renderer");
    var controls = {
      toneMapping: renderer.toneMapping
    }
    folder.add(renderer, "toneMappingExposure", 0, 2, 0.1);
    folder.add(renderer, "toneMappingWhitePoint", 0, 2, 0.1);
    folder.add(controls, "toneMapping", {
      "NoToneMapping" : THREE.NoToneMapping,
      "LinearToneMapping" : THREE.LinearToneMapping,
      "ReinhardToneMapping" : THREE.ReinhardToneMapping,
      "Uncharted2ToneMapping" : THREE.Uncharted2ToneMapping,
      "Uncharted2ToneMapping" : THREE.Uncharted2ToneMapping,
      "CineonToneMapping" : THREE.CineonToneMapping
    }).onChange(function(tm) {
      renderer.toneMapping = parseInt(tm)
      onToneMappingChange();
    });
  }

  render();
  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
