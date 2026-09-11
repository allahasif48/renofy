import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = 'https://raw.githubusercontent.com/MuhammadMuzamil-dev/threejs-architectural-walkthrough/main/Main%20Project/models/house.glb';

// Deliberate architectural walkthrough. Positions are kept at human eye height
// and doorway transitions are explicitly separated from room showcase moments.
const SHOTS = [
  { p:[0,1.66,17.5], t:[0,1.55,9.0], hold:.9, fov:40 },
  { p:[0,1.65,13.6], t:[0,1.52,8.0], hold:.25, fov:41 },
  { p:[0,1.64,10.7], t:[0,1.50,6.7], hold:.25, fov:42 },
  { p:[0,1.63,8.55], t:[0,1.48,5.3], hold:.10, fov:43 },
  { p:[0,1.63,7.30], t:[0,1.47,4.3], hold:.05, fov:44 },
  { p:[0,1.62,5.85], t:[-0.6,1.43,3.2], hold:.45, fov:43 },
  { p:[-0.55,1.62,4.65], t:[-2.1,1.40,2.6], hold:.08, fov:43 },
  { p:[-1.55,1.62,3.75], t:[-3.0,1.38,1.8], hold:.05, fov:44 },
  { p:[-2.65,1.61,2.45], t:[-2.7,1.28,-0.25], hold:.75, fov:39 },
  { p:[-2.25,1.61,1.15], t:[-0.7,1.34,-1.1], hold:.10, fov:43 },
  { p:[-1.05,1.61,0.20], t:[0.55,1.34,-1.75], hold:.05, fov:44 },
  { p:[0.20,1.60,-0.65], t:[1.75,1.31,-2.35], hold:.05, fov:44 },
  { p:[1.45,1.60,-1.70], t:[2.35,1.26,-3.65], hold:.15, fov:43 },
  { p:[2.05,1.59,-3.05], t:[1.10,1.20,-4.95], hold:.70, fov:38 },
  { p:[1.35,1.59,-4.20], t:[0.15,1.20,-5.90], hold:.12, fov:42 },
  { p:[0.48,1.58,-5.30], t:[-0.08,1.16,-7.00], hold:.05, fov:43 },
  { p:[0.02,1.57,-6.55], t:[0.00,1.12,-8.15], hold:.10, fov:43 },
  { p:[-0.15,1.56,-7.65], t:[0.00,1.05,-9.25], hold:.55, fov:39 },
  { p:[0.00,1.55,-8.55], t:[0.00,1.00,-10.05], hold:.9, fov:38 }
];

function LoadingModel(){
  return <Html center><div className="model-loader">Preparing the residence</div></Html>;
}

function RealHouseModel({ onReady }){
  const { scene } = useGLTF(MODEL_URL);
  const prepared = useMemo(()=>{
    const clone = scene.clone(true);
    clone.traverse((child)=>{
      if(!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.filter(Boolean).forEach((m)=>{
        if('envMapIntensity' in m) m.envMapIntensity = 1.25;
        if('roughness' in m) m.roughness = THREE.MathUtils.clamp(m.roughness ?? .65,.22,.92);
        if('metalness' in m) m.metalness = THREE.MathUtils.clamp(m.metalness ?? 0,0,.72);
        m.needsUpdate = true;
      });
    });
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size); box.getCenter(center);
    const scale = 17 / Math.max(size.x,size.z,1);
    clone.scale.setScalar(scale);
    clone.position.set(-center.x*scale,-box.min.y*scale,-center.z*scale);
    clone.updateMatrixWorld(true);
    return clone;
  },[scene]);
  useEffect(()=>onReady?.(prepared),[prepared,onReady]);
  return <primitive object={prepared}/>;
}

function buildTimeline(){
  const weights = SHOTS.slice(0,-1).map((s)=>1+s.hold*2.4);
  const total = weights.reduce((a,b)=>a+b,0);
  let acc=0;
  return weights.map((w,i)=>{const start=acc/total; acc+=w; return {i,start,end:acc/total};});
}
const TIMELINE = buildTimeline();

function cinematicEase(t){
  t = THREE.MathUtils.clamp(t,0,1);
  return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
}

