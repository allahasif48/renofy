import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const WALL = '#eee9df';
const OAK = '#9d7453';
const BLACK = '#141414';
const GOLD = '#b99247';
const STONE = '#c9c3b8';

function Box({ position, scale, color = WALL, roughness = 0.8, metalness = 0, radius = 0.08 }) {
  return (
    <RoundedBox args={[1, 1, 1]} radius={radius} smoothness={3} position={position} scale={scale}>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  );
}

function Window({ position, scale = [1.6, 1.8, 0.08] }) {
  return (
    <group position={position}>
      <Box position={[0,0,0]} scale={scale} color={BLACK} radius={0.03} />
      <Box position={[0,0,-0.055]} scale={[scale[0]-0.12, scale[1]-0.12, 0.04]} color="#bcd0d6" roughness={0.15} metalness={0.05} radius={0.02} />
    </group>
  );
}

function Exterior() {
  return (
    <group position={[0,0,8]}>
      <Box position={[0,1.5,0]} scale={[10,5,0.55]} color="#e8e4da" />
      <Box position={[-2.9,4.15,-0.05]} scale={[4.2,0.38,0.7]} color={BLACK} />
      <Box position={[2.5,3.4,-0.1]} scale={[3.3,1.9,0.55]} color="#ded8cb" />
      <Window position={[2.5,3.45,-0.45]} scale={[2.6,1.15,0.08]} />
      <Window position={[-2.5,1.9,-0.45]} scale={[2.7,1.7,0.08]} />
      <Box position={[0,1.25,-0.55]} scale={[1.35,2.55,0.18]} color={BLACK} />
      <Box position={[0,1.25,-0.69]} scale={[1.02,2.15,0.07]} color="#6d503d" />
      <Box position={[0.42,1.2,-0.78]} scale={[0.05,0.45,0.05]} color={GOLD} metalness={0.7} roughness={0.25} />
      <Box position={[0,-0.2,2]} scale={[4.5,0.12,4]} color="#a7a39a" />
      {[[-4,-0.05,1.5],[-4,-0.05,3.5],[4,-0.05,1.5],[4,-0.05,3.5]].map((p,i)=><Box key={i} position={p} scale={[1.2,0.22,1.2]} color="#68805c" radius={0.5} />)}
    </group>
  );
}

function Foyer() {
  return (
    <group position={[0,0,1.5]}>
      <Box position={[0,-0.15,0]} scale={[8,0.18,5]} color={OAK} />
      <Box position={[-4,2.25,0]} scale={[0.18,4.8,5]} />
      <Box position={[4,2.25,0]} scale={[0.18,4.8,5]} />
      <Box position={[0,4.55,0]} scale={[8,0.18,5]} />
      <Box position={[-2.6,1.6,-1.6]} scale={[1.5,0.1,0.55]} color={STONE} />
      <Box position={[-2.6,0.75,-1.6]} scale={[0.18,1.7,0.18]} color={BLACK} />
      <Float speed={1.3} rotationIntensity={0.06} floatIntensity={0.1}>
        <mesh position={[0,3.3,-0.3]}>
          <sphereGeometry args={[0.24,24,24]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.25} />
        </mesh>
      </Float>
    </group>
  );
}

function LivingRoom() {
  return (
    <group position={[-4,0,-4]}>
      <Box position={[0,-0.15,0]} scale={[7,0.18,5.8]} color={OAK} />
      <Box position={[-3.5,2.2,0]} scale={[0.18,4.7,5.8]} />
      <Box position={[0,2.2,-2.9]} scale={[7,4.7,0.18]} />
      <Box position={[-0.8,0.55,0]} scale={[3.2,0.75,1.35]} color="#d9d4c9" radius={0.25} />
      <Box position={[1.5,0.25,-0.4]} scale={[1.5,0.32,0.8]} color={STONE} radius={0.18} />
      <Box position={[2.5,1.4,-2.65]} scale={[2.5,1.9,0.1]} color={BLACK} />
      <Window position={[-3.35,2.4,0]} scale={[0.09,2.4,2.7]} />
    </group>
  );
}

function Kitchen() {
  return (
    <group position={[4,0,-5]}>
      <Box position={[0,-0.15,0]} scale={[7,0.18,6]} color={OAK} />
      <Box position={[3.5,2.2,0]} scale={[0.18,4.7,6]} />
      <Box position={[0,2.2,-3]} scale={[7,4.7,0.18]} />
      <Box position={[0,0.55,-2.45]} scale={[5.5,1.05,0.62]} color="#f1efe9" />
      <Box position={[0,1.15,-2.12]} scale={[5.7,0.12,0.78]} color={STONE} />
      <Box position={[0.4,0.65,0]} scale={[3.2,1.05,1.25]} color="#ebe8e0" />
      <Box position={[0.4,1.25,0]} scale={[3.45,0.12,1.48]} color="#bfb8aa" />
      {[-2,-1,0,1,2].map((x)=><Box key={x} position={[x,2.2,-2.58]} scale={[0.86,1.65,0.22]} color="#d8cfbf" radius={0.04} />)}
      <Box position={[-2.4,1.55,-2.25]} scale={[1.0,1.9,0.45]} color={BLACK} />
      {[[-0.4,3,0],[0.4,3,0],[1.2,3,0]].map((p,i)=><mesh key={i} position={p}><cylinderGeometry args={[0.07,0.07,0.8,16]} /><meshStandardMaterial color={GOLD} metalness={0.6} roughness={0.25}/></mesh>)}
    </group>
  );
}

