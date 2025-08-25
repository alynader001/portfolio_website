"use client"

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Shapes(){
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square
    md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas className="z-0" shadows gl={{antialias:false}} dpr={[1, 1.5]}
      camera={{position: [0, 0, 25], fov:30, near:1, far:40}}>
        <Suspense fallback={null}>
          <Geometries/>
          <ContactShadows
          position={[0, -3.5]}
          opacity={0.65}
          scale={40}
          blur={1}
          far={9} />
          <Environment preset="studio"/>
        </Suspense>
      </Canvas>
    </div>
  )
}

function Geometries() {
  const geometries = [
    // Head
    {
      position: [0, 2, 0],
      r: 0.3,
      geometry: new THREE.DodecahedronGeometry(1) // Robot head
    },
    // Body
    {
      position: [0, 0, 0],
      r: 0.2,
      geometry: new THREE.BoxGeometry(2, 2, 1) // Body
    },
    // Left arm
    {
      position: [-1.5, 0.5, 0],
      r: 0.4,
      geometry: new THREE.CylinderGeometry(0.3, 0.3, 1.5) // Arm
    },
    // Right arm
    {
      position: [1.5, 0.5, 0],
      r: 0.4,
      geometry: new THREE.CylinderGeometry(0.3, 0.3, 1.5) // Arm
    },
    // Left leg
    {
      position: [-0.5, -1.5, 0],
      r: 0.3,
      geometry: new THREE.CylinderGeometry(0.3, 0.3, 1.5) // Leg
    },
    // Right leg
    {
      position: [0.5, -1.5, 0],
      r: 0.3,
      geometry: new THREE.CylinderGeometry(0.3, 0.3, 1.5) // Leg
    }
  ];

  const materials = [
    new THREE.MeshNormalMaterial({color: 0x1abc9c, roughness: 0.4}),
    new THREE.MeshNormalMaterial({color: 0xf1c40f, roughness: 0.4})
  ]

  return geometries.map(({position, r, geometry})=>(
    <Geometry
    key={JSON.stringify(position)}
    position={position.map((p)=>p*2)}
    geometry={geometry}
    materials={materials}
    r={r}
    ></Geometry>
  ))

}

function Geometry({ r, position, geometry, materials }) {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);

  const startingMaterial = getRandomMaterial();

  function getRandomMaterial() {
    return gsap.utils.random(materials);
  }

  function handleClick(e) {
    const mesh = e.object;

    gsap.to(mesh.rotation, {
      x: `+=${gsap.utils.random(0, 2)}`,
      y: `+=${gsap.utils.random(0, 2)}`,
      z: `+=${gsap.utils.random(0, 2)}`,
      duration: 1.3,
      ease: "elastic.out(1,0.3)",
      yoyo: true,
    });

    mesh.material = getRandomMaterial();
  }

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: gsap.utils.random(0.8, 1.2),
        ease: "elastic.out(1,0.3)",
        delay: gsap.utils.random(0, 0.5),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <group position={position} ref={meshRef}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <mesh
          geometry={geometry}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          material={startingMaterial}
        ></mesh>
      </Float>
    </group>
  );
}