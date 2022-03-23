import React, { useEffect, useRef, useState } from 'react'
import PageHeader from '../../elements/supplementary/PageHeader'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import '../../../css/index.css'
export default function VisulizerEight() {
  const canvasRef = useRef();
  const clock = new THREE.Clock();
  const renderCanvas = () => {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    const cursor = {
      x: 0,
      y: 0
    }
    const tag = window.addEventListener('mousemove', (event) => {
      cursor.x = event.clientX / sizes.width - 0.5
      cursor.y = -(event.clientY / sizes.height - 0.5)
    })
    const scene = new THREE.Scene();
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
      'color': 'lightgreen'
    }))
    scene.add(cube);

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 5
    scene.add(camera)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    })
    
    window.addEventListener('resize', () => {
      //update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight
      //update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      //update renderer
      renderer.setSize(sizes.width , sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio,2)
    })

    window.addEventListener('dblclick',() =>{
      const fullscreenElement  = document.fullscreenElement || document.webkitFullscreenElement;
      console.log("double Click!");
      if(!document.fullscreenElement){
        if(canvasRef.current.requestFullscreen)
          canvasRef.current.requestFullscreen()
        else if(canvasRef.current.webkitRequestFullscreen){
          canvasRef.current.webkitRequestFullscreen();
        }
      }
      else{
        if(document.exitFullscreen){
          document.exitFullscreen();
        }
        else if(document.webkitExitFullscreen){
          document.webkitExitFullscreen();
        }
      }
    })
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true
    // gsap.to(cube.position, { x: 2, 'duration': 1, 'delay': 1 })
    // gsap.to(cube.position, { x: 0, 'duration': 1, 'delay': 2 })
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
    //Animations
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // camera.position.x  = Math.sin(cursor.x * 2 * Math.PI) * 3
      // camera.position.y  = cursor.y * 5
      // camera.position.z  = Math.cos(cursor.x * 2 * Math.PI) * 3
      // camera.lookAt(cube.position)
      // cube.rotation.y = elapsedTime 
      // cube.rotation.x = Math.sin(elapsedTime)
      // cube.rotation.z = Math.sin(elapsedTime)
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }
    tick();
  }
  useEffect(() => {
    renderCanvas();
  }, [])
  return (
    <div>
      {/* <PageHeader /> */}
      {/* <div style={{ marginTop: '5%', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> */}
      <canvas className='webgl' ref={canvasRef} ></canvas>
      {/* </div> */}
    </div>
  )
}
