import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as TWEEN from '@tweenjs/tween.js'
import * as dat from 'dat.gui'
import { sRGBEncoding, Vector3 } from 'three'

export default class OfficeScene {
    constructor(canvas) {

        let scrollAmount;

        //override this two methods on monitor scroll event
        this.onHideHomePage = null;
        this.onUnhideHomePage = null;

        // Debug
        const gui = new dat.GUI()

        // Canvas
        // const canvas = document.querySelector('canvas.office')

        // Scene
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf5f5f5);


        /**
         * Sizes
         */
        const sizes = {
            width: canvas.getBoundingClientRect().width,
            height: canvas.getBoundingClientRect().height
        }

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        window.addEventListener('resize', () => {
            // Update size
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight

            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()

            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        })

        window.addEventListener('dblclick', () => {
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
            if (!fullscreenElement) {
                if (canvas.requestFullscreen())
                    canvas.requestFullscreen()
                else if (canvas.webkitRequestFullscreen)
                    canvas.webkitRequestFullscreen()
            }
            else {
                if (canvas.exitFullScreen)
                    canvas.exitFullScreen()
                else if (canvas.webkitExitFullScreen)
                    canvas.webkitExitFullScreen()
            }
        })

        window.addEventListener('pointermove', onPointerMove);

        window.addEventListener('click', selectObject)

        let isHomePageVisible = true;

        function updateTexture(imgURL){
            new THREE.TextureLoader().load(
                imgURL, 
                (texture)=>{
                    scene.getObjectByName('Plane').material.map = texture;
                    scene.getObjectByName('Plane').material.needsUpdate = true;
                }
            )
        }
        
        window.addEventListener('scroll', () => {
            let lastScrollPos = window.scrollY;
            scrollAmount = 700; // scroll amount needs to determined based responsiveness

            if (lastScrollPos > scrollAmount && isHomePageVisible) {
                isHomePageVisible = false;
                //TODO: hide homepage; replace with screenshot: editorSS.png
                this.onHideHomePage();
            }
            if (lastScrollPos < scrollAmount && !isHomePageVisible) {
                isHomePageVisible = true;
                //TODO: unhide homepage; remove screenshot : editorSS.png
                this.onUnhideHomePage();
            }
        })

        /**
         * Camera
         */
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.copy(new THREE.Vector3(-0.025, 4.1, 1))
        scene.add(camera)

        let position = new Vector3(0, 4, 0)
        // gui.add(position, 'x').min(-100).max(100).step(1).name('LookAt X')
        // gui.add(position, 'y').min(-100).max(100).step(1).name('LookAt Y')
        // gui.add(position, 'z').min(-100).max(100).step(1).name('LookAt Z')

        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.enableDamping = true
        controls.minZoom = 1
        controls.minDistance = 1
        controls.maxDistance = 7.5
        controls.minPolarAngle = Math.PI / 16
        controls.maxPolarAngle = Math.PI / 2
        controls.minAzimuthAngle = -Math.PI / 3
        controls.maxAzimuthAngle = Math.PI / 3

        // Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
        scene.add(ambientLight);

        const gltfLoader = new GLTFLoader()
        gltfLoader.load(
            'assets/office/FullScene/fullscene.gltf',
            (object) => {
                console.log(object);
                while (object.scene.children.length) {
                    object.scene.children[0].position.setZ(object.scene.children[0].position.z + 1.5)
                    object.scene.children[0].position.setX(object.scene.children[0].position.x - 0.2)
                    scene.add(object.scene.children[0])
                }
            }
        )


        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.physicallyCorrectLights = true
        renderer.outputEncoding = sRGBEncoding

        function selectObject() {

            raycaster.setFromCamera(pointer, camera);

            // calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {

                if (intersects[0].object.parent.name === "kitap_kitap_1_Cube001" || intersects[0].object.parent.name === "kitap_kitap_1_Cube003") {
                    console.log('Lets read');
                    window.location.href = "./textureUtils"
                }
                if (intersects[0].object.getObjectByName('Plane')) {
                    console.log('Plane');
                    window.location.href = "./editor"
                }
                if (intersects[0].object.parent.name === "Photoframe") {
                    console.log("Yay Photoframe!!");
                    window.location.href = ""
                }
                if (intersects[0].object.parent.name === "Headphone") {
                    console.log("Relax with Music!!");
                    window.location.href = ""
                }
            }
        }

        function hover(object) {
            const tween = new TWEEN.Tween({ x: object.position.x, y: object.position.y, z: object.position.z })
                .to({ x: object.position.x, y: object.position.y + 0.05, z: object.position.z }, 500)
                .onUpdate(function (obj) {
                    object.position.set(obj.x, obj.y, obj.z)
                })

            const tween0 = new TWEEN.Tween({ y: object.position.y + 0.2 })
                .to({ y: object.position.y }, 1500)
                .onUpdate(function (obj) {
                    object.position.setY(obj.y)
                })
            // tween.yoyo = true
            tween.chain(tween0)
            tween0.chain(tween)
            tween.start()
            tween0.start()
        }


        function onPointerMove(event) {

            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

        }


        let zoom = controls.target.distanceTo( controls.object.position );
        let isScreenChanged = false;

        // Animation
        const animationLoop = () => {

            // control updates(necessary for damping)
            // controls.update()

            // TWEEN.update()

            
            camera.lookAt(position)
            controls.target = position
            
            renderer.render(scene, camera)
            
            // Change monitor screen based on zoom
            zoom = controls.target.distanceTo( controls.object.position )
            if(zoom >= 1.06 && !isScreenChanged){
                isScreenChanged = true
                updateTexture('/assets/office/FullScene/editorSS.png')
            } 
            if(zoom < 1.06 && isScreenChanged) {
                isScreenChanged = false
                updateTexture('/assets/office/FullScene/ash-edmonds-0aWZdK8nK2I-unsplash.jpg')
            }
            window.requestAnimationFrame(animationLoop)
        }
        // Also get more control over it using GSAP

        animationLoop()
    }
} 