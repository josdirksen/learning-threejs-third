function init() {

  var stats = initStats();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  var scene = new THREE.Scene();
  var webGLRenderer = initRenderer();

  createSprites();
  render();

  function createSprites() {
    var material = new THREE.SpriteMaterial({
      map: createGhostTexture(),
      color: 0xffffff
    });

    var range = 500;
    for (var i = 0; i < 1500; i++) {
      var sprite = new THREE.Sprite(material);
      sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() *
        range - range / 2);
      sprite.scale.set(4, 4, 4);
      scene.add(sprite);
    }
  }

  var step = 0;

  function render() {
    stats.update();
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }

}