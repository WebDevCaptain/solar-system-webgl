import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

let aspectRatio = window.innerWidth / window.innerHeight;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, aspectRatio, 0.1, 400);
camera.position.set(0, 5, 100);

const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const pixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);

const textureLoader = new THREE.TextureLoader();

// adding textures
const sunTexture = textureLoader.load('/textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('/textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('/textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('/textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('/textures/2k_mars.jpg');
const moonTexture = textureLoader.load('/textures/2k_moon.jpg');

// add materials
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture,
});
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture,
});
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
});
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture,
});
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
});

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});

const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
sun.scale.setScalar(5);
scene.add(sun);

// const earthMaterial = new THREE.MeshBasicMaterial({
//   color: 0x0000ff,
// });
// const earth = new THREE.Mesh(sphereGeometry, earthMaterial);
// earth.position.set(10, 0, 0);
// scene.add(earth);

// const moonMaterial = new THREE.MeshBasicMaterial({
//   color: 'grey',
// });
// const moon = new THREE.Mesh(sphereGeometry, moonMaterial);
// moon.scale.setScalar(0.3);
// moon.position.x = 2;
// earth.add(moon);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

window.addEventListener('resize', () => {
  aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// const clock = new THREE.Clock();

function renderLoop() {
  // const elapsedTime = clock.getElapsedTime();
  // // animation
  // earth.position.x = Math.sin(elapsedTime) * 10;
  // earth.position.z = Math.cos(elapsedTime) * 10;

  // moon.position.x = Math.sin(elapsedTime) * 2;
  // moon.position.z = Math.cos(elapsedTime) * 2;

  stats.begin();
  controls.update();
  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(renderLoop);
}

renderLoop();
