function init() {

  // use the defaults
  var stats = initStats();
  var camera = initCamera(new THREE.Vector3(20, 0, 150));
  var canvasRenderer = initCanvasRenderer();

  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();

  initCanvasRenderer()


  var getTexture = function (ctx) {

    // the body
    ctx.translate(-81, -84);

    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(83, 116);
    ctx.lineTo(83, 102);
    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);
    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);
    ctx.lineTo(111, 116);
    ctx.lineTo(106.333, 111.333);
    ctx.lineTo(101.666, 116);
    ctx.lineTo(97, 111.333);
    ctx.lineTo(92.333, 116);
    ctx.lineTo(87.666, 111.333);
    ctx.lineTo(83, 116);
    ctx.fill();

    // the eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(91, 96);
    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);
    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);
    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);
    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);
    ctx.moveTo(103, 96);
    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);
    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);
    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);
    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);
    ctx.fill();

    // the pupils
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);
    ctx.fill();

  };

  createSprites();
  render();

  function createSprites() {
    var material = new THREE.SpriteCanvasMaterial({
      program: getTexture
    });

    material.rotation = Math.PI;

    var range = 500;
    for (var i = 0; i < 1500; i++) {
      var sprite = new THREE.Sprite(material);
      sprite.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() *
        range - range / 2);
      sprite.scale.set(0.1, 0.1, 0.1);
      scene.add(sprite);
    }
  }

  var step = 0;

  function render() {

    stats.update();

    requestAnimationFrame(render);
    canvasRenderer.render(scene, camera);
  }
}