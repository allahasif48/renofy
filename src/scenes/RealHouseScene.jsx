import { Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = 'https://raw.githubusercontent.com/MuhammadMuzamil-dev/threejs-architectural-walkthrough/main/Main%20Project/models/house.glb';

const keyframes = [
  { p: [0, 2.15, 16], t: [0, 1.8, 5.5] },
  { p: [0, 1.75, 11.2], t: [0, 1.6, 4.0] },
  { p: [0, 1.68, 6.8], t: [0, 1.55, 1.5] },
  { p: [-2.6, 1.65, 2.8], t: [-1.4, 1.45, -1.4] },
  { p: [2.1, 1.62, 0.5], t: [1.0, 1.35, -3.2] },
  { p: [1.1, 1.58, -3.5], t: [0.1, 1.25, -6.3] },
  { p: [-0.8, 1.50, -7.0], t: [0.0, 1.15, -9.0] },
  { p: [0, 2.4, 14.0], t: [0, 2.0, 0] }
];

function LoadingModel() {
  return (
    <Html center>
      <div style={{
        padding: '10px 14px',
        borderRadius: 999,
        background: 'rgba(0,0,0,.64)',
        border: '1px solid rgba(255,255,255,.16)',
        color: '#fff',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 12,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}>
        Loading real 3D house
      </div>
    </Html>
  );
}

function RealHouseModel() {
  const { scene } = useGLTF(MODEL_URL);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if ('envMapIntensity' in material) material.envMapIntensity = 0.9;
          if ('roughness' in material && material.roughness < 0.16) material.roughness = 0.16;
          material.needsUpdate = true;
        });
      }
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const footprint = Math.max(size.x, size.z, 1);
    const scale = 17 / footprint;
    const floorY = box.min.y;

    return {
      object: clone,
      scale,
      position: [
        -center.x * scale,
        -floorY * scale,
        -center.z * scale
      ]
    };
  }, [scene]);

  return (
    <primitive
      object={prepared.object}
      scale={prepared.scale}
      position={prepared.position}
    />
  );
}

function CameraRig({ progress }) {
  const { camera } = useThree();
  const currentPosition = useMemo(() => new THREE.Vector3(), []);
  const currentTarget = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    currentPosition.set(...keyframes[0].p);
    currentTarget.set(...keyframes[0].t);
    camera.position.copy(currentPosition);
    camera.lookAt(currentTarget);
  }, [camera, currentPosition, currentTarget]);

  useFrame((_, delta) => {
    const maxIndex = keyframes.length - 1;
    const scaled = THREE.MathUtils.clamp(progress, 0, 0.9999) * maxIndex;
    const index = Math.floor(scaled);
    const nextIndex = Math.min(index + 1, maxIndex);
    const mix = THREE.MathUtils.smoothstep(scaled - index, 0, 1);

    desiredPosition
      .set(...keyframes[index].p)
      .lerp(new THREE.Vector3(...keyframes[nextIndex].p), mix);
    desiredTarget
      .set(...keyframes[index].t)
      .lerp(new THREE.Vector3(...keyframes[nextIndex].t), mix);

    const damping = 1 - Math.exp(-delta * 3.2);
    currentPosition.lerp(desiredPosition, damping);
    currentTarget.lerp(desiredTarget, damping);

    camera.position.copy(currentPosition);
    camera.lookAt(currentTarget);
  });

  return null;
}

function Scene({ progress }) {
  return (
    <>
      <color attach="background" args={['#c9d2d4']} />
      <fog attach="fog" args={['#c9d2d4', 24, 54]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#dce8f0', '#766f65', 1.15]} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={2.4}
        color="#fff4df"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />

      <Suspense fallback={<LoadingModel />}>
        <RealHouseModel />
        <Environment preset="apartment" environmentIntensity={0.8} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#787d72" roughness={0.96} />
      </mesh>

      <CameraRig progress={progress} />
    </>
  );
}

export default function RealHouseScene({ progress }) {
  return (
    <div className="canvas-shell">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: keyframes[0].p, fov: 46, near: 0.1, far: 120 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Scene progress={progress} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
