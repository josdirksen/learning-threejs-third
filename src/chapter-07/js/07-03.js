function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  var scene = new THREE.Scene();

  camera.position.set(20, 0, 150);

  var cloud;

  var controls = new function () {
    this.size = 4;
    this.transparent = true;
    this.opacity = 0.6;
    this.vertexColors = true;
    this.color = 0xffffff;
    this.sizeAttenuation = true;
    this.rotateSystem = true;

    this.redraw = function () {
      if (scene.getObjectByName("particles")) {
        scene.remove(scene.getObjectByName("particles"));
      }
      createParticles(controls.size, controls.transparent, controls.opacity, controls.vertexColors,
        controls.sizeAttenuation, controls.color);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.add(controls, 'vertexColors').onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotateSystem');

  controls.redraw();
  render();

  function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {


    var geom = new THREE.Geometry();
    var material = new THREE.PointCloudMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      vertexColors: vertexColors,

      sizeAttenuation: sizeAttenuation,
      color: color
    });


    var range = 500;
    for (var i = 0; i < 15000; i++) {
      var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
        Math.random() * range - range / 2);
      geom.vertices.push(particle);
      var color = new THREE.Color(0x00ff00);
      color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
      geom.colors.push(color);

    }

    cloud = new THREE.PointCloud(geom, material);
    cloud.name = "particles";
    scene.add(cloud);
  }

  var step = 0;

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    if (controls.rotateSystem) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}