import * as THREE from 'three';

let turnSpeed = 0.02;
let moveSpeed;

export function createWall(startPoint, endPoint, WallMaterial){
    const dist = new THREE.Vector2().add(endPoint).sub(startPoint);
    const length = dist.length();
    const WallGeometry = new THREE.PlaneGeometry(length, 1000);
    const Wall = new THREE.Mesh(WallGeometry, WallMaterial);
    const position = new THREE.Vector2().add(startPoint).add(endPoint).divideScalar(2);
    const radius = - dist.angle(); 
    Wall.position.x = position.x;
    Wall.position.y = 300;
    Wall.position.z = position.y;
    Wall.rotation.y = radius; 
    return Wall
}

export function move(camera, keyPressed){
    while (camera.rotation.y > Math.PI) {
        camera.rotation.y -= 2 * Math.PI;
    }
    while (camera.rotation.y < -Math.PI) {
        camera.rotation.y += 2 * Math.PI;
    }
    if (keyPressed['ShiftLeft']) {
        moveSpeed = 2.4;
    }else{
        moveSpeed = 1.2;
    }
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0);
    camera.getWorldDirection(forward);
    forward.normalize();
    right.crossVectors(forward, up).normalize();
    
    // Update camera position based on moveDirection
    if (keyPressed['KeyW']) {
        camera.position.add(forward.multiplyScalar(moveSpeed));
    }
    if (keyPressed['KeyS']) {
        camera.position.sub(forward.multiplyScalar(moveSpeed));
    }
    if (keyPressed['KeyA']) {
        camera.position.sub(right.multiplyScalar(moveSpeed));
    }
    if (keyPressed['KeyD']) {
        camera.position.add(right.multiplyScalar(moveSpeed));
    }
    
    // Update menObject rotation based on rotation
    if (keyPressed['ArrowLeft']) {
        camera.rotation.y += turnSpeed;
    }
    if (keyPressed['ArrowRight']) {
        camera.rotation.y -= turnSpeed;
    }
    return camera;
}