function init() {

  Physijs.scripts.worker = '../../libs/other/physijs/physijs_worker.js';
  Physijs.scripts.ammo = './ammo.js';

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 50, 100));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  scene = new Physijs.Scene({reportSize: 10, fixedTimeStep: 1 / 60});
  scene.setGravity(new THREE.Vector3(0, -100, 20));

  initDefaultLighting(scene);
  var flip_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({color: 0x44ff44}), 0,  0);
  var slider_material = Physijs.createMaterial(new THREE.MeshStandardMaterial({color: 0x4444ff}), 0,  0);
  
  var flipperLeftConstraint = createLeftFlipper(scene, flip_material);
  var flipperRightConstraint = createRightFlipper(scene, flip_material);
  var sliderBottomConstraint = createSliderBottom(scene, slider_material);
  var sliderTopConstraint = createSliderTop(scene, slider_material);
  createGroundAndWalls(scene);

  var controls = {
    velocity: 10,
    acceleration: 20,
    sliderPos: function () {
      sliderBottomConstraint.disableLinearMotor();
      sliderBottomConstraint.enableLinearMotor(controls.velocity, controls.acceleration);
      sliderTopConstraint.disableLinearMotor();
      sliderTopConstraint.enableLinearMotor(controls.velocity, controls.acceleration);
    },
    sliderNeg: function () {
      sliderBottomConstraint.disableLinearMotor();
      sliderBottomConstraint.enableLinearMotor(-1 * controls.velocity, controls.acceleration);
      sliderTopConstraint.disableLinearMotor();
      sliderTopConstraint.enableLinearMotor(-1 * controls.velocity, controls.acceleration);
    },
    addBall: function () {
      var rangeXMin = -10;
      var rangeXMax = 10;
      var rangeZMin = -30;
      var rangeZMax = 10
      var sphere = new THREE.SphereGeometry(2.5);
      var sphereMesh = new Physijs.SphereMesh(sphere, Physijs.createMaterial(new THREE.MeshStandardMaterial({color: 0xff4444}, 0, 0), 0.001)); 
      sphereMesh.position.set(Math.random() * (-rangeXMin + rangeXMax) + rangeXMin, 10, Math.random() * (-rangeZMin + rangeZMax) + rangeZMin);
      scene.add(sphereMesh);
    },
    flipUp: function () {
      flipperLeftConstraint.enableAngularMotor(controls.velocity *1000, controls.acceleration * 1000);
      flipperRightConstraint.enableAngularMotor(-1 * controls.velocity * 1000, controls.acceleration * 1000);
    },
    flipDown: function () {
      flipperLeftConstraint.enableAngularMotor(-1 * controls.velocity *1000, controls.acceleration * 1000);
      flipperRightConstraint.enableAngularMotor(controls.velocity * 1000, controls.acceleration * 1000);
    }
  }

  var gui = new dat.GUI();
  var motorFolder = gui.addFolder('motor');
  motorFolder.add(controls, "acceleration", 0, 40).onChange(controls.updateMotor);
  motorFolder.add(controls, "velocity", -30, 30).onChange(controls.updateMotor);

  var sliderFolder = gui.addFolder('sliders');
  sliderFolder.add(controls, "sliderPos").onChange(controls.sliderLeft);
  sliderFolder.add(controls, "sliderNeg").onChange(controls.sliderRight);

  gui.add(controls, "addBall")
  gui.add(controls, "flipUp")
  gui.add(controls, "flipDown")
  
  scene.simulate();
  
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    scene.simulate(undefined, 1);
  }
}

function createGroundAndWalls(scene) {
  var ground_material = Physijs.createMaterial(new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('../../assets/textures/general/floor-wood.jpg')}), 0.9, 0.7);
  var ground = new Physijs.BoxMesh(new THREE.BoxGeometry(50, 1, 80), ground_material, 0);
  scene.add(ground);
  var wall_material = Physijs.createMaterial(new THREE.MeshBasicMaterial({transparent: true, opacity: 0.1}), 0.9, 0.7);
  var wall1 = new  Physijs.BoxMesh(new THREE.BoxGeometry(1, 100, 80), wall_material, 0);
  wall1.position.x = -25;
  wall1.position.y = 50;
  scene.add(wall1);
  var wall2 = new  Physijs.BoxMesh(new THREE.BoxGeometry(1, 100, 80), wall_material, 0);
  wall2.position.x = 25; 
  wall2.position.y = 50;
  scene.add(wall2);
  var wall3 = new  Physijs.BoxMesh(new THREE.BoxGeometry(50, 100, 1), wall_material, 0);
  wall3.position.y = 50;
  wall3.position.z = -40; 
  scene.add(wall3);
  var wall4 = new  Physijs.BoxMesh(new THREE.BoxGeometry(50, 100, 1), wall_material, 0);
  wall4.position.y = 50;
  wall4.position.z = 40; 
  scene.add(wall4);
}

