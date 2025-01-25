import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'stats.js';

let aspectRatio = window.innerWidth / window.innerHeight;

const stats = new Stats();
stats.showPanel(0);

const debugMode = location.hash.includes('debug');

console.log(`Debug Mode = ${debugMode}`, { hash: location.hash });

if (debugMode) {
  document.body.appendChild(stats.dom);
}

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
scene.add(pointLight);

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
const cubeTextureLoader = new THREE.CubeTextureLoader();

cubeTextureLoader.setPath('textures/cubeMap/');

// adding textures
const sunTexture = textureLoader.load('textures/2k_sun.jpg');
const mercuryTexture = textureLoader.load('textures/2k_mercury.jpg');
const venusTexture = textureLoader.load('textures/2k_venus_surface.jpg');
const earthTexture = textureLoader.load('textures/2k_earth_daymap.jpg');
const marsTexture = textureLoader.load('textures/2k_mars.jpg');
const moonTexture = textureLoader.load('textures/2k_moon.jpg');
const backgroundTexture = textureLoader.load('textures/2k_stars_milky_way.jpg');

const backgroundCubemap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
]);

// scene.background = backgroundTexture;
scene.background = backgroundCubemap;

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

const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
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

const planets = [
  {
    name: 'Mercury',
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: 'Venus',
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },
  {
    name: 'Earth',
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: 'Moon',
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: 'Mars',
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: 'Phobos',
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: 'Deimos',
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
];

const createPlanet = (planet) => {
  const planetMesh = new THREE.Mesh(sphereGeometry, planet.material);
  planetMesh.scale.setScalar(planet.radius);
  planetMesh.position.x = planet.distance;
  return planetMesh;
};

const createMoon = (moon) => {
  const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.setScalar(moon.radius);
  moonMesh.position.x = moon.distance;
  return moonMesh;
};

const planetMeshes = planets.map((planet) => {
  const planetMesh = createPlanet(planet);
  scene.add(planetMesh);

  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon);
    planetMesh.add(moonMesh);
  });
  return planetMesh;
});

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20;

const axesHelper = new THREE.AxesHelper(10);

if (debugMode) {
  scene.add(axesHelper);
}

window.addEventListener('resize', () => {
  aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// const clock = new THREE.Clock();

function renderLoop() {
  stats.begin();
  // const elapsedTime = clock.getElapsedTime();
  // // animation
  // earth.position.x = Math.sin(elapsedTime) * 10;
  // earth.position.z = Math.cos(elapsedTime) * 10;

  // moon.position.x = Math.sin(elapsedTime) * 2;
  // moon.position.z = Math.cos(elapsedTime) * 2;

  planetMeshes.forEach((planetMesh, index) => {
    planetMesh.rotation.y += planets[index].speed;

    planetMesh.position.x =
      Math.sin(planetMesh.rotation.y) * planets[index].distance;

    planetMesh.position.z =
      Math.cos(planetMesh.rotation.y) * planets[index].distance;

    planetMesh.children.forEach((moon, moonIdx) => {
      const moonData = planets[index].moons[moonIdx];
      moon.rotation.y += moonData.speed;
      moon.position.x = Math.sin(moon.rotation.y) * moonData.distance;
      moon.position.z = Math.cos(moon.rotation.y) * moonData.distance;
    });
  });

  controls.update();
  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(renderLoop);
}

renderLoop();
