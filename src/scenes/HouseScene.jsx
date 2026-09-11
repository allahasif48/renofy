import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const WALL = '#eee9df';
const WALL_WARM = '#e7e0d4';
const OAK = '#9a704d';
const OAK_DARK = '#6f4d35';
const BLACK = '#151515';
const GOLD = '#b8924d';
const STONE = '#c7c0b4';
const STONE_LIGHT = '#ded9d0';
const GLASS = '#a9c2c9';
const FABRIC = '#d7d0c4';
const GREEN = '#6e8066';

function Box({ position, scale, rotation = [0, 0, 0], color = WALL, roughness = 0.8, metalness = 0, radius = 0.06, castShadow = true, receiveShadow = true }) {
  return (
    <RoundedBox
      args={[1, 1, 1]}
      radius={radius}
      smoothness={3}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </RoundedBox>
  );
}

function Cylinder({ position, args = [0.1, 0.1, 1, 20], color = BLACK, rotation = [0, 0, 0], metalness = 0, roughness = 0.7 }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

function Window({ position, scale = [1.6, 1.8, 0.08], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 0, 0]} scale={scale} color={BLACK} radius={0.02} />
      <Box
        position={[0, 0, -0.055]}
        scale={[scale[0] - 0.12, scale[1] - 0.12, 0.04]}
        color={GLASS}
        roughness={0.08}
        metalness={0.05}
        radius={0.01}
      />
      <Box position={[0, 0, -0.09]} scale={[0.045, scale[1] - 0.18, 0.035]} color={BLACK} radius={0.01} />
    </group>
  );
}

function RecessedLight({ position, intensity = 7, distance = 5 }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0, 0]} args={[0.09, 0.09, 0.04, 20]} color="#f7f3ea" />
      <pointLight position={[0, -0.08, 0]} intensity={intensity} distance={distance} color="#fff0d5" />
    </group>
  );
}

