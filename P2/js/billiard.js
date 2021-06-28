var renderer, scene, geometry, mesh, clock, material;
var currentCamera, camera1, camera2, camera3;

//world constants
const friction = -8;
const gravity = 9.8;
const speed = 40;
const angle_limit = Math.PI * 1/3;


var axesHelper = new THREE.AxesHelper(110);
var spacePressed = false;

function handleWallCollision(obj, wall){
  'use strict';

  switch (wall) {
    case "left":
    case "right":
      obj.userData.vx = -obj.userData.vx;
      break;
    case "up":
    case "down":
      obj.userData.vz = -obj.userData.vz;
      break;
  }
}

function checkCollisionWall(obj){
  'use strict';
  const upperLimit = table.children[1].position.z + wallDepth / 2;
  const bottomLimit = table.children[2].position.z - wallDepth / 2;
  const leftLimit = table.children[4].position.x + wallDepth / 2;
  const rightLimit = table.children[3].position.x - wallDepth / 2;

  if(obj.position.x + ballRadius > rightLimit){
    obj.position.x = rightLimit - ballRadius;
    handleWallCollision(obj, "right");
  }
  if(obj.position.x - ballRadius < leftLimit){
    obj.position.x = leftLimit + ballRadius;
    handleWallCollision(obj, "left");
  }
  if(obj.position.z + ballRadius > bottomLimit){
    obj.position.z = bottomLimit - ballRadius;
    handleWallCollision(obj, "down");
  }
  if(obj.position.z - ballRadius < upperLimit){
    obj.position.z = upperLimit + ballRadius;
    handleWallCollision(obj, "up");
  }

}

function checkFall(ball){
  for(var i = 5; i < 11 ; i++){
    if ((Math.pow(ball.position.x - table.children[i].position.x, 2) +
      Math.pow(ball.position.z - table.children[i].position.z, 2)) < 0.25){ //ball is falling
      ball.userData.vx = 0;
      ball.userData.vz = 0;
      if (ball.userData.vy == 0){
        ball.userData.vy = -20;
        ball.userData.ghost = true;
      }
      break;
    }
    else if ((Math.pow(ball.position.x - table.children[i].position.x, 2) +
        Math.pow(ball.position.z - table.children[i].position.z, 2)) <
        Math.pow(holeRadius, 2)){                                           //ball is being sucked into the blackhole
          //if the ball is aproaching the hole, we let gravity do its magic
          ball.userData.vx == 0 ? ball.userData.vx = 5 : ball.userData.vx;
          ball.userData.vz == 0 ? ball.userData.vz = 5 : ball.userData.vz;
          
          ball.userData.vx = Math.abs(ball.userData.vx)*(table.children[i].position.x - ball.position.x);
          ball.userData.vz = Math.abs(ball.userData.vz)*(table.children[i].position.z - ball.position.z);
          break;
        }
  }
}


function onKeyDown(e){
  'use strict';
    keyMap[e.keyCode] = true;
}

function onKeyUp(e){
  'use strict';
  if(e.keyCode == 32){
    spacePressed = false;
  }
  keyMap[e.keyCode] = false;
}

function render(){
  'use strict';
  renderer.render(scene, currentCamera);
}

function createClock(){
  'use strict';
  clock = new THREE.Clock();
}

function createScene(){
  'use strict';
  scene = new THREE.Scene();

  table = createTable(0, 0, 0);
  scene.add(table);
  createPoles(scene);
  addRandomBalls(scene);
}

function createCamera(){
  'use strict';

  camera1 = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15,
                                      window.innerHeight / 15, window.innerHeight / -15,
                                      1, 1000);
  camera2 = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 1, 1000);
  camera3 = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 1, 1000);

  camera1.position.y = 55;
  camera2.position.set(55, 55, 55);
  camera3.position.set(55, 55, 55);

  camera1.lookAt(scene.position);
  camera2.lookAt(scene.position);
  camera3.lookAt(scene.position);

  currentCamera = camera1;
}

