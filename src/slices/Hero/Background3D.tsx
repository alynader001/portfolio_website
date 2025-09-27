'use client';

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RefObject } from "react";

type HexagonalGridProps = {
  gridRef?: RefObject<THREE.Group>;
};

function HexagonalGrid({ gridRef }: HexagonalGridProps) {
  const localRef = useRef<THREE.Group>(null);
  const size = 2;
  const rows = 5;
  const cols = 5;

  useEffect(() => {
    const group = (gridRef?.current ?? localRef.current);
    if (!group) return;

    // clear old children (important during hot reload)
    group.clear();

    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        const x = (col + (row % 2) * 0.5) * (size * Math.sqrt(3));
        const z = row * (size * 1.5);

        // build one hex outline
        const hexPoints: THREE.Vector3[] = [];
        for (let i = 0; i <= 6; i++) { // <=6 to close loop
          const angle = Math.PI / 6 + (i / 6) * Math.PI * 2;
          hexPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * size,
              0,
              Math.sin(angle) * size
            )
          );
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(hexPoints);
        const material = new THREE.LineBasicMaterial({
          color: 0x2b5320,
          transparent: true,
          opacity: 0.7,
        });

        const line = new THREE.Line(geometry, material);
        line.position.set(x, 0, z);
        group.add(line);
      }
    }
  }, [gridRef]);

  return <group ref={gridRef ?? localRef} />;
}

function Scene() {
  const gridRef = useRef<THREE.Line | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const velocity = useRef({ x: 0, y: 0, z: 0 });


  useEffect(() => {
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    if (particlesRef.current) {
      particlesRef.current.geometry = particlesGeometry;
    }

    // Add mouse move event listener
    const updateMousePosition = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      };
      // Update target rotation based on mouse position
      targetRotation.current = {
        x: mousePosition.current.y * 0.30,
        y: mousePosition.current.x * 0.30,
        z: mousePosition.current.x * 0.1
      };
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useFrame(() => {
    if (gridRef.current && particlesRef.current) {
      const acceleration = 0.03;  
      const friction = 0.40;      
      const damping = 0.9;
      const maxVelocity = 0.05; 
      
      // Calculate distance to target
      const deltaX = targetRotation.current.x - gridRef.current.rotation.x;
      const deltaY = targetRotation.current.y - gridRef.current.rotation.y;
      const deltaZ = targetRotation.current.z - gridRef.current.rotation.z;

      // Update velocities with inertia and damping
      velocity.current.x = velocity.current.x * damping + deltaX * acceleration;
      velocity.current.y = velocity.current.y * damping + deltaY * acceleration;
      velocity.current.z = velocity.current.z * damping + deltaZ * acceleration;

      // Apply friction
      velocity.current.x *= friction;
      velocity.current.y *= friction;
      velocity.current.z *= friction;

      // Clamp velocities
      velocity.current.x = THREE.MathUtils.clamp(velocity.current.x, -maxVelocity, maxVelocity);
      velocity.current.y = THREE.MathUtils.clamp(velocity.current.y, -maxVelocity, maxVelocity);
      velocity.current.z = THREE.MathUtils.clamp(velocity.current.z, -maxVelocity, maxVelocity);

      // Apply velocities to rotation
      gridRef.current.rotation.x += velocity.current.x;
      gridRef.current.rotation.y += velocity.current.y;
      gridRef.current.rotation.z += velocity.current.z;

      // Smooth particle following with increased damping
      const particleDamping = 0.08; // Reduced from 0.1 for smoother following
      particlesRef.current.rotation.x += (gridRef.current.rotation.x - particlesRef.current.rotation.x) * particleDamping;
      particlesRef.current.rotation.y += (gridRef.current.rotation.y - particlesRef.current.rotation.y) * particleDamping;
      particlesRef.current.rotation.z += (gridRef.current.rotation.z - particlesRef.current.rotation.z) * particleDamping;

    }
  });

  return (
    <>
    <HexagonalGrid gridRef={gridRef}/>
      <points ref={particlesRef}>
        <pointsMaterial 
          size={0.1}
          color={0xffeb3b}
        />
      </points>
    </>
  );
}

const Background3D = () => {
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
      <Canvas
        camera={{ position: [0, 2, 5], rotation: [-0.5, 0, 0], fov: 75 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default Background3D;