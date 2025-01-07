import * as THREE from './three.js-dev/build/three.module.js';
import { GLTFLoader} from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { FontLoader} from './three.js-dev/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './three.js-dev/examples/jsm/geometries/TextGeometry.js';
import { createWall, move } from './utils.js';

let scene, camera, renderer, cameraArrow, Minimap, ghostArrow;
let clock;
let mixers = [];
let shakeAmount = 0.05;
let shakeTimer = 0; 
let shaked = false;
let PositionCopy;
let SpaceUp = true;
let chasing, ghost;


export function init_3(last_room) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();
  clock = new THREE.Clock()
  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
//   camera.position.set(0, 600, 0); // 初始相机位置
//   camera.rotation.x += -Math.PI / 2;
  if (last_room === 2){
    camera.position.set(-550, 0, 300); // 初始相机位置
    camera.rotation.y = - Math.PI / 2;
  }
  if (last_room === 4){
    camera.position.set(150, 0, -400); // 初始相机位置
    camera.rotation.y = Math.PI;
  }

  // Create the renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  cameraArrow = document.getElementById('cameraArrow');
  ghostArrow = document.getElementById('ghostArrow');
  Minimap = document.getElementById('minimapDiv');

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight1.position.set(0, 500, 0);
  scene.add(directionalLight1);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight2.position.set(-1, 1, 1);
  scene.add(directionalLight2);

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
    metalness: 0.0, // 设置金属度
    roughness: 0.5, // 设置粗糙度
  });

  const groundGeometry = new THREE.PlaneGeometry(1200, 900);
  const ground1 = new THREE.Mesh(groundGeometry, groundMaterial);
  ground1.rotation.x = -Math.PI / 2; 
  ground1.position.y = -200;
  scene.add(ground1);
  const ground2 = new THREE.Mesh(groundGeometry, roofMaterial);
  ground2.rotation.x = Math.PI / 2; 
  ground2.position.y = 500;
  scene.add(ground2);

  
  const carpetGeometry = new THREE.PlaneGeometry(400, 300);
  const carpet = new THREE.Mesh(carpetGeometry, carpetMaterial);
  carpet.rotation.x = -Math.PI / 2; 
  carpet.position.set(150 ,-199, -280);
  scene.add(carpet);

  const paperTexture = textureLoader.load('global/paper.png');
  const paperMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: paperTexture, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const FontTexture = textureLoader.load('global/font.jpg');
  const FontMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      map: FontTexture, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
  });
  const paperGeometry = new THREE.PlaneGeometry(300, 200);
  const paper = new THREE.Mesh(paperGeometry, paperMaterial);
  paper.position.set(-450, 100, -149);
  scene.add(paper);

  const loader = new FontLoader();
  loader.load( './global/lvyao_Regular.json', function ( font ) {
    const geometry = new TextGeometry( ' 乐谱被 蓝色\n的眼睛注视着', {
      font: font,
      size: 28,
      depth: 0,
      curveSegments: 12,
    } );
    const textMesh = new THREE.Mesh(geometry, FontMaterial);
    textMesh.position.set(-580, 120, -148);
    scene.add(textMesh);
  } );

  const paintingTexture1 = textureLoader.load('room3/red.png');
  const paintingMaterial1 = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      map: paintingTexture1, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const paintingGeometry1 = new THREE.PlaneGeometry(100, 150);
  const painting1 = new THREE.Mesh(paintingGeometry1, paintingMaterial1);
  painting1.position.set(-200, 50, -445);
  scene.add(painting1);

  const paintingTexture2 = textureLoader.load('room3/silver.png');
  const paintingMaterial2 = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      map: paintingTexture2, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const paintingGeometry2 = new THREE.PlaneGeometry(100, 150);
  const painting2 = new THREE.Mesh(paintingGeometry2, paintingMaterial2);
  painting2.position.set(-30, 50, -445);
  scene.add(painting2);

  const paintingTexture3 = textureLoader.load('room3/black.png');
  const paintingMaterial3 = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      map: paintingTexture3, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const paintingGeometry3 = new THREE.PlaneGeometry(100, 150);
  const painting3 = new THREE.Mesh(paintingGeometry3, paintingMaterial3);
  painting3.position.set(310, 50, -445);
  scene.add(painting3);

  const paintingTexture4 = textureLoader.load('room3/gold.png');
  const paintingMaterial4 = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      map: paintingTexture4, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const paintingGeometry4 = new THREE.PlaneGeometry(100, 150);
  const painting4 = new THREE.Mesh(paintingGeometry4, paintingMaterial4);
  painting4.position.set(480, 50, -445);
  scene.add(painting4);

  scene.add(createWall(new THREE.Vector2(-600, 450), new THREE.Vector2(-600, -150), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-600, -150), new THREE.Vector2(-300, -150), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-300, -150), new THREE.Vector2(-300, -450), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-300, -450), new THREE.Vector2(600, -450), WallMaterial));
  scene.add(createWall(new THREE.Vector2(600, -450), new THREE.Vector2(600, 450), WallMaterial));
  scene.add(createWall(new THREE.Vector2(600, 450), new THREE.Vector2(-600, 450), WallMaterial));

  load_items();
  
  PositionCopy = 0;
  Minimap.style.width =  "240px";
  Minimap.style.height = '200px';
  Minimap.style.backgroundImage =  "url('minimap/room3.png')";
  chasing = 0;
}

