import * as THREE from './three.js-dev/build/three.module.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader} from './three.js-dev/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader} from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { createWall, move } from './utils.js';

let scene, camera, renderer, cameraArrow, Minimap;
let shakeAmount = 0.05;
let shakeTimer = 0; 
let shaked = false;
let PositionCopy;
let SpaceUp = true;

export function init_4_deep(last_room) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
//   camera.position.set(0, 600, 0); // 初始相机位置
  // camera.rotation.y += -Math.PI;
  camera.position.set(0, 0, 350); // 初始相机位置

  // Create the renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight1.position.set(0, 1000, 0);
  scene.add(directionalLight1);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-1, 1, 1);
  scene.add(directionalLight2);
  cameraArrow = document.getElementById('cameraArrow');
  Minimap = document.getElementById('minimapDiv');

  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('global/ground.jpg'); // 替换为你的纹理图片路径

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: groundTexture, // 应用纹理
    metalness: 0.5, // 设置金属度
    roughness: 1.0, // 设置粗糙度
  });

  const carpetTexture = textureLoader.load('global/carpet.jpg'); // 替换为你的纹理图片路径

  const carpetMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: carpetTexture, // 应用纹理
    metalness: 0.5, // 设置金属度
    roughness: 1.0, // 设置粗糙度
  });

  const WallTexture = textureLoader.load('global/wall.jpg');

  const WallMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: WallTexture, // 应用纹理
    metalness: 0.0, // 设置金属度
    roughness: 0.5, // 设置粗糙度
  });

  const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
  const ground1 = new THREE.Mesh(groundGeometry, groundMaterial);
  ground1.rotation.x = -Math.PI / 2; 
  ground1.position.y = -200;
  scene.add(ground1);

  const carpetGeometry = new THREE.PlaneGeometry(500, 500);
  const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet.rotation.x = -Math.PI / 2; 
//   carpet.rotation.z = Math.PI / 2;
  carpet.position.y = -199;
  scene.add(carpet);

  scene.add(createWall(new THREE.Vector2(-500, 500), new THREE.Vector2(-500, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-500, -500), new THREE.Vector2(500, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(500, -500), new THREE.Vector2(500, 500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(500, 500), new THREE.Vector2(-500, 500), WallMaterial));

  load_items();

  PositionCopy = 0;
  Minimap.style.height = '200px'
  Minimap.style.width = '200px'
  Minimap.style.backgroundImage =  "url('minimap/room4.png')";
}

function load_items(){
  const loader = new GLTFLoader();
  loader.load(
    'room4/clock.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(30, 30, 30);
      gltf.scene.position.set(0, -40, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room4/man.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(30, 30, 30);
    //   gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(-360, -230, -400);
      scene.add(gltf.scene); 
    },
  );  
  loader.load(
    'room4/woman.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(70, 70, 70);
    //   gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(360, 0, -400);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room4/potted_plant.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(600, 600, 600);
    //   gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(360, -200, 400);
      scene.add(gltf.scene); 
    },
  );
  
  loader.load(
    'room4/mirror.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(200, 200, 200);
      gltf.scene.rotation.set(0, 3 * Math.PI / 4, 0);
      gltf.scene.position.set(-360, -200, 400);
      scene.add(gltf.scene); 
    },
  );
  const mtlLoader = new MTLLoader();
  mtlLoader.load(
    'global/door1/models/8.mtl',
    function (materialCreator) {
    materialCreator.preload(); 
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materialCreator);
    objLoader.load(
        'global/door1/models/8.obj',
        function (object) {
        object.scale.set(6, 6, 6);
        object.position.z = 595;
        object.position.x = 70;
        object.position.y = 145;
        object.traverse(function (child) {
            if (child.isMesh) {
            child.castShadow = true; 
            child.receiveShadow = true; 
            }
        });
        scene.add(object);
        },
    );
    },
  );
}

export function animate_4_deep(current_room, last_room, keyPressed, face_item, message) {
  if (shakeTimer > 0) {
    shakeTimer--;
    camera.rotation.x += (Math.random() - 0.5) * shakeAmount;
    camera.rotation.y += (Math.random() - 0.5) * shakeAmount;
    camera.rotation.z += (Math.random() - 0.5) * shakeAmount;
    if (shakeTimer == 0){
      camera.rotation.x = 0;
      camera.rotation.y = PositionCopy;
      camera.rotation.z = 0;
    }
  }
  else if (shakeTimer == 0){
    const x_copy = camera.position.x;
    const z_copy = camera.position.z;
    camera = move(camera, keyPressed);
    if (keyPressed['Space']){
      if (SpaceUp === true) {
        if (face_door()){
          current_room = 3;
        }
        if(face_clock()){
            face_item['clock'] = true;
        }
        if (face_man()){
            face_item['man'] = true;
        }
        if (face_woman()){
            face_item['woman'] = true;
        }
        if (face_mirror()){
            face_item['mirror'] = true;
        }
        if (face_plant()){
            face_item['plant'] = true;
        }
      }
    }
    if (cannot_go(camera.position.x, camera.position.z)){
        camera.position.x = x_copy;
        camera.position.z = z_copy;
        if (shaked == false){
          PositionCopy = camera.rotation.y;
          shakeTimer = 10;
          shaked = true;
        }
    }
    else{
      shaked = false;
    }
    if ('Space' in keyPressed && keyPressed['Space'] === true){
      SpaceUp = false;
    }
    else{
      SpaceUp = true;
    }
  } 
  updateCameraArrow();
  renderer.render(scene, camera);
  return [current_room, face_item];
}

function face_man(){
  if (camera.position.z >= -300 || camera.position.x >= -300 ){
      return false;
  }
  return true;
}
function face_woman(){
  if (camera.position.z >= -300 || camera.position.x <= 300 ){
      return false;
  }
  return true;
}
function face_mirror(){
  if (camera.position.z <= 300 || camera.position.x >= -300 ){
      return false;
  }
  return true;
}
function face_plant(){
  if (camera.position.z <= 300 || camera.position.x <= 300 ){
      return false;
  }
  return true;
}

function face_clock(){
  if (camera.position.z <= 100 || camera.position.z >= 200 || Math.abs(camera.position.x) >= 50 ){
      return false;
  }
  if (camera.rotation.y >= Math.PI / 4 || camera.rotation.y <= -Math.PI / 4){
      return false;
  }
  return true;
}

function face_door(){
  if (camera.position.z <= 250 || Math.abs(camera.position.x) >= 100 ){
      return false;
  }
  if (camera.rotation.y <= 3 * Math.PI / 4 && camera.rotation.y >= -3 * Math.PI / 4){
      return false;
  }
  return true;
}

function cannot_go(x, z){
    if (Math.abs(x) > 350 || Math.abs(z) > 350){
        return true;
    }
    if (Math.abs(x) < 100 && Math.abs(z) < 100){
        return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 5 + 110; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 5 + 110; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}