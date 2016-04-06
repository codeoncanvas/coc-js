var cocSwipe = require('../../src/coc-swipe');

var currentTouches = [];

window.onload = function() {
  var touchCanvas = document.getElementById("canvas");
  touchCanvas.width = window.innerWidth;
  touchCanvas.height = window.innerHeight;

  touchCanvas.addEventListener("touchstart", handleTouchStart, false);
  touchCanvas.addEventListener("touchend", handleTouchEnd, false);
  touchCanvas.addEventListener("touchmove", handleTouchMove, false);
  console.log("touch listeners initialized.");

  runLoop();
};

function handleTouchStart(evt) {
  evt.preventDefault();
  if (currentTouches.length == 1) {
    return;
  }
  for (var i = 0; i < evt.changedTouches.length; i++) {
    currentTouches.push(copyTouch(evt.changedTouches[i]));
  }
  cocSwipe.pointDown(currentTouches[0].pageX, currentTouches[0].pageY);
}

function handleTouchMove(evt) {
  evt.preventDefault();
  for (var i = 0; i < evt.changedTouches.length; i++) {
    var idx = ongoingTouchIndexById(evt.changedTouches[i].identifier);
    if (idx >= 0) {
      cocSwipe.pointMoved(evt.changedTouches[idx].pageX, evt.changedTouches[idx].pageY);
    }
    else {
      //Only handle single touches now
      console.log("no touch to continue");
    }
  }
}

function handleTouchEnd(evt) {
  evt.preventDefault();
  for (var i = 0; i < evt.changedTouches.length; i++) {
    var idx = ongoingTouchIndexById(evt.changedTouches[i].identifier);
    if (idx >= 0) {
      cocSwipe.pointUp(evt.changedTouches[idx].pageX, evt.changedTouches[idx].pageY);
      currentTouches.splice(idx, 1);
    }
    else {
      //Only handle single touches now
      console.log("no touch to end");
    }
  }
}

function runLoop() {
  //Code here
  cocSwipe.update();

  var bFoundSwipeGesture = cocSwipe.hasFoundSwipeGesture();

  if(bFoundSwipeGesture) {
    var swipeDirection = cocSwipe.getSwipeGestureDirection();

    switch (swipeDirection) {
      case cocSwipe.SwipeDirectionEnum.UP:
        console.log("UP");
        break;
      case cocSwipe.SwipeDirectionEnum.RIGHT:
        console.log("RIGHT");
        break;
      case cocSwipe.SwipeDirectionEnum.DOWN:
        console.log("DOWN");
        break;
      case cocSwipe.SwipeDirectionEnum.LEFT:
        console.log("LEFT");
        break;
      default:
        break;
    }
  }

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var radius = 5;
  context.clearRect(0,0,canvas.width, canvas.height);
  for (var i = 0; i < cocSwipe.points.length; i++) {
    // console.log(cocSwipe.points[i].position);
    context.fillStyle = 'green';
    context.beginPath();
    context.arc(cocSwipe.points[i].position.x, cocSwipe.points[i].position.y, radius, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  }

  requestAnimationFrame(runLoop);
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < currentTouches.length; i++) {
    var id = currentTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}
