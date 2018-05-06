function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var scene = new THREE.Scene();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  camera.lookAt(new THREE.Vector3(20, 30, 0));

  createSprites();
  render();

  var group;

  function getTexture() {
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/sprite-sheet.png");
    return texture;
  }

  function createSprites() {
    group = new THREE.Object3D();
    var range = 200;
    for (var i = 0; i < 400; i++) {
      group.add(createSprite(10, false, 0.6, 0xffffff, i % 5, range));
    }
    scene.add(group);
  }

  function createSprite(size, transparent, opacity, color, spriteNumber, range) {

    var spriteMaterial = new THREE.SpriteMaterial({
      opacity: opacity,
      color: color,
      transparent: transparent,
      map: getTexture()
    });

    // we have 1 row, with five sprites
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.depthTest = false;

    spriteMaterial.blending = THREE.AdditiveBlending;

    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2);

    return sprite;
  }



  function render() {

    stats.update();
    group.rotation.x +=0.01;

    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}