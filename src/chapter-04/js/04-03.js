function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
  camera.position.set(-50, 40, 50);
  camera.lookAt(scene.position);

  // call the render function
  var step = 0;

  var controls = new function () {
    this.cameraNear = camera.near;
    this.cameraFar = camera.far;
    this.rotationSpeed = 0.02;
    this.numberOfObjects = scene.children.length;
    this.color = 0x00ff00;


    this.removeCube = function () {
      var allChildren = scene.children;
      var lastObject = allChildren[allChildren.length - 1];
      if (lastObject instanceof THREE.Group) {
        scene.remove(lastObject);
        this.numberOfObjects = scene.children.length;
      }
    };

    this.addCube = function () {

      var cubeSize = Math.ceil(3 + (Math.random() * 3));
      var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

      //var cubeMaterial = new THREE.MeshLambertMaterial({color:  Math.random() * 0xffffff });
      var cubeMaterial = new THREE.MeshDepthMaterial();
      var colorMaterial = new THREE.MeshBasicMaterial({
        color: controls.color,
        transparent: true,
        blending: THREE.MultiplyBlending
      });
      var cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial,
        cubeMaterial
      ]);
      cube.children[1].scale.set(0.99, 0.99, 0.99);
      cube.castShadow = true;

      // position the cube randomly in the scene
      cube.position.x = -60 + Math.round((Math.random() * 100));
      cube.position.y = Math.round((Math.random() * 10));
      cube.position.z = -100 + Math.round((Math.random() * 150));

      // add the cube to the scene
      scene.add(cube);
      this.numberOfObjects = scene.children.length;
    };

    this.outputObjects = function () {
      console.log(scene.children);
    }
  };

  var gui = new dat.GUI();
  gui.addColor(controls, 'color');
  gui.add(controls, 'rotationSpeed', 0, 0.5);
  gui.add(controls, 'addCube');
  gui.add(controls, 'removeCube');
  gui.add(controls, 'cameraNear', 0, 50).onChange(function (e) {
    camera.near = e;
    camera.updateProjectionMatrix();
  });
  gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
    camera.far = e;
    camera.updateProjectionMatrix();
  });

  var i = 0;
  while (i < 10) {
    controls.addCube();
    i++;
  }

  render();

  function render() {
    stats.update();

    // rotate the cubes around its axes
    scene.traverse(function (e) {
      if (e instanceof THREE.Group) {
        e.rotation.x += controls.rotationSpeed;
        e.rotation.y += controls.rotationSpeed;
        e.rotation.z += controls.rotationSpeed;
      }
    });

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }


}