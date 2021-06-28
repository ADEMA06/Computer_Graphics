var renderer, scene, clock, keyMap = [];
var currentCamera, camera1, camera2; //camera 1 - shows all scene || camera 2 - from palanque POV
var spotLight1, spotLight2, spotLight3;
var geometry, mesh, material;
var rotatingPlate, floor;
var dLightOn = true, basicFlag = true, phongFlag = false;
var lightSwitchDelay = 0, basicDelay = 0, reflectiveDelay = 0;
var light1Delay = 0, light2Delay = 0, light3Delay = 0;
var frustumSize = 100;

const darkGrey = 0x3C3C3C;
//========Obeject Functions========//

function createCamera(){
    var aspectRatio = window.innerWidth / window.innerHeight;

    camera1 = new THREE.PerspectiveCamera(90, aspectRatio, 1, 1000);
    camera1.position.set(80, 80, 80);

    camera2 = new THREE.OrthographicCamera(frustumSize * aspectRatio / -2, frustumSize * aspectRatio / 2, frustumSize / 2, frustumSize / -2, 1, 1000);
    camera2.position.set(200, 0, 0);

    camera1.lookAt(scene.position);
    camera2.lookAt(scene.position);

    currentCamera = camera1;
}

function createScene(){
    'use strict';
    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(150, 150, 3, 5, 5, 5);
    material = new THREE.MeshBasicMaterial({color: darkGrey});
    floor = new THREE.Mesh(geometry, material);
    floor.translateY(-2);
    floor.rotateX(Math.PI/2);

    directLight.position.set(0, 20, 0);
    dLightTarget.position.set(0, 12, 0);
    directLight.target = dLightTarget;

    spotLight1 = createSpotlight(50, 30, 70, dLightTarget, red);
    spotLight2 = createSpotlight(-50, 30, 70, dLightTarget, blue);
    spotLight3 = createSpotlight(0, 30, -70, dLightTarget, white);

    rotatingPlate = createPlate();

    scene.add(directLight);
    scene.add(dLightTarget);
    scene.add(rotatingPlate);
    scene.add(spotLight1);
    scene.add(spotLight2);
    scene.add(spotLight3);
    scene.add(floor);
}


function createClock(){
    'use strict';
    clock = new THREE.Clock();
}

function changeMaterial(material){
  if(material == "basic"){
    rotatingPlate.children[1].material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors}); //carrocaria popo
    for(var i = 0; i < 7; i++){
      rotatingPlate.children[0].children[i].material = new THREE.MeshBasicMaterial({color: lightGrey}); //chassis
    }
    rotatingPlate.material = new THREE.MeshBasicMaterial({color: 0x800000});
    floor.material = new THREE.MeshBasicMaterial({color: darkGrey});
  }
  else if(material == "phong"){
    rotatingPlate.children[1].material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors,
    shininess: 60});
    for(var i = 0; i < 7; i++){
      rotatingPlate.children[0].children[i].material = new THREE.MeshPhongMaterial({color: lightGrey, shininess: 60});
    }
    rotatingPlate.material = new THREE.MeshPhongMaterial({color: 0x800000, shininess: 60});
    floor.material = new THREE.MeshPhongMaterial({color: darkGrey, shininess: 60});
  }
  else if(material == "lambert"){
    rotatingPlate.children[1].material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors});
    for(var i = 0; i < 7; i++){
      rotatingPlate.children[0].children[i].material = new THREE.MeshLambertMaterial({color: lightGrey});
    }
    rotatingPlate.material = new THREE.MeshLambertMaterial({color: 0x800000});
    floor.material = new THREE.MeshLambertMaterial({color: darkGrey});
  }
}

//========Key Inputs========//
function onKeyDown(e){
    'use strict';
    keyMap[e.keyCode] = true;
}

function onKeyUp(e){
    'use strict';
    keyMap[e.keyCode] = false;
}

//======Main functions=====//

function render(){
    'use strict';
    renderer.render(scene, currentCamera);
}

function animate(){
    'use strict';

    var elapsedTime = clock.getDelta();

    if(keyMap[37]){ //rotate right
      rotatingPlate.rotateY(-0.07 * elapsedTime * 20);
    }
    if(keyMap[39]){ //rotate left
      rotatingPlate.rotateY(0.07 * elapsedTime * 20);
    }
    if(keyMap[49]){ //1
      if(light1Delay == 0){
        console.log(spotLight1);
        light1Delay = 10;
        spotLight1.children[0].visible = !spotLight1.children[0].visible;
        spotLight1.children[0].visible ? spotLight1.visible = true : spotLight1.visible = false;
      }
    }
    if(keyMap[50]){ //2
      if(light2Delay == 0){
        light2Delay = 10;
        spotLight2.children[0].visible = !spotLight2.children[0].visible;
        spotLight2.children[0].visible ? spotLight2.visible = true : spotLight2.visible = false;
      }
    }
    if(keyMap[51]){ //3
      if(light3Delay == 0){
        light3Delay = 10;
        spotLight3.children[0].visible = !spotLight3.children[0].visible;
        spotLight3.children[0].visible ? spotLight3.visible = true : spotLight3.visible = false;
      }
    }
    if(keyMap[52]){ //4
      currentCamera = camera1;
    }
    if(keyMap[53]){ //5
      currentCamera = camera2;
    }
    if(keyMap[87]){ //W
      if(basicDelay == 0){
        basicDelay = 15;
        basicFlag = !basicFlag;
        if(basicFlag){ //if basicFlag is active, then every material is basic
          changeMaterial("basic");
        }
        else{
          if(phongFlag){ //if basicFlag is innactive and phongFlag is active, then every material will be phong
            changeMaterial("phong");
          }
          else{ //else every material will be lambert
            changeMaterial("lambert");
          }
        }
      }
    }
    if(keyMap[69]){ //E
      if(reflectiveDelay == 0){
        reflectiveDelay = 15;
        phongFlag = !phongFlag;
        if(phongFlag && !basicFlag){ // same logic as the previous key input
          changeMaterial("phong");
        }
        else if(!phongFlag && !basicFlag){
          changeMaterial("lambert");
        }
      }
    }
    if(keyMap[81]){ //Q
      if(lightSwitchDelay == 0){
        lightSwitchDelay = 10;
        dLightOn = !dLightOn;
        // if(dLightOn) directLight.intensity = 1;
        // else directLight.intensity = 0;
        directLight.visible = !directLight.visible;
      }
    }

    if(lightSwitchDelay > 0) lightSwitchDelay--;
    if(reflectiveDelay > 0) reflectiveDelay--;
    if(basicDelay > 0) basicDelay--;
    if(light1Delay > 0) light1Delay--;
    if(light2Delay > 0) light2Delay--;
    if(light3Delay > 0) light3Delay--;
    render();
    requestAnimationFrame(animate);
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
    window.addEventListener("resize", onResize);
  }
