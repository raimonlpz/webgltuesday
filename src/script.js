import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'


/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const texture1 = new THREE.TextureLoader().load( "img/img1.jpg" );
const texture2 = new THREE.TextureLoader().load( "img/img2.jpg" );
const texture3 = new THREE.TextureLoader().load( "img/img3.jpg" );
const texture4 = new THREE.TextureLoader().load( "img/img4.png" );
const texture5 = new THREE.TextureLoader().load( "img/img5.jpg" );

const textureArr = [texture1, texture2, texture3, texture4, texture5]

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer;
let modelPilar;
let modelArc;

gltfLoader.load(
    '/models/Bcn/glTF/scene.gltf',
    (gltf) => {
       // scene.add(gltf.scene.children[0])
    //    console.log(gltf.scene.children)
    //    const arrOfChildrens = [...gltf.scene.children]
    //    for (const child of arrOfChildrens) {
    //        scene.add(child)
    //    }
    //    while (gltf.scene.children.length > 0) {
    //     scene.add(gltf.scene.children[0])
    //    }
        // mixer = new THREE.AnimationMixer(gltf.scene)

        // let action = mixer.clipAction(gltf.animations[0])
        // action.play()

        // window.addEventListener('click', () => {
        //     action.stop()
        //     action = mixer.clipAction(gltf.animations[Math.round(Math.random() * 2)])
        //     action.play()
        // })
    
        modelPilar = gltf.scene;

        gltf.scene.scale.set(0.085, 0.085, 0.085)
        gltf.scene.rotation.set(0,1.5,0);
        scene.add(gltf.scene)
    }
)
// gltfLoader.load(
//     '/models/Bcn2/glTF/scene.gltf',
//     (gltf) => {
       // scene.add(gltf.scene.children[0])
    //    console.log(gltf.scene.children)
    //    const arrOfChildrens = [...gltf.scene.children]
    //    for (const child of arrOfChildrens) {
    //        scene.add(child)
    //    }
    //    while (gltf.scene.children.length > 0) {
    //     scene.add(gltf.scene.children[0])
    //    }
        // mixer = new THREE.AnimationMixer(gltf.scene)

        // let action = mixer.clipAction(gltf.animations[0])
        // action.play()

        // window.addEventListener('click', () => {
        //     action.stop()
        //     action = mixer.clipAction(gltf.animations[Math.round(Math.random() * 2)])
        //     action.play()
        // })
    
        // modelArc = gltf.scene;
        // gltf.scene.castShadow = true
        // gltf.scene.scale.set(2.5, 2.5, 2.5)
        // gltf.scene.rotation.set(0,1.5,0);
        // gltf.scene.position.set(1, 1, -5)
        // scene.add(gltf.scene)
//     }
// )

const shaderMat = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
        uTexture: { value: textureArr[0] },
        uTime: { value: 0 },
        uWavingDensity: { value: 0.001 },
        uMouse: { value: { x: 0.0, y: 0.0 }},
        uResolution: { value: {x: window.innerWidth, y: window.innerHeight}},
        // uFrequency: { value: 7.0 },
        // uWaving: { value: 1. },
        // uFrequency: { value: 7.0 },
    }
})

// mousemove
document.addEventListener('touchmove', move)
document.addEventListener('mousemove', move)
function move(evt) {
    shaderMat.uniforms.uMouse.value.x = (evt.touches) ? evt.touches[0].clientX : evt.clientX;
    shaderMat.uniforms.uMouse.value.y = (evt.touches) ? evt.touches[0].clientY : evt.clientY;
}


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5,7),
    shaderMat
)
floor.receiveShadow = true
floor.position.set(4, 1, -2)
// floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(10, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 3)
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.target.set(0, 0.75, 0)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true,
    antialias:true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

let newfloor;
let initWaveDensity = false

const listEl = document.querySelectorAll('.work--items--it')
listEl.forEach(el => {
    el.addEventListener('mouseover', () => {
        initWaveDensity = true;
        // if(el.id) {
            i = i < textureArr.length - 1  ? i+1 : 0
            scene.remove(floor)
            if(newfloor) { scene.remove(newfloor) }

            newfloor = new THREE.Mesh(
                new THREE.PlaneGeometry(5,7),
                shaderMat
            )
            newfloor.material.uniforms.uTexture.value = textureArr[i];
            newfloor.receiveShadow = true
            newfloor.position.set(4, 1, -2)
            // floor.rotation.x = - Math.PI * 0.5
            scene.add(newfloor)

        // }
    })
})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    if (mixer) mixer.update(deltaTime)

    // Update controls
    // controls.update()

    // Model update
    modelPilar?.rotation.set(0,scrollY * 0.004,scrollY * 0.00025);
    modelPilar?.position.set(0,Math.sin(elapsedTime * -1) * 0.6,0)
    modelArc?.position.set( Math.cos(elapsedTime ) * 1.15 - 1.25,  Math.sin(elapsedTime) * 1.15 + .25, -4)

    // if (floor) floor?.material.uniforms.uTime.value = elapsedTime;
    // if (newfloor) newfloor?.material.uniforms.uTime.value = elapsedTime;
    shaderMat.uniforms.uTime.value = elapsedTime

    if (initWaveDensity && shaderMat.uniforms.uWavingDensity.value <= 1.5) {
        shaderMat
            .uniforms
            .uWavingDensity
            .value  += elapsedTime * 0.001 
    } else {
        initWaveDensity = false
        if (shaderMat.uniforms.uWavingDensity.value >= 0.001) {
            shaderMat
                .uniforms
                .uWavingDensity
                .value -= elapsedTime * 0.001 
        }   
    }

    // Render
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

let scrollY = 0;
let i = 0;

window.addEventListener('scroll', (e) => {
    scrollY = window.scrollY
})





