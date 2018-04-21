function init() {

  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  initDefaultLighting(scene);
  var groundPlane = addLargeGroundPlane(scene)
  groundPlane.position.y = -30;

  var sphere1 = createMesh(new THREE.SphereGeometry(5, 20, 30));
  sphere1.position.x = -2;
  var sphere2 = createMesh(new THREE.SphereGeometry(5, 20, 30));
  sphere2.position.set(3, 0, 0);
  var cube = createMesh(new THREE.BoxGeometry(5, 5, 5));
  cube.position.x = -7;
  var result;

  // add the sphere to the scene
  scene.add(sphere1);
  scene.add(sphere2);
  scene.add(cube);

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 20;
  camera.position.z = 20;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // call the render function
  var step = 0;

  // setup the control gui
  var controls = new function () {

    this.sphere1PosX = sphere1.position.x;
    this.sphere1PosY = sphere1.position.y;
    this.sphere1PosZ = sphere1.position.z;
    this.sphere1Scale = 1;

    this.sphere2PosX = sphere2.position.x;
    this.sphere2PosY = sphere2.position.y;
    this.sphere2PosZ = sphere2.position.z;
    this.sphere2Scale = 1;

    this.cubePosX = cube.position.x;
    this.cubePosY = cube.position.y;
    this.cubePosZ = cube.position.z;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;

    this.actionCube = "subtract"; // add, substract, intersect
    this.actionSphere = "subtract";

    this.showResult = function () {
      redrawResult();
    };

    this.hideWireframes = false;
    this.rotateResult = false;
  };

  var gui = new dat.GUI();
  var guiSphere1 = gui.addFolder("Sphere1");
  guiSphere1.add(controls, "sphere1PosX", -15, 15).onChange(function () {
    sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
  });
  guiSphere1.add(controls, "sphere1PosY", -15, 15).onChange(function () {
    sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
  });
  guiSphere1.add(controls, "sphere1PosZ", -15, 15).onChange(function () {
    sphere1.position.set(controls.sphere1PosX, controls.sphere1PosY, controls.sphere1PosZ)
  });
  guiSphere1.add(controls, "sphere1Scale", 0, 10).onChange(function (e) {
    sphere1.scale.set(e, e, e)
  });

  var guiSphere2 = gui.addFolder("Sphere2");
  guiSphere2.add(controls, "sphere2PosX", -15, 15).onChange(function () {
    sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
  });
  guiSphere2.add(controls, "sphere2PosY", -15, 15).onChange(function () {
    sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
  });
  guiSphere2.add(controls, "sphere2PosZ", -15, 15).onChange(function () {
    sphere2.position.set(controls.sphere2PosX, controls.sphere2PosY, controls.sphere2PosZ)
  });
  guiSphere2.add(controls, "sphere2Scale", 0, 10).onChange(function (e) {
    sphere2.scale.set(e, e, e)
  });
  guiSphere2.add(controls, "actionSphere", ["subtract", "intersect", "union", "none"]);

  var guiCube = gui.addFolder("cube");
  guiCube.add(controls, "cubePosX", -15, 15).onChange(function () {
    cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
  });
  guiCube.add(controls, "cubePosY", -15, 15).onChange(function () {
    cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
  });
  guiCube.add(controls, "cubePosZ", -15, 15).onChange(function () {
    cube.position.set(controls.cubePosX, controls.cubePosY, controls.cubePosZ)
  });
  guiCube.add(controls, "scaleX", 0, 10).onChange(function (e) {
    cube.scale.x = e
  });
  guiCube.add(controls, "scaleY", 0, 10).onChange(function (e) {
    cube.scale.y = e
  });
  guiCube.add(controls, "scaleZ", 0, 10).onChange(function (e) {
    cube.scale.z = e
  });
  guiCube.add(controls, "actionCube", ["subtract", "intersect", "union", "none"]);

  gui.add(controls, "showResult");
  gui.add(controls, "rotateResult");
  gui.add(controls, "hideWireframes").onChange(function () {
    if (controls.hideWireframes) {
      sphere1.material.visible = false;
      sphere2.material.visible = false;
      cube.material.visible = false;
    } else {
      sphere1.material.visible = true;
      sphere2.material.visible = true;
      cube.material.visible = true;
    }
  });

  render();

  var spinner;

  function redrawResult() {

    // make the call async to avoid blocking the thread. Need
    // to set timeout > 1, if not executed immediately.
    setTimeout(function () {
      scene.remove(result);
      var sphere1BSP = new ThreeBSP(sphere1);
      var sphere2BSP = new ThreeBSP(sphere2);
      var cube2BSP = new ThreeBSP(cube);

      var resultBSP;


      // first do the sphere
      switch (controls.actionSphere) {
        case "subtract":
          resultBSP = sphere1BSP.subtract(sphere2BSP);
          break;
        case "intersect":
          resultBSP = sphere1BSP.intersect(sphere2BSP);
          break;
        case "union":
          resultBSP = sphere1BSP.union(sphere2BSP);
          break;
        case "none": // noop;
      }

      // next do the cube
      if (!resultBSP) resultBSP = sphere1BSP;
      switch (controls.actionCube) {
        case "subtract":
          resultBSP = resultBSP.subtract(cube2BSP);
          break;
        case "intersect":
          resultBSP = resultBSP.intersect(cube2BSP);
          break;
        case "union":
          resultBSP = resultBSP.union(cube2BSP);
          break;
        case "none": // noop;
      }


      if (controls.actionCube === "none" && controls.actionSphere === "none") {
        // do nothing
      } else {
        result = resultBSP.toMesh();
        result.geometry.computeFaceNormals();
        result.geometry.computeVertexNormals();
        scene.add(result);
      }

    }, 200);
  }

  function createMesh(geom) {

    // assign two materials
    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial({
      transparency: true,
      opacity: 0.5,
      wireframeLinewidth: 0.5
    });
    wireFrameMat.wireframe = true;

    // create a multimaterial
    var mesh = new THREE.Mesh(geom, wireFrameMat);

    return mesh;
  }


  function render() {
    stats.update();

    if (controls.rotateResult && result) {
      result.rotation.y += 0.04;
      //      result.rotation.x+=0.04;
      result.rotation.z -= 0.005;
    }

    // render using requestAnimationFrame
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}