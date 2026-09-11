import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo } from 'react';

const C = {
  wall: '#eee9df',
  wallWarm: '#e5ded2',
  oak: '#9b7252',
  oakDark: '#6c4b35',
  black: '#171717',
  brass: '#b7904a',
  stone: '#c8c0b4',
  stoneLight: '#ded8cf',
  glass: '#a9c8d2',
  fabric: '#d2cbc0',
  green: '#6f7f63',
  concrete: '#aaa49c',
  tile: '#cfc9bf'
};

function Box({ position, scale, rotation = [0,0,0], color = C.wall, roughness = 0.8, metalness = 0, opacity = 1, transparent = false }) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} opacity={opacity} transparent={transparent} />
    </mesh>
  );
}

function Cylinder({ position, args = [0.1,0.1,1,20], color = C.black, rotation = [0,0,0], metalness = 0, roughness = 0.7 }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

function Wall({ a, b, y = 2.3, height = 4.6, thickness = 0.16, color = C.wall }) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  const angle = -Math.atan2(dz, dx);
  return <Box position={[(a[0]+b[0])/2, y, (a[1]+b[1])/2]} scale={[len, height, thickness]} rotation={[0, angle, 0]} color={color} />;
}

function DoorOpeningWall({ z, x1, x2, doorCenter, doorWidth = 1.25, height = 4.6 }) {
  const leftEnd = doorCenter - doorWidth/2;
  const rightStart = doorCenter + doorWidth/2;
  if (leftEnd <= x1 || rightStart >= x2) return null;
  return <>
    <Wall a={[x1,z]} b={[leftEnd,z]} height={height} />
    <Wall a={[rightStart,z]} b={[x2,z]} height={height} />
    <Box position={[doorCenter, 3.95, z]} scale={[doorWidth, 1.3, 0.16]} color={C.wall} />
  </>;
}

function Window({ position, width = 2.2, height = 1.7, rotation = [0,0,0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0,0,0]} scale={[width+0.14,height+0.14,0.09]} color={C.black} />
      <Box position={[0,0,-0.055]} scale={[width,height,0.045]} color={C.glass} roughness={0.08} metalness={0.05} />
      <Box position={[0,0,-0.09]} scale={[0.045,height,0.035]} color={C.black} />
      <Box position={[0,0,-0.09]} scale={[width,0.045,0.035]} color={C.black} />
    </group>
  );
}

function Plant({ position, scale = 1 }) {
  return <group position={position} scale={scale}>
    <Cylinder position={[0,0.3,0]} args={[0.28,0.22,0.5,18]} color="#7e6958" />
    {[[-.18,.86,0],[.16,1,.05],[0,1.18,-.07],[.11,.76,.16]].map((p,i)=><mesh key={i} position={p} rotation={[0,0,i%2?.35:-.35]} castShadow><sphereGeometry args={[.28,14,10]} /><meshStandardMaterial color={C.green} roughness={.9} /></mesh>)}
  </group>;
}

function Recessed({ position }) {
  return <group position={position}><Cylinder position={[0,0,0]} args={[.08,.08,.03,18]} color="#fff8e8" /><pointLight position={[0,-.08,0]} intensity={7} distance={5} color="#ffe9c6" /></group>;
}

function FrontDoor() {
  return <group position={[0,0,7.92]}>
    <Box position={[0,1.35,0]} scale={[1.42,2.7,.18]} color={C.black} />
    <Box position={[0,1.35,-.11]} scale={[1.08,2.35,.07]} color={C.oakDark} />
    <Box position={[.42,1.28,-.17]} scale={[.045,.5,.045]} color={C.brass} metalness={.7} roughness={.25} />
  </group>;
}

