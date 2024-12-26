import * as THREE from 'three';
import { GLTFLoader} from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader} from './three.js-dev/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { createWall, move } from './utils.js';

let scene, camera, renderer, cameraArrow, Minimap;
let clock;
let mixers = [];
let cat, cat_mixer, dist, cat_animation;
let shakeAmount = 0.05;
let shakeTimer = 0; 
let shaked = false;
let PositionCopy;
let SpaceUp = true;


export function init_2(last_room, room_lit) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
//   camera.position.set(0, 600, 0); // 初始相机位置
  // camera.rotation.y += -Math.PI;
  if (last_room === 0){
    camera.position.set(0, 0, 700); // 初始相机位置
  }
  else if (last_room === 1){
    camera.position.set(0, 0, -700); // 初始相机位置
    camera.rotation.y = Math.PI;
  }
  else if (last_room === 3){
    camera.position.set(450, 0, 500); // 初始相机位置
    camera.rotation.y = Math.PI / 2;
  }
  else if (last_room === 5){
    camera.position.set(-450, 0, 500); // 初始相机位置
    camera.rotation.y = - Math.PI / 2;
  }

  // Create the renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  cameraArrow = document.getElementById('cameraArrow');
  Minimap = document.getElementById('minimapDiv');

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.08);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1); // 白色光，强度为1.0
  directionalLight.position.set(0, 200, 10); // 设置光源位置
  scene.add(directionalLight);

  const textureLoader = new THREE.TextureLoader();
  const groundTexture = textureLoader.load('global/ground.jpg'); // 替换为你的纹理图片路径

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: groundTexture, // 应用纹理
    metalness: 0.5, // 设置金属度
    roughness: 1.0, // 设置粗糙度
  });

  
  const roofTexture = textureLoader.load('global/roof.png'); // 替换为你的纹理图片路径

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: roofTexture, // 应用纹理
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
    metalness: 0.2, // 设置金属度
    roughness: 0.5, // 设置粗糙度
  });

  const groundGeometry = new THREE.PlaneGeometry(1050, 1500);
  const ground1 = new THREE.Mesh(groundGeometry, groundMaterial);
  ground1.rotation.x = -Math.PI / 2; 
  ground1.position.y = -200;
  scene.add(ground1);
  const ground2 = new THREE.Mesh(groundGeometry, roofMaterial);
  ground2.rotation.x = Math.PI / 2; 
  ground2.position.y = 800;
  scene.add(ground2);

  const carpetGeometry = new THREE.PlaneGeometry(150, 250);
  const carpet1 = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet1.rotation.x = -Math.PI / 2; 
//   carpet.rotation.z = Math.PI / 2;
  carpet1.position.set(-450 ,-199, 475);
  scene.add(carpet1);

  const carpet2 = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet2.rotation.x = -Math.PI / 2; 
//   carpet.rotation.z = Math.PI / 2;
  carpet2.position.set(450 ,-199, 475);
  scene.add(carpet2);

  scene.add(createWall(new THREE.Vector2(-525, 600), new THREE.Vector2(-525, 250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(525, 250), new THREE.Vector2(525, 600), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-225, -750), new THREE.Vector2(225, -750), WallMaterial));
  scene.add(createWall(new THREE.Vector2(225, 750), new THREE.Vector2(-225, 750), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-225, 100), new THREE.Vector2(-225, -750), WallMaterial));
  scene.add(createWall(new THREE.Vector2(225, -750), new THREE.Vector2(225, 100), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-525, 250), new THREE.Vector2(-375, 250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-375, 600), new THREE.Vector2(-525, 600), WallMaterial));
  scene.add(createWall(new THREE.Vector2(525, 600), new THREE.Vector2(375, 600), WallMaterial));
  scene.add(createWall(new THREE.Vector2(375, 250), new THREE.Vector2(525, 250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-375, 250), new THREE.Vector2(-225, 100), WallMaterial));
  scene.add(createWall(new THREE.Vector2(225, 100), new THREE.Vector2(375, 250), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-225, 750), new THREE.Vector2(-375, 600), WallMaterial));
  scene.add(createWall(new THREE.Vector2(375, 600), new THREE.Vector2(225, 750), WallMaterial));

  load_items(room_lit);
  
  PositionCopy = 0;
  Minimap.style.width = '150px';
  Minimap.style.height = '300px';
  if (room_lit[3] === false){
    Minimap.style.backgroundImage =  "url('minimap/room2_0.png')";
  }
  else if (room_lit[2] === false){
    Minimap.style.backgroundImage =  "url('minimap/room2_1.png')";
  }
  else if (room_lit[0] === false){
    Minimap.style.backgroundImage =  "url('minimap/room2_2.png')";
  }
  else if (room_lit[1] === false){
    Minimap.style.backgroundImage =  "url('minimap/room2_3.png')";
  }
  else{
    Minimap.style.backgroundImage =  "url('minimap/room2_4.png')";
  }
}

