function init() {

  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create the ground plane
  var textureGrass = new THREE.TextureLoader().load("../../assets/textures/ground/grasslight-big.jpg");
  textureGrass.wrapS = THREE.RepeatWrapping;
  textureGrass.wrapT = THREE.RepeatWrapping;
  textureGrass.repeat.set(10, 10);

  var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20);
  var planeMaterial = new THREE.MeshLambertMaterial({
    map: textureGrass
  });

  //        var planeMaterial = new THREE.MeshLambertMaterial();
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 15;
  plane.position.y = 0;
  plane.position.z = 0;

  // add the plane to the scene
  scene.add(plane);

  // create a cube
  var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff3333
  });
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;

  // position the cube
  cube.position.x = -4;
  cube.position.y = 3;
  cube.position.z = 0;

  // add the cube to the scene
  scene.add(cube);

  var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
  var sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x7777ff
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.x = 10;
  sphere.position.y = 5;
  sphere.position.z = 10;
  sphere.castShadow = true;

  // add the sphere to the scene
  scene.add(sphere);

  // add spotlight for a bit of light
  var spotLight0 = new THREE.SpotLight(0xcccccc);
  spotLight0.position.set(-40, 60, -10);
  spotLight0.lookAt(plane);
  scene.add(spotLight0);

  var target = new THREE.Object3D();
  target.position = new THREE.Vector3(5, 0, 0);

  var hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
  hemiLight.position.set(0, 500, 0);
  scene.add(hemiLight);

  var pointColor = "#ffffff";
  var dirLight = new THREE.DirectionalLight(pointColor);
  dirLight.position.set(30, 10, -50);
  dirLight.castShadow = true;
  dirLight.target = plane;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  // call the render function
  var step = 0;

  // used to determine the switch point for the light animation
  var invert = 1;
  var phase = 0;
  var controls = addControls();



  render();

  function render() {
    stats.update();

    trackballControls.update(clock.getDelta());

    // rotate the cube around its axes
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    // bounce the sphere up and down
    step += controls.bouncingSpeed;
    sphere.position.x = 20 + (10 * (Math.cos(step)));
    sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function addControls() {
    var controls = new function () {
      this.rotationSpeed = 0.03;
      this.bouncingSpeed = 0.03;
      this.hemisphere = true;
      this.color = 0x0000ff;
      this.groundColor = 0x00ff00;
      this.intensity = 0.6;

    };

    var gui = new dat.GUI();

    gui.add(controls, 'hemisphere').onChange(function (e) {

      if (!e) {
        hemiLight.intensity = 0;
      } else {
        hemiLight.intensity = controls.intensity;
      }
    });
    gui.addColor(controls, 'groundColor').onChange(function (e) {
      hemiLight.groundColor = new THREE.Color(e);
    });
    gui.addColor(controls, 'color').onChange(function (e) {
      hemiLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
      hemiLight.intensity = e;
    });

    return controls;
  }
}