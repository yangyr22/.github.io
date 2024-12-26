import * as THREE from './node_modules/three';
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

export function init_5(last_room) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
//   camera.position.set(0, 600, 0); // 初始相机位置
//   camera.rotation.x += -Math.PI / 2;
  if (last_room === 6){
    camera.position.set(-800, 0, 400); // 初始相机位置
    camera.rotation.y = - Math.PI / 2;
  }
  if (last_room === 2){
    camera.position.set(800, 0, 400); // 初始相机位置
    camera.rotation.y = Math.PI / 2;
  }

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

  
  const roofTexture = textureLoader.load('global/roof.png'); // 替换为你的纹理图片路径

  const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: roofTexture, // 应用纹理
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

  const groundGeometry = new THREE.PlaneGeometry(1700, 1000);
  const ground1 = new THREE.Mesh(groundGeometry, groundMaterial);
  ground1.rotation.x = -Math.PI / 2; 
  ground1.position.y = -200;
  scene.add(ground1);

  const ground2 = new THREE.Mesh(groundGeometry, roofMaterial);
  ground2.rotation.x = -Math.PI / 2; 
  ground2.position.y = 800;
  scene.add(ground2);

//   const carpetGeometry = new THREE.PlaneGeometry(600, 350);
//   const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
//   carpet.rotation.x = -Math.PI / 2; 
// //   carpet.rotation.z = Math.PI / 2;
//   carpet.position.y = -199;
//   scene.add(carpet);

  scene.add(createWall(new THREE.Vector2(-850, 500), new THREE.Vector2(-850, 200), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-850, 200), new THREE.Vector2(-750, 200), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-750, 200), new THREE.Vector2(-750, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-750, -500), new THREE.Vector2(450, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(450, -500), new THREE.Vector2(450, 0), WallMaterial));
  scene.add(createWall(new THREE.Vector2(450, 0), new THREE.Vector2(850, 0), WallMaterial));
  scene.add(createWall(new THREE.Vector2(850, 0), new THREE.Vector2(850, 500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(850, 500), new THREE.Vector2(-850, 500), WallMaterial));

  load_items();

  PositionCopy = 0;
  Minimap.style.width = '340px';
  Minimap.style.height = '200px';
  Minimap.style.backgroundImage =  "url('minimap/room5.png')";
}

function load_items(){
  const loader = new GLTFLoader();
  loader.load(
    'room5/late_1800s_austrian_vanity_desks__tables.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(250, 170, 200);
      gltf.scene.position.set(990, -200, 60);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/music_box.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(600, 600, 600);
      gltf.scene.position.set(-350, -100, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/cup_and_plate.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(3000, 3000, 3000);
      gltf.scene.rotation.set(0, - Math.PI / 2, 0);
      gltf.scene.position.set(10, -70, -130);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/cup_and_plate.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(3000, 3000, 3000);
      gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(90, -70, -130);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/window_and_curtains.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.emissive = node.material.color; 
          node.material.emissiveMap = node.material.map; 
        }
      });
      gltf.scene.scale.set(0.8, 0.8, 0.8);
      gltf.scene.position.set(-100, 200, -470);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/coat_hanger.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, Math.PI, 0);
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.set(510, -200, 80);
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
      gltf.scene.position.set(50, -200, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/victorian_chair.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, - Math.PI / 2, 0);
      gltf.scene.scale.set(100, 100, 100);
      gltf.scene.position.set(150, -200, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/victorian_chair.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.scale.set(100, 100, 100);
      gltf.scene.position.set(-50, -200, -150);
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
      gltf.scene.position.set(-350, -200, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/victorian_chair.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, - Math.PI / 2, 0);
      gltf.scene.scale.set(100, 100, 100);
      gltf.scene.position.set(-250, -200, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/victorian_chair.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.scale.set(100, 100, 100);
      gltf.scene.position.set(-450, -200, -150);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/chesterfield-sofa.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(128, 100, 80);
      gltf.scene.position.set(50, -200, 250);
      gltf.scene.rotation.set(0, Math.PI, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/chesterfield-sofa.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(128, 100, 80);
      gltf.scene.position.set(50, -200, 50);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/mahogany_table.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(16, 12, 12);
      gltf.scene.position.set(50, -200, 150);
      gltf.scene.rotation.set(0, Math.PI, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/chesterfield-sofa.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(128, 100, 80);
      gltf.scene.position.set(-350, -200, 250);
      gltf.scene.rotation.set(0, Math.PI, 0);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/chesterfield-sofa.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(128, 100, 80);
      gltf.scene.position.set(-350, -200, 50);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room3/mahogany_table.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      gltf.scene.scale.set(16, 12, 12);
      gltf.scene.position.set(-350, -200, 150);
      gltf.scene.rotation.set(0, Math.PI, 0);
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
          object.rotation.y = -Math.PI / 2;
          object.position.z = 450;
          object.position.x = 725;
          object.position.y = 145;
          object.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true; 
              child.receiveShadow = true; 
            }
          });
          scene.add(object);
        }
      );
    }
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
          object.rotation.y = -Math.PI / 2;
          object.position.z = 450;
          object.position.x = -935;
          object.position.y = 145;
          object.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true; 
              child.receiveShadow = true; 
            }
          });
          scene.add(object);
        }
      );
    }
  );
}

export function animate_5(current_room, last_room, keyPressed, face_item, message, items) {
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
        if (face_door_1()){
          current_room = 2;
        }
        if (face_door_2()){
          current_room = 6;
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

function face_door_1(){
    if (camera.position.x <= 750 || Math.abs(camera.position.z - 400) >= 100){
        return false;
    }
    if (camera.rotation.y <= - 3 * Math.PI / 4 || camera.rotation.y >= - Math.PI / 4){
        return false;
    }
    return true;
}

function face_door_2(){
    if (camera.position.x >= -750 || Math.abs(camera.position.z - 400) >= 100){
        return false;
    }
    if (camera.rotation.y >= 3 * Math.PI / 4 || camera.rotation.y <= Math.PI / 4){
        return false;
    }
    return true;
}

function cannot_go(x, z){
    if (Math.abs(z) > 450 || Math.abs(x) > 800){
        return true;
    }
    if (z < 250 && x > 400){
      return true;
    }
    if (z < 250 && x < -700){
      return true;
    }
    if (Math.abs(z-50) < 320 && Math.abs(x+350) < 180){
      return true;
    }
    if (Math.abs(z-50) < 320 && Math.abs(x-50) < 180){
      return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 5 + 180; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 5 + 110; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}