function ExteriorShell() {
  return <group>
    <Box position={[0,-.15,1.5]} scale={[12,.28,13]} color="#8f8c86" />
    <Wall a={[-6,8]} b={[-.8,8]} color="#e5e0d7" />
    <Wall a={[-.8,8]} b={[.8,8]} y={4.0} height={1.2} color="#e5e0d7" />
    <Wall a={[-.8,8]} b={[-.8,8]} />
    <Wall a={[-6,8]} b={[-6,-5]} />
    <Wall a={[6,8]} b={[6,-5]} />
    <Wall a={[-6,-5]} b={[6,-5]} />
    <Wall a={[-6,8]} b={[-.85,8]} />
    <Wall a={[-.85,8]} b={[-.85,8]} />
    <Wall a={[-.85,8]} b={[-.85,8]} />
    <Wall a={[-6,8]} b={[-.9,8]} />
    <Wall a={[-6,8]} b={[-1.05,8]} />
    <Wall a={[1.05,8]} b={[6,8]} />
    <Box position={[0,4.65,1.5]} scale={[12,.18,13]} color="#e7e1d7" />
    <Box position={[-3,4.9,1.5]} scale={[6.2,.3,13.2]} rotation={[0,0,.02]} color={C.black} />
    <Box position={[3,4.72,1.5]} scale={[6.2,.3,13.2]} rotation={[0,0,-.02]} color={C.black} />
    <Window position={[-3,2.35,7.88]} width={2.4} height={1.75} />
    <Window position={[3.1,2.35,7.88]} width={2.5} height={1.65} />
    <FrontDoor />
    <Box position={[0,-.02,9.5]} scale={[3.2,.18,2.8]} color={C.concrete} />
    <Box position={[0,-.09,11.1]} scale={[2.2,.12,1.1]} color="#bbb6ae" />
    <Plant position={[-4.5,0,9.0]} scale={.9} />
    <Plant position={[4.5,0,9.0]} scale={.9} />
    {[-4.7,-2.9,2.9,4.7].map(x=><Box key={x} position={[x,-.16,10.8]} scale={[1.2,.22,1.2]} color="#66775b" />)}
    <pointLight position={[0,2.8,8.7]} intensity={15} distance={8} color="#ffdca8" />
  </group>;
}

function Sofa({ position, rotation=[0,0,0] }) {
  return <group position={position} rotation={rotation}>
    <Box position={[0,.5,0]} scale={[3.2,.7,1.35]} color={C.fabric} />
    <Box position={[0,1.0,.48]} scale={[3.2,.8,.3]} color="#c4baad" />
    <Box position={[-1.5,.72,0]} scale={[.3,.9,1.3]} color="#c4baad" />
    <Box position={[1.5,.72,0]} scale={[.3,.9,1.3]} color="#c4baad" />
    <Box position={[-.72,.85,-.05]} scale={[1.2,.18,.85]} color="#e0dbd2" />
    <Box position={[.72,.85,-.05]} scale={[1.2,.18,.85]} color="#ddd5ca" />
  </group>;
}

