import * as THREE from "three";
import BoxGeometry from "./boxgeometry/BoxGeometry";

// import "./style.css"

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene: THREE.Scene = new THREE.Scene();
const canvas = document.querySelector(".webgl") as HTMLBodyElement;
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2.5;

const box = new BoxGeometry().renderCube();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

const topLight = new THREE.PointLight(0xffffff, 0.5);
topLight.position.set(10, 15, 0);
topLight.castShadow = true;
topLight.shadow.mapSize.width = 2048;
topLight.shadow.mapSize.height = 2048;
topLight.shadow.camera.near = 5;
topLight.shadow.camera.far = 400;

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  },
  false
);

scene.add(box, ambientLight, topLight);

function animate() {
  requestAnimationFrame(animate);

  box.rotation.x += 0.02;
  box.rotation.y += 0.008;

  render();
}

function render() {
  renderer.render(scene, camera);
  renderer.shadowMap.enabled = true;
}

animate();
