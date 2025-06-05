// setting up scene
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); 

renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // for smooth movement

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);


// for loading textures and cube1
const loader = new THREE.TextureLoader();
const texture = loader.load('../lib/gold_texture.jpg');
texture.colorSpace = THREE.SRGBColorSpace;


const material = new THREE.MeshBasicMaterial({ map: texture}); // color: 0x00ff00 
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// floor 
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const loader2 = new THREE.TextureLoader();
const floorTexture = loader2.load('../lib/sand_texture.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(50, 50);

const floorMaterial = new THREE.MeshBasicMaterial({
  map: floorTexture,
  side: THREE.DoubleSide
});

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);


// spheres
const spheres = [];
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

const loader3 = new THREE.TextureLoader();
const sphereTexture = loader3.load('../lib/orb_texture.jpg');
const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });

for (let i = 0; i < 20; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  const x = (Math.random() - 0.5) * 20;
  const y = Math.random() * 5 + 0.5;
  const z = (Math.random() - 0.5) * 20;
  sphere.position.set(x, y, z);
  scene.add(sphere);
  spheres.push(sphere);
}


// pyramids
const pyramids = [];
const pyramidGeometry = new THREE.ConeGeometry(0.7, 1, 4); 

const loader4 = new THREE.TextureLoader();
const pyramidTexture = loader3.load('../lib/fire_texture.jpg');
const pyramidMaterial = new THREE.MeshBasicMaterial({ map: pyramidTexture });

for (let i = 0; i < 10; i++) {
  const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
  const x = (Math.random() - 0.5) * 20;
  const y = Math.random() * 5;
  const z = (Math.random() - 0.5) * 20;
  pyramid.position.set(x, y, z);
  pyramid.rotation.y = Math.PI / 4;
  scene.add(pyramid);
  pyramids.push(pyramid);
}

// loading 3D obj (glb)
// object from:
// Sun by Paul Hoover [CC-BY] via Poly Pizza
const gltfLoader = new GLTFLoader();

import { Box3, Vector3 } from 'three';

gltfLoader.load(
  '../lib/Sun.glb',
  function (gltf) {
    const model = gltf.scene;

    
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center); 

    
    model.scale.set(0.4, -0.5, 0.6); 
    model.position.set(0, 50, -100);


    
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      }
    });

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('An error happened:', error);
  }
);





// camera set up
class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
}

function updateCamera() {
  camera.updateProjectionMatrix();
}
 


function animate() {
  for (let i = 0; i < spheres.length; i++) {
    spheres[i].rotation.y += 0.01;
  }

  for (let i = 0; i < pyramids.length; i++) {
    pyramids[i].rotation.y += 0.01;
  }

  cube.rotation.x += 0.001;
  cube.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);
}

// deleting shapes
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onClick, false);

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const clickable = [...spheres, ...pyramids, cube];
  const intersects = raycaster.intersectObjects(clickable);

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    scene.remove(clicked);

    const sphereIndex = spheres.indexOf(clicked);
    if (sphereIndex !== -1) spheres.splice(sphereIndex, 1);

    const pyramidIndex = pyramids.indexOf(clicked);
    if (pyramidIndex !== -1) pyramids.splice(pyramidIndex, 1);

    if (clicked === cube) cube.visible = false;

    if (spheres.length === 0 && pyramids.length === 0 && !cube.visible) {
      document.body.style.backgroundImage = 'none';
      document.body.style.backgroundColor = '#add8e6';
    }

  }
}


// main stuff
function main() {
  renderer.setAnimationLoop(animate);


  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);

  
}




main();