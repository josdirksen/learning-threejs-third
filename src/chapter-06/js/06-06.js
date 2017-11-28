function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  // position and point the camera to the center of the scene
  // camera.position.set(-80, 80, 80);
  // camera.lookAt(new THREE.Vector3(60, -60, 0));

  var scene = new THREE.Scene();

  var spotLight = new THREE.DirectionalLight();
  spotLight.position = new THREE.Vector3(-20, 250, -50);
  spotLight.target.position.x = 30;
  spotLight.target.position.y = -40;
  spotLight.target.position.z = -20;
  spotLight.intensity = 0.3;
  scene.add(spotLight);

  // call the render function
  var step = 0;

  klein = function (u, v) {
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

    return new THREE.Vector3(x, y, z);
  };

  radialWave = function (u, v) {
    var r = 50;

    var x = Math.sin(u) * r;
    var z = Math.sin(v / 2) * 2 * r;
    var y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;

    return new THREE.Vector3(x, y, z);
  };

  var mesh = createMesh(new THREE.ParametricGeometry(radialWave, 120, 120, false));
  scene.add(mesh);

  // setup the control gui
  var controls = new function () {
    this.renderFunction = "radialWave"
  };
  var gui = new dat.GUI();
  gui.add(controls, 'renderFunction', ["radialWave", "klein"]).onChange(function (e) {
    scene.remove(mesh);
    switch (e) {
      case "radialWave":
        mesh = createMesh(new THREE.ParametricGeometry(radialWave, 120, 120, false));
        break;

      case "klein":
        mesh = createMesh(new THREE.ParametricGeometry(klein, 120, 120, false));
        break;
    }
    scene.add(mesh);
  });


  render();


  function createMesh(geom) {
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-25, 0, -25));
    var meshMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x550000,
      metalness: 0.5
    });
    meshMaterial.side = THREE.DoubleSide;
    return new THREE.Mesh(geom, meshMaterial);
  }

  function render() {
    stats.update();
    mesh.rotation.y = step += 0.01;
    mesh.rotation.x = step;
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}