// TODO: There is also a different way to do fonts now

function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  var dirLight = new THREE.DirectionalLight();
  dirLight.position.set(25, 23, 15);
  scene.add(dirLight);

  var dirLight2 = new THREE.DirectionalLight();
  dirLight2.position.set(-25, 23, 15);
  scene.add(dirLight2);

  // call the render function
  var step = 0;
  var text1;
  var text2;

  var controls = new function () {

    this.size = 90;
    this.height = 90;
    this.bevelThickness = 2;
    this.bevelSize = 0.5;
    this.bevelEnabled = true;
    this.bevelSegments = 3;
    this.bevelEnabled = true;
    this.curveSegments = 12;
    this.steps = 1;
    this.font = "helvetiker";
    this.weight = "normal";

    this.asGeom = function () {
      // remove the old plane
      scene.remove(text1);
      scene.remove(text2);

      var options = {
        size: controls.size,
        height: controls.height,
        weight: controls.weight,
        font: controls.font,
        bevelThickness: controls.bevelThickness,
        bevelSize: controls.bevelSize,
        bevelSegments: controls.bevelSegments,
        bevelEnabled: controls.bevelEnabled,
        curveSegments: controls.curveSegments,
        steps: controls.steps
      };

      text1 = createMesh(new THREE.TextGeometry("Learning", options));
      text1.position.z = -100;
      text1.position.y = 100;
      scene.add(text1);

      text2 = createMesh(new THREE.TextGeometry("Three.js", options));
      scene.add(text2);
    };

  };

  controls.asGeom();

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 200).onChange(controls.asGeom);
  gui.add(controls, 'height', 0, 200).onChange(controls.asGeom);
  gui.add(controls, 'font', ['bitstream vera sans mono', 'helvetiker']).onChange(controls.asGeom);
  gui.add(controls, 'bevelThickness', 0, 10).onChange(controls.asGeom);
  gui.add(controls, 'bevelSize', 0, 10).onChange(controls.asGeom);
  gui.add(controls, 'bevelSegments', 0, 30).step(1).onChange(controls.asGeom);
  gui.add(controls, 'bevelEnabled').onChange(controls.asGeom);
  gui.add(controls, 'curveSegments', 1, 30).step(1).onChange(controls.asGeom);
  gui.add(controls, 'steps', 1, 5).step(1).onChange(controls.asGeom);


  render();


  function createMesh(geom) {

    // assign two materials
    //            var meshMaterial = new THREE.MeshLambertMaterial({color: 0xff5555});
    //            var meshMaterial = new THREE.MeshNormalMaterial();
    var meshMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      color: 0xeeffff,
      shininess: 100,
      metal: true
    });
    //            meshMaterial.side=THREE.DoubleSide;
    // create a multimaterial
    var plane = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);

    return plane;
  }

  function render() {
    stats.update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}