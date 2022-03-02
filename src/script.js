import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Debug
 */

const gui = new dat.GUI()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const boxHeight = 1
const geometry = new THREE.BoxGeometry(1, boxHeight, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

gui.add(mesh.position, 'y', -3, 3, 0.01)



/**
 * Object 2
 */

 var material1 = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide } );
 var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
 var material3 = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.DoubleSide } );
 var material4 = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
 var material5 = new THREE.MeshBasicMaterial( { color: 0x00ffff, side: THREE.DoubleSide } );

 var materialTransparent =  new THREE.MeshBasicMaterial( { transparent: true, opacity: 0, wireframe: true, side: THREE.DoubleSide} );
 var geometry2 = new THREE.BoxBufferGeometry( 1, 1, 1 );

 var materials2 = [ materialTransparent, material1, material2, material3, material4, material5 ]

 var mesh2 = new THREE.Mesh( geometry2, materials2 );
 scene.add( mesh2 );

gui.add(mesh2.position, 'y', -3, 3, 0.01)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const cam1 = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)

const cameraFov = 50;
const cam2 = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height, 0.1, 100)

const cameras = {
    cam1: cam1,
    cam2: cam2,
    currentCamera: cam1,
    changeCamera: function(){
        if (this.currentCamera === cam1){
            console.log('cam1')
            this.currentCamera = cam2;
        } else {
            console.log('cam2')
            this.currentCamera = cam1
        }
    }
}

gui.add(cameras, 'changeCamera')

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
 * Camera
 */
// Base camera


cameras.cam1.position.z = 3
cameras.cam2.position.x = boxHeight / 2 / Math.tan(Math.PI * cameraFov / 360);

// cameras.cam2.position.z = 0
cameras.cam2.lookAt( 0, 0, 0 );


scene.add(cameras.cam1)
scene.add(cameras.cam2)
const helper1 = new THREE.CameraHelper( cameras.cam1 );
scene.add( helper1 );
const helper2 = new THREE.CameraHelper( cameras.cam2 );
scene.add( helper2 );

// Controls
const controls1 = new OrbitControls(cameras.cam1, canvas)
const controls2 = new OrbitControls(cameras.cam2, canvas)
controls1.enableDamping = true

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