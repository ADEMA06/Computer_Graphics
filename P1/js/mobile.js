var renderer, scene, currentCamera, camera1, camera2, camera3, geometry, mesh, clock;
var lowerTree, middleTree, topTree, keyMap = [];

//=========Materials==========//
var material_sq, material_circle;
var material_beam, material_pent;
var material_list = [];

//=====Primitives======//
const square_h = 4;
const square_l = 1;
const circle_r = 2;
const cylinder_r = 0.1;

//=====Colors======//
const green = 0x14B80C;
const pink = 0xC97394;
const red = 0xC70039;
const orange = 0xF3920F;


//=======Object Creation========//

function addSquare(obj, x, y, z, material){
  'use strict';

  geometry = new THREE.BoxGeometry(square_l, square_h, square_h);
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x,y,z);

  obj.add(mesh);
}

function addCircle(obj, x, y, z, material){
  'use strict';

  geometry = new THREE.CylinderGeometry(circle_r, circle_r, 1, 32);
  mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.z = Math.PI / 2;
  mesh.position.set(x,y,z);

  obj.add(mesh);
}

function addPentagon(obj, x, y, z, material){
  'use strict';

  geometry = new THREE.CylinderGeometry(circle_r, circle_r, 1, 5);
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x,y,z);
  mesh.rotation.z = Math.PI / 2;
  mesh.rotation.x = Math.PI / 3.5;

  obj.add(mesh);
}

function addHorizontalBeam(obj, x, y, z, length, material){
  'use strict';
  geometry = new THREE.CylinderGeometry(cylinder_r, cylinder_r, length, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(x, y, z);

  obj.add(mesh);
}

function addVerticalBeam(obj, x, y, z, length, material){
  'use strict';
  geometry = new THREE.CylinderGeometry(cylinder_r, cylinder_r, length, 32);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);

  obj.add(mesh);

}

function createLowerTree(x,y,z){
  'use strict';
  //lowerTreeScale
  const lTScale = 1;

  //Beam lenghts
  const hBeamLength = 40;
  const vBeamLength = 5;

  //Object coordinates
  const verticalBeamY = -vBeamLength/2 - cylinder_r;
  var verticalBeamZ = -20;
  const squareY = -vBeamLength - square_h/2 - cylinder_r;

  lowerTree = new THREE.Object3D();

  material_sq = new THREE.MeshBasicMaterial({color: red});
  material_list.push(material_sq);

  addHorizontalBeam(lowerTree, 0, 0, 0, hBeamLength + cylinder_r * 2, material_beam);

  for(var i = 0; i < 5; i++){
    addVerticalBeam(lowerTree, 0, verticalBeamY, verticalBeamZ, vBeamLength, material_beam);
    addSquare(lowerTree, 0, squareY, verticalBeamZ, material_sq);
    verticalBeamZ = verticalBeamZ + hBeamLength / 4;
  }

  lowerTree.position.x = x;
  lowerTree.position.y = y;
  lowerTree.position.z = z;

  lowerTree.scale.set(lTScale, lTScale, lTScale);
  lowerTree.updateMatrix();

  scene.add(lowerTree);
}

function createMiddleTree(x, y, z){
  'use strict';
   //middleTreeScale
  const mDScale = 1;

  //Beam lenghts
  const hUpBeamLength = 15;
  const hDownBeamLength = 10;
  const vLeftBeamLength = 25;
  const vMiddleBeamLength = 10;
  const vRightBeamLength = 5;

  middleTree = new THREE.Object3D();

  middleTree.position.x = x;
  middleTree.position.y = y;
  middleTree.position.z = z;

  material_circle = new THREE.MeshBasicMaterial({color: orange});
  material_list.push(material_circle);


  addHorizontalBeam(middleTree, 0, 0, 0, hUpBeamLength, material_beam);
  addHorizontalBeam(middleTree, 0, -10, -7, hDownBeamLength, material_beam);

  addVerticalBeam(middleTree, 0, -12.5, 7.4, vLeftBeamLength, material_beam);
  addVerticalBeam(middleTree, 0, -5, -7.4, vMiddleBeamLength, material_beam);
  addVerticalBeam(middleTree, 0, -12.5, -11.9, vRightBeamLength, material_beam);

  addCircle(middleTree, 0, -15.5, -11.9, material_circle);
  addCircle(middleTree, 0, -10, -0.25, material_circle);

  middleTree.add(lowerTree);

  lowerTree.translateY(-y);
  lowerTree.translateZ(-z);

  middleTree.scale.set(mDScale, mDScale, mDScale);
  middleTree.updateMatrix();

  scene.add(middleTree);

}

