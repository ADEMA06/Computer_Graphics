var geometry, mesh, material; //the holy trinity

//balls constants
const ballRadius = 2;
const randBallsNumb = 15;


var activeBalls = [], activeBallsLenght = 0; //all of the balls will be stored here
var axesHelper = new THREE.AxesHelper(15); //use me in case of emergency

const white = new THREE.Color(0xFFFFFF);

function createBall(x, y, z, angle, color, ghost){
    'use strict';

    var ball = new THREE.Object3D();

    ball.userData = {vx: 0, vy: 0, vz: 0, ghost: ghost, angle: angle};

    geometry = new THREE.SphereGeometry(ballRadius, 50, 50);
    material = new THREE.MeshBasicMaterial({color: color});

    mesh = new THREE.Mesh(geometry, material);
    ball.position.set(x,y,z);
    ball.add(mesh);

    return ball;
  }

  function simulateCollision(b1, b2, elapsedTime){
    'use strict';

    //repositions the balls to state before colliding
    b1.translateX(b1.userData.vx * -elapsedTime);
    b1.translateZ(b1.userData.vz * -elapsedTime);
    b2.translateX(b2.userData.vx * -elapsedTime);
    b2.translateZ(b2.userData.vz * -elapsedTime);

    //math implementations copied from wiki (simulates elastic collision)
    var v1 = new THREE.Vector3(b1.userData.vx, 0, b1.userData.vz);
    var v2 = new THREE.Vector3(b2.userData.vx, 0, b2.userData.vz);

    var p1 = new THREE.Vector3(b1.position.x, b1.position.y, b1.position.z);
    var p2 = new THREE.Vector3(b2.position.x, b2.position.y, b2.position.z);

    var v1minusv2 = new THREE.Vector3();
    var p1minusp2 = new THREE.Vector3();
    var v2minusv1 = new THREE.Vector3();
    var p2minusp1 = new THREE.Vector3();
    var nv1 = new THREE.Vector3();
    var nv2 = new THREE.Vector3();

    //======new ball1 speed=======//
    v1minusv2.subVectors(v1, v2);
    p1minusp2.subVectors(p1,p2);

    var dot = v1minusv2.dot(p1minusp2);

    var norm = p1.distanceToSquared(p2);

    var div = dot / norm;

    var mult = p1minusp2.multiplyScalar(div);

    nv1.subVectors(v1, mult);

  //=======new ball2 speed==========//
    v2minusv1.subVectors(v2, v1);

    p2minusp1.subVectors(p2,p1);

    dot = v2minusv1.dot(p2minusp1);

    norm = p2.distanceToSquared(p1);
    div = dot / norm;

    mult = p2minusp1.multiplyScalar(div);

    nv2.subVectors(v2, mult);

    b1.userData.vx = nv1.x;
    b1.userData.vy = nv1.y;
    b1.userData.vz = nv1.z;

    b1.userData.angle = Math.atan(nv1.x / nv1.z);

    b2.userData.vx = nv2.x;
    b2.userData.vy = nv2.y;
    b2.userData.vz = nv2.z;

    b2.userData.angle = Math.atan(nv2.x / nv2.z);
  }

  function checkBallsColl(b1, b2){ //detects collisions between balls
    const diam = 2 * ballRadius;
    if(Math.pow(b1.position.x - b2.position.x, 2) + Math.pow(b1.position.z - b2.position.z, 2) < Math.pow(diam, 2) &&
       !b1.userData.ghost && !b2.userData.ghost) return true;

    else return false;
  }

  function addRandomBalls(scene){//adds the random balls to the table
    'use strict';
    //limits of the table
    var maxX = 48;
    var minX = -48;
    var maxZ = 23;
    var minZ = -23;

    for(var i = 0; i < randBallsNumb; i++){
      var flag = 1;
      var ball;
      var x, z;
      while(flag){
        flag = 0;
        x = Math.random() * (maxX - minX) + minX;
        z = Math.random() * (maxZ - minZ) + minZ;
        ball = createBall( x, 2, z, Math.PI/6, white, false);
        
        if(activeBallsLenght == 0) break;
        
        for(var b of activeBalls){
          if(checkBallsColl(b, ball)){
            flag = 1;
            break;
          }
        }
      }
      var speed = 60;
      var vx = speed * (2 * Math.random() - 1);
      var vz = speed * (2 * Math.random() - 1);
      ball.userData.vx = vx;
      ball.userData.vy = 0;
      ball.userData.vz = vz;
      ball.userData.angle = Math.atan(vx / vz);
      scene.add(ball);
      activeBalls.push(ball);
      activeBallsLenght++;
    }
  }
