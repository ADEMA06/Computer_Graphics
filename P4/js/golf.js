function createField(){
  'use strict';
  var fieldMap = new THREE.TextureLoader().load('../images_textures/golfGrass.png');
  var bumpMap = new THREE.TextureLoader().load('../images_textures/grassBump.png');
  fieldMap.wrapS = THREE.RepeatWrapping;
  fieldMap.wrapT = THREE.RepeatWrapping;
  fieldMap.repeat.set(8, 16);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(8, 16);
  var geometry = new THREE.BoxGeometry(150, 300, 5, 5, 5, 5);
  var basicMaterial = new THREE.MeshBasicMaterial({map: fieldMap});
  var phongMaterial = new THREE.MeshPhongMaterial({shininess: 15, map: fieldMap, bumpMap: bumpMap});
  var floor = new THREE.Mesh(geometry, phongMaterial);
  floor.rotateX(Math.PI / 2);
  floor.userData = {phongMaterial: phongMaterial, basicMaterial: basicMaterial};
  return floor;
}

function createFlag(){

  'use strict';

  var geometry = new THREE.CylinderGeometry(7.5, 7.5, 0.5, 3);
  var basicMaterial = new THREE.MeshBasicMaterial({color: red});
  var phongMaterial = new THREE.MeshPhongMaterial({shininess:50, color:red});
  var flag = new THREE.Mesh(geometry, phongMaterial);

  flag.userData = {basicMaterial: basicMaterial, phongMaterial: phongMaterial};

  flag.rotateZ(Math.PI/2);
  flag.position.set(0, 13.5, 3.75);

  geometry = new THREE.CylinderGeometry(1, 1, 40, 50);
  var basicMaterial = new THREE.MeshBasicMaterial({color: brown});
  var phongMaterial = new THREE.MeshPhongMaterial({shininess:50, color:brown});
  var stick = new THREE.Mesh(geometry, phongMaterial);

  stick.userData = {basicMaterial: basicMaterial, phongMaterial: phongMaterial};

  stick.add(flag);

  stick.position.set(-25 ,22.5, 0);

  return stick;

}

function createBall(){

  'use strict';

  var bumpMap = new THREE.TextureLoader().load('../images_textures/golfBall.jpg');
  var geometry = new THREE.SphereGeometry(5, 50, 50);
  var basicMaterial = new THREE.MeshBasicMaterial({color:white});
  var phongMaterial = new THREE.MeshPhongMaterial({shininess: 300, color:white, bumpMap: bumpMap});
  
  var ball = new THREE.Mesh(geometry, phongMaterial);

  ball.position.set(0, 7.5, 0);
  ball.userData = { jumping: false, step: 0, basicMaterial: basicMaterial, phongMaterial: phongMaterial};

  return ball;
}
