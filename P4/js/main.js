var renderer, scene, scene2, clock, keyMap = [], keyHeldMap = [];
var camera1, camera2, controls, flag, ball, floor, paused = false, reset = false;
var materials_list = [];
var frustumSize = 100;

function createClock(){
    'use strict';
    clock = new THREE.Clock();
}

function createScene(){
    'use strict';
    scene = new THREE.Scene();

    floor = createField();
    var pirilampo = createPointLight(0, 2.6, -15, white);
    var dLight = createDirectionalLight(0, 10, 50);
    flag = createFlag();
    ball = createBall();

    scene.add(floor);
    scene.add(pirilampo);
    scene.add(dLight);
    scene.add(flag);
    scene.add(ball);

    scene.background = new THREE.CubeTextureLoader().setPath( 'images_textures/cubemap/' ).load( ['px.png','nx.png','py.png','ny.png','pz.png','nz.png'] );
}

function createScene2(){
  'use strict';
  scene2 = new THREE.Scene();

  var pause_icon = new THREE.Object3D();
  var material = new THREE.MeshBasicMaterial({color: white});
  var geometry = new THREE.BoxGeometry(12, 50, 10);
  var mesh1 = new THREE.Mesh(geometry, material);
  mesh1.position.set(13, 0, 0);
  var mesh2 = new THREE.Mesh(geometry, material);
  mesh2.position.set(-13, 0, 0);

  pause_icon.add(mesh1);
  pause_icon.add(mesh2);

  pause_icon.position.set(0, 0, 250);

  scene2.add(pause_icon);

}

