var geometry, mesh, material;

var axesHelper = new THREE.AxesHelper(70);

const grey = 0x424949;
const lightGrey = 0x7B7D7D;
const black = 0x000;


function addFace(vector1, vector2, Vector3, color){
    var face = new THREE.Face3(vector1, vector2, Vector3);
    face.color.set(color);
    geometry.faces.push(face);
}

function createPopo(){

    'use strict';

    geometry = new THREE.Geometry();

    /**===== Popo Back =====*/
    geometry.vertices.push(new THREE.Vector3(10.7, 30, -8.5), new THREE.Vector3(-10.7, 30, -8.5), new THREE.Vector3(14.7, 21.3, 43.5), new THREE.Vector3(-14.7, 21.3, 43.5), new THREE.Vector3(14.2, 12.3, 41.5), new THREE.Vector3(-14.2, 12.3, 41.5));

    addFace(0, 1, 2, grey);
    addFace(1, 2, 3, grey);

    /**===== Popo Front =====*/
    geometry.vertices.push(new THREE.Vector3(14.7, 19, -44.2), new THREE.Vector3(-14.7, 19, -44.2), new THREE.Vector3(9, 17, -49.5), new THREE.Vector3(-9, 17, -49.5));

    addFace(0, 1, 6, black);
    addFace(1, 6, 7, black);

    addFace(6, 7, 8, grey);
    addFace(7, 8, 9, grey);

    /**===== Popo Sides =====*/
    geometry.vertices.push(new THREE.Vector3(14.7, 12, -49.3), new THREE.Vector3(-14.7, 12, -49.3));

    addFace(0, 2, 6, grey);
    addFace(1, 3, 7, grey);

    addFace(7, 3, 5, grey);
    addFace(2, 4, 6, grey);

    addFace(11, 7, 5, grey);
    addFace(10, 6, 4, grey);

    /**===== Popo Front Lights =====*/
    addFace(11, 9, 7, white);
    addFace(10, 8, 6, white);

    addFace(9, 8, 11,grey); //popo front 
    addFace(8, 11, 10,grey);//popo front

    geometry.vertices.push(new THREE.Vector3(14.7, 19.3, 43.1), new THREE.Vector3(-14.7, 19.3, 43.1));

    /**===== Popo Back Lights and Some More Popo Back =====*/
    addFace(2, 3, 12, red);
    addFace(3, 12, 13, red);

    addFace(12, 13, 4, grey);
    addFace(4, 5, 13, grey);

    /**===== Popo Windows =====*/
    geometry.vertices.push(new THREE.Vector3(14.2,21.3,-8.5), new THREE.Vector3(14.2, 21, -30), new THREE.Vector3(11.6, 28, -8.5));
    geometry.vertices.push(new THREE.Vector3(-14.2,21.3,-8.5), new THREE.Vector3(-14.2, 21, -30), new THREE.Vector3(-11.6, 28, -8.5));

    addFace(16 , 14, 15, black);
    addFace(17 , 18, 19, black);


    geometry.computeFaceNormals();
    material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, vertexColors: THREE.FaceColors});
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateY(-2.8);

    return mesh;

}


function createWheel(x, y, z){

    var wheel = new THREE.CylinderGeometry(7.7, 7.7, 1, 32);
    var material = new THREE.MeshBasicMaterial({color: lightGrey});
    var mesh = new THREE.Mesh (wheel, material);

    mesh.position.set(x, y, z);
    mesh.rotateZ(Math.PI/2);

    return mesh;
}

function createTop(){

    var top = new THREE.CylinderGeometry(1, 1, 30, 32);
    var material = new THREE.MeshBasicMaterial({color: lightGrey});
    var mesh = new THREE.Mesh (top, material);

    mesh.rotateZ(Math.PI/2);
    mesh.position.set(0, 8.2, 30);

    return mesh;

}

function createBottom(){

    var bottom = new THREE.CylinderGeometry(1, 1, 30, 32);
    var material = new THREE.MeshBasicMaterial({color: lightGrey});
    var mesh = new THREE.Mesh (bottom, material);

    mesh.rotateZ(Math.PI/2);
    mesh.position.set(0, 8.2, -30);

    return mesh;

}

function createMiddle(){

    var middle = new THREE.CylinderGeometry(1, 1, 60, 32);
    var material = new THREE.MeshBasicMaterial({color: lightGrey});
    var mesh = new THREE.Mesh (middle, material);

    mesh.rotateX(Math.PI/2);
    mesh.position.set(0, 8.2, 0);

    return mesh;

}

function createChassis(){

    var chassis = new THREE.Object3D();

    var wheel1 = createWheel(15, 8.2, 30);
    var wheel2 = createWheel(15, 8.2, -30);
    var wheel3 = createWheel(-15, 8.2, 30);
    var wheel4 = createWheel(-15, 8.2, -30);

    chassis.add(wheel1);
    chassis.add(wheel2);
    chassis.add(wheel3);
    chassis.add(wheel4);

    var top = createTop();
    var bottom = createBottom();
    var middle = createMiddle();
    chassis.add(top);
    chassis.add(bottom);
    chassis.add(middle);

    return chassis;

}


function createPlate(){

    var plate = new THREE.CylinderGeometry(60,60,1,32);
    var material = new THREE.MeshBasicMaterial( {color: 0x800000} );
    var mesh = new THREE.Mesh( plate, material);

    var chassis = createChassis();
    mesh.add(chassis);

    var car = createPopo();
    mesh.add(car);

    return mesh;
}
