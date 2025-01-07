import * as THREE from './three.js-dev/build/three.module.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader} from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader} from './three.js-dev/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from './three.js-dev/examples/jsm/geometries/TextGeometry.js';
import { createWall, move } from './utils.js';

let scene, camera, renderer, cameraArrow, Minimap;
let shakeAmount = 0.05;
let shakeTimer = 0; 
let shaked = false;
let PositionCopy;
let clock;
let mixer1, mixer2;
let open = false;
let play, playTimer;
let SpaceUp = true;
let time = 0;
let hat, image;

export function init_5(last_room) {
  // Create the scene ************************************************************************************************************************************************
  scene = new THREE.Scene();
  clock = new THREE.Clock();

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 10000);
  // camera.position.set(0, 600, 0); // 初始相机位置
  // camera.rotation.x += -Math.PI / 2;
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

  scene.add(createWall(new THREE.Vector2(-850, 500), new THREE.Vector2(-850, 100), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-850, 100), new THREE.Vector2(-750, 100), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-750, 100), new THREE.Vector2(-750, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(-750, -500), new THREE.Vector2(550, -500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(550, -500), new THREE.Vector2(550, 0), WallMaterial));
  scene.add(createWall(new THREE.Vector2(550, 0), new THREE.Vector2(850, 0), WallMaterial));
  scene.add(createWall(new THREE.Vector2(850, 0), new THREE.Vector2(850, 500), WallMaterial));
  scene.add(createWall(new THREE.Vector2(850, 500), new THREE.Vector2(-850, 500), WallMaterial));

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
  const paperGeometry = new THREE.PlaneGeometry(350, 200);
  const paper = new THREE.Mesh(paperGeometry, paperMaterial);
  paper.position.set(25, 100, -499);
  scene.add(paper);

  const loader = new FontLoader();
  loader.load( './global/lvyao_Regular.json', function ( font ) {
    const geometry = new TextGeometry( '如果是12的话\n  八音盒即可', {
      font: font,
      size: 30,
      depth: 0,
      curveSegments: 12,
    } );
    const textMesh = new THREE.Mesh(geometry, FontMaterial);
    textMesh.position.set(-110, 120, -498);
    scene.add(textMesh);
  } );

  const ImageTexture = textureLoader.load('room5/image.png');
  const ImageMaterial = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      map: ImageTexture, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
  });
  const ImageGeometry = new THREE.PlaneGeometry(70, 70);
  image = new THREE.Mesh(ImageGeometry, ImageMaterial);
  image.position.set(720, -30, 60);
  scene.add(image);

  load_items();

  PositionCopy = 0;
  play = false;
  playTimer = 0;
  Minimap.style.width = '300px';
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
      gltf.scene.position.set(1010, -200, 60);
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
      gltf.scene.position.set(-100, -100, -250);
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
      gltf.scene.position.set(160, -70, -100);
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
      gltf.scene.position.set(240, -70, -100);
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
      gltf.scene.position.set(-440, -70, -100);
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
      gltf.scene.position.set(-360, -70, -100);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/window.glb',
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
      gltf.scene.position.set(-450, 200, -470);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/cortina_animada_curtain_animated.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.emissive = node.material.color; 
          node.material.emissiveMap = node.material.map; 
          node.material.emissiveIntensity = 0.2;
        }
      });
      gltf.scene.scale.set(80, 80, 260);
      gltf.scene.rotation.set(0, Math.PI / 2, 0);
      gltf.scene.position.set(-450, 0, -430);
      mixer1 = new THREE.AnimationMixer(gltf.scene);
      mixer1.clipAction(gltf.animations[0]).play();
      mixer2 = new THREE.AnimationMixer(gltf.scene);
      mixer2.clipAction(gltf.animations[1]).play();
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/cupboard.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material.emissive = node.material.color; 
          node.material.emissiveMap = node.material.map; 
        }
      });
      gltf.scene.scale.set(60, 60, 60);
      gltf.scene.position.set(790, -200, -740);
      gltf.scene.rotation.set(0, - Math.PI / 12 * 7, 0);
      scene.add(gltf.scene); 
    },
  );
  
  const textureLoader = new THREE.TextureLoader();
  const backTexture = textureLoader.load('room5/back.png');
  const backMaterial = new THREE.MeshStandardMaterial({
      color: 0xdd8888,
      map: backTexture, // 应用纹理
      metalness: 0.2, // 设置金属度
      roughness: 0.5, // 设置粗糙度
      transparent: true 
  });
  const backGeometry = new THREE.PlaneGeometry(280, 470);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.set(375, 35, -499);
  scene.add(back);
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
      gltf.scene.position.set(550, -200, 80);
      scene.add(gltf.scene); 
    },
  );
  loader.load(
    'room5/low_poly_cowboy_hat.glb',
    function ( gltf ) {
      gltf.scene.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      hat = gltf.scene;
      hat.rotation.set(0, 0, - Math.PI / 4);
      hat.scale.set(2.5, 2.5, 2.5);
      hat.position.set(280, -200, 80);
      scene.add(hat); 
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
      gltf.scene.position.set(200, -200, -100);
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
      gltf.scene.position.set(-100, -200, -250);
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
      gltf.scene.position.set(300, -200, -100);
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
      gltf.scene.position.set(100, -200, -100);
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
      gltf.scene.position.set(-400, -200, -100);
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
      gltf.scene.position.set(-300, -200, -100);
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
      gltf.scene.position.set(-500, -200, -100);
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
      gltf.scene.position.set(200, -200, 325);
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
      gltf.scene.position.set(200, -200, 125);
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
      gltf.scene.position.set(200, -200, 225);
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
      gltf.scene.position.set(-400, -200, 325);
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
      gltf.scene.position.set(-400, -200, 125);
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
      gltf.scene.position.set(-400, -200, 225);
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
  time += 1;
  if (time > 3000){
    hat.rotation.set(0, 0, 0);
    hat.position.set(610, -465, 80);
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
    if (camera.position.x >= 640){
      image.position.set(camera.position.x, -13, 59);
      const scale = 1 - (camera.position.z - 250) / 400;
      image.scale.set(scale, scale, scale);
    }
    else{
      image.position.set(720, 0, -60);
    }
    if (keyPressed['Space']){
      if (SpaceUp === true) {
        if (face_door_1()){
          current_room = 2;
        }
        if (face_door_2()){
          current_room = 6;
        }
        if (face_window()){
          play = true;
          open = true;
        }
        if (face_music() && items['queen']){
          face_item['musicbox'] = true;
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
  const time2 = clock.getDelta();
  console.log(playTimer);
  if (open === false){
    mixer1.update(time2);
  } else if (play === true){
    playTimer += 1;
    mixer2.update(time2);
    if (playTimer >= 800){
        play = false;
    }
  }
  
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

function face_window(){
  if (camera.position.z >= -200 || Math.abs(camera.position.x + 450) >= 100){
    return false;
  }
  if (camera.rotation.y <=  - Math.PI / 4 || camera.rotation.y >= Math.PI / 4){
      return false;
  }
  return true;
}

function face_music(){
  if (Math.abs(camera.position.z + 350) >= 50 || Math.abs(camera.position.x + 100) >= 100){
      return false;
  }
  if (camera.rotation.y <= 3 * Math.PI / 4 && camera.rotation.y >= - 3 * Math.PI / 4){
      return false;
  }
  return true;
}

function cannot_go(x, z){
    if (z > 450 || z < -400 || Math.abs(x) > 800){
        return true;
    }
    if (z < 250 && x > 500){
      return true;
    }
    if (z < 150 && x < -700){
      return true;
    }
    if (Math.abs(z-225) < 180 && Math.abs(x+400) < 180){
      return true;
    }
    if (Math.abs(z-225) < 180 && Math.abs(x-200) < 180){
      return true;
    }
    if (Math.abs(z+100) < 80 && Math.abs(x+400) < 180){
      return true;
    }
    if (Math.abs(z+100) < 80 && Math.abs(x-200) < 180){
      return true;
    }
    if (Math.abs(z+250) < 80 && Math.abs(x+100) < 80){
      return true;
    }
    return false;
}


function updateCameraArrow() {
  const position = camera.position;
  const direction = -camera.rotation.y;

  // 将方向转换为小地图上的相对位置
  const arrowX = position.x / 6 + 160; // 假设小地图宽度为400px，中心为200px
  const arrowY = position.z / 5 + 110; // 假设小地图高度为400px，中心为200px

  // 更新箭头的位置
  cameraArrow.style.left = arrowX + 'px';
  cameraArrow.style.top = arrowY + 'px';

  // 更新箭头的方向
  const rotation = `rotate(${direction}rad)`;
  cameraArrow.style.transform = `translate(-50%, -50%) ${rotation}`;
}