function addGeometry(scene, geom, name, texture, gui, controls) {
  var mat = new THREE.MeshStandardMaterial(
    {
      map: texture,
      metalness: 0.2,
      roughness: 0.07
  });
  var mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  
  scene.add(mesh);
  addBasicMaterialSettings(gui, controls, mat, name + '-THREE.Material');
  addSpecificMaterialSettings(gui, controls, mat, name + '-THREE.MeshStandardMaterial');

  return mesh;
};

function addGeometryWithMaterial(scene, geom, name, gui, controls, material) {
  var mesh = new THREE.Mesh(geom, material);
  mesh.castShadow = true;
  
  scene.add(mesh);
  addBasicMaterialSettings(gui, controls, material, name + '-THREE.Material');
  addSpecificMaterialSettings(gui, controls, material, name + '-Material');

  return mesh;
};

function addEarth(scene) {
  var textureLoader = new THREE.TextureLoader();
  var planetMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load("../../assets/textures/earth/Earth.png"),
    normalMap: textureLoader.load("../../assets/textures/earth/EarthNormal.png"),
    specularMap: textureLoader.load("../../assets/textures/earth/EarthSpec.png"),
    specular: new THREE.Color(0x4444aa),
    normalScale: new THREE.Vector2(6,6),
    shininess: 0.5
  });
  
  var earth = new THREE.Mesh(new THREE.SphereGeometry(15, 40, 40), planetMaterial);
  scene.add(earth);
  var pivot = new THREE.Object3D();
  initDefaultLighting(pivot);
  scene.add(pivot);

  return {earth: earth, pivot: pivot};
}

function addMars(scene) {
  var textureLoader = new THREE.TextureLoader();
  var planetMaterial = new THREE.MeshPhongMaterial({
    map: textureLoader.load("../../assets/textures/mars/mars_1k_color.jpg"),
    normalMap: textureLoader.load("../../assets/textures/mars/mars_1k_normal.jpg"),
    normalScale: new THREE.Vector2(6,6),
    shininess: 0.5
  });
  
  var mars = new THREE.Mesh(new THREE.SphereGeometry(15, 40, 40), planetMaterial);
  scene.add(mars);
  var pivot = new THREE.Object3D();
  initDefaultLighting(pivot);
  scene.add(pivot);

  return {mars: mars, pivot: pivot};
}


function addFilmPassControls(gui, controls, effectFilm) {
    
  controls.grayScale = false;
  controls.noiseIntensity = 0.8;
  controls.scanlinesIntensity = 0.325;
  controls.scanlinesCount = 256;

  controls.updateFilmPass = function() {
      if ( controls.grayScale !== undefined )	effectFilm.uniforms.grayscale.value = controls.grayScale;
      if ( controls.noiseIntensity !== undefined ) effectFilm.uniforms.nIntensity.value = controls.noiseIntensity;
      if ( controls.scanlinesIntensity !== undefined ) effectFilm.uniforms.sIntensity.value = controls.scanlinesIntensity;
      if ( controls.scanlinesCount !== undefined ) effectFilm.uniforms.sCount.value = controls.scanlinesCount;    
    }

  var filmFolder = gui.addFolder("FilmPass");
  filmFolder.add(controls, "grayScale").onChange(controls.updateFilmPass);
  filmFolder.add(controls, "noiseIntensity", 0, 1, 0.01).onChange(controls.updateFilmPass);
  filmFolder.add(controls, "scanlinesIntensity", 0, 1, 0.01).onChange(controls.updateFilmPass);
  filmFolder.add(controls, "scanlinesCount", 0, 500, 1).onChange(controls.updateFilmPass);
}

function addBloomPassControls(gui, controls, bloom, callback) {
  controls.strength = 3;
  controls.kernelSize = 25;
  controls.sigma = 5.0;
  controls.resolution = 256;

  controls.updateBloomPass = function() {
    var bloomPass = new THREE.BloomPass(controls.strength, controls.kernelSize, controls.sigma, controls.resolution);
    callback(bloomPass);
  }

  var bloomFolder = gui.addFolder("BloomPass");
  bloomFolder.add(controls, "strength", 0, 5, 0.01).onChange(controls.updateBloomPass);
  bloomFolder.add(controls, "kernelSize", 10, 100, 1).onChange(controls.updateBloomPass);
  bloomFolder.add(controls, "sigma", 1, 8, 0.1).onChange(controls.updateBloomPass);
  bloomFolder.add(controls, "resolution", 100, 256, 10).onChange(controls.updateBloomPass);
}

