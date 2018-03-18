function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0x000000));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;
  
  var canvasRenderer = new THREE.CanvasRenderer();
  canvasRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer = webGLRenderer;

  var groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
  var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
    color: 0x777777
  }));
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = -20;
  scene.add(groundMesh);

  var sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
  var cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
  var planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


  var meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    name: 'Basic Material',
    flatShading: true
  });

  var sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
  var cube = new THREE.Mesh(cubeGeometry, meshMaterial);
  var plane = new THREE.Mesh(planeGeometry, meshMaterial);

  // position the sphere
  sphere.position.x = 0;
  sphere.position.y = 3;
  sphere.position.z = 2;


  cube.position = sphere.position;
  plane.position = sphere.position;


  // add the sphere to the scene
  scene.add(cube);

  // position and point the camera to the center of the scene
  camera.position.x = -20;
  camera.position.y = 50;
  camera.position.z = 40;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x0c0c0c);
  scene.add(ambientLight);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  var step = 0;
  var oldContext = null;

  var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;

    this.color = meshMaterial.color.getStyle();
    this.selectedMesh = "cube";

    this.switchRenderer = function () {
      if (renderer instanceof THREE.WebGLRenderer) {
        renderer = canvasRenderer;
        document.getElementById("webgl-output").innerHTML = "";
        document.getElementById("webgl-output").appendChild(renderer.domElement);
      } else {
        renderer = webGLRenderer;
        document.getElementById("webgl-output").innerHTML = "";
        document.getElementById("webgl-output").appendChild(renderer.domElement);
      }
    }
  };

  var gui = new dat.GUI();
  var selectedMesh = cube;
  
  addBasicMaterialSettings(gui, controls, meshMaterial);

  var spGui = gui.addFolder("THREE.MeshBasicMaterial");
  spGui.addColor(controls, 'color').onChange(function (e) {
    meshMaterial.color.setStyle(e)
  });
  spGui.add(meshMaterial, 'wireframe');
  spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
  spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
    meshMaterial.wireframeLinejoin = e
  });
  spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
    meshMaterial.wireframeLinecap = e
  });

  loadGopher(meshMaterial).then(function(gopher) {
    gopher.scale.x = 4;
    gopher.scale.y = 4;
    gopher.scale.z = 4;
    gui.add(controls, 'selectedMesh', ["cube", "sphere", "plane", "gopher"]).onChange(function (e) {

      scene.remove(plane);
      scene.remove(cube);
      scene.remove(sphere);
      scene.remove(gopher);
  
      switch (e) {
        case "cube":
          scene.add(cube);
          selectedMesh = cube;
          break;
        case "sphere":
          scene.add(sphere);
          selectedMesh = sphere;
          break;
        case "plane":
          scene.add(plane);
          selectedMesh = plane;
          break;
        case "gopher":
          scene.add(gopher);
          selectedMesh = gopher;
          break;
      }
    });
  });


  gui.add(controls, 'switchRenderer');

  render();

  function render() {
    stats.update();

    selectedMesh.rotation.y = step += 0.01;

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}