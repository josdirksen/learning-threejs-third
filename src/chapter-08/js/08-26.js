function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  var loaderScene = new BaseLoaderScene(camera);

  var loader = new THREE.SVGLoader();

  // you can use slicer to convert the model
  loader.load("../../assets/models/tiger/tiger.svg", function (paths) {
    var group = new THREE.Group();
    group.scale.multiplyScalar( 0.1 );
    group.scale.y *= -1;
    for ( var i = 0; i < paths.length; i ++ ) {
      var path = paths[ i ];
      var material = new THREE.MeshBasicMaterial( {
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false
      } );
      var shapes = path.toShapes( true );
      for ( var j = 0; j < shapes.length; j ++ ) {
        var shape = shapes[ j ];
        var geometry = new THREE.ShapeBufferGeometry( shape );
        var mesh = new THREE.Mesh( geometry, material );
        group.add( mesh );
      }
    }
          
    console.log(group);
    loaderScene.render(group, camera);
  });


}