function addDotScreenPassControls(gui, controls, dotscreen) {
    
  controls.centerX = 0.5;
  controls.centerY = 0.5;
  controls.angle = 1;
  controls.scale = 1;
  
  controls.updateDotScreen = function() {
    dotscreen.uniforms["center"].value.copy(new THREE.Vector2(controls.centerX, controls.centerY));
    dotscreen.uniforms["angle"].value = controls.angle;
    dotscreen.uniforms["scale"].value = controls.scale;
  }

  var dsFolder = gui.addFolder("DotScreenPass");
  dsFolder.add(controls, "centerX", 0, 5, 0.01).onChange(controls.updateDotScreen);
  dsFolder.add(controls, "centerY", 0, 5, 0.01).onChange(controls.updateDotScreen);
  dsFolder.add(controls, "angle", 0, 3.14, 0.01).onChange(controls.updateDotScreen);
  dsFolder.add(controls, "scale", 0, 10).onChange(controls.updateDotScreen);
}

function addGlitchPassControls(gui, controls, glitchPass, callback) {
  controls.dtsize = 64;
  var gpFolder = gui.addFolder("GlitchPass");
  gpFolder.add(controls,"dtsize", 0, 1024).onChange(function(e) { callback(new THREE.GlitchPass(e)) })
}

function addHalftonePassControls(gui, controls, htshader, callback) {

  controls.shape = 1;
  controls.radius = 4;
  controls.rotateR = Math.PI / 12 * 1;
  controls.rotateG = Math.PI / 12 * 2;
  controls.rotateB = Math.PI / 12 * 2;
  controls.scatter = 0;
  controls.width = 1;
  controls.height = 1;
  controls.blending = 1;
  controls.blendingMode = 1;
  controls.greyscale = false;

  function applyParams() {
    var newPass = new THREE.HalftonePass(controls.width, controls.height, controls);
    callback(newPass);
  }

  var htFolder = gui.addFolder("HalfTonePass");
  htFolder.add(controls, "shape", {dot: 1, ellipse: 2, line: 3, square: 4}).onChange(applyParams);
  htFolder.add(controls, "radius", 0, 40, 0.1).onChange(applyParams);
  htFolder.add(controls, "rotateR", 0, Math.PI*2, 0.1).onChange(applyParams);
  htFolder.add(controls, "rotateG", 0, Math.PI*2, 0.1).onChange(applyParams);
  htFolder.add(controls, "rotateB", 0, Math.PI*2, 0.1).onChange(applyParams);
  htFolder.add(controls, "scatter", 0, 2, 0.1).onChange(applyParams);
  htFolder.add(controls, "width", 0, 15, 0.1).onChange(applyParams);
  htFolder.add(controls, "height", 0, 15, 0.1).onChange(applyParams);
  htFolder.add(controls, "blending", 0, 2, 0.01).onChange(applyParams);
  htFolder.add(controls, "blendingMode", {linear: 1, multiply: 2, add: 3, lighter: 4, darker: 5}).onChange(applyParams);
  htFolder.add(controls, "greyscale").onChange(applyParams);
}

function addOutlinePassControls(gui, controls, outlinePass) {

  controls.edgeStrength = 3.0,
  controls.edgeGlow = 0.0,
  controls.edgeThickness = 1.0,
  controls.pulsePeriod = 0,
  controls.usePatternTexture = false

  var folder = gui.addFolder("OutlinePass");
  folder.add( controls, 'edgeStrength', 0.01, 10 ).onChange( function ( value ) { outlinePass.edgeStrength = Number( value );});
  folder.add( controls, 'edgeGlow', 0.0, 1 ).onChange( function ( value ) { outlinePass.edgeGlow = Number( value );});
  folder.add( controls, 'edgeThickness', 1, 4 ).onChange( function ( value ) { outlinePass.edgeThickness = Number( value );});
  folder.add( controls, 'pulsePeriod', 0.0, 5 ).onChange( function ( value ) { outlinePass.pulsePeriod = Number( value );});

  var colors = {
    visibleEdgeColor: '#ffffff',
    hiddenEdgeColor: '#190a05'
  };

  folder.addColor( colors, 'visibleEdgeColor' ).onChange( function ( value ) {  outlinePass.visibleEdgeColor.set( value );});
  folder.addColor( colors, 'hiddenEdgeColor' ).onChange( function ( value ) { outlinePass.hiddenEdgeColor.set( value );});
}

function addUnrealBloomPassControls(gui, controls, bloomPass, callback) {
  controls.resolution = 256;
  controls.strength = 1;
  controls.radius = 0.1;
  controls.threshold = 0.1;

  function newBloom() {
    var newPass = new THREE.UnrealBloomPass(new THREE.Vector2(controls.resolution, controls.resolution), controls.strength, controls.radius, controls.threshold)
    console.log(newPass)
    callback(newPass);
  }

  var folder = gui.addFolder("UnrealBloom");
  folder.add( controls, 'resolution', 2, 1024, 2).onChange(newBloom);
  folder.add( controls, 'strength', 0, 10, 0.1).onChange(newBloom);
  folder.add( controls, 'radius', 0, 10, 0.01).onChange(newBloom);
  folder.add( controls, 'threshold', 0, 0.2, 0.01).onChange(newBloom);
}

