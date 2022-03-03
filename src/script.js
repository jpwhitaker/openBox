import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Debug Panel
 */
const gui = new dat.GUI({width: 500})


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




/**
 * Open Box
 */
var material1 = new THREE.MeshStandardMaterial( { color: 0xff0000, side: THREE.DoubleSide, shadowSide:THREE.DoubleSide  } );
var material2 = new THREE.MeshStandardMaterial( { color: 0x00ff00, side: THREE.DoubleSide, shadowSide:THREE.DoubleSide } );
var material3 = new THREE.MeshStandardMaterial( { color: 0x0000ff, side: THREE.DoubleSide, shadowSide:THREE.DoubleSide } );
var material4 = new THREE.MeshStandardMaterial( { color: 0xffff00, side: THREE.DoubleSide, shadowSide:THREE.DoubleSide } );
var material5 = new THREE.MeshStandardMaterial( { color: 0x00ffff, side: THREE.DoubleSide, shadowSide:THREE.DoubleSide } );
var materialTransparent =  new THREE.MeshStandardMaterial( { transparent: true, opacity: 0, wireframe: true, side: THREE.DoubleSide} );

var geometry = new THREE.BoxGeometry( 5, 1, 1 );
var materials = [ materialTransparent, material1, material2, material3, material4, material5 ]

var openBox = new THREE.Mesh( geometry, materials );
openBox.receiveShadow = true;
openBox.castShadow = true
scene.add( openBox );

gui.add(openBox.position, 'y', -3, 3, 0.001)
    .name("Open Box Y-pos")


/**
 * light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.PointLight(0xffffff, 1);
directionalLight.position.x = 3
directionalLight.castShadow = true
scene.add(directionalLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



const lights = {
    directionalLight: directionalLight,
    toggleLight: function(){
        this.directionalLight.visible = !this.directionalLight.visible
    },
    intensity: directionalLight.intensity
}
// const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight );
// scene.add( directionalLightHelper );

gui.add(lights, 'toggleLight').name("Toggle light")
gui.add(directionalLight, 'intensity', 0, 3, 0.05)
gui.add(directionalLight, 'decay', 0, 100, 0.5)
gui.add(directionalLight.position, 'x', 0, 10, 0.05)



window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    cameras.cam1.aspect = sizes.width / sizes.height
    cameras.cam1.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Cameras
 */

const cameraFov = 50;
const boxHeight = 1;

const cam1 = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height, 0.1, 100)
const cam2 = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height, 0.1, 100)


//object used to change between the two cameras
const cameras = {
    cam1: cam1,
    cam2: cam2,
    currentCamera: cam1,
    changeCamera: function(){
        this.currentCamera = (this.currentCamera === cam1) ? cam2 : cam1;
    }
}
gui.add(cameras, 'changeCamera')

cam1.position.z = 3
cam2.position.x = boxHeight / 2 / Math.tan(Math.PI * cameraFov / 360);
cameras.cam2.lookAt( 0, 0, 0 );

scene.add(cameras.cam1)
scene.add(cameras.cam2)

const helper1 = new THREE.CameraHelper( cameras.cam1 );
const helper2 = new THREE.CameraHelper( cameras.cam2 );
scene.add( helper1 );
scene.add( helper2 );


// Controls
const controls1 = new OrbitControls(cameras.cam1, canvas)
const controls2 = new OrbitControls(cameras.cam2, canvas)
controls1.enableDamping = true
controls2.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    if (cameras.currentCamera === cam1){
        controls2.enabled = false;
        controls1.enabled = true;
        controls1.update()
    } else {
        controls1.enabled = false;
        controls2.enabled = true;
        controls2.update()
    }

    // Render
    renderer.render(scene, cameras.currentCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()