import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Stylized 3D Avatar of Harsh made programmatically
function HarshModel({ pose, section, scrollProgress }) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const chestRef = useRef();
  
  // Custom materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: '#dfa684',
    roughness: 0.6,
    metalness: 0.1,
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: '#0d0d0f', // deep black dress shirt
    roughness: 0.8,
  });

  const vestMaterial = new THREE.MeshStandardMaterial({
    color: '#121217', // matte black vest
    roughness: 0.5,
    metalness: 0.1,
  });

  const trouserMaterial = new THREE.MeshStandardMaterial({
    color: '#08080a',
    roughness: 0.7,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: '#1a1310', // dark curly hair tint
    roughness: 0.9,
  });

  const glassesMaterial = new THREE.MeshStandardMaterial({
    color: '#d4af37', // Gold metal frame
    roughness: 0.2,
    metalness: 0.9,
  });

  const blazerMaterial = new THREE.MeshStandardMaterial({
    color: '#4a4b52', // Grey-black draped blazer
    roughness: 0.6,
  });

  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: '#c5a059', // brass/gold buttons
    roughness: 0.1,
    metalness: 0.9,
  });

  // Handle poses and animations using frame-loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (!groupRef.current) return;

    // 1. Idle Breathing Animation (Section 2, base breathing)
    const breathe = Math.sin(time * 2) * 0.02;
    chestRef.current.position.y = breathe;
    headRef.current.position.y = 1.35 + breathe * 0.5;
    
    // Default pose values
    let targetLeftArmRotZ = -0.1;
    let targetLeftArmRotX = 0;
    let targetRightArmRotZ = 0.1;
    let targetRightArmRotX = 0;
    let targetHeadRotY = Math.sin(time * 0.5) * 0.05; // gentle idle head swing
    let targetHeadRotX = 0;

    // 2. State-driven Poses
    if (section === 2) {
      // Welcome pose - subtle face drift, arms at side
      targetLeftArmRotZ = -0.15;
      targetRightArmRotZ = 0.15;
    } else if (section === 4) {
      // Shrugging/Humorous Pose (Data Analyst who can't edit his own life)
      // Left arm holds blazer, right arm shrugs slightly
      targetRightArmRotZ = 0.7; // Lift right arm
      targetRightArmRotX = 0.3;
      targetHeadRotX = 0.1; // Head tilt forward slightly
      targetHeadRotY = 0.15; // looking slightly off
    } else if (section === 6) {
      // Presenting showcase pose (Let me show you what I've built)
      // Right arm gestures forward pointing to screen
      targetRightArmRotX = -1.2; // Point forward
      targetRightArmRotZ = -0.2; // Point inward slightly
      targetHeadRotY = -0.3; // look toward screen/side
    }

    // Lerp bones towards their target rotations
    leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targetLeftArmRotZ, 0.1);
    leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targetLeftArmRotX, 0.1);
    
    rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targetRightArmRotZ, 0.1);
    rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targetRightArmRotX, 0.1);

    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetHeadRotY, 0.1);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetHeadRotX, 0.1);

    // Subtle model rotation based on cursor
    const mouseX = state.pointer.x * 0.15;
    const mouseY = state.pointer.y * 0.1;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
    headRef.current.rotation.x += mouseY * 0.2; // add cursor nod
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. HEAD & FACE */}
      <group ref={headRef} position={[0, 1.35, 0]}>
        {/* Head Base */}
        <mesh material={skinMaterial} castShadow>
          <sphereGeometry args={[0.26, 32, 32]} />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, -0.2, 0]} material={skinMaterial}>
          <cylinderGeometry args={[0.08, 0.09, 0.2, 16]} />
        </mesh>

        {/* Wavy/Curly Hair Structure (programmatic curly volume) */}
        <group position={[0, 0.08, -0.02]}>
          {/* Main hair cap */}
          <mesh material={hairMaterial}>
            <sphereGeometry args={[0.27, 16, 16]} />
          </mesh>
          {/* Individual curls/spheres representing wavy locks */}
          <mesh position={[0, 0.18, 0.1]} material={hairMaterial}>
            <sphereGeometry args={[0.1, 8, 8]} />
          </mesh>
          <mesh position={[0.1, 0.16, 0.12]} material={hairMaterial}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
          <mesh position={[-0.1, 0.16, 0.12]} material={hairMaterial}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
          <mesh position={[0.12, 0.08, 0.15]} material={hairMaterial}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
          <mesh position={[-0.12, 0.08, 0.15]} material={hairMaterial}>
            <sphereGeometry args={[0.08, 8, 8]} />
          </mesh>
          <mesh position={[0.08, 0.22, 0.02]} material={hairMaterial}>
            <sphereGeometry args={[0.09, 8, 8]} />
          </mesh>
          <mesh position={[-0.08, 0.22, 0.02]} material={hairMaterial}>
            <sphereGeometry args={[0.09, 8, 8]} />
          </mesh>
        </group>

        {/* Round Wire Glasses */}
        <group position={[0, -0.02, 0.22]}>
          {/* Left Frame */}
          <mesh position={[-0.1, 0, 0.02]} material={glassesMaterial} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.07, 0.008, 8, 32]} />
          </mesh>
          {/* Right Frame */}
          <mesh position={[0.1, 0, 0.02]} material={glassesMaterial} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.07, 0.008, 8, 32]} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0.01, 0.02]} material={glassesMaterial} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.07, 8]} />
          </mesh>
          {/* Temple arms (side elements going back) */}
          <mesh position={[-0.17, 0, -0.1]} material={glassesMaterial} rotation={[Math.PI / 2, 0, -0.1]}>
            <cylinderGeometry args={[0.005, 0.005, 0.22, 8]} />
          </mesh>
          <mesh position={[0.17, 0, -0.1]} material={glassesMaterial} rotation={[Math.PI / 2, 0, 0.1]}>
            <cylinderGeometry args={[0.005, 0.005, 0.22, 8]} />
          </mesh>
        </group>

        {/* Eyes (stylized simple) */}
        <mesh position={[-0.08, 0.01, 0.23]} material={new THREE.MeshBasicMaterial({ color: '#222' })}>
          <sphereGeometry args={[0.015, 8, 8]} />
        </mesh>
        <mesh position={[0.08, 0.01, 0.23]} material={new THREE.MeshBasicMaterial({ color: '#222' })}>
          <sphereGeometry args={[0.015, 8, 8]} />
        </mesh>
      </group>

      {/* 2. TORSO / BODY */}
      <group ref={chestRef} position={[0, 0, 0]}>
        {/* Chest (Shirt base) */}
        <mesh position={[0, 0.65, 0]} material={shirtMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.7, 16]} />
        </mesh>

        {/* Double Breasted Waistcoat (Vest) over shirt */}
        <mesh position={[0, 0.63, 0.02]} material={vestMaterial} castShadow>
          <cylinderGeometry args={[0.23, 0.19, 0.62, 16]} />
        </mesh>
        
        {/* Collar elements */}
        <mesh position={[-0.08, 0.95, 0.14]} rotation={[0.4, 0.2, -0.4]} material={vestMaterial}>
          <boxGeometry args={[0.08, 0.15, 0.03]} />
        </mesh>
        <mesh position={[0.08, 0.95, 0.14]} rotation={[0.4, -0.2, 0.4]} material={vestMaterial}>
          <boxGeometry args={[0.08, 0.15, 0.03]} />
        </mesh>

        {/* Double Breasted Golden Buttons */}
        <group position={[0, 0.6, 0.21]}>
          {/* Row 1 */}
          <mesh position={[-0.06, 0.1, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          <mesh position={[0.06, 0.1, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          {/* Row 2 */}
          <mesh position={[-0.06, -0.03, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          <mesh position={[0.06, -0.03, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          {/* Row 3 */}
          <mesh position={[-0.06, -0.16, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
          <mesh position={[0.06, -0.16, 0]} material={buttonMaterial}>
            <sphereGeometry args={[0.015, 8, 8]} />
          </mesh>
        </group>

        {/* Hips / Pants base */}
        <mesh position={[0, 0.22, 0]} material={trouserMaterial}>
          <cylinderGeometry args={[0.18, 0.19, 0.22, 16]} />
        </mesh>
      </group>

      {/* 3. LIMBS & EXTRAS */}
      {/* Left Arm holding Blazer */}
      <group ref={leftArmRef} position={[-0.24, 0.9, 0]}>
        {/* Upper arm (shirt) */}
        <mesh position={[0, -0.18, 0]} material={shirtMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.38, 16]} />
        </mesh>
        
        {/* Elbow / Lower arm bent holding blazer */}
        <group position={[0, -0.34, 0]} rotation={[0.6, 0, 0]}>
          <mesh position={[0, -0.15, 0.08]} material={shirtMaterial} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.34, 16]} />
          </mesh>
          
          {/* Hand */}
          <mesh position={[0, -0.3, 0.18]} material={skinMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>

          {/* Draped Blazer over forearm */}
          <group position={[0, -0.18, 0.14]} rotation={[0.2, 0, -0.1]}>
            <mesh material={blazerMaterial} castShadow>
              <boxGeometry args={[0.22, 0.38, 0.22]} />
            </mesh>
            {/* Blazer folds */}
            <mesh position={[0.04, -0.1, 0.04]} material={blazerMaterial}>
              <boxGeometry args={[0.18, 0.25, 0.18]} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.24, 0.9, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.18, 0]} material={shirtMaterial} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.38, 16]} />
        </mesh>
        {/* Lower arm */}
        <group position={[0, -0.34, 0]}>
          <mesh position={[0, -0.16, 0]} material={shirtMaterial} castShadow>
            <cylinderGeometry args={[0.07, 0.06, 0.36, 16]} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.34, 0]} material={skinMaterial}>
            <sphereGeometry args={[0.06, 12, 12]} />
          </mesh>
        </group>
      </group>

      {/* Pants Legs */}
      {/* Left Leg */}
      <mesh position={[-0.1, -0.2, 0]} material={trouserMaterial} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.66, 16]} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.1, -0.2, 0]} material={trouserMaterial} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.66, 16]} />
      </mesh>
    </group>
  );
}