function addSepiaShaderControls(gui, controls, shaderPass) {
  controls.amount = 1;
  var folder = gui.addFolder("SepiaShader");
  folder.add( controls, "amount", 0, 10, 0.1).onChange(function(e) {
    shaderPass.uniforms["amount"].value = e;
  });
}

function addColorifyShaderControls(gui, controls, shaderPass) {
  var folder = gui.addFolder("ColorifyShader");
  controls.color = 0xffffff;

  folder.addColor( controls, 'color' ).onChange( function ( value ) {  
    shaderPass.uniforms["color"].value = new THREE.Color(value);
    }
  );
}

function addShaderControl(gui, folderName, shaderPass, toSet, enabled) {

  function uniformOrDefault(uniforms, key, def) {
    return (uniforms[key].value !== undefined && uniforms[key].value !== null ) ? uniforms[key].value : def;
  }

  function addUniformBool(folder, key, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, 0);
    folder.add(localControls, key).onChange(function(v) {shader.uniforms[key].value = v}); 
  }

  function addUniformFloat(folder, key, from, to, step, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, 0);
    folder.add(localControls, key, from, to, step).onChange(function(v) {shader.uniforms[key].value = v});
  }

  function addUniformColor(folder, key, shader) {
    var localControls = {}
    localControls[key] = uniformOrDefault(shader.uniforms, key, new THREE.Color(0xffffff));
    folder.addColor( localControls, key ).onChange( function ( value ) {  
      shader.uniforms[key].value = new THREE.Color().setRGB(value.r / 255, value.g / 255, value.b / 255);
      }
    );
  }

  function addUniformVector3(folder, key, shader, from, to, step) {
    var startValue = uniformOrDefault(shader.uniforms, key, new THREE.Vector3(0, 0, 0));
    var keyX = key + "_x";
    var keyY = key + "_y";
    var keyZ = key + "_z";

    localControls = {};
    localControls[keyX] = startValue.x;
    localControls[keyY] = startValue.y;
    localControls[keyZ] = startValue.z;

    folder.add(localControls, keyX, from.x, to.x, step.x).onChange(function(v) {shader.uniforms[key].value.x = v});
    folder.add(localControls, keyY, from.x, to.x, step.x).onChange(function(v) {shader.uniforms[key].value.y = v});
    folder.add(localControls, keyZ, from.x, to.x, step.x).onChange(function(v) {shader.uniforms[key].value.z = v});
  }

  function addUniformVector2(folder, key, shader, from, to, step) {
    var startValue = uniformOrDefault(shader.uniforms, key, new THREE.Vector2(0, 0));
    shader.uniforms[key].value = startValue;

    var keyX = key + "_x";
    var keyY = key + "_y";

    localControls = {};
    localControls[keyX] = startValue.x;
    localControls[keyY] = startValue.y;

    folder.add(localControls, keyX, from.x, to.x, step.x).onChange(function(v) {shader.uniforms[key].value.x = v});
    folder.add(localControls, keyY, from.x, to.x, step.x).onChange(function(v) {shader.uniforms[key].value.y = v});
  }

  // create the folder and set enabled
  var folder = gui.addFolder(folderName);
  if (toSet.setEnabled !== undefined ? toSet.setEnabled : true) {
    shaderPass.enabled = enabled !== undefined ? enabled : false;
    folder.add(shaderPass, "enabled");  
  }

  if (toSet.floats !== undefined) {
    toSet.floats.forEach(function (p) {
      var from = p.from !== undefined ? p.from : 0;
      var to = p.from !== undefined ? p.to : 1;
      var step = p.from !== undefined ? p.step : 0.01;
      addUniformFloat(folder, p.key, from, to, step, shaderPass)
    });
  }

  if (toSet.colors !== undefined) {
    toSet.colors.forEach(function (p) {
      addUniformColor(folder, p.key, shaderPass)
    });
  }

  if (toSet.vector3 !== undefined) {
    toSet.vector3.forEach(function (p) {
      addUniformVector3(folder, p.key, shaderPass, p.from, p.to, p.step)
    });
  }

  if (toSet.vector2 !== undefined) {
    toSet.vector2.forEach(function (p) {
      addUniformVector2(folder, p.key, shaderPass, p.from, p.to, p.step)
    });
  }

  if (toSet.booleans !== undefined) {
    toSet.booleans.forEach(function(p) {
      addUniformBool(folder, p.key, shaderPass)
    })
  }
}
  