function CameraRig({progress,collisionRoot}){
  const {camera} = useThree();
  const currentP = useMemo(()=>new THREE.Vector3(...SHOTS[0].p),[]);
  const currentT = useMemo(()=>new THREE.Vector3(...SHOTS[0].t),[]);
  const desiredP = useMemo(()=>new THREE.Vector3(),[]);
  const desiredT = useMemo(()=>new THREE.Vector3(),[]);
  const a = useMemo(()=>new THREE.Vector3(),[]), b=useMemo(()=>new THREE.Vector3(),[]);
  const ta=useMemo(()=>new THREE.Vector3(),[]), tb=useMemo(()=>new THREE.Vector3(),[]);
  const candidate=useMemo(()=>new THREE.Vector3(),[]), travel=useMemo(()=>new THREE.Vector3(),[]);
  const ray=useMemo(()=>new THREE.Raycaster(),[]);

  useEffect(()=>{camera.position.copy(currentP);camera.lookAt(currentT);},[camera,currentP,currentT]);

  useFrame((state,delta)=>{
    const p=THREE.MathUtils.clamp(progress,0,.999999);
    let seg=TIMELINE[TIMELINE.length-1];
    for(const s of TIMELINE){ if(p>=s.start && p<s.end){seg=s;break;} }
    const local=(p-seg.start)/(seg.end-seg.start || 1);
    const hold=SHOTS[seg.i].hold;
    const holdPart=Math.min(.34, hold*.22);
    const moveStart=holdPart*.5;
    const moveEnd=1-holdPart;
    const moveT=cinematicEase(THREE.MathUtils.clamp((local-moveStart)/(moveEnd-moveStart),0,1));

    a.set(...SHOTS[seg.i].p); b.set(...SHOTS[seg.i+1].p);
    ta.set(...SHOTS[seg.i].t); tb.set(...SHOTS[seg.i+1].t);
    desiredP.copy(a).lerp(b,moveT);
    desiredT.copy(ta).lerp(tb,cinematicEase(moveT));

    const damping=1-Math.exp(-delta*3.1);
    candidate.copy(currentP).lerp(desiredP,damping);

    if(collisionRoot){
      travel.copy(candidate).sub(currentP);
      const distance=travel.length();
      if(distance>.0001){
        ray.set(currentP,travel.normalize()); ray.near=.04; ray.far=distance+.20;
        const hit=ray.intersectObject(collisionRoot,true).find(h=>h.distance>.12 && h.distance<distance+.14);
        if(hit) candidate.copy(currentP).addScaledVector(travel,Math.max(0,hit.distance-.24));
      }
    }

    currentP.copy(candidate);
    currentT.lerp(desiredT,1-Math.exp(-delta*2.8));
    camera.position.copy(currentP);
    camera.lookAt(currentT);

    const targetFov=THREE.MathUtils.lerp(SHOTS[seg.i].fov,SHOTS[seg.i+1].fov,moveT);
    camera.fov=THREE.MathUtils.damp(camera.fov,targetFov,3.2,delta);
    camera.updateProjectionMatrix();

    // restrained handheld drift: millimetres, not game-style head bob
    const breathe=Math.sin(state.clock.elapsedTime*.58)*.006;
    camera.position.y += breathe;
  });
  return null;
}

function Scene({progress}){
  const [root,setRoot]=useState(null);
  return <>
    <color attach="background" args={['#d8d7d2']}/>
    <fog attach="fog" args={['#d8d7d2',30,68]}/>
    <ambientLight intensity={.16}/>
    <hemisphereLight args={['#e8edf0','#81796e',.78]}/>
    <directionalLight position={[10,18,7]} intensity={3.0} color="#fff2dc" castShadow
      shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-near={.5} shadow-camera-far={65}
      shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={20} shadow-camera-bottom={-20}/>
    <rectAreaLight position={[-3.5,4.8,4]} rotation={[-Math.PI/2,0,.35]} width={5} height={3} intensity={5.5} color="#fff7eb"/>
    <rectAreaLight position={[3,3.4,-3]} rotation={[0,Math.PI,.1]} width={3} height={2} intensity={3.0} color="#ffe5c1"/>

    <Suspense fallback={<LoadingModel/>}>
      <RealHouseModel onReady={setRoot}/>
      <Environment preset="city" environmentIntensity={.62}/>
    </Suspense>

    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.025,0]} receiveShadow>
      <planeGeometry args={[90,90]}/><meshStandardMaterial color="#8b8c84" roughness={1}/>
    </mesh>
    <ContactShadows position={[0,.01,0]} opacity={.32} scale={34} blur={2.5} far={14}/>
    <CameraRig progress={progress} collisionRoot={root}/>
  </>;
}

export default function RealHouseScene({progress}){
  return <div className="canvas-shell"><Canvas shadows dpr={[1,1.75]}
    camera={{position:SHOTS[0].p,fov:40,near:.06,far:140}}
    gl={{antialias:true,alpha:false,powerPreference:'high-performance'}}
    onCreated={({gl})=>{
      gl.outputColorSpace=THREE.SRGBColorSpace;
      gl.toneMapping=THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure=1.06;
      gl.shadowMap.enabled=true;
      gl.shadowMap.type=THREE.PCFSoftShadowMap;
    }}><Scene progress={progress}/></Canvas></div>;
}

useGLTF.preload(MODEL_URL);
