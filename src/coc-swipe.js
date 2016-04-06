/***************
coc-swipe.js
Ramkumar Shankar
Port of the C++ cocSwipe class for swipe dete tion
Created 06/04/2016
***************/

//Specify dependency on vec2 class here
var vec2 = require('../lib/vec2');

//cocSwipe 'class' starts here
var cocSwipe = cocSwipe || {};

cocSwipe.SwipeDirectionEnum = {
  UNDEFINED: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3,
  LEFT: 4
};

cocSwipe.SwipePointTypeEnum = {
  UNDEFINED: 0,
  DOWN: 1,
  MOVED: 2,
  UP: 3
};

cocSwipe.points = [];
cocSwipe.pointsNew = [];

cocSwipe.swipePixelDistanceThreshold = 50;
cocSwipe.swipePixelVelocityThreshold = 100;
cocSwipe.swipeTime = '';
cocSwipe.gestureDirection = cocSwipe.SwipeDirectionEnum.UNDEFINED;
cocSwipe.gestureStartIndex = -1;
cocSwipe.bGestureFoundNew = false;
cocSwipe.time = 0;

cocSwipe.swipePoint = function (xPos, yPos, _type) {
  return {
    type: _type,
    position: {
      x: xPos,
      y: yPos
    },
    velocity: {
      x: 0,
      y: 0
    },
    velocityScale: 0,
    angleDeg: 0,
    time: 0,
  };
};

cocSwipe.setSwipePixelDistanceThreshold = function (value) {
  this.swipePixelDistanceThreshold = value;
};

cocSwipe.setSwipePixelVelocityThreshold = function (value) {
  this.swipePixelVelocityThreshold = value;
};

cocSwipe.pointUp = function(x, y) {
  this.pointNew(x, y, this.SwipePointTypeEnum.UP);
};

cocSwipe.pointDown = function(x, y) {
  this.pointNew(x, y, this.SwipePointTypeEnum.DOWN);
};

cocSwipe.pointMoved = function(x, y) {
  this.pointNew(x, y, this.SwipePointTypeEnum.MOVED);
};

cocSwipe.pointNew = function(x, y, type) {
  var point = this.swipePoint(x, y, type);
  this.pointsNew.push(point);
};

cocSwipe.reset = function() {
  this.points = [];
  this.swipeTime = 0;

  this.gestureDirection = this.SwipeDirectionEnum.UNDEFINED;
  this.gestureStartIndex = -1;
};

cocSwipe.hasFoundSwipeGesture = function() {
  return this.bGestureFoundNew;
};

cocSwipe.getSwipeGestureDirection = function() {
  return this.gestureDirection;
};

cocSwipe.getPoints = function() {
  return this.points;
};

cocSwipe.getSwipeTime = function() {
  return this.swipeTime;
};