function GroundFloor() {
  return <group>
    <Box position={[0,-.02,1.5]} scale={[11.7,.12,12.7]} color={C.oak} />

    {/* foyer corridor walls with actual openings */}
    <DoorOpeningWall z={4.9} x1={-6} x2={6} doorCenter={0} doorWidth={2.1} />
    <DoorOpeningWall z={0.2} x1={-6} x2={6} doorCenter={0} doorWidth={2.5} />

    {/* living / kitchen split walls leave central circulation open */}
    <Wall a={[-.9,4.9]} b={[-.9,.2]} />
    <Wall a={[-6,.2]} b={[-6,-5]} />
    <Wall a={[6,.2]} b={[6,-5]} />

    {/* foyer */}
    <Box position={[-3.9,.65,5.7]} scale={[1.8,1.25,.5]} color={C.oakDark} />
    <Box position={[-3.9,1.35,5.68]} scale={[1.95,.08,.58]} color={C.stoneLight} />
    <Box position={[-3.9,2.45,5.62]} scale={[1.45,1.55,.05]} color="#9ba5a4" roughness={.2} />
    <Plant position={[-4.8,0,5.0]} scale={.65} />

    {/* living room on left */}
    <Sofa position={[-3.3,0,-1.4]} rotation={[0,.15,0]} />
    <Box position={[-3.3,.02,-1.4]} scale={[4.6,.03,2.4]} color="#c9bba8" />
    <Box position={[-1.2,.22,-1.0]} scale={[1.7,.22,.95]} color={C.stoneLight} />
    <Box position={[-3.5,1.5,-4.82]} scale={[2.8,1.7,.08]} color={C.black} />
    <Box position={[-3.5,.48,-4.72]} scale={[3.3,.55,.42]} color={C.oakDark} />
    <Box position={[-3.5,1.5,-4.87]} scale={[4.2,2.7,.04]} color="#d4cbc0" />
    <Window position={[-5.88,2.35,-1.8]} width={2.5} height={1.8} rotation={[0,Math.PI/2,0]} />
    <Plant position={[-5.1,0,-3.9]} scale={.7} />

    {/* kitchen on right */}
    <Box position={[3.65,.52,-4.42]} scale={[4.25,1.0,.7]} color="#efece5" />
    <Box position={[3.65,1.08,-4.35]} scale={[4.45,.12,.9]} color={C.stone} />
    {[2.05,2.85,3.65,4.45,5.25].map(x=><Box key={x} position={[x,2.55,-4.52]} scale={[.68,2.3,.55]} color="#d7cec0" />)}
    <Box position={[5.35,1.7,-4.45]} scale={[1.05,3.1,.56]} color={C.black} />
    <Box position={[2.25,1.45,-4.4]} scale={[1.0,1.7,.08]} color="#202020" />
    <Box position={[3.35,.62,-1.85]} scale={[3.2,1.08,1.25]} color="#e6e1d8" />
    <Box position={[3.35,1.23,-1.85]} scale={[3.45,.12,1.5]} color="#bab2a7" />
    {[[2.55,0,-.65],[3.35,0,-.65],[4.15,0,-.65]].map((p,i)=><group key={i} position={[p[0],0,-.65]}><Cylinder position={[0,.42,0]} args={[.04,.04,.82,12]} /><Box position={[0,.86,0]} scale={[.48,.12,.48]} color={C.oakDark} /></group>)}
    {[2.55,3.35,4.15].map(x=><group key={x} position={[x,3.85,-1.85]}><Cylinder position={[0,.25,0]} args={[.035,.035,.65,12]} color={C.brass} metalness={.65} /><mesh position={[0,-.1,0]}><sphereGeometry args={[.18,18,18]} /><meshStandardMaterial color="#f4d7a0" emissive="#f4c66d" emissiveIntensity={.5} /></mesh><pointLight position={[0,-.25,0]} intensity={6} distance={4} color="#ffe3b5" /></group>)}

    {/* bathroom hallway and room */}
    <DoorOpeningWall z={-5} x1={-6} x2={6} doorCenter={0.8} doorWidth={1.35} />
    <Wall a={[-2.2,-5]} b={[-2.2,-8.8]} />
    <Wall a={[2.8,-5]} b={[2.8,-8.8]} />
    <Wall a={[-2.2,-8.8]} b={[2.8,-8.8]} />
    <Box position={[.3,-.01,-6.9]} scale={[4.8,.12,3.7]} color={C.tile} />
    <Box position={[1.25,.62,-8.2]} scale={[2.1,1.0,.62]} color="#c1b092" />
    <Box position={[1.25,1.18,-8.13]} scale={[2.25,.11,.72]} color="#eeeae2" />
    <Box position={[1.25,2.25,-8.48]} scale={[1.95,1.5,.05]} color="#8fa0a2" roughness={.15} />
    <Box position={[-1.15,1.2,-7.55]} scale={[1.8,2.35,1.45]} color={C.glass} opacity={.35} transparent roughness={.08} />
    <Box position={[-1.15,.28,-5.85]} scale={[.7,.45,.9]} color="#f1eee9" />

    {/* stairwell descending to basement */}
    <Wall a={[3.5,-5]} b={[3.5,-10]} />
    {Array.from({length:10},(_,i)=><Box key={i} position={[4.55,-.1-.18*i,-5.5-.42*i]} scale={[1.8,.18,.42]} color={C.oakDark} />)}
    <Box position={[5.55,1.2,-7.5]} scale={[.06,2.5,4.5]} rotation={[0,0,-.36]} color={C.black} />

    {[-4,-1,2,5].flatMap((x,xi)=>[2.3,-1.5,-4.0].map((z,zi)=><Recessed key={`${xi}-${zi}`} position={[x,4.48,z]} />))}
  </group>;
}