function Bathroom() {
  return (
    <group position={[0,0,-10.5]}>
      <Box position={[0,-0.15,0]} scale={[6.4,0.18,5.2]} color={STONE} />
      <Box position={[0,2.2,-2.6]} scale={[6.4,4.7,0.18]} color="#e2ddd2" />
      <Box position={[-3.2,2.2,0]} scale={[0.18,4.7,5.2]} />
      <Box position={[1.6,0.6,-2.15]} scale={[2.4,0.92,0.62]} color="#c8b99e" />
      <Box position={[1.6,1.2,-2.05]} scale={[2.55,0.1,0.72]} color="#eeeae1" />
      <Box position={[1.6,2.25,-2.42]} scale={[2.15,1.65,0.06]} color="#8f9c9f" metalness={0.1} roughness={0.2} />
      <Box position={[-1.7,1.2,-1.7]} scale={[1.8,2.4,1.5]} color="#b7c7cb" roughness={0.12} radius={0.05} />
      <Box position={[-1.7,1.2,-1.66]} scale={[0.08,2.4,1.5]} color={BLACK} radius={0.02} />
      <Box position={[-0.15,0.45,0.55]} scale={[1.5,0.55,0.75]} color="#efede8" radius={0.22} />
    </group>
  );
}

function Basement() {
  return (
    <group position={[0,-3,-16]}>
      <Box position={[0,-0.15,0]} scale={[9,0.18,7]} color="#65554a" />
      <Box position={[0,2.1,-3.5]} scale={[9,4.5,0.18]} color="#ded8cc" />
      <Box position={[-4.5,2.1,0]} scale={[0.18,4.5,7]} color="#ded8cc" />
      <Box position={[-1,0.55,0]} scale={[3.6,0.75,1.55]} color="#c9c2b8" radius={0.25} />
      <Box position={[2.4,0.4,-1.5]} scale={[2.5,0.8,0.8]} color={BLACK} radius={0.08} />
      <Box position={[2.4,2.0,-3.35]} scale={[3.2,1.9,0.08]} color={BLACK} />
      <Box position={[-3.25,1.4,-3.2]} scale={[1.7,2.5,0.12]} color="#704936" />
      {[[-2.4,2.7,-2.8],[0,2.7,-2.8],[2.4,2.7,-2.8]].map((p,i)=><mesh key={i} position={p}><sphereGeometry args={[0.16,20,20]}/><meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.35}/></mesh>)}
    </group>
  );
}

const keyframes = [
  { p: [0,2.3,18], t: [0,1.7,8] },
  { p: [0,1.8,11.7], t: [0,1.5,7.2] },
  { p: [0,1.7,5.2], t: [0,1.5,1.5] },
  { p: [-1.7,1.7,-1.0], t: [-4,1.4,-4] },
  { p: [1.8,1.7,-2.6], t: [4,1.4,-5] },
  { p: [0.5,1.7,-7.5], t: [0,1.3,-10.5] },
  { p: [0,0.2,-12.8], t: [0,-1.8,-16] },
  { p: [0,-1.4,-18.2], t: [0,-1.5,-16] }
];

function CameraRig({ progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const scaled = THREE.MathUtils.clamp(progress,0,0.999) * (keyframes.length - 1);
    const i = Math.floor(scaled);
    const f = scaled - i;
    const a = keyframes[i];
    const b = keyframes[Math.min(i + 1, keyframes.length - 1)];
    const pos = new THREE.Vector3(...a.p).lerp(new THREE.Vector3(...b.p), f);
    const look = new THREE.Vector3(...a.t).lerp(new THREE.Vector3(...b.t), f);
    camera.position.lerp(pos, 0.08);
    target.lerp(look, 0.08);
    camera.lookAt(target);
  });
  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[6,12,12]} intensity={2.4} castShadow />
      <pointLight position={[0,3,-8]} intensity={35} distance={18} color="#fff0d4" />
      <Exterior />
      <Foyer />
      <LivingRoom />
      <Kitchen />
      <Bathroom />
      <Basement />
      <Environment preset="apartment" />
    </>
  );
}

export default function HouseScene({ progress }) {
  return (
    <div className="canvas-shell" aria-hidden="true">
      <Canvas shadows dpr={[1,1.6]} camera={{ position: [0,2.3,18], fov: 48, near: 0.1, far: 100 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={['#b8c2c3']} />
        <fog attach="fog" args={['#b8c2c3', 16, 42]} />
        <SceneContent />
        <CameraRig progress={progress} />
      </Canvas>
    </div>
  );
}
