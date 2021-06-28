var geometry, mesh, material; //name a better trio, ill wait
var poles = []; //all the poles will be stored here
var keyMap = [];
var table;
//=======Table Constants======//
const tableTopWidth = 100;
const tableTopHeight = 50;
const tableTopDepth = 4;

const longWallLenght = 100;
const shortWallLenght = 50;

const wallHeight = 4;
const wallDepth = 2;

const poleLenght = 40;
const poleBaseRadius = 1;
const poleTipRadius = 0.5;

const holeRadius = 2.5;

const billiard_green = new THREE.Color(0x0E382B);
const brown = new THREE.Color(0x4D2C20);
const default_pole_color = new THREE.Color(0xBD4242);
const highlight_pole_color = new THREE.Color(0x58F336);


function addTableBase(obj, x, y, z, color){
  'use strict';

  geometry = new THREE.BoxGeometry(tableTopWidth, tableTopHeight, tableTopDepth);
  material = new THREE.MeshBasicMaterial({color: color});

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  mesh.rotateX(Math.PI / 2);

  obj.add(mesh);
}

function addLongWall(obj, x, y, z, color){
  'use strict';

  geometry = new THREE.BoxGeometry(longWallLenght, wallHeight, wallDepth);
  material = new THREE.MeshBasicMaterial({color: color});

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);

  obj.add(mesh);
}

function addShortWall(obj, x, y, z, color){
  'use strict';

  geometry = new THREE.BoxGeometry(shortWallLenght, wallHeight, wallDepth);
  material = new THREE.MeshBasicMaterial({color: color});

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  mesh.rotateY(Math.PI / 2);

  obj.add(mesh);
}

function addHoles(obj, x, y, z){
  'use strict';

  geometry = new THREE.CylinderGeometry(holeRadius, holeRadius, tableTopDepth, 64);
  material = new THREE.MeshBasicMaterial({color: 0x000000});

  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);

  obj.add(mesh);
}

function addPole(scene, x, y, z, angle_x, angle_z){
  'use strict';

  // var axesHelper = new THREE.AxesHelper(110); //uncomment me in case of emergency
  var pole = new THREE.Object3D();

  geometry = new THREE.CylinderGeometry(poleBaseRadius, poleTipRadius, poleLenght, 75, 50);
  material = new THREE.MeshBasicMaterial({color: default_pole_color});

  var pole_mesh = new THREE.Mesh(geometry, material);

  if(angle_x < 0 ){
    pole_mesh.position.set(0,0, -poleLenght/2);
  }
  else if(angle_x > 0 ){
    pole_mesh.position.set(0,0, poleLenght/2);
  }
  else if(angle_z < 0 ){
    pole_mesh.position.set(poleLenght/2 ,0,0);
  }
  else if(angle_z > 0 ){
    pole_mesh.position.set(poleLenght/-2 ,0, 0);
  }

  pole.add(pole_mesh);
  pole_mesh.rotateX(angle_x);
  pole_mesh.rotateZ(angle_z);
  pole.position.set(x, y, z);
  scene.add(pole);

  poles.push(pole);

}

function createPoles(scene){
  'use strict';

  addPole(scene, -tableTopWidth/4, tableTopDepth/2, -tableTopHeight/2, Math.PI/-2, 0);
  addPole(scene, tableTopWidth/4, tableTopDepth/2, -tableTopHeight/2, Math.PI/-2, 0);
  addPole(scene, -tableTopWidth/4, tableTopDepth/2, tableTopHeight/2, Math.PI/2, 0);
  addPole(scene, tableTopWidth/4, tableTopDepth/2, tableTopHeight/2, Math.PI/2, 0);
  addPole(scene, tableTopWidth/-2, tableTopDepth/2, 0, 0, Math.PI/2);
  addPole(scene, tableTopWidth/2, tableTopDepth/2, 0, 0, Math.PI/-2);

}


function createTable(x, y, z){
    'use strict';
    var table = new THREE.Object3D();

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;

    addTableBase(table, 0, -(tableTopDepth)/2, 0, billiard_green);
    addLongWall(table, 0, wallHeight/2, (tableTopHeight - wallDepth) / -2, brown);
    addLongWall(table, 0, wallHeight/2, (tableTopHeight - wallDepth) / 2, brown);
    addShortWall(table, (tableTopWidth - wallDepth) / 2, wallHeight/2, 0, brown);
    addShortWall(table, (tableTopWidth - wallDepth) / -2, wallHeight/2, 0, brown);
    addHoles(table, 0, -(tableTopDepth)/2, tableTopHeight/2 - wallDepth - holeRadius);
    addHoles(table, 0, -(tableTopDepth)/2, -(tableTopHeight/2 - wallDepth - holeRadius));
    addHoles(table, tableTopWidth/2 - wallDepth - holeRadius, -(tableTopDepth)/2, tableTopHeight/2 - wallDepth - holeRadius);
    addHoles(table, tableTopWidth/2 - wallDepth - holeRadius, -(tableTopDepth)/2, -(tableTopHeight/2 - wallDepth - holeRadius));
    addHoles(table, -(tableTopWidth/2 - wallDepth - holeRadius), -(tableTopDepth)/2, tableTopHeight/2 - wallDepth - holeRadius);
    addHoles(table, -(tableTopWidth/2 - wallDepth - holeRadius), -(tableTopDepth)/2, -(tableTopHeight/2 - wallDepth - holeRadius));


    return table;
  }