function createTopTree(x, y, z){
  'use strict';
  //topTreeScale
  const tTScale = 1;

  topTree = new THREE.Object3D();

  material_pent = new THREE.MeshBasicMaterial({color: pink});
  material_list.push(material_pent);

  topTree.position.x = x;
  topTree.position.y = y;
  topTree.position.z = z;

  addVerticalBeam(topTree, 0, 0, 0, 25, material_beam);
  addVerticalBeam(topTree, 0, 27.5 - y, -7.3 - z, 4.9, material_beam);
  addVerticalBeam(topTree, 0, 27.5 - y, 16.5 - z, 4.9, material_beam);
  addVerticalBeam(topTree, 0, 22.8 - y, 12 - z, 4.9, material_beam);
  addVerticalBeam(topTree, 0, 22.8 - y, 22 - z, 4.9, material_beam);
  addHorizontalBeam(topTree, 0, 30 - y, 4.5 - z, 24, material_beam);
  addHorizontalBeam(topTree, 0, 25 - y, 17 - z, 10, material_beam);
  addHorizontalBeam(topTree, 0, 50 - y, 9.5 - z, 7, material_beam);
  addHorizontalBeam(topTree, 0, 40 - y, 2.5 - z, 7, material_beam);

  addPentagon(topTree, 0, 19 - y, 22 - z, material_pent);
  addPentagon(topTree, 0, 19 - y, 12 - z, material_pent);
  addCircle(topTree,0, 40 - y, - 3 - z, material_circle);
  addPentagon(topTree, 0, 50 - y, 14.5 - z, material_pent);

  topTree.add(middleTree);

  middleTree.translateY(-y);
  middleTree.translateZ(-z);

  topTree.scale.set(tTScale, tTScale, tTScale);
  topTree.updateMatrix();

  scene.add(topTree);
}

function createCamera(){
  'use strict';

  camera1 = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15,
                                      window.innerHeight / 15, window.innerHeight / -15,
                                      1, 1000);
  camera2 = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15,
                                      window.innerHeight / 15, window.innerHeight / -15,
                                      1, 1000);
  camera3 = new THREE.OrthographicCamera(window.innerWidth / -15, window.innerWidth / 15,
                                      window.innerHeight / 15, window.innerHeight / -15,
                                      1, 1000);

  camera1.position.x = 100;
  camera2.position.z = 100;
  camera3.position.y = 100;

  camera3.position.x = 0.01;

  camera1.lookAt(scene.position);
  camera2.lookAt(scene.position);
  camera3.lookAt(scene.position);

  //The active camera
  currentCamera = camera1;
}

function createScene(){
  'use strict';
  scene = new THREE.Scene();

  material_beam = new THREE.MeshBasicMaterial({color: green});
  material_list.push(material_beam);

  createLowerTree(0, 0, 0);
  createMiddleTree(0, 25, -7.5);
  createTopTree(0, 42.5, 6);
}

function createClock(){
  'use strict';
  clock = new THREE.Clock();
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

function onResize(){
  'use strict';

  renderer.setSize(window.innerWidth, window.innerHeight);
  if(window.innerWidth > 0 && window.innerHeight > 0){
      currentCamera.aspect = window.innerWidth / window.innerHeight;
      currentCamera.updateProjectionMatrix();
  }
}

function animate(){
  'use strict';

  var elapsedTime = clock.getDelta();

  if(keyMap[90]){ //z
    lowerTree.rotateY(0.07 * elapsedTime * 20);
  }
  if(keyMap[67]){ //c
    lowerTree.rotateY(-0.07 * elapsedTime * 20);
  }
  if(keyMap[65]){ //a
    middleTree.rotateY(0.07 * elapsedTime * 20);
  }
  if(keyMap[68]){ //d
    middleTree.rotateY(-0.07 * elapsedTime * 20);
  }
  if(keyMap[81]){ //q
    topTree.rotateY(0.07 * elapsedTime * 20);
  }
  if(keyMap[87]){ //w
    topTree.rotateY(-0.07 * elapsedTime * 20);
  }
  if(keyMap[37]){ //arrow left
    topTree.position.z += (20 * elapsedTime);
  }
  if(keyMap[38]){ //arrow up
    topTree.position.x -= (20 * elapsedTime);
  }
  if(keyMap[39]){ //arrouw right
    topTree.position.z -= (20 * elapsedTime);
  }
  if(keyMap[40]){ //arrow down
    topTree.position.x += (20 * elapsedTime);
  }
  if(keyMap[49]){ //1
    currentCamera = camera1
    currentCamera.updateProjectionMatrix();
  }
  if(keyMap[50]){ //2
    currentCamera = camera2
    currentCamera.updateProjectionMatrix();
  }
  if(keyMap[51]){ //3
    currentCamera = camera3
    currentCamera.updateProjectionMatrix();
  }
  if(keyMap[52]){ //4
    for(var i = 0; i < material_list.length; i++){
      material_list[i].wireframe = !material_list[i].wireframe;
    }
    keyMap[52] = false;
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
  window.addEventListener("resize", onResize);
}
