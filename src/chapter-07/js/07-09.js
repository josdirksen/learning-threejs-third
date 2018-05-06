function init() {

  // use the defaults
  var stats = initStats();
  var webGLRenderer = initRenderer();
  var stats = initStats();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  var sceneOrtho = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  var camera = initCamera(new THREE.Vector3(0, 0, 50));
  var cameraOrtho = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);

  var material = new THREE.MeshNormalMaterial();
  var geom = new THREE.SphereGeometry(15, 20, 20);
  var mesh = new THREE.Mesh(geom, material);

  scene.add(mesh);

  var getTexture = function () {
    var texture = new THREE.TextureLoader().load("../../assets/textures/particles/sprite-sheet.png");
    return texture;
  };

  var controls = new function () {
    this.size = 150;
    this.sprite = 0;
    this.transparent = true;
    this.opacity = 0.6;
    this.color = 0xffffff;
    this.rotateSystem = true;

    this.redraw = function () {
      sceneOrtho.children.forEach(function (child) {
        if (child instanceof THREE.Sprite) sceneOrtho.remove(child);
      });
      createSprite(controls.size, controls.transparent, controls.opacity, controls.color, controls.sprite);
    };
  };

  var gui = new dat.GUI();
  gui.add(controls, 'sprite', 0, 4).step(1).onChange(controls.redraw);
  gui.add(controls, 'size', 0, 120).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.addColor(controls, 'color').onChange(controls.redraw);


  controls.redraw();

  render();

  function createSprite(size, transparent, opacity, color, spriteNumber) {
    var spriteMaterial = new THREE.SpriteMaterial({
      opacity: opacity,
      color: color,
      transparent: transparent,
      map: getTexture()
    });

    // we have 1 row, with five sprites
    spriteMaterial.map.offset = new THREE.Vector2(0.2 * spriteNumber, 0);
    spriteMaterial.map.repeat = new THREE.Vector2(1 / 5, 1);
    spriteMaterial.blending = THREE.AdditiveBlending;
    // make sure the object is always rendered at the front
    spriteMaterial.depthTest = false;
    
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(size, size, size);
    sprite.position.set(100, 50, -10);
    sprite.velocityX = 5;

    sceneOrtho.add(sprite);
  }


  var step = 0;

  function render() {

    stats.update();

    camera.position.y = Math.sin(step += 0.01) * 20;

    sceneOrtho.children.forEach(function (e) {
      if (e instanceof THREE.Sprite) {
        // move the sprite along the bottom
        e.position.x = e.position.x + e.velocityX;
        if (e.position.x > window.innerWidth) {
          e.velocityX = -5;
          controls.sprite += 1;
          e.material.map.offset.set(1 / 5 * (controls.sprite % 4), 0);
        }
        if (e.position.x < 0) {
          e.velocityX = 5;
        }
      }
    });


    requestAnimationFrame(render);

    webGLRenderer.render(scene, camera);
    webGLRenderer.autoClear = false;
    webGLRenderer.render(sceneOrtho, cameraOrtho);

  }
}