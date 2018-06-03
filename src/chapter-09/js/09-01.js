function init() {
    var stats = initStats();
    var renderer = initRenderer();
    var camera = initCamera();
    var scene = new THREE.Scene();

    var trackballControls = initTrackballControls(camera, renderer);
    var clock = new THREE.Clock();
  
    initDefaultLighting(scene);  

    var groundPlane = addGroundPlane(scene)
    groundPlane.position.y = 0;

    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -10;
    cube.position.y = 4;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    // add the sphere to the scene
    scene.add(sphere);


    var cylinderGeometry = new THREE.CylinderGeometry(2, 2, 20);
    var cylinderMaterial = new THREE.MeshStandardMaterial({color: 0x77ff77});
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.castShadow = true;
    cylinder.position.set(0, 0, 1);

    scene.add(cylinder);


    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // call the render function
    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.scalingSpeed = 0.03;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'scalingSpeed', 0, 0.5);


    renderScene();
    var step = 0;
    var scalingStep = 0;

    function renderScene() {
        stats.update();
        trackballControls.update(clock.getDelta());

        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        // scale the cylinder
        scalingStep += controls.scalingSpeed;
        var scaleX = Math.abs(Math.sin(scalingStep / 4));
        var scaleY = Math.abs(Math.cos(scalingStep / 5));
        var scaleZ = Math.abs(Math.sin(scalingStep / 7));
        cylinder.scale.set(scaleX, scaleY, scaleZ);

        // render using requestAnimationFrame
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
}