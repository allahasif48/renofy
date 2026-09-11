import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = 'https://raw.githubusercontent.com/MuhammadMuzamil-dev/threejs-architectural-walkthrough/main/Main%20Project/models/house.glb';

// A walking route, not room-to-room jumps. Each turn is broken into an
// approach -> doorway -> threshold -> room sequence so the camera does not
// cut diagonally through walls.
const WALK_PATH = [
  { p: [0, 1.72, 16.0], t: [0, 1.62, 10.5] },
  { p: [0, 1.70, 13.3], t: [0, 1.60, 9.0] },
  { p: [0, 1.68, 11.2], t: [0, 1.58, 7.0] },
  { p: [0, 1.66, 9.4], t: [0, 1.55, 5.7] },
  { p: [0, 1.65, 8.15], t: [0, 1.52, 4.6] },
  { p: [0, 1.64, 6.9], t: [0, 1.50, 3.4] },
  { p: [0, 1.63, 5.2], t: [-1.2, 1.45, 2.5] },
  { p: [-0.9, 1.62, 4.2], t: [-2.5, 1.42, 2.1] },
  { p: [-1.8, 1.62, 3.5], t: [-3.2, 1.40, 1.2] },
  { p: [-2.7, 1.62, 2.5], t: [-2.6, 1.35, -0.5] },
  { p: [-2.3, 1.62, 1.0], t: [-0.6, 1.38, -1.1] },
  { p: [-1.1, 1.61, 0.2], t: [0.6, 1.36, -1.8] },
  { p: [0.3, 1.60, -0.6], t: [1.9, 1.35, -2.4] },
  { p: [1.5, 1.60, -1.6], t: [2.5, 1.32, -3.8] },
  { p: [2.1, 1.60, -3.0], t: [1.0, 1.28, -4.8] },
  { p: [1.4, 1.59, -4.2], t: [0.2, 1.26, -5.8] },
  { p: [0.5, 1.58, -5.3], t: [-0.1, 1.22, -7.0] },
  { p: [0.0, 1.57, -6.6], t: [0.0, 1.18, -8.2] },
  { p: [-0.2, 1.55, -7.7], t: [0.0, 1.12, -9.4] },
  { p: [0.0, 1.52, -8.7], t: [0.0, 0.95, -10.2] }
];

function LoadingModel() {
  return (
    <Html center>
      <div style={{
        padding: '10px 14px', borderRadius: 999,
        background: 'rgba(0,0,0,.64)', border: '1px solid rgba(255,255,255,.16)',
        color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: 12,
        letterSpacing: '.08em', textTransform: 'uppercase', whiteSpace: 'nowrap'
      }}>
        Loading real 3D house
      </div>
    </Html>
  );
}

function RealHouseModel({ onReady }) {
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
          if ('envMapIntensity' in material) material.envMapIntensity = 1.05;
          if ('roughness' in material && material.roughness < 0.18) material.roughness = 0.18;
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

    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -floorY * scale, -center.z * scale);
    clone.updateMatrixWorld(true);

    return clone;
  }, [scene]);

  useEffect(() => {
    onReady?.(prepared);
  }, [prepared, onReady]);

  return <primitive object={prepared} />;
}

function CameraRig({ progress, collisionRoot }) {
  const { camera } = useThree();
  const currentPosition = useMemo(() => new THREE.Vector3(...WALK_PATH[0].p), []);
  const currentTarget = useMemo(() => new THREE.Vector3(...WALK_PATH[0].t), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const candidate = useMemo(() => new THREE.Vector3(), []);
  const travel = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const targetA = useMemo(() => new THREE.Vector3(), []);
  const targetB = useMemo(() => new THREE.Vector3(), []);
  const posA = useMemo(() => new THREE.Vector3(), []);
  const posB = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.position.copy(currentPosition);
    camera.lookAt(currentTarget);
  }, [camera, currentPosition, currentTarget]);

  useFrame((_, delta) => {
    const maxIndex = WALK_PATH.length - 1;
    const scaled = THREE.MathUtils.clamp(progress, 0, 0.99999) * maxIndex;
    const index = Math.floor(scaled);
    const nextIndex = Math.min(index + 1, maxIndex);
    const local = scaled - index;
    const mix = local * local * (3 - 2 * local);

    posA.set(...WALK_PATH[index].p);
    posB.set(...WALK_PATH[nextIndex].p);
    targetA.set(...WALK_PATH[index].t);
    targetB.set(...WALK_PATH[nextIndex].t);

    desiredPosition.copy(posA).lerp(posB, mix);
    desiredTarget.copy(targetA).lerp(targetB, mix);

    const damping = 1 - Math.exp(-delta * 4.0);
    candidate.copy(currentPosition).lerp(desiredPosition, damping);

    if (collisionRoot) {
      travel.copy(candidate).sub(currentPosition);
      const distance = travel.length();
      if (distance > 0.0001) {
        raycaster.set(currentPosition, travel.normalize());
        raycaster.near = 0.02;
        raycaster.far = distance + 0.18;
        const hits = raycaster.intersectObject(collisionRoot, true);
        const blockingHit = hits.find((hit) => hit.distance > 0.10 && hit.distance < distance + 0.12);
        if (blockingHit) {
          const safeDistance = Math.max(0, blockingHit.distance - 0.28);
          candidate.copy(currentPosition).addScaledVector(travel, safeDistance);
        }
      }
    }

    currentPosition.copy(candidate);
    currentTarget.lerp(desiredTarget, 1 - Math.exp(-delta * 3.5));
    camera.position.copy(currentPosition);
    camera.lookAt(currentTarget);
  });

  return null;
}

function Scene({ progress }) {
  const [collisionRoot, setCollisionRoot] = useState(null);

  return (
    <>
      <color attach="background" args={['#c9d2d4']} />
      <fog attach="fog" args={['#c9d2d4', 26, 58]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#dce8f0', '#766f65', 0.95]} />
      <directionalLight
        position={[12, 18, 10]}
        intensity={2.15}
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
        <RealHouseModel onReady={setCollisionRoot} />
        <Environment preset="apartment" environmentIntensity={0.72} />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial color="#787d72" roughness={0.96} />
      </mesh>

      <CameraRig progress={progress} collisionRoot={collisionRoot} />
    </>
  );
}

export default function RealHouseScene({ progress }) {
  return (
    <div className="canvas-shell">
      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: WALK_PATH[0].p, fov: 52, near: 0.08, far: 120 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.96;
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
