import * as THREE from 'three';
import { GLTFLoader } from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';

let scene, camera, renderer, menObject;
let moveSpeed = 1.5;
let turnSpeed = 0.01;
let keyPressed = {}; 

init();
animate();

function init() {
  // Create the scene
  scene = new THREE.Scene();

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 305); // 初始相机位置

  // Create the renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.position.set(-1, 1, 1);
  scene.add(directionalLight);

  // // Load the GLTF model
  // const loader = new GLTFLoader();
  // loader.load(
  //   'three.js-dev/examples/models/gltf/Horse.glb',
  //   function (gltf) {
  //     horseObject = new THREE.Object3D(); // 创建容器对象
  //     gltf.scene.traverse(function (node) {
  //       if (node.isMesh) {
  //         node.castShadow = true;
  //         node.receiveShadow = true;
  //       }
  //     });
  //     horseObject.add(gltf.scene); // 将模型添加到容器对象
  //     scene.add(menObject); // 将容器对象添加到场景
  //   },
  //   undefined,
  //   function (error) {
  //     console.error(error);
  //   }
  // );

  const mtlLoader = new MTLLoader();
  const materials = mtlLoader.load(
    'witch/77807.mtl',
    function (materialCreator) {
      materialCreator.preload(); 
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materialCreator);
      objLoader.load(
        'witch/77807.obj',
        function (object) {
          menObject = new THREE.Object3D(); 
          object.traverse(function (child) {
            if (child.isMesh) {
              child.castShadow = true; 
              child.receiveShadow = true; 
            }
          });
          menObject.add(object);
          scene.add(menObject);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
          console.error('An error happened', error);
        }
      );
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
      console.error('An error happened', error);
    }
  );

  // Add keyboard listeners
  document.addEventListener('keydown', function(event) {
    keyPressed[event.code] = true; 
  });
  document.addEventListener('keyup', function(event) {
    keyPressed[event.code] = false; 
  });
}

function animate() {
  requestAnimationFrame(animate);

  // Update menObject position based on moveDirection
  if (keyPressed['KeyW']) {
    menObject.position.z += moveSpeed;
  }
  if (keyPressed['KeyS']) {
    menObject.position.z -= moveSpeed;
  }
  if (keyPressed['KeyA']) {
    menObject.position.x -= moveSpeed;
  }
  if (keyPressed['KeyD']) {
    menObject.position.x += moveSpeed;
  }

  // Update menObject rotation based on rotation
  if (keyPressed['ArrowLeft']) {
    menObject.rotation.y -= turnSpeed;
  }
  if (keyPressed['ArrowRight']) {
    menObject.rotation.y += turnSpeed;
  }
  if (keyPressed['ArrowUp']) {
    menObject.rotation.x += turnSpeed;
  }
  if (keyPressed['ArrowDown']) {
    menObject.rotation.x -= turnSpeed;
  }

  renderer.render(scene, camera);
}