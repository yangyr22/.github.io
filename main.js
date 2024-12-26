import * as THREE from 'three';
import { GLTFLoader } from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { TextureLoader } from 'three';

let scene, camera, renderer, menObject;
let turnSpeed = 0.01;

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
  const ambientLight = new THREE.AmbientLight(0xcccccc, 1.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
  directionalLight.position.set(-1, 1, 1);
  scene.add(directionalLight);

  const textureLoader = new TextureLoader(); 
  textureLoader.load(
    'house/bg_color_2.png', 
    function(texture) {
      scene.background = texture;
    }
  );

  const mtlLoader = new MTLLoader();
  const materials = mtlLoader.load(
    'house/medieval-house-2.mtl',
    function (materialCreator) {
      materialCreator.preload(); 
      const objLoader = new OBJLoader();
      objLoader.setMaterials(materialCreator);
      objLoader.load(
        'house/medieval-house-2.obj',
        function (object) {
          menObject = new THREE.Object3D(); 
          menObject.position.set(600, -400, -1100);
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
  // window.addEventListener('wheel', onDocumentMouseWheel, { passive: false });
  // document.addEventListener('wheel', function(event) {
  //   const delta = event.deltaY;
  //   menObject.position.z -= delta; 
  //   // camera.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z); 
  // });
}


function animate() {
  requestAnimationFrame(animate);

  menObject.rotation.y += turnSpeed; 
  
  renderer.render(scene, camera);
}