function createCamera(){
    'use strict';
    var aspectRatio = window.innerWidth / window.innerHeight;

    camera1 = new THREE.PerspectiveCamera(90, aspectRatio, 1, 1000);
    camera1.position.set(80, 80, 80);

    camera2 = new THREE.OrthographicCamera(frustumSize * aspectRatio / -2, frustumSize * aspectRatio / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
    camera2.position.set(0, 0, 200);

    camera1.lookAt(scene.position);
    camera2.lookAt(scene2.children[0].position);

}

function createControls(){
    'use strict';

    controls = new THREE.OrbitControls(camera1, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

	  controls.maxDistance = 500;

}


//========Key Inputs========//
function onKeyDown(e){
    'use strict';
    keyMap[e.keyCode] = true;
}

function onKeyUp(e){
    'use strict';
    keyMap[e.keyCode] = false;
    keyHeldMap[e.keyCode] = false;
}

function onResize(){
  var aspectRatio = window.innerWidth / window.innerHeight;

  camera1.aspect = aspectRatio;
  camera1.updateProjectionMatrix();

  camera2.left = frustumSize * aspectRatio / - 2;
  camera2.right = frustumSize * aspectRatio / 2;
  camera2.top = frustumSize/ 2;
  camera2.bottom = - frustumSize/ 2;
  camera2.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function resetInit(){
  'use strict';

  scene.children[1].visible = true;
  scene.children[2].visible = true;

  keyMap = [];
  keyHeldMap = [];

  ball.position.set(0, 7.5, 0);
  ball.userData.jumping = false;
  ball.userData.step = 0;
  ball.userData.phongMaterial.wireframe = false;
  ball.userData.basicMaterial.wireframe = false;
  ball.material = ball.userData.phongMaterial;


  flag.rotation.set(0, 0, 0);
  flag.children[0].userData.phongMaterial.wireframe = false;
  flag.children[0].userData.basicMaterial.wireframe = false;
  flag.children[0].material = flag.children[0].userData.phongMaterial;
  flag.userData.phongMaterial.wireframe = false;
  flag.userData.basicMaterial.wireframe = false;
  flag.material = flag.userData.phongMaterial;

  floor.userData.phongMaterial.wireframe = false;
  floor.userData.basicMaterial.wireframe = false;
  floor.material = floor.userData.phongMaterial;

  paused = false;
  reset = false;

  camera1.position.set(80, 80, 80);

  clock.start();
}


function animate(){
    'use strict';

    render(scene, camera1);
    if(paused){
      renderer.clearDepth();
      render(scene2, camera2);
    }

    var elapsedTime = clock.getDelta();


    if(keyMap[68] && !keyHeldMap[68]){//d
        scene.children[2].visible = !scene.children[2].visible;
        keyHeldMap[68] = true;
    }

    if(keyMap[80] && !keyHeldMap[80]){//p
        scene.children[1].visible = !scene.children[1].visible;
        keyHeldMap[80] = true;
    }

    if(keyMap[66] && !keyHeldMap[66]){//b
        ball.userData.jumping = !ball.userData.jumping;
        keyHeldMap[66] = true;
    }

    if(keyMap[73] && !keyHeldMap[73]){//i
        keyHeldMap[73] = true;

        //Ball
        if(ball.material.type === "MeshPhongMaterial") ball.material = ball.userData.basicMaterial;
        else ball.material = ball.userData.phongMaterial;

        //Flag
        if(flag.material.type === "MeshPhongMaterial"){
            flag.children[0].material = flag.children[0].userData.basicMaterial;
            flag.material = flag.userData.basicMaterial;
        } else {
            flag.children[0].material = flag.children[0].userData.phongMaterial;
            flag.material = flag.userData.phongMaterial;
        }

        //Floor
        if(floor.material.type === "MeshPhongMaterial") floor.material = floor.userData.basicMaterial;
        else floor.material = floor.userData.phongMaterial;

    }

    if(keyMap[87] && !keyHeldMap[87]){//w

        //Ball
        ball.userData.basicMaterial.wireframe = !ball.userData.basicMaterial.wireframe;
        ball.userData.phongMaterial.wireframe = !ball.userData.phongMaterial.wireframe;
        if(ball.material.type === "MeshPhongMaterial") ball.material.wireframe = ball.userData.phongMaterial.wireframe;
        else ball.material.wireframe = ball.userData.basicMaterial.wireframe;

        //Floor
        floor.userData.basicMaterial.wireframe = !floor.userData.basicMaterial.wireframe;
        floor.userData.phongMaterial.wireframe = !floor.userData.phongMaterial.wireframe;
        if(floor.material.type === "MeshPhongMaterial") floor.material.wireframe = floor.userData.phongMaterial.wireframe;
        else floor.material.wireframe = floor.userData.basicMaterial.wireframe;

        //Flag
        flag.children[0].userData.basicMaterial.wireframe = !flag.children[0].userData.basicMaterial.wireframe;
        flag.children[0].userData.phongMaterial.wireframe = ! flag.children[0].userData.phongMaterial.wireframe;
        flag.userData.basicMaterial.wireframe = !flag.userData.basicMaterial.wireframe;
        flag.userData.phongMaterial.wireframe = !flag.userData.phongMaterial.wireframe;
        if(flag.material.type === "MeshPhongMaterial"){
            flag.children[0].material.wireframe = flag.children[0].userData.phongMaterial.wireframe;
            flag.material.wireframe = flag.userData.phongMaterial.wireframe;
        } else {
            flag.children[0].material.wireframe = flag.children[0].userData.basicMaterial.wireframe;
            flag.material.wireframe = flag.userData.basicMaterial.wireframe;
        }

        keyHeldMap[87] = true;
    }

    if(keyMap[83] && !keyHeldMap[83]){ //s

        if(!paused){
            elapsedTime = 0;
            clock.stop();
        } else {
            clock.start();
            elapsedTime = clock.getDelta();
        }
        paused = !paused;
        keyHeldMap[83] = true;
        console.log(paused);

    }

    if(keyMap[82]){ //r
      if(paused) reset = true;
    }


    if (ball.userData.jumping) {
        ball.userData.step += 2 * elapsedTime;
        ball.position.y = Math.abs(50 * (Math.sin(ball.userData.step))) + 7.5;
        ball.position.z = -15 + 15 * (Math.cos(ball.userData.step));
    }

    flag.rotateY(0.7*elapsedTime);

    if(reset) resetInit();
    controls.update();
    requestAnimationFrame(animate);
}

function render(scene, camera){
    'use strict';
    renderer.render(scene, camera);
}


function init(){
    'use strict';

    renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    createScene();
    createScene2();
    createClock();
    createCamera();
    createControls();

    renderer.autoClear = false;

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
  }
