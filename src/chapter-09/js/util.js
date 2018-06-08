
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

/**
 * Adds a folder to the provided dat.gui to control an animation clip
 * 
 * @param {*} folderName name of the folder to add
 * @param {*} gui dat.gui to add it to
 * @param {*} clipAction clipAction to control
 * @return the control object
 */
function addClipActionFolder(folderName, gui, clipAction, animationClip) {
  var actionControls = {
      keyframe: 0,
      time: 0,
      timeScale: 1,
      repetitions: Infinity,
      // warp
      warpStartTimeScale: 1,
      warpEndTimeScale: 1,
      warpDurationInSeconds: 2,
      warp: function() {clipAction.warp(actionControls.warpStartTimeScale, actionControls.warpEndTimeScale, actionControls.warpDurationInSeconds)},
      fadeDurationInSeconds: 2,
      fadeIn: function() {clipAction.fadeIn(actionControls.fadeDurationInSeconds)},
      fadeOut: function() {clipAction.fadeOut(actionControls.fadeDurationInSeconds)},
      effectiveWeight: 0,
      effectiveTimeScale: 0
    }

    var actionFolder = gui.addFolder(folderName)
    actionFolder.add(clipAction, "clampWhenFinished").listen();
    actionFolder.add(clipAction, "enabled").listen();
    actionFolder.add(clipAction, "paused").listen();
    actionFolder.add(clipAction, "loop", { LoopRepeat: THREE.LoopRepeat, LoopOnce: THREE.LoopOnce, LoopPingPong: THREE.LoopPingPong }).onChange(function(e) {
      if (e == THREE.LoopOnce || e == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(e), undefined);
      } else {
        clipAction.setLoop(parseInt(e), actionControls.repetitions);
      }
    });
    actionFolder.add(actionControls, "repetitions", 0, 100).listen().onChange(function(e) {
      if (clipAction.loop == THREE.LoopOnce || clipAction.loop == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(clipAction.loop), undefined);
      } else {
        clipAction.setLoop(parseInt(e), actionControls.repetitions);
      }
    });
    actionFolder.add(clipAction, "time", 0, animationClip.duration, 0.001).listen()
    actionFolder.add(clipAction, "timeScale", 0, 5, 0.1).listen()
    actionFolder.add(clipAction, "weight", 0, 1, 0.01).listen()
    actionFolder.add(actionControls, "effectiveWeight", 0, 1, 0.01).listen()
    actionFolder.add(actionControls, "effectiveTimeScale", 0, 5, 0.01).listen()
    actionFolder.add(clipAction, "zeroSlopeAtEnd").listen()
    actionFolder.add(clipAction, "zeroSlopeAtStart").listen()
    actionFolder.add(clipAction, "stop")
    actionFolder.add(clipAction, "play")
    actionFolder.add(clipAction, "reset")
    actionFolder.add(actionControls, "warpStartTimeScale", 0, 10, 0.01)
    actionFolder.add(actionControls, "warpEndTimeScale", 0, 10, 0.01)
    actionFolder.add(actionControls, "warpDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(actionControls, "warp")
    actionFolder.add(actionControls, "fadeDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(actionControls, "fadeIn")
    actionFolder.add(actionControls, "fadeOut")

    return actionControls;
}