function Plant({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <Cylinder position={[0, 0.32, 0]} args={[0.28, 0.22, 0.52, 18]} color="#7a6554" />
      {[[-0.16, 0.85, 0], [0.17, 1, 0.05], [0, 1.16, -0.06], [0.08, 0.78, 0.15]].map((p, i) => (
        <mesh key={i} position={p} rotation={[0, 0, i % 2 ? 0.35 : -0.35]} castShadow>
          <sphereGeometry args={[0.28, 14, 10]} />
          <meshStandardMaterial color={GREEN} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Exterior() {
  return (
    <group position={[0, 0, 8]}>
      <Box position={[-2.8, 1.6, 0]} scale={[4.7, 5.2, 0.55]} color="#e7e2d8" />
      <Box position={[2.6, 1.45, 0]} scale={[5, 4.9, 0.55]} color="#d9d2c5" />
      <Box position={[2.65, 3.82, -0.1]} scale={[5.1, 0.3, 0.7]} color={BLACK} />
      <Box position={[-2.85, 4.2, -0.1]} scale={[4.9, 0.34, 0.7]} color={BLACK} />

      <Window position={[-2.75, 2.05, -0.44]} scale={[2.7, 1.8, 0.08]} />
      <Window position={[2.7, 2.3, -0.44]} scale={[2.75, 1.55, 0.08]} />

      <Box position={[0, 1.23, -0.54]} scale={[1.42, 2.65, 0.18]} color={BLACK} radius={0.03} />
      <Box position={[0, 1.23, -0.69]} scale={[1.08, 2.3, 0.08]} color={OAK_DARK} radius={0.025} />
      <Box position={[0.44, 1.18, -0.78]} scale={[0.045, 0.5, 0.045]} color={GOLD} metalness={0.75} roughness={0.25} />
      <Box position={[0, 2.72, -0.34]} scale={[2.4, 0.18, 1.6]} color={BLACK} />

      <Box position={[0, -0.16, 1.55]} scale={[4.8, 0.16, 3.5]} color="#aaa49b" />
      <Box position={[0, -0.06, -0.1]} scale={[2.1, 0.22, 1.15]} color="#bdb7ae" />
      <Box position={[0, -0.23, -0.75]} scale={[2.7, 0.18, 0.45]} color="#c6c0b7" />

      <Box position={[-4.35, 0.95, -0.1]} scale={[0.4, 2.3, 0.4]} color="#4f4b47" />
      <Box position={[4.35, 0.95, -0.1]} scale={[0.4, 2.3, 0.4]} color="#4f4b47" />

      <Plant position={[-3.65, 0, -0.85]} scale={0.8} />
      <Plant position={[3.65, 0, -0.85]} scale={0.8} />

      {[-3.9, -1.9, 1.9, 3.9].map((x) => (
        <Box key={x} position={[x, -0.2, 2.6]} scale={[1.25, 0.22, 1.25]} color="#6f7f62" radius={0.5} />
      ))}

      <pointLight position={[0, 2.7, -1.2]} intensity={14} distance={7} color="#ffdca8" />
    </group>
  );
}

function Foyer() {
  return (
    <group position={[0, 0, 1.5]}>
      <Box position={[0, -0.15, 0]} scale={[8, 0.18, 5]} color={OAK} />
      <Box position={[-4, 2.25, 0]} scale={[0.18, 4.8, 5]} />
      <Box position={[4, 2.25, 0]} scale={[0.18, 4.8, 5]} />
      <Box position={[0, 4.55, 0]} scale={[8, 0.18, 5]} />
      <Box position={[0, 2.25, 2.48]} scale={[2.7, 4.7, 0.18]} color={WALL_WARM} />

      <Box position={[-2.7, 0.75, -1.55]} scale={[1.65, 1.35, 0.5]} color="#8e6548" />
      <Box position={[-2.7, 1.48, -1.58]} scale={[1.78, 0.09, 0.58]} color={STONE_LIGHT} />
      <Box position={[-2.7, 2.55, -1.78]} scale={[1.35, 1.5, 0.05]} color="#9aa5a4" roughness={0.18} />
      <Plant position={[-3.2, 1.5, -1.4]} scale={0.45} />

      <Box position={[1.8, 0.01, -0.7]} scale={[2.7, 0.04, 1.1]} color="#d6cabb" />
      <Box position={[1.8, 0.05, -0.7]} scale={[2.45, 0.025, 0.9]} color="#8b7765" />

      <Cylinder position={[0, 3.55, -0.3]} args={[0.08, 0.08, 0.7, 20]} color={GOLD} metalness={0.7} roughness={0.25} />
      <mesh position={[0, 3.12, -0.3]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f4d8a7" emissive="#f3c677" emissiveIntensity={0.7} />
      </mesh>
      <pointLight position={[0, 3.0, -0.3]} intensity={13} distance={6} color="#ffe1b0" />

      <RecessedLight position={[-2.3, 4.38, 0.7]} />
      <RecessedLight position={[2.3, 4.38, 0.7]} />
    </group>
  );
}

function Sofa({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Box position={[0, 0.5, 0]} scale={[3.1, 0.72, 1.28]} color={FABRIC} radius={0.18} />
      <Box position={[0, 1.0, 0.48]} scale={[3.1, 0.86, 0.28]} color="#c9c0b4" radius={0.18} />
      <Box position={[-1.48, 0.72, 0]} scale={[0.3, 0.9, 1.25]} color="#c9c0b4" radius={0.16} />
      <Box position={[1.48, 0.72, 0]} scale={[0.3, 0.9, 1.25]} color="#c9c0b4" radius={0.16} />
      <Box position={[-0.72, 0.86, -0.05]} scale={[1.2, 0.18, 0.85]} color="#e2ddd5" radius={0.12} />
      <Box position={[0.72, 0.86, -0.05]} scale={[1.2, 0.18, 0.85]} color="#ddd6ca" radius={0.12} />
    </group>
  );
}

function LivingRoom() {
  return (
    <group position={[-4, 0, -4]}>
      <Box position={[0, -0.15, 0]} scale={[7, 0.18, 5.8]} color={OAK} />
      <Box position={[-3.5, 2.2, 0]} scale={[0.18, 4.7, 5.8]} />
      <Box position={[0, 2.2, -2.9]} scale={[7, 4.7, 0.18]} />
      <Box position={[0, 4.5, 0]} scale={[7, 0.16, 5.8]} />

      <Window position={[-3.35, 2.5, 0]} scale={[0.09, 2.6, 2.8]} rotation={[0, Math.PI / 2, 0]} />
      <Sofa position={[-0.8, 0, 0.25]} />

      <Box position={[1.35, 0.18, -0.2]} scale={[1.7, 0.23, 0.95]} color={STONE_LIGHT} radius={0.18} />
      <Box position={[1.35, 0.42, -0.2]} scale={[1.6, 0.06, 0.88]} color="#d1cabf" radius={0.14} />

      <Box position={[2.45, 1.45, -2.7]} scale={[2.7, 1.65, 0.09]} color={BLACK} radius={0.025} />
      <Box position={[2.45, 0.48, -2.68]} scale={[3.15, 0.55, 0.42]} color={OAK_DARK} />
      <Box position={[2.45, 1.5, -2.77]} scale={[3.5, 2.6, 0.05]} color="#d8d0c4" />
      {[1.2, 2.45, 3.7].map((x) => (
        <Box key={x} position={[x, 1.5, -2.81]} scale={[0.06, 2.5, 0.04]} color="#bda98b" />
      ))}

      <Box position={[-1.0, 0.005, 0.25]} scale={[4.2, 0.035, 2.25]} color="#c7bbaa" radius={0.1} />
      <Plant position={[-2.65, 0, -1.85]} scale={0.65} />

      <RecessedLight position={[-1.8, 4.35, 1.55]} intensity={8} />
      <RecessedLight position={[1.3, 4.35, 1.55]} intensity={8} />
      <RecessedLight position={[1.5, 4.35, -1.5]} intensity={8} />
    </group>
  );
}

function Stool({ position }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0.42, 0]} args={[0.035, 0.035, 0.8, 14]} color={BLACK} />
      <Cylinder position={[0.2, 0.42, 0]} args={[0.035, 0.035, 0.8, 14]} color={BLACK} />
      <Cylinder position={[0, 0.42, 0.2]} args={[0.035, 0.035, 0.8, 14]} color={BLACK} />
      <Cylinder position={[0.2, 0.42, 0.2]} args={[0.035, 0.035, 0.8, 14]} color={BLACK} />
      <Box position={[0.1, 0.86, 0.1]} scale={[0.48, 0.12, 0.48]} color="#8a6548" radius={0.1} />
    </group>
  );
}

function Pendant({ position }) {
  return (
    <group position={position}>
      <Cylinder position={[0, 0.25, 0]} args={[0.025, 0.025, 0.9, 12]} color={BLACK} />
      <mesh position={[0, -0.25, 0]} castShadow>
        <coneGeometry args={[0.23, 0.36, 22, 1, true]} />
        <meshStandardMaterial color={BLACK} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={9} distance={5} color="#ffddb0" />
    </group>
  );
}

function Kitchen() {
  return (
    <group position={[4, 0, -5]}>
      <Box position={[0, -0.15, 0]} scale={[7, 0.18, 6]} color={OAK} />
      <Box position={[3.5, 2.2, 0]} scale={[0.18, 4.7, 6]} />
      <Box position={[0, 2.2, -3]} scale={[7, 4.7, 0.18]} />
      <Box position={[0, 4.5, 0]} scale={[7, 0.16, 6]} />

      {[-2.35, -1.3, -0.25, 0.8, 1.85].map((x) => (
        <Box key={`base-${x}`} position={[x, 0.48, -2.48]} scale={[0.96, 0.96, 0.62]} color="#e8e4dc" radius={0.025} />
      ))}
      <Box position={[-0.25, 1.02, -2.35]} scale={[5.2, 0.12, 0.82]} color={STONE_LIGHT} radius={0.025} />
      <Box position={[-0.25, 1.68, -2.72]} scale={[5.2, 1.1, 0.08]} color="#d3cabd" radius={0.02} />

      {[-1.85, -0.8, 0.25, 1.3].map((x) => (
        <Box key={`upper-${x}`} position={[x, 2.55, -2.55]} scale={[0.92, 1.3, 0.42]} color="#ddd5c7" radius={0.025} />
      ))}

      <Box position={[-2.7, 1.6, -2.55]} scale={[0.9, 2.9, 0.48]} color="#7d8586" metalness={0.3} roughness={0.35} radius={0.03} />
      <Box position={[-2.7, 1.7, -2.82]} scale={[0.025, 0.8, 0.03]} color={BLACK} />
      <Box position={[2.45, 0.8, -2.52]} scale={[0.95, 1.6, 0.45]} color={BLACK} />
      <Box position={[2.45, 2.15, -2.52]} scale={[0.9, 0.55, 0.45]} color="#777" metalness={0.4} roughness={0.25} />

      <Box position={[0.35, 0.62, 0]} scale={[3.55, 1.12, 1.35]} color="#e8e4dc" />
      <Box position={[0.35, 1.22, 0]} scale={[3.8, 0.12, 1.56]} color="#bfb7aa" radius={0.03} />
      <Box position={[0.35, 1.29, 0]} scale={[3.35, 0.025, 1.14]} color="#d7d0c6" radius={0.02} />

      <Box position={[-0.35, 1.34, 0.05]} scale={[0.75, 0.035, 0.52]} color="#797979" metalness={0.5} roughness={0.25} />
      <Cylinder position={[-0.35, 1.65, 0.18]} args={[0.035, 0.035, 0.55, 12]} color={GOLD} metalness={0.8} roughness={0.2} />
      <Cylinder position={[-0.35, 1.9, -0.02]} args={[0.03, 0.03, 0.42, 12]} color={GOLD} rotation={[Math.PI / 2, 0, 0]} metalness={0.8} roughness={0.2} />

      <Stool position={[-0.85, 0, 1.05]} />
      <Stool position={[0.25, 0, 1.05]} />
      <Stool position={[1.35, 0, 1.05]} />

      <Pendant position={[-0.5, 3.15, 0]} />
      <Pendant position={[0.45, 3.15, 0]} />
      <Pendant position={[1.4, 3.15, 0]} />

      <RecessedLight position={[-2.4, 4.34, 1.7]} />
      <RecessedLight position={[2.4, 4.34, 1.7]} />
    </group>
  );
}

function Bathroom() {
  return (
    <group position={[0, 0, -10.5]}>
      <Box position={[0, -0.15, 0]} scale={[6.4, 0.18, 5.2]} color="#c9c3b9" />
      <Box position={[0, 2.2, -2.6]} scale={[6.4, 4.7, 0.18]} color="#e1dbd0" />
      <Box position={[-3.2, 2.2, 0]} scale={[0.18, 4.7, 5.2]} />
      <Box position={[3.2, 2.2, 0]} scale={[0.18, 4.7, 5.2]} />
      <Box position={[0, 4.5, 0]} scale={[6.4, 0.16, 5.2]} />

      <Box position={[1.55, 0.58, -2.1]} scale={[2.5, 0.95, 0.68]} color="#a98563" />
      <Box position={[1.55, 1.12, -2.05]} scale={[2.62, 0.1, 0.75]} color="#ebe7df" />
      <Box position={[1.1, 1.2, -1.98]} scale={[0.62, 0.08, 0.42]} color="#f5f2ed" radius={0.1} />
      <Box position={[2.0, 1.2, -1.98]} scale={[0.62, 0.08, 0.42]} color="#f5f2ed" radius={0.1} />
      <Box position={[1.55, 2.35, -2.38]} scale={[2.2, 1.8, 0.055]} color="#929fa0" roughness={0.16} metalness={0.08} />
      <pointLight position={[1.55, 3.25, -1.95]} intensity={8} distance={4} color="#ffe3bd" />

      <Box position={[-1.75, 1.35, -1.85]} scale={[1.9, 2.7, 0.055]} color={GLASS} roughness={0.08} radius={0.02} />
      <Box position={[-2.65, 1.35, -1.0]} scale={[0.055, 2.7, 1.7]} color={GLASS} roughness={0.08} radius={0.02} />
      <Box position={[-1.75, 0.06, -1.82]} scale={[1.9, 0.12, 1.7]} color="#d7d2c8" />
      <Cylinder position={[-2.35, 2.25, -2.05]} args={[0.035, 0.035, 1.3, 14]} color={BLACK} />
      <Cylinder position={[-2.35, 2.85, -1.72]} args={[0.03, 0.03, 0.55, 14]} color={BLACK} rotation={[Math.PI / 2, 0, 0]} />

      <Box position={[-0.1, 0.42, 0.65]} scale={[0.86, 0.52, 0.72]} color="#f0ede7" radius={0.18} />
      <Box position={[-0.1, 0.8, 0.83]} scale={[0.72, 0.5, 0.42]} color="#f0ede7" radius={0.14} />

      <Box position={[1.75, 0.012, 0.8]} scale={[2.2, 0.035, 1.25]} color="#b9aa98" radius={0.08} />
      <Plant position={[2.55, 0, 1.6]} scale={0.45} />
      <RecessedLight position={[-1.6, 4.34, 0.9]} />
      <RecessedLight position={[1.7, 4.34, 0.9]} />
    </group>
  );
}

function Basement() {
  return (
    <group position={[0, -3, -16]}>
      <Box position={[0, -0.15, 0]} scale={[9, 0.18, 7]} color="#6b5749" />
      <Box position={[0, 2.1, -3.5]} scale={[9, 4.5, 0.18]} color="#ddd7cc" />
      <Box position={[-4.5, 2.1, 0]} scale={[0.18, 4.5, 7]} color="#ddd7cc" />
      <Box position={[4.5, 2.1, 0]} scale={[0.18, 4.5, 7]} color="#ddd7cc" />
      <Box position={[0, 4.32, 0]} scale={[9, 0.16, 7]} color="#e9e4da" />

      <Sofa position={[-1.15, 0, 0.4]} scale={1.1} />
      <Box position={[-1.0, 0.005, 0.45]} scale={[4.5, 0.035, 2.6]} color="#8f7865" radius={0.12} />
      <Box position={[1.35, 0.25, -0.5]} scale={[1.7, 0.3, 0.9]} color="#403a36" radius={0.16} />

      <Box position={[2.4, 2.05, -3.35]} scale={[3.5, 2.0, 0.08]} color={BLACK} />
      <Box position={[2.4, 0.55, -3.22]} scale={[3.9, 0.62, 0.42]} color={OAK_DARK} />
      <Box position={[2.4, 2.05, -3.43]} scale={[4.4, 3.2, 0.05]} color="#c7bcae" />
      {[0.4, 1.4, 2.4, 3.4, 4.4].map((x) => (
        <Box key={x} position={[x, 2.05, -3.47]} scale={[0.045, 3.1, 0.035]} color="#9a8067" />
      ))}

      <Box position={[-3.15, 1.5, -3.25]} scale={[1.9, 2.7, 0.12]} color="#6f4735" />
      <Box position={[-3.15, 2.1, -3.12]} scale={[1.45, 1.05, 0.05]} color="#1c1c1c" />
      <Box position={[-3.15, 0.58, -3.05]} scale={[1.8, 0.5, 0.5]} color="#333" />

      <Box position={[3.25, 0.65, 1.9]} scale={[2.2, 1.05, 0.65]} color="#d5cbbd" />
      <Box position={[3.25, 1.2, 1.9]} scale={[2.35, 0.1, 0.78]} color={STONE_LIGHT} />
      <Stool position={[2.7, 0, 2.75]} />
      <Stool position={[3.7, 0, 2.75]} />

      <Plant position={[-3.6, 0, 2.35]} scale={0.55} />
      <RecessedLight position={[-2.8, 4.14, 1.8]} intensity={7} />
      <RecessedLight position={[0, 4.14, 1.8]} intensity={7} />
      <RecessedLight position={[2.8, 4.14, 1.8]} intensity={7} />
      <RecessedLight position={[0, 4.14, -1.5]} intensity={7} />
    </group>
  );
}

const keyframes = [
  { p: [0, 2.3, 18], t: [0, 1.7, 8] },
  { p: [0, 1.8, 11.7], t: [0, 1.5, 7.2] },
  { p: [0, 1.7, 5.2], t: [0, 1.5, 1.5] },
  { p: [-1.7, 1.7, -1.0], t: [-4, 1.4, -4] },
  { p: [1.8, 1.7, -2.6], t: [4, 1.4, -5] },
  { p: [0.5, 1.7, -7.5], t: [0, 1.3, -10.5] },
  { p: [0, 0.2, -12.8], t: [0, -1.8, -16] },
  { p: [0, -1.4, -18.2], t: [0, -1.5, -16] }
];

function CameraRig({ progress }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const positionA = useMemo(() => new THREE.Vector3(), []);
  const positionB = useMemo(() => new THREE.Vector3(), []);
  const lookA = useMemo(() => new THREE.Vector3(), []);
  const lookB = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const scaled = THREE.MathUtils.clamp(progress, 0, 0.999) * (keyframes.length - 1);
    const i = Math.floor(scaled);
    const f = scaled - i;
    const a = keyframes[i];
    const b = keyframes[Math.min(i + 1, keyframes.length - 1)];

    positionA.set(...a.p);
    positionB.set(...b.p);
    lookA.set(...a.t);
    lookB.set(...b.t);

    const pos = positionA.lerp(positionB, f);
    const look = lookA.lerp(lookB, f);

    camera.position.lerp(pos, 0.075);
    target.lerp(look, 0.075);
    camera.lookAt(target);
  });

  return null;
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.72} />
      <hemisphereLight args={['#dce6ea', '#8b7665', 1.15]} />
      <directionalLight
        position={[8, 12, 10]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
      />
      <pointLight position={[0, 2.8, -7]} intensity={20} distance={20} color="#fff0d4" />

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
      <Canvas
        shadows
        dpr={[1, 1.65]}
        camera={{ position: [0, 2.3, 18], fov: 48, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <color attach="background" args={['#aeb9bc']} />
        <fog attach="fog" args={['#aeb9bc', 18, 44]} />
        <SceneContent />
        <CameraRig progress={progress} />
      </Canvas>
    </div>
  );
}
