const white = 0xffffff;
const red = 0xC0392B;
const blue = 0x3044CC;

var directLight = new THREE.DirectionalLight(white, 1);
var dLightTarget = new THREE.Object3D();

function createSpotlight(x, y, z, target, color){
  'use strict';
  var int = 10;
  if (color == white) int = 3;
  var spotLight = new THREE.SpotLight(color, int);
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.25;
  spotLight.decay = 1.5;
  spotLight.target = target;

  var spotLight_Obj = new THREE.Object3D();
  var material = new THREE.MeshBasicMaterial({color: lightGrey, side: THREE.DoubleSide});
  var geometry = new THREE.ConeGeometry(5, 13, 32, 1, true);
  var cone = new THREE.Mesh(geometry, material);

  material = new THREE.MeshBasicMaterial({color: color});
  geometry = new THREE.SphereGeometry(4.65, 30, 30);
  var sphere = new THREE.Mesh(geometry, material);

  sphere.translateY(-6.5);

  cone.add(sphere);
  cone.rotateX(-Math.PI/2);

  spotLight_Obj.add(spotLight);
  spotLight_Obj.add(cone);
  spotLight_Obj.position.set(x, y, z);
  spotLight_Obj.lookAt(target.position.x, target.position.y, target.position.z);

  return spotLight_Obj
}
