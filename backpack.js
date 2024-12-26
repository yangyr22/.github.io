import * as THREE from 'three';
import { GLTFLoader } from './three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader} from './three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader} from './three.js-dev/examples/jsm/loaders/MTLLoader.js';

let scene, camera, renderer, menObject;
let raycaster, mouse;
let turnSpeed = 0.01;
let rotationTarget = 0;
let rotationDirection = 1; 

window.onload = function() {
  var audio = document.getElementById('option-game-audio');

  var oldAudio = document.getElementById('background-audio');
  if (oldAudio) {
      oldAudio.pause();
      oldAudio.currentTime = 0;
  }

  audio.play();
};

init();
animate();

function init() {
  // Create the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x808080);

  // Create the camera
  camera = new THREE.PerspectiveCamera(75, 0.25 * window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 305); // 初始相机位置

  // Create the renderer and add it to the DOM
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(0.25 * window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Add lights to the scene
  const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
  directionalLight.position.set(-1, 1, 1);
  scene.add(directionalLight);

  
  // document.addEventListener('mousemove', onMouseMove, false);

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
          menObject.position.set(0, 0, 0);
          menObject.rotation.set(0, 1, 0);
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
  const objLoader = new OBJLoader();
  objLoader.load(
    'witch/77807.obj',
    function (object) {
      menObject = new THREE.Object3D(); 
      menObject.position.set(0, 70, 0);
      menObject.rotation.x = -Math.PI / 2;
      menObject.rotation.z = -Math.PI / 3;
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
}


function animate() {
  requestAnimationFrame(animate);

  // menObject.rotation.y += turnSpeed; 
  // if (mouseOverObject()) {
  //   menObject.rotation.y += turnSpeed * rotationDirection;
  //   if (menObject.rotation.y >= 1.5 || menObject.rotation.y <= 0) {
  //     rotationDirection *= -1; // Change direction when reaching limits
  //   }
  // }
  
  renderer.render(scene, camera);
}

// function onMouseMove(event) {
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// }

// function mouseOverObject() {
//   // Update the picking ray with the camera and mouse position
//   raycaster.setFromCamera(mouse, camera);

//   // Calculate objects intersecting the picking ray
//   const intersects = raycaster.intersectObjects(scene.children);

//   // Return true if one of the intersected objects is menObject
//   return intersects.some(function (intersect) {
//     return intersect.object === menObject;
//   });
// }