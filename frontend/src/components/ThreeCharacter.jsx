import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelViewer = ({ gltfUrl, skyboxUrl,onScreenshot,takesc }) => {
  const canvasRef = useRef(null);
  const [showSkybox, setShowSkybox] = useState(false);
  const [scente, setScene] = useState(null);
  const [rendere,setRenderer] = useState(null);
  
  useEffect(() => {
    const init = async () => {
      if (window.isCanvasLoaded) {
        console.log("canvas already loaded")
        return
      }
      const scene = new THREE.Scene();
      setScene(scene)
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true,    preserveDrawingBuffer: true 
      });
      console.log("i am started")
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current.appendChild(renderer.domElement);
      window.isCanvasLoaded = true;
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync(gltfUrl);
      const model = gltf.scene;
      const animations = gltf.animations;
      scene.add(model);

      

      const mixer = new THREE.AnimationMixer(model);
      animations.forEach((animation) => {
        mixer.clipAction(animation).play();
      });

      // Adjust camera position and target
      const modelBoundingBox = new THREE.Box3().setFromObject(model);
      const modelCenter = modelBoundingBox.getCenter(new THREE.Vector3());
      const modelSize = modelBoundingBox.getSize(new THREE.Vector3());
      const modelBoundingSphereRadius = modelSize.length() / 2;
      const cameraDistance = modelBoundingSphereRadius / Math.sin(Math.PI / 4); // Adjust the camera distance as desired
      const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Add ambient light
      scene.add(ambientLight);
      camera.position.set(modelCenter.x, modelCenter.y, cameraDistance + 8);
      camera.lookAt(modelCenter);
      model.position.x = -2
      

      const animate = () => {
        requestAnimationFrame(animate);
        mixer.update(0.016);
        renderer.render(scene, camera);
      };

      animate();
      setRenderer(renderer)
     

    };

    init();
  }, [gltfUrl]);


  useEffect(() => {

    const addSkybox = async () => {
      if (skyboxUrl != "") {
        const textureLoader = new THREE.TextureLoader();
        const skyboxTexture = await textureLoader.loadAsync([skyboxUrl]);
        scente.background = skyboxTexture;
        setShowSkybox(true);
      }
 
    };

    addSkybox();
  }, [skyboxUrl])

  useEffect(() => {
    if(takesc){
        const captureScreenshot = () => {
          const canvas = rendere.domElement
          console.log(canvas)
          const dataURL = canvas.toDataURL('image/png');
          console.log("the data url is : "+ dataURL)
          // Use the dataURL as needed (e.g., save to a file, display in an <img> tag, etc.)
          onScreenshot(dataURL);
        };
        captureScreenshot()
    }
  },[takesc])
  return <div ref={canvasRef} />;
};

export default ModelViewer;
