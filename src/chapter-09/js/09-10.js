function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  initDefaultLighting(scene);

  var loader = new THREE.JSONLoader();
  var mesh
  var skeletonHelper
  var tween

  loader.load('../../assets/models/hand/hand-1.js', function (geometry, mat) {
    var mat = new THREE.MeshLambertMaterial({color: 0xF0C8C9, skinning: true});
    mesh = new THREE.SkinnedMesh(geometry, mat);
    mesh.scale.set(15,15,15);
    mesh.position.x = -5;
    mesh.rotateX(0.5*Math.PI);
    mesh.rotateZ(0.3*Math.PI);
    scene.add(mesh);
    startAnimation();

    var gui = new dat.GUI();
    var controls = {
      showHelper: false
    }
    gui.add(controls, "showHelper").onChange(function(e) {
      if (e) {
        skeletonHelper = new THREE.SkeletonHelper( mesh );
				skeletonHelper.material.linewidth = 2;
				scene.add( skeletonHelper );
      } else {
        if (skeletonHelper) {
          scene.remove(skeletonHelper)
        }
      }

      
    });
  });

  var onUpdate = function () {
    var pos = this.pos;

    // rotate the fingers
    mesh.skeleton.bones[5].rotation.set(0, 0, pos);
    mesh.skeleton.bones[6].rotation.set(0, 0, pos);
    mesh.skeleton.bones[10].rotation.set(0, 0, pos);
    mesh.skeleton.bones[11].rotation.set(0, 0, pos);
    mesh.skeleton.bones[15].rotation.set(0, 0, pos);
    mesh.skeleton.bones[16].rotation.set(0, 0, pos);
    mesh.skeleton.bones[20].rotation.set(0, 0, pos);
    mesh.skeleton.bones[21].rotation.set(0, 0, pos);

    // rotate the wrist
    mesh.skeleton.bones[1].rotation.set(pos, 0, 0);
  };

  function startAnimation() {
    tween = new TWEEN.Tween({pos: -1.5})
    .to({pos: 0}, 3000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .yoyo(true)
    .repeat(Infinity)
    .onUpdate(onUpdate);   

    tween.start();
  }     

  render();
  function render() {
    stats.update();
    TWEEN.update();
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }   
}
