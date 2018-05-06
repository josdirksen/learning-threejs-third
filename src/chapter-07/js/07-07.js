function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 40, 110));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  var system1;
  var cloud;

  var controls = new function () {
    this.size = 3;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;

    this.sizeAttenuation = true;

    this.redraw = function () {
      scene.remove(scene.getObjectByName("particles1"));

      createPointCloud(controls.size, controls.transparent, controls.opacity, controls.sizeAttenuation,
        controls.color);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'size', 0, 20).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);

  controls.redraw();
  render();

  function createPointCloud(size, transparent, opacity, sizeAttenuation, color) {


    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/raindrop-3.png");
    var geom = new THREE.Geometry();

    var material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      map: texture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: sizeAttenuation,
      color: color
    });


    var range = 40;
    for (var i = 0; i < 1500; i++) {
      var particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range * 1.5,
        // Math.random() * range - range / 2
        1 + (i/100)
      )
      particle.velocityY = 0.1 + Math.random() / 5;
      particle.velocityX = (Math.random() - 0.5) / 3;
      geom.vertices.push(particle);
    }

    cloud = new THREE.Points(geom, material);
    cloud.sortParticles = true;
    cloud.name = "particles1"

    scene.add(cloud);
  }

  function render() {
    stats.update();
    var vertices = cloud.geometry.vertices;
    vertices.forEach(function (v) {
      v.y = v.y - (v.velocityY);
      v.x = v.x - (v.velocityX);

      if (v.y <= 0) v.y = 60;
      if (v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
    });
    cloud.geometry.verticesNeedUpdate = true;

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

}