function load_items(){
    const loader = new GLTFLoader();
    loader.load(
      'room3/ghost_in_a_white_sheet.glb',
      function ( gltf ) {
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        gltf.scene.scale.set(160, 160, 160);
        gltf.scene.position.set(-150, 0, -400);
        ghost = gltf.scene;
      },
    );
    loader.load(
      'room3/halloween_pumpkin.glb',
      function ( gltf ) {
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        gltf.scene.scale.set(50, 50, 50);
        gltf.scene.position.set(-100, -150, -100);
        // gltf.scene.rotation.set(0, Math.PI, 0);
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
        gltf.scene.scale.set(160, 100, 100);
        gltf.scene.position.set(150, -200, 350);
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
        gltf.scene.scale.set(160, 100, 100);
        gltf.scene.position.set(150, -200, 50);
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
        gltf.scene.scale.set(20, 12, 15);
        gltf.scene.position.set(150, -200, 200);
        gltf.scene.rotation.set(0, Math.PI, 0);
        scene.add(gltf.scene); 
      },
    );
    loader.load(
      'room3/flowers_with_the_vase.glb',
      function ( gltf ) {
        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });
        gltf.scene.scale.set(200, 200, 200);
        gltf.scene.position.set(-500, -200, 125);
        gltf.scene.rotation.set(0, - Math.PI / 6, 0);
        scene.add(gltf.scene); 
      },
    );
    for (let i = 0; i < 5; i++){
        if ( i != 2){
            loader.load(
            'room3/old_portrait_of_witch.glb',
            function ( gltf ) {
                gltf.scene.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
                });
                gltf.scene.scale.set(300, 300, 300);
                gltf.scene.position.set(-200 + i * 170, 50, -450);
                // gltf.scene.rotation.set(0, Math.PI / 2, 0);
                scene.add(gltf.scene); 
            },
            );
            const pointLight = new THREE.PointLight(0xffffff, 600);
            pointLight.position.set(-200 + i * 170, 50, -400);
            scene.add(pointLight);
        }
    }
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
            object.position.z = -360;
            object.position.x = 200;
            object.position.y = 85;
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
            object.scale.set(5, 5, 5);
            object.position.z = 230;
            object.position.x = -510;
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


let audio;

export function stopMusic() {
  const audioElement = document.getElementById('queen2');
  if (audioElement) {
    audioElement.pause();
  }
}

