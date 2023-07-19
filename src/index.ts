import * as THREE from 'three'
import BoxGeometry from './BoxGeometry'


const scene: THREE.Scene = new THREE.Scene()
const canvas = document.querySelector('.webgl') as HTMLBodyElement
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight)

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    300
)
camera.position.z = 1.5

const box = new BoxGeometry().renderCube()



const ambientLight = new THREE.AmbientLight(0xffffff, .5);

const topLight = new THREE.PointLight(0xffffff, .5);
    topLight.position.set(10, 15, 0);
    topLight.castShadow = true;
    topLight.shadow.mapSize.width = 2048;
    topLight.shadow.mapSize.height = 2048;
    topLight.shadow.camera.near = 5;
    topLight.shadow.camera.far = 400;


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}



scene.add(box, ambientLight, topLight)
function animate() {
    requestAnimationFrame(animate)

    box.rotation.x += 0.002
    box.rotation.y += 0.002

    render()
}

function render() {
    renderer.render(scene, camera)
    renderer.shadowMap.enabled = true
}

animate()