'use client';

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function Scene() {
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    // Always regenerate new star positions
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20; // random spread
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    if (particlesRef.current) {
      particlesRef.current.geometry.dispose(); // clear old geometry
      particlesRef.current.geometry = particlesGeometry;
    }
  }, []);

  return (
    <points ref={particlesRef}>
      <pointsMaterial 
        size={0.1}
        color={0xffeb3b}
      />
    </points>
  );
}

const BackgroundStars = () => {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: '#0d0d0d'
    }}>
      {/* Give Canvas a random key so React always remounts -> new stars */}
      <Canvas
        key={Math.random()}
        camera={{ position: [0, 2, 5], rotation: [-0.5, 0, 0], fov: 75 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default BackgroundStars;