// Camera control and Scene environment handling
function SceneManager({ section, scrollProgress }) {
  const { camera } = useThree();
  
  // Animate Camera positions dynamically based on active section
  useEffect(() => {
    let targetCam = { x: 0, y: 0.9, z: 2.8, lookY: 0.7 }; // Default Section 2 Dolly-in Zoom

    if (section === 1) {
      // Intro: Far & hidden camera
      targetCam = { x: 0, y: 0.9, z: 4.5, lookY: 0.7 };
    } else if (section === 2) {
      // Welcome: Dolly-zoom close up
      // Interpolate based on scrollProgress
      const zoom = 2.8 - (scrollProgress * 0.6); // dolly in further as you scroll
      targetCam = { x: 0, y: 0.9, z: zoom, lookY: 0.7 };
    } else if (section === 3) {
      // Trailer Montage: Cinematic sweeping angle
      targetCam = { x: 0.5, y: 1.2, z: 3.2, lookY: 0.8 };
    } else if (section === 4) {
      // Who I Am: Humorous/Shrug angle. Zoom back slightly, shift side
      targetCam = { x: -0.4, y: 0.8, z: 2.8, lookY: 0.75 };
    } else if (section === 5) {
      // Photo Reel: Back off to the side, look down
      targetCam = { x: 0.8, y: 1.0, z: 3.5, lookY: 0.6 };
    } else if (section === 6) {
      // Portfolio Intro: Presentation angle. Shift left to open up right screen area
      targetCam = { x: -0.6, y: 0.8, z: 2.4, lookY: 0.7 };
    } else {
      // Default / Showcase
      targetCam = { x: 0, y: 0.9, z: 3.0, lookY: 0.7 };
    }

    // Animate camera using GSAP for buttery smooth movement
    gsap.to(camera.position, {
      x: targetCam.x,
      y: targetCam.y,
      z: targetCam.z,
      duration: 1.8,
      ease: 'power3.out',
    });

    // Make camera look at model center
    const targetLook = new THREE.Vector3(0, targetCam.lookY, 0);
    const lookTween = { y: camera.rotation.y }; // dummy to animate target looking smoothly
    
    // Smooth lookup update
    gsap.to(camera, {
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        camera.lookAt(targetLook);
      }
    });

  }, [section, scrollProgress, camera]);

  return null;
}