function createSliderBottom(scene, mat) {
  var sliderCube = new THREE.BoxGeometry(12, 2, 2);
  var sliderMesh = new Physijs.BoxMesh(sliderCube, mat, 1000);
  sliderMesh.position.x = 0;
  sliderMesh.position.y = 2;
  sliderMesh.position.z = 5;
  sliderMesh.castShadow = true;
  scene.add(sliderMesh);
  
  var constraint = new Physijs.SliderConstraint(sliderMesh, new THREE.Vector3(0, 1, 5), new THREE.Vector3(0, 1, 0));
  scene.addConstraint(constraint);
  constraint.setLimits(-18, 18, 0, 0);
  constraint.setRestitution(0.1, 0.1);
  return constraint;
}

function createSliderTop(scene, mat) {
  var sliderSphere = new THREE.BoxGeometry(7, 2, 7);
  var sliderMesh = new Physijs.BoxMesh(sliderSphere, mat, 100);
  sliderMesh.position.z = -15;
  sliderMesh.position.x = 2;
  sliderMesh.position.y = 1.5;
  scene.add(sliderMesh);

  sliderMesh.castShadow = true;

  //position is the position of the axis, relative to the ref, based on the current position
  var constraint = new Physijs.SliderConstraint(sliderMesh, new THREE.Vector3(-15, 2, 1.5), new THREE.Vector3(Math.PI / 2, 0, 0));
  scene.addConstraint(constraint);
  constraint.setLimits(-18, 18, 0.5, -0, 5);
  constraint.setRestitution(0.1, 0.1);

  return constraint;
}

function createLeftFlipper(scene, mat) {
  var flipperLeft = new Physijs.BoxMesh(new THREE.BoxGeometry(12, 2, 2), mat, 10);
  flipperLeft.position.x = -8;
  flipperLeft.position.y = 2;
  flipperLeft.position.z = 30;
  flipperLeft.castShadow = true;
  scene.add(flipperLeft);

  var flipperLeftPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), mat, 0);
  flipperLeftPivot.position.y = 2;
  flipperLeftPivot.position.x = -15;
  flipperLeftPivot.position.z = 30;
  flipperLeftPivot.rotation.y = 1.4;
  flipperLeftPivot.castShadow = true;

  scene.add(flipperLeftPivot);

  // when looking at the axis, the axis of object two are used.
  // so as long as that one is the same as the scene, no problems
  // rotation and axis are relative to object2. If position == cube2.position it works as expected
  var constraint = new Physijs.HingeConstraint(flipperLeft, flipperLeftPivot, flipperLeftPivot.position, new THREE.Vector3(0, 1, 0));
  scene.addConstraint(constraint);

  constraint.setLimits(
          -2.2, // minimum angle of motion, in radians, from the point object 1 starts (going back)
          -0.6, // maximum angle of motion, in radians, from the point object 1 starts (going forward)
          0.3, // applied as a factor to constraint error, how big the kantelpunt is moved when a constraint is hit
          0.5 // controls bounce at limit (0.0 == no bounce)
  );

  return constraint;
}

function createRightFlipper(scene, mat) {
  var flipperright = new Physijs.BoxMesh(new THREE.BoxGeometry(12, 2, 2), mat, 10);
  flipperright.position.x = 8;
  flipperright.position.y = 2;
  flipperright.position.z = 30;
  flipperright.castShadow = true;
  scene.add(flipperright);
  var flipperRightPivot = new Physijs.SphereMesh(new THREE.BoxGeometry(1, 1, 1), mat, 0);

  flipperRightPivot.position.y = 2;
  flipperRightPivot.position.x = 15;
  flipperRightPivot.position.z = 30;
  flipperRightPivot.rotation.y = 1.4;
  flipperRightPivot.castShadow = true;

  scene.add(flipperRightPivot);

  // when looking at the axis, the axis of object two are used.
  // so as long as that one is the same as the scene, no problems
  // rotation and axis are relative to object2. If position == cube2.position it works as expected
  var constraint = new Physijs.HingeConstraint(flipperright, flipperRightPivot, flipperRightPivot.position, new THREE.Vector3(0, 1, 0));
//            var constraint = new Physijs.HingeConstraint(cube1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
  scene.addConstraint(constraint);

  constraint.setLimits(
          -2.2, // minimum angle of motion, in radians, from the point object 1 starts (going back)
          -0.6, // maximum angle of motion, in radians, from the point object 1 starts (going forward)
          0.3, // applied as a factor to constraint error, how big the kantelpunt is moved when a constraint is hit
          0.5 // controls bounce at limit (0.0 == no bounce)
  );

  return constraint;
}