cocSwipe.update = function() {
  this.bGestureFoundNew = false;

  var bSwipeStopped = false;

  if (this.points.length > 0) {
    if (this.points[this.points.length-1].type == this.SwipePointTypeEnum.UP) {
      bSwipeStopped = true;
    }
    if (bSwipeStopped) {
      var bDownNew = false;
      for (var i = 0; i < this.pointsNew.length; i++) {
        if (this.pointsNew[i].type == this.SwipePointTypeEnum.DOWN) {
          bDownNew = true;
          break;
        }
      }
      if (bDownNew) {
        bSwipeStopped = false;
        this.reset();
      }
    }
  }

  if (bSwipeStopped) {
    return;
  }

  var bSwipeStarted = false;
  if (this.points.length > 0) {
    bSwipeStarted = true;
  }

  var bSwipeStartedNow = false;
  if (!bSwipeStarted && this.pointsNew.length > 0) {
    if (this.pointsNew[0].type == this.SwipePointTypeEnum.DOWN) {
      bSwipeStartedNow = true;
    }
  }

  var bUpdate = false;
  if (bSwipeStarted || bSwipeStartedNow) {
    bUpdate = true;
  }
  else {
    return;
  }

  //Update swipe time
  var now = new Date().getTime();
  var delta = (now - (this.time || now))/1000;
  this.time = now;

  if (bSwipeStartedNow) {
    this.swipeTime = 0;
  }
  else {
    this.swipeTime += delta;
  }

  if(this.pointsNew.length === 0) {
    return;
  }

  var bFound = false;
  var pointNew;

  if (bSwipeStartedNow) {
    //look for touch down
    for (var i = 0; i < this.pointsNew.length; i++) {
      if (this.pointsNew[i].type === this.SwipePointTypeEnum.DOWN) {
        pointNew = Object.assign({}, this.pointsNew[i]);
        bFound = true;
        break;
      }
    }
  }
  else {
    //look for touch up
    for (var i = this.pointsNew.length - 1; i >= 0; i--) {
      if (this.pointsNew[i].type === this.SwipePointTypeEnum.UP) {
        var bSame = false;
        if (this.points.length > 0) {
          if (this.pointsNew[i].position.x == this.points[this.points.length-1].position.x && this.pointsNew[i].position.y == this.points[this.points.length-1].position.y) {
            bSame = true;
          }
        }
        if (bSame) {
          this.points.splice(this.points.length-1, 1);
        }
        pointNew = Object.assign({}, this.pointsNew[i]);
        bFound = true;
        break;
      }
    }
    if (!bFound) {
      for (var i = this.pointsNew.length - 1; i >= 0; i--) {
        if (this.pointsNew[i].type === this.SwipePointTypeEnum.MOVED) {
          var bSame = false;
          if (this.points.length > 0) {
            if (this.pointsNew[i].position.x == this.points[this.points.length-1].position.x && this.pointsNew[i].position.y == this.points[this.points.length-1].position.y) {
              bSame = true;
            }
          }
          if (bSame) {
            continue;
          }
          pointNew = Object.assign({}, this.pointsNew[i]);
          bFound = true;
          break;
        }
      }
    }
  }

  this.pointsNew = [];
  if (!bFound) {
    return;
  }

  this.points.push(pointNew);
  this.points[this.points.length-1].time = this.swipeTime;

  if (this.points.length > 1) {
    //Find the velocity
    var point = vec2.fromValues(this.points[this.points.length-1].position.x, this.points[this.points.length-1].position.y);
    var pointLast = vec2.fromValues(this.points[this.points.length-2].position.x, this.points[this.points.length-2].position.y);
    var velocity = vec2.create();
    vec2.sub(velocity, point, pointLast);
    var timeDelta = this.points[this.points.length-1].time - this.points[this.points.length-2].time;
    this.points[this.points.length-1].velocity.x = velocity[0]/timeDelta;
    this.points[this.points.length-1].velocity.y = velocity[1]/timeDelta;

    this.points[this.points.length-1].velocityScale = vec2.length(vec2.fromValues(velocity[0]/timeDelta, velocity[1]/timeDelta)) / this.swipePixelVelocityThreshold;
    this.points[this.points.length-1].angleDeg = this.angleClockwise(this.points[this.points.length-1].velocity);
    this.points[this.points.length-1].angleDeg = (this.points[this.points.length-1].angleDeg / Math.PI) * 180.0;
  }

  if (this.gestureStartIndex == -1) {
    this.gestureStartIndex = this.points.length-1;
  }

  var gesturePointStart;
  var gestureDirectionStart;

  for (var i = this.gestureStartIndex; i < this.points.length; i++) {
    if (i == this.gestureStartIndex) {
      gesturePointStart = Object.assign({}, this.points[i]);
      gestureDirectionStart = this.getDirectionFromAngle(gesturePointStart.angleDeg);
    }

    var gesturePoint = Object.assign({}, this.points[i]);
    if(gesturePoint.velocityScale < 1.0) {
      this.gestureDirection = this.SwipeDirectionEnum.UNDEFINED;
      this.gestureStartIndex = -1;
      break;
    }

    var gestureDirectionNew = this.getDirectionFromAngle(gesturePoint.angleDeg);
    if (gestureDirectionNew != gestureDirectionStart) {
      this.gestureDirection = this.SwipeDirectionEnum.UNDEFINED;
      this.gestureStartIndex = -1;
      break;
    }

    var dist = vec2.distance(vec2.fromValues(gesturePoint.position.x, gesturePoint.position.y), vec2.fromValues(gesturePointStart.position.x, gesturePointStart.position.y));
    if (dist >= this.swipePixelDistanceThreshold) {
      if (this.gestureDirection != gestureDirectionNew) {
        this.bGestureFoundNew = true;
      }
      this.gestureDirection = gestureDirectionNew;
    }
  }


  //Check if last event is an up event
};

cocSwipe.angleClockwise = function(direction) {
  var angle = Math.atan2(direction.y, direction.x);
  angle += Math.PI * 0.5;
  if(angle < 0.0) {
    angle += Math.PI * 2;
  } else if(angle > Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
};

cocSwipe.getDirectionFromAngle = function(angleDeg) {
  var dir;
  if((angleDeg > 315 && angleDeg <= 360) || (angleDeg >= 0 && angleDeg <= 45)) {
    dir = this.SwipeDirectionEnum.UP;
  } else if(angleDeg > 45 && angleDeg <= 135) {
    dir = this.SwipeDirectionEnum.RIGHT;
  } else if(angleDeg > 135 && angleDeg <= 225) {
    dir = this.SwipeDirectionEnum.DOWN;
  } else if(angleDeg > 225 && angleDeg <= 315) {
    dir = this.SwipeDirectionEnum.LEFT;
  }
  return dir;
};

//Allow 'requiring' as a commonJS module
module.exports = cocSwipe;