export default function ModelScene({ section, scrollProgress }) {
  // Determine shadow poly levels based on viewport size for optimization
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div className="w-full h-full absolute inset-0 z-10 pointer-events-none">
      <Canvas
        shadows={!isMobile}
        camera={{ position: [0, 0.9, 3.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Lights */}
        {/* Base Ambient */}
        <ambientLight intensity={0.45} />
        
        {/* Directional Spot Light / Dramatic Keylight */}
        <spotLight
          position={[2, 4, 3]}
          angle={0.4}
          penumbra={0.8}
          intensity={4.0}
          castShadow={!isMobile}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Dramatic Rim Lighting (Electric Blue backlight) */}
        <directionalLight
          position={[-3, 1, -2]}
          intensity={5.0}
          color="#0070f3"
        />

        {/* Amber Fill light for cinematic contrast */}
        <directionalLight
          position={[3, -1, -1]}
          intensity={1.2}
          color="#ff9f00"
        />

        {/* Subtle point light inside chest/bottom to fill base */}
        <pointLight position={[0, -1, 1]} intensity={0.5} color="#ffffff" />

        {/* Scene Orchestrator */}
        <SceneManager section={section} scrollProgress={scrollProgress} />

        {/* Model */}
        <Center>
          <HarshModel pose="idle" section={section} scrollProgress={scrollProgress} />
        </Center>
      </Canvas>
    </div>
  );
}
