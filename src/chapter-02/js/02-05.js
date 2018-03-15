function init() {

  var stats = initStats();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // create the ground plane
  var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
  var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 0;
  plane.position.y = 0;
  plane.position.z = 0;

  // add the plane to the scene
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.x = -20;
  camera.position.y = 25;
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(5, 0, 0));

  // add subtle ambient lighting
  var ambientLight = new THREE.AmbientLight(0x494949);
  scene.add(ambientLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // call the render function
  var step = 0;


  var vertices = [
      new THREE.Vector3(1, 3, 1),
      new THREE.Vector3(1, 3, -1),
      new THREE.Vector3(1, -1, 1),
      new THREE.Vector3(1, -1, -1),
      new THREE.Vector3(-1, 3, -1),
      new THREE.Vector3(-1, 3, 1),
      new THREE.Vector3(-1, -1, -1),
      new THREE.Vector3(-1, -1, 1)
  ];

  var faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(2, 3, 1),
      new THREE.Face3(4, 6, 5),
      new THREE.Face3(6, 7, 5),
      new THREE.Face3(4, 5, 1),
      new THREE.Face3(5, 0, 1),
      new THREE.Face3(7, 6, 2),
      new THREE.Face3(6, 3, 2),
      new THREE.Face3(5, 7, 0),
      new THREE.Face3(7, 2, 0),
      new THREE.Face3(1, 3, 4),
      new THREE.Face3(3, 6, 4),
  ];

  var geom = new THREE.Geometry();
  geom.vertices = vertices;
  geom.faces = faces;
  geom.computeFaceNormals();

  var materials = [
    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
    new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
  ];

  var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
  mesh.castShadow = true;
  mesh.children.forEach(function (e) {
      e.castShadow = true
  });

  scene.add(mesh);

  // add spotlight for the shadows
  var spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI/4);
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.position.set(-40, 30, 30);
  spotLight.castShadow = true;
  spotLight.lookAt(mesh);
  scene.add(spotLight);

  function addControl(x, y, z) {
      var controls = new function () {
          this.x = x;
          this.y = y;
          this.z = z;
      };

      return controls;
  }

  var controlPoints = [];
  controlPoints.push(addControl(3, 5, 3));
  controlPoints.push(addControl(3, 5, 0));
  controlPoints.push(addControl(3, 0, 3));
  controlPoints.push(addControl(3, 0, 0));
  controlPoints.push(addControl(0, 5, 0));
  controlPoints.push(addControl(0, 5, 3));
  controlPoints.push(addControl(0, 0, 0));
  controlPoints.push(addControl(0, 0, 3));

  var gui = new dat.GUI();
  gui.add(new function () {
      this.clone = function () {

          var clonedGeometry = mesh.children[0].geometry.clone();
          var materials = [
              new THREE.MeshLambertMaterial({opacity: 0.8, color: 0xff44ff, transparent: true}),
              new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
          ];

          var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
          mesh2.children.forEach(function (e) {
              e.castShadow = true
          });

          mesh2.translateX(5);
          mesh2.translateZ(5);
          mesh2.name = "clone";
          scene.remove(scene.getChildByName("clone"));
          scene.add(mesh2);


      }
  }, 'clone');

  for (var i = 0; i < 8; i++) {

      f1 = gui.addFolder('Vertices ' + (i + 1));
      f1.add(controlPoints[i], 'x', -10, 10);
      f1.add(controlPoints[i], 'y', -10, 10);
      f1.add(controlPoints[i], 'z', -10, 10);

  }

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  render();

  function render() {
      trackballControls.update(clock.getDelta());
      stats.update();

      var vertices = [];
      for (var i = 0; i < 8; i++) {
          vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
      }

      mesh.children.forEach(function (e) {
          e.geometry.vertices = vertices;
          e.geometry.verticesNeedUpdate = true;
          e.geometry.computeFaceNormals();
          delete e.geometry.__directGeometry
      });

      // render using requestAnimationFrame
      requestAnimationFrame(render);
      renderer.render(scene, camera);
  }
}