function load_items(room_lit){
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( 'three.js-dev/examples/jsm/libs/draco/' );
  loader.setDRACOLoader( dracoLoader );
  for (const key in room_lit){
    if (room_lit[key] === true){
      loader.load(
        'room2/copper_candlestick.glb',
        function ( gltf ) {
          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          gltf.scene.scale.set(500, 500, 500);
          gltf.scene.position.set(360 * (key % 2) - 180, 0, -300 + 200 * Math.floor(key / 2));
          gltf.scene.rotation.set(0, (key - 1 / 6) * Math.PI, 0);
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixer.clipAction(gltf.animations[0]).play();
          mixers.push(mixer);
          scene.add(gltf.scene); 
        },
      );
      const pointLight = new THREE.PointLight(0xffffff, 300);
      pointLight.position.set(360 * (key % 2) - 180, 120, -300 + 200 * Math.floor(key / 2));
      scene.add(pointLight);
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.02);
      scene.add(ambientLight);
    }
    else{
      loader.load(
        'room2/scene.glb',
        function ( gltf ) {
          gltf.scene.traverse(function (node) {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
          gltf.scene.scale.set(500, 500, 500);
          gltf.scene.position.set(360 * (key % 2) - 180, 0, -300 + 200 * Math.floor(key / 2));
          gltf.scene.rotation.set(0, (key - 1 / 6) * Math.PI, 0);
          scene.add(gltf.scene); 
        },
      );
    }
  }
  //cat
  loader.load(
    'room2/black_cat.glb',
    function ( gltf ) {
      cat = gltf.scene;
      cat.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      cat.scale.set(30, 30, 30);
      cat.position.set(100, -200, 450);
      cat.rotation.set(0, 0, 0);
      cat_mixer = new THREE.AnimationMixer(cat);
      cat_animation = gltf.animations[0]
      cat_mixer.clipAction(gltf.animations[0]).play();
      scene.add(cat); 
    },
  );
  const mtlLoader = new MTLLoader();
  mtlLoader.load(
    'room2/Toy_Soldier/11584_Toy Soldier_V2_l3.mtl',
    function (materialCreator) {
      materialCreator.preload(); 
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materialCreator);
      objLoader.load(
        'room2/Toy_Soldier/11584_Toy Soldier_V2_l3.obj',
        function (object) {
          object.scale.set(24, 24, 24);
          object.rotation.x = -Math.PI / 2;
          object.position.set(100, -200, -650);
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
          object.position.z = -630;
          object.position.x = 80;
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
          object.position.z = 850;
          object.position.x = 80;
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
          // object.rotation.x = -Math.PI;
          // object.rotation.z = -Math.PI;
          object.rotation.y = -Math.PI / 2;
          object.position.z = 550;
          object.position.x = 405;
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
          // object.rotation.x = -Math.PI;
          // object.rotation.z = -Math.PI;
          object.rotation.y = -Math.PI / 2;
          object.position.z = 550;
          object.position.x = -615;
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

export function animate_2(current_room, last_room, keyPressed, face_item, message) {
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
    dist = new THREE.Vector2(camera.position.x - 100, camera.position.z - 450)
    cat.rotation.y = dist.angle() * (-1) + Math.PI / 2;
    if (keyPressed['Space']){
      if (SpaceUp === true) {
        if (face_door_1()){
          current_room = 1;
        }
        if (face_door_2()){
          current_room = 3;
        }
        if (face_door_3()){
          current_room = 5;
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
  //动画
  const time = clock.getDelta();
  for (const key in mixers){
    mixers[key].update(time);
  }
  if (dist.length() <= 300){
    cat_mixer.update(time);
  }
  else{
    cat_mixer.stopAllAction(); 
    cat_mixer.clipAction(cat_animation).play();
  }
  renderer.render(scene, camera);
  return [current_room, face_item];
}

function face_door_1(){
  if (camera.position.z >= -600){
      return false;
  }
  if (camera.rotation.y >= Math.PI / 4 || camera.rotation.y <= - Math.PI / 4){
      return false;
  }
  return true;
}

function face_door_2(){
  if (camera.position.x <= 450 && camera.position.z <= 350){
      return false;
  }
  if (camera.rotation.y <= - 3 * Math.PI / 4 || camera.rotation.y >= - Math.PI / 4){
      return false;
  }
  return true;
}

function face_door_3(){
  if (camera.position.x >= -450 && camera.position.z <= 350){
      return false;
  }
  if (camera.rotation.y >= 3 * Math.PI / 4 || camera.rotation.y <= Math.PI / 4){
      return false;
  }
  return true;
}

function cannot_go(x, z){
    if (Math.abs(x) > 200 || Math.abs(z) > 700){
      if(z >= 280 && z <= 570 && Math.abs(x) <= 475){
        return false;
      }
      return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 6 + 85; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 5 + 160; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}