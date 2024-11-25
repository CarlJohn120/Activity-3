import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3);
scene.add(ambientLight);

const cameraLight = new THREE.PointLight('#ffffff', 1);
cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(cameraLight);

// Raycaster
const raycaster = new THREE.Raycaster();

// Mouse
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Adds smooth motion to camera controls

// Model
let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  './models/Duck/glTF-Binary/Duck.glb',
  (gltf) => {
    model = gltf.scene;
    model.position.y = -1.2;
    scene.add(model);
  }
);

// Clock for animation
const clock = new THREE.Clock();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update raycaster
  raycaster.setFromCamera(mouse, camera);

  // Test intersection with model
  if (model) {
    const modelIntersects = raycaster.intersectObject(model);
    if (modelIntersects.length) {
      model.scale.set(1.2, 1.2, 1.2); // Enlarge when hovered
    } else {
      model.scale.set(1, 1, 1); // Reset size when not hovered
    }
  }

  // Update light position to follow the camera
  cameraLight.position.set(camera.position.x, camera.position.y, camera.position.z);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

// Start animation loop
tick();
