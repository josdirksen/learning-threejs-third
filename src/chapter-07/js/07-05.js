function init() {

  var stats = initStats();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  var scene = new THREE.Scene();
  var webGLRenderer = initRenderer();

  var cloud;

  var controls = new function () {
    this.size = 15;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;
    this.rotate = true;
    this.sizeAttenuation = true;

    this.redraw = function () {
      if (scene.getObjectByName("points")) {
        scene.remove(scene.getObjectByName("points"));
      }
      createPoints(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotate');
  controls.redraw();

  render();

  function createPoints(size, transparent, opacity, sizeAttenuation, color) {

    var geom = new THREE.Geometry();

    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      map: createGhostTexture(),
      sizeAttenuation: sizeAttenuation,
      color: color
    });

    var range = 500;
    for (var i = 0; i < 5000; i++) {
      var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2,
        Math.random() * range - range / 2);
      geom.vertices.push(particle);
    }

    cloud = new THREE.Points(geom, material);
    cloud.name = 'points';
    scene.add(cloud);
  }

  var step = 0;

  function render() {
    stats.update();
    if (controls.rotate) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}