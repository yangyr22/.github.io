import * as THREE from './three.js-dev/build/three.module.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { DRACOLoader} from './three.js-dev/examples/jsm/loaders/DRACOLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader} from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { createWall, move } from './utils.js';

let scene, camera, renderer, cameraArrow, clock, Minimap;
let dairyElement1, dairyElement2, dairyElement3, diary;
let shakeAmount = 0.05;
let shakeTimer = 0; 
let shaked = false;
let mixers = [];
let play, playTimer;
let PositionCopy;
let SpaceUp = true;

export function init_6(last_room) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
//   camera.position.set(0, 600, 0); // 初始相机位置
  camera.rotation.y += Math.PI / 2;
  camera.position.set(150, 0, 150); // 初始相机位置

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
  const pointLight = new THREE.PointLight(0xffffff, 500);
  pointLight.position.set(-50, -25, 175);
  scene.add(pointLight);
//   const pointLightHelper = new THREE.PointLightHelper( pointLight, 100 );
//   scene.add( pointLightHelper );
  cameraArrow = document.getElementById('cameraArrow');
  Minimap = document.getElementById('minimapDiv');
  dairyElement1 = document.getElementById('WitchDiary1');
  dairyElement2 = document.getElementById('WitchDiary3');
  dairyElement3 = document.getElementById('WitchDiary2');
  diary = 0;

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

  scene.add(createWall(new THREE.Vector2(-200, 250), new THREE.Vector2(-200, -250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-200, -250), new THREE.Vector2(200, -250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(200, -250), new THREE.Vector2(200, 250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(200, 250), new THREE.Vector2(-200, 250), WallMaterial));

  load_items();

  PositionCopy = 0;
  play = false;
  playTimer = 0;
  Minimap.style.width = '200px'
  Minimap.style.height = '200px'
  Minimap.style.backgroundImage =  "url('minimap/room6.png')";
}

function load_items(){
  //书柜
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( 'three.js-dev/examples/jsm/libs/draco/' );
  loader.setDRACOLoader( dracoLoader );
  loader.load(
    'room6/old_desk_scene.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(200, 120, 200);
      gltf.scene.position.set(0, -120, -200);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room6/bar_stool.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(120, 80, 120);
      gltf.scene.position.set(0, -200, -80);
      gltf.scene.rotation.set(0, - Math.PI / 2, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room6/medieval_open_book_1.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(50, 50, 50);
      gltf.scene.position.set(0, -68, -160);
      gltf.scene.rotation.set(- Math.PI / 2, 0, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room6/clown.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(60, 60, 60);
      gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(90, -30, 180);
      const mixer = new THREE.AnimationMixer(gltf.scene);
      mixer.clipAction(gltf.animations[0]).play();
      mixers.push(mixer);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/table.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, Math.PI, 0);
      gltf.scene.scale.set(30, 30, 30);
      gltf.scene.position.set(-100, -200, 150);
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
        object.scale.set(5, 5, 5);
        object.position.z = 80;
        object.position.x = 280;
        object.position.y = 85;
        object.rotation.y = Math.PI / 2;
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

export function animate_6(current_room, last_room, keyPressed, face_item, message, items) {
  if (diary === 1){
    dairyElement1.style.display = 'flex';
    if (keyPressed['Space'] && SpaceUp){
      diary += 1;
    }
    if ('Space' in keyPressed && keyPressed['Space'] === true){
      SpaceUp = false;
    }
    else{
      SpaceUp = true;
    }
  }
  else if (diary === 2){
    dairyElement1.style.display = 'none';
    dairyElement2.style.display = 'flex';
    if (keyPressed['Space'] && SpaceUp){
      diary += 1;
    }
    if ('Space' in keyPressed && keyPressed['Space'] === true){
      SpaceUp = false;
    }
    else{
      SpaceUp = true;
    }
  }
  else if (diary === 3){
    dairyElement2.style.display = 'none';
    dairyElement3.style.display = 'flex';
    if (keyPressed['Space'] && SpaceUp){
      diary += 1;
    }
    if ('Space' in keyPressed && keyPressed['Space'] === true){
      SpaceUp = false;
    }
    else{
      SpaceUp = true;
    }
  }
  else if (diary === 4){
    dairyElement3.style.display = 'none';
    diary = 0;
  }
  else if (shakeTimer > 0) {
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
        if (face_clown()){
            play = true;
        }
        if (face_door()){
          current_room = 5;
        }
        if (face_diary()){
          diary += 1;
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
  const time = clock.getDelta();
  if (play === true){
    playTimer += 1;
    for (const key in mixers){
        mixers[key].update(time);
    }
    if (playTimer >= 300){
        play = false;
    }
  }
  updateCameraArrow();
  renderer.render(scene, camera);
  return [current_room, face_item];
}

function face_clown(){
    if (camera.position.x <= -50 || camera.position.x >= 120 || camera.position.z <= 50){
        return false;
    }
    if (camera.rotation.y >= Math.PI / 4 * 3 || camera.rotation.y <= Math.PI / 4){
        return false;
    }
    return true;
}

function face_diary(){
  if (Math.abs(camera.position.x) >= 100 || camera.position.z >= 0){
      return false;
  }
  if (camera.rotation.y >= Math.PI / 4  || camera.rotation.y <= - Math.PI / 4){
      return false;
  }
  return true;
}

function face_door(){
  if (camera.position.x <= 100 || camera.position.z <= 50){
      return false;
  }
  if (camera.rotation.y <= - Math.PI / 4 * 3 || camera.rotation.y >= - Math.PI / 4){
      return false;
  }
  return true;
}

function cannot_go(x, z){
    if (Math.abs(x) > 150 || z > 200 || z < -50){
        return true;
    }
    if (x < 50 && z > 50){
      return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 2 + 110; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 2.5 + 110; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}