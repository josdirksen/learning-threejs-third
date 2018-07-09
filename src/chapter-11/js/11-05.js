function init() {


  // for the bokeh effect

  // 1. add a cubemap
  // 2. render a torusknot in the middle.
  // 3. render a sphere to the right and the left halfway
  // 4. render a wall of cubes at a distance

    // use the defaults
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera(new THREE.Vector3(0, 20, 40));
    camera.far = 300;
    camera.updateProjectionMatrix();
    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
  
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    // and add some simple default lights
    var scene = new THREE.Scene();
    initDefaultLighting(scene);
    var groundPlane = addLargeGroundPlane(scene, true)
    groundPlane.position.y = -8;

    var gui = new dat.GUI();
    var controls = {
      normalScaleX: 1,
      normalScaleY: 1
    };
    var textureLoader = new THREE.TextureLoader();
  
    var urls = [
        '../../assets/textures/cubemap/flowers/right.png',
        '../../assets/textures/cubemap/flowers/left.png',
        '../../assets/textures/cubemap/flowers/top.png',
        '../../assets/textures/cubemap/flowers/bottom.png',
        '../../assets/textures/cubemap/flowers/front.png',
        '../../assets/textures/cubemap/flowers/back.png'
    ];
  
    var cubeLoader = new THREE.CubeTextureLoader();
    var sphereMaterial = new THREE.MeshStandardMaterial({
        envMap: cubeLoader.load(urls),
        color: 0xffffff,
        metalness: 1,
        roughness: 0.3,
    });
  
    sphereMaterial.normalMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_NORM.jpg");
    sphereMaterial.aoMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_OCC.jpg");
    sphereMaterial.shininessMap = textureLoader.load("../../assets/textures/engraved/Engraved_Metal_003_ROUGH.jpg");
  
    var sphere = new THREE.SphereGeometry(5, 50, 50)
    var sphere1 = addGeometryWithMaterial(scene, sphere, 'sphere', gui, controls, sphereMaterial);
    sphere1.position.x = 0;
  
    var boxMaterial1 = new THREE.MeshStandardMaterial({color: 0x0066ff});
    var m1 = new THREE.BoxGeometry(10, 10, 10);
    var m1m = addGeometryWithMaterial(scene, m1, 'm1', gui, controls, boxMaterial1);
    m1m.position.z = -40;
    m1m.position.x = -35;
    m1m.rotation.y = 1;

    var m2 = new THREE.BoxGeometry(10, 10, 10);
    var boxMaterial2 = new THREE.MeshStandardMaterial({color: 0xff6600});
    var m2m = addGeometryWithMaterial(scene, m2, 'm2', gui, controls, boxMaterial2);
    m2m.position.z = -40;
    m2m.position.x = 35;
    m2m.rotation.y = -1;

    var totalWidth = 220;
    var nBoxes = 10;
    for (var i = 0 ; i < nBoxes ; i++) {
      var box = new THREE.BoxGeometry(10, 10, 10);
      var mat = new THREE.MeshStandardMaterial({color: 0x66ff00});
      var mesh = new THREE.Mesh(box, mat);
      mesh.position.z = -120;
      mesh.position.x = -(totalWidth / 2) + (totalWidth / nBoxes) * i;
      mesh.rotation.y = i;
      scene.add(mesh);
    }

    var params = {
      focus:  10,
      aspect: camera.aspect,
      aperture: 0.0002,
      maxblur: 1,
    };

    var renderPass = new THREE.RenderPass(scene, camera);
    var bokehPass = new THREE.BokehPass(scene, camera, params)
    bokehPass.renderToScreen = true;
  
    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bokehPass);

    addShaderControl(gui, "Bokeh", bokehPass.materialBokeh , { floats: [
      { key: "focus", from: 10, to: 200, step: 0.01 },
      { key: "aperture", from: 0, to: 0.0005, step: 0.000001 },
      { key: "maxblur", from: 0, to: 1, step: 0.1 },
    ]}, false)
  
    render();
    function render() {
      stats.update();
      var delta = clock.getDelta()
      trackballControls.update(delta);
      requestAnimationFrame(render);
      composer.render(delta);
      sphere1.rotation.y -= 0.01;
    }
  }
  