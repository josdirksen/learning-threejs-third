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

  var amount = 50;
  var xRange = 20;
  var yRange = 20;
  var zRange = 20;

  var totalGroup = new THREE.Group();
  for ( var i = 0 ; i < amount ; i++) {
    var boxGeometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
    var boxMesh = new THREE.Mesh(boxGeometry, material);

    var rX = Math.random() * xRange - xRange / 2;
    var rY = Math.random() * yRange - yRange / 2;
    var rZ = Math.random() * zRange - zRange / 2;

    var totalRotation = 2*Math.PI;

    boxMesh.position.set(rX, rY, rZ);
    boxMesh.rotation.set(Math.random() * totalRotation,Math.random() * totalRotation,Math.random() * totalRotation)
    totalGroup.add(boxMesh);
  } 

  scene.add(totalGroup);

  var renderPass = new THREE.RenderPass(scene, camera);
  var aoPass = new THREE.SSAOPass(scene, camera);
  aoPass.renderToScreen = true;

  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(aoPass);
  
  addShaderControl(new dat.GUI(), "SSAO", aoPass , { setEnabled: false, 
    floats: [
      { key: "radius", from: 1, to: 10, step: 0.1 },
      { key: "aoClamp", from: 0, to: 1, step: 0.01 },
      { key: "lumInfluence", from: 0, to: 2, step: 0.01 },
    ],
    booleans: [
      {key: "onlyAO"}
    ]
  })

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta()
    trackballControls.update(delta);
    requestAnimationFrame(render);
    totalGroup.rotation.x += 0.0001;
    totalGroup.rotation.y += 0.001;
    composer.render(delta);
  }
}
