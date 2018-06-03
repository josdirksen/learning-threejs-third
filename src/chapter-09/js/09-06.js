function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  initDefaultLighting(scene);  
}