function Basement() {
  return <group position={[0,-3.25,-11.5]}>
    <Box position={[0,-.1,0]} scale={[11.8,.18,8]} color="#69594d" />
    <Wall a={[-5.9,4]} b={[-5.9,-4]} y={2.1} height={4.3} color="#ded8ce" />
    <Wall a={[5.9,4]} b={[5.9,-4]} y={2.1} height={4.3} color="#ded8ce" />
    <Wall a={[-5.9,-4]} b={[5.9,-4]} y={2.1} height={4.3} color="#ded8ce" />
    <Box position={[0,4.28,0]} scale={[11.8,.16,8]} color="#e2dcd1" />
    <Sofa position={[-2.7,0,.6]} rotation={[0,-.05,0]} />
    <Box position={[-2.5,.02,.6]} scale={[4.8,.035,2.5]} color="#b7a994" />
    <Box position={[2.5,1.55,-3.87]} scale={[3.2,1.8,.08]} color={C.black} />
    <Box position={[2.5,.5,-3.72]} scale={[3.6,.65,.55]} color={C.oakDark} />
    <Box position={[-4.7,.95,-3.65]} scale={[1.9,2.0,.35]} color="#714c37" />
    <Box position={[3.9,.56,2.1]} scale={[2.8,1.0,.72]} color="#e7e2da" />
    <Box position={[3.9,1.12,2.1]} scale={[3.0,.11,.9]} color={C.stone} />
    {[3.2,4.0,4.8].map(x=><Cylinder key={x} position={[x,1.72,1.85]} args={[.04,.04,.5,14]} color={C.brass} metalness={.65} />)}
    <Plant position={[-5.0,0,2.9]} scale={.7} />
    {[[-3,4.05,2],[0,4.05,2],[3,4.05,2],[-3,4.05,-2],[0,4.05,-2],[3,4.05,-2]].map((p,i)=><Recessed key={i} position={p} />)}
  </group>;
}

const keyframes = [
  { p:[0,2.4,18.5], t:[0,1.8,8] },
  { p:[0,2.0,12.2], t:[0,1.6,8] },
  { p:[0,1.75,6.2], t:[0,1.5,3.8] },
  { p:[-2.5,1.7,.4], t:[-3.5,1.3,-2.7] },
  { p:[2.3,1.7,-.6], t:[3.5,1.4,-2.5] },
  { p:[.8,1.65,-4.8], t:[.5,1.25,-7.0] },
  { p:[4.3,.7,-8.4], t:[4.4,-1.6,-11.2] },
  { p:[0,-1.5,-13.8], t:[0,-1.6,-11.8] }
];

function CameraRig({progress}) {
  const { camera } = useThree();
  const target = useMemo(()=>new THREE.Vector3(),[]);
  useFrame(()=>{
    const scaled = THREE.MathUtils.clamp(progress,0,.999)*(keyframes.length-1);
    const i = Math.floor(scaled);
    const f = scaled-i;
    const a = keyframes[i];
    const b = keyframes[Math.min(i+1,keyframes.length-1)];
    const pos = new THREE.Vector3(...a.p).lerp(new THREE.Vector3(...b.p),f);
    const look = new THREE.Vector3(...a.t).lerp(new THREE.Vector3(...b.t),f);
    camera.position.lerp(pos,.08);
    target.lerp(look,.08);
    camera.lookAt(target);
  });
  return null;
}

function Scene() {
  return <>
    <ambientLight intensity={.8} />
    <hemisphereLight intensity={1.1} color="#fff7ea" groundColor="#6d7a77" />
    <directionalLight position={[7,12,10]} intensity={2.3} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
    <pointLight position={[0,3,-3]} intensity={18} distance={18} color="#fff0d4" />
    <ExteriorShell />
    <GroundFloor />
    <Basement />
    <Environment preset="apartment" />
  </>;
}

export default function ArchitecturalHouseScene({progress}) {
  return <div className="canvas-shell" aria-hidden="true">
    <Canvas shadows dpr={[1,1.5]} camera={{position:[0,2.4,18.5],fov:48,near:.1,far:120}} gl={{antialias:true,alpha:false,toneMapping:THREE.ACESFilmicToneMapping}}>
      <color attach="background" args={['#aeb9ba']} />
      <fog attach="fog" args={['#aeb9ba',24,48]} />
      <Scene />
      <CameraRig progress={progress} />
    </Canvas>
  </div>;
}