function animate(){
  'use strict';
  var elapsedTime = clock.getDelta();

  if(keyMap[32] && !spacePressed){ //space
    spacePressed = true;
    for(var i = 0; i < 6; i++){
      if(poles[i].children[0].material.color.equals(highlight_pole_color)){
        var poleX = poles[i].position.x;
        var poleZ = poles[i].position.z;
        var new_ball;
        var angle = poles[i].rotation._y;
        if(poles[i].position.z < 0){
          new_ball = createBall(poleX, 2, poleZ + wallDepth + ballRadius + 1, angle, white, false);
          new_ball.userData.vz = speed * Math.cos(angle);
          new_ball.userData.vx = speed * Math.sin(angle);
        }
        else if(poles[i].position.z > 0){
          angle = angle + Math.PI;
          new_ball = createBall(poleX, 2, poleZ - wallDepth - ballRadius - 1, angle, white, false);
          new_ball.userData.vz = speed * Math.cos(angle);
          new_ball.userData.vx = speed * Math.sin(angle);
        }
        else if(poles[i].position.x < 0){
          angle = Math.PI/-2 + angle;
          new_ball = createBall(poleX + wallDepth + ballRadius + 1, 2, poleZ, angle, white, false);
          new_ball.userData.vx = -speed * Math.sin(angle);
          new_ball.userData.vz = -speed * Math.cos(angle);
        }
        else if(poles[i].position.x > 0){
          angle = Math.PI/2 + angle;
          new_ball = createBall(poleX - wallDepth - ballRadius - 1, 2, poleZ, angle, white, false);
          new_ball.userData.vx = -speed * Math.sin(angle);
          new_ball.userData.vz = -speed * Math.cos(angle);
        }
        scene.add(new_ball);
        activeBalls.push(new_ball);
        activeBallsLenght++;
      }
    }
  }

  if(keyMap[49]){ //1
    currentCamera = camera1
  }
  if(keyMap[50]){ //2
    currentCamera = camera2
  }
  if(keyMap[51]){ //3
    currentCamera = camera3
  }
  for(var i = 0; i < 6; i++){
    if(keyMap[52 + i]){ //changes the color of the selected poles 1..6
      if(poles[i].children[0].material.color.equals(default_pole_color)){
      poles[i].children[0].material.color.set(highlight_pole_color);
      }
      else{
        poles[i].children[0].material.color.set(default_pole_color);
      }
    keyMap[52 + i] = false;
    }
  }

  for(var i = 0; i < 6; i++){
    if(keyMap[37]){ // left
      if(poles[i].children[0].material.color.equals(highlight_pole_color)){
        if(poles[i].rotation._y > -angle_limit){
          poles[i].rotateY(-0.7 * elapsedTime);
        }
      }
    }
  }

  for(var i = 0; i < 6; i++){
    if(keyMap[39]){ // right
      if(poles[i].children[0].material.color.equals(highlight_pole_color)){
        if(poles[i].rotation._y < angle_limit){
          poles[i].rotateY(0.7 * elapsedTime);
        }
      }
    }
  }
  for(var i = 0; i < activeBallsLenght; i++){
    var ball = activeBalls[i];
     for(var j = i+1; j < activeBallsLenght; j++){
      if(checkBallsColl(ball, activeBalls[j])){
          simulateCollision(ball, activeBalls[j], elapsedTime);
      }
     }
    if(ball.userData.vx < -0.4){
      ball.userData.vx -= friction * Math.abs(Math.sin(ball.userData.angle)) * elapsedTime;
    }
    else if (ball.userData.vx > 0.4) {
      ball.userData.vx += friction * Math.abs(Math.sin(ball.userData.angle))* elapsedTime;
    }
    else{
      ball.userData.vx = 0;
    }

    if(ball.userData.vz < -0.4){
      ball.userData.vz -= friction * Math.abs(Math.cos(ball.userData.angle)) * elapsedTime;
    }
    else if (ball.userData.vz > 0.4){
      ball.userData.vz += friction * Math.abs(Math.cos(ball.userData.angle)) * elapsedTime;
    }
    else {
      ball.userData.vz = 0;
    }

    if(ball.userData.vy != 0){
      ball.userData.vy -= gravity * elapsedTime;
    }

    //rotates the ball i (math!)
    var ballVec = new THREE.Vector3(ball.userData.vx, 0, ball.userData.vz);
    ballVec.cross(new THREE.Vector3(0,-1,0));

    var rotSpeed = Math.sqrt(Math.pow(ball.userData.vx, 2) + Math.pow(ball.userData.vz, 2));

    ball.children[0].rotateOnAxis(ballVec.normalize(), rotSpeed * elapsedTime);

    ball.translateX(ball.userData.vx * elapsedTime);
    ball.translateZ(ball.userData.vz * elapsedTime);
    ball.translateY(ball.userData.vy * elapsedTime);
    checkCollisionWall(ball);
    checkFall(ball);
  }

  if(activeBallsLenght > randBallsNumb){
    var currBall = activeBalls[activeBallsLenght-1];
    camera3.lookAt(currBall.position);
    if(currBall.userData.vx > 0) camera3.position.x = currBall.position.x - 5;
    else if(currBall.userData.vx < 0) camera3.position.x = currBall.position.x + 5;
    else camera3.position.x = currBall.position.x;

    if(currBall.userData.vz > 0) camera3.position.z = currBall.position.z - 5;
    else if(currBall.userData.vz < 0) camera3.position.z = currBall.position.z + 5;
    else camera3.position.z = currBall.position.z;

    camera3.position.y = currBall.position.y + 5;
  }

  render();

  requestAnimationFrame(animate);
}

function init(){
  'use strict';

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  createScene();
  createClock();
  createCamera();

  render();

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
}