export function animate_3(current_room, keyPressed, face_item, message, is_4_locked) {
  let die = false;
  if(chasing === 0 && message === "chasing"){
    stopMusic();
    audio = new Audio('audio/loop_65.ogg');
    audio.loop = true; 
    audio.play();
    chasing = 1;
    scene.add(ghost);
    ghostArrow.style.display = 'block';
  }
  if (chasing === 1){
    const to_ghost = new THREE.Vector2(ghost.position.x - camera.position.x, ghost.position.z - camera.position.z);
    const dist = to_ghost.length();
    ghost.position.x += (camera.position.x - ghost.position.x) / dist;
    ghost.position.z += (camera.position.z - ghost.position.z) / dist;
    ghost.rotation.y = - to_ghost.angle() - Math.PI / 2;
    if (to_ghost.length() <= 100){
      die = true;
      message = "";
      chasing = 0;
      scene.remove(ghost);
      stopMusic();
      audio.pause();
      audio = new Audio('audio/queen.ogg');
      audio.loop = true; 
      audio.play();
    }
    const position = ghost.position;
    const direction = to_ghost.angle() - Math.PI / 2;
    
    const arrowX = position.x / 5 + 130;
    const arrowY = position.z / 4.5 + 110;
    ghostArrow.style.left = arrowX + 'px';
    ghostArrow.style.top = arrowY + 'px';
    const rotation = `rotate(${direction}rad)`;
    ghostArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
  }
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
        if (face_door_1() && chasing != 1){
          current_room = 2;
        }
        if (face_door_2() && chasing != 1 && is_4_locked != true){
          current_room = 4;
        }
        if (face_door_2() && chasing != 1 && is_4_locked){
          face_item['door'] = true;
        }
        if (face_wall()){
          face_item['paper'] = true;
        }
        if (face_pumpkin()){
          face_item['pumpkin'] = true;
        }
        if (face_painting()  && chasing != 0){
          chasing = -1;
          audio.pause();
          stopMusic()
          audio = new Audio('audio/queen.ogg')
          audio.loop = true; 
          audio.play();
          ghost.position.y = -500;
          ghostArrow.style.display = 'none';
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
  renderer.render(scene, camera);
  return [current_room, face_item, die];
}

function face_door_1(){
    if (camera.position.x >= -500 || Math.abs(camera.position.z - 300) >= 100){
        return false;
    }
    if (camera.rotation.y >= 3 * Math.PI / 4 || camera.rotation.y <= Math.PI / 4){
        return false;
    }
    return true;
  }


function face_door_2(){
    if (camera.position.z >= -350 || Math.abs(camera.position.x - 150) >= 50){
        return false;
    }
    if (camera.rotation.y >= Math.PI / 4 || camera.rotation.y <= - Math.PI / 4){
        return false;
    }
    return true;
}

function face_painting(){
  if (camera.position.z >= -350 || Math.abs(camera.position.x + 30) >= 50){
      return false;
  }
  if (camera.rotation.y >= Math.PI / 4 || camera.rotation.y <= - Math.PI / 4){
      return false;
  }
  return true;
}

function face_wall(){
  if (camera.position.z <= 350 || Math.abs(camera.position.x + 30) >= 100){
      return false;
  }
  if (camera.rotation.y <= 3 * Math.PI / 4 && camera.rotation.y >= - 3 * Math.PI / 4){
      return false;
  }
  return true;
}

function face_pumpkin(){
  if (camera.position.z >= 200 || camera.position.z <= 100 || Math.abs(camera.position.x + 100) >= 100){
      return false;
  }
  if (camera.rotation.y >= Math.PI / 4 || camera.rotation.y <= - Math.PI / 4){
      return false;
  }
  return true;
}

function cannot_go(x, z){
    if (Math.abs(x) > 550 || Math.abs(z) > 400){
      return true;
    }
    if(x < -300 && z < -100){
      return true;
    }
    if(x < -450 && z > 50 && z < 250){
        return true;
    }
    if(x < 400 && x > -100 && z > 50 && z < 300){
        return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 5 + 130; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 4.5 + 110; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}
