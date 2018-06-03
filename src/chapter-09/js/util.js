
function setRandomColors(object, scale) {
  var children = object.children;
  if (children && children.length > 0) {
      children.forEach(function (e) {
          setRandomColors(e, scale)
      });
  } else {
      // no children assume contains a mesh
      if (object instanceof THREE.Mesh) {
        if (object.material instanceof Array) {
          object.material.forEach(function(m) {
            m.color = new THREE.Color(scale(Math.random()).hex());
            if (m.name.indexOf("building") == 0) {
                m.emissive = new THREE.Color(0x444444);
                m.transparent = true;
                m.opacity = 0.8;
              }
          });
        } else {
          object.material.color = new THREE.Color(scale(Math.random()).hex());
          if (object.material.name.indexOf("building") == 0) {
              object.material.emissive = new THREE.Color(0x444444);
              object.material.transparent = true;
              object.material.opacity = 0.8;
            }
        }
      }
  }
}