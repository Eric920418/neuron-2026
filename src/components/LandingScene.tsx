import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

function PulseLine({ target, currentProgress }: { target: THREE.Vector3, currentProgress: React.MutableRefObject<number> }) {
  const lineRef = useRef<any>(null);
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), target], [target]);

  useFrame(() => {
    const progress = currentProgress.current;
    const phaseBProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
    const phaseCProgress = Math.max(0, Math.min(1, (progress - 0.8) / 0.2));

    if (lineRef.current) {
      const material = lineRef.current.material;
      material.opacity = phaseBProgress * (1 - phaseCProgress);
      material.dashOffset -= 0.02;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color="#00FFCC"
      lineWidth={1.5}
      transparent
      opacity={0}
      dashed
      dashScale={10}
      dashSize={2}
      dashOffset={0}
    />
  );
}

function Scene({ phase }: { phase: string }) {
  const surroundingNodesRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  const targetProgress = (phase === 'narrative' || phase === 'input') ? 0 : (phase === 'network' ? 0.8 : 1);
  const currentProgress = useRef(0);
  const _startPos = useRef(new THREE.Vector3());

  const nodesData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      data.push(new THREE.Vector3(x, y, z));
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    currentProgress.current = THREE.MathUtils.lerp(currentProgress.current, targetProgress, delta * 2);
    const progress = currentProgress.current;
    const time = state.clock.elapsedTime;

    const phase0Progress = Math.max(0, Math.min(1, progress / 0.2));
    const phaseAProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.3));
    const phaseBProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
    const phaseCProgress = Math.max(0, Math.min(1, (progress - 0.8) / 0.2));

    if (groupRef.current) {
      const scale = 1 - phaseCProgress * 0.5;
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.position.z = -phaseCProgress * 5;
    }

    if (surroundingNodesRef.current) {
      surroundingNodesRef.current.children.forEach((child, i) => {
        const targetPos = nodesData[i];
        const startPos = _startPos.current.copy(targetPos).multiplyScalar(2);
        child.position.lerpVectors(startPos, targetPos, phaseAProgress);

        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.opacity = phaseAProgress * 0.6 * (1 - phaseCProgress);
        material.transparent = true;

        if (progress > 0.5) {
          const highlightProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
          material.color.setHex(0x00FFCC);
          material.emissive.setHex(0x00FFCC);
          material.emissiveIntensity = highlightProgress * 0.5;
        } else {
          material.color.setHex(0x333333);
          material.emissiveIntensity = 0;
        }
      });
      surroundingNodesRef.current.rotation.y = time * 0.05;
    }

    if (linesRef.current) {
      linesRef.current.rotation.y = time * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />

      <group ref={surroundingNodesRef}>
        {nodesData.map((pos, i) => (
          <Sphere key={i} args={[0.15, 8, 8]} position={pos}>
            <meshStandardMaterial color="#333333" />
          </Sphere>
        ))}
      </group>

      <group ref={linesRef}>
        {nodesData.map((pos, i) => (
          <PulseLine key={i} target={pos} currentProgress={currentProgress} />
        ))}
      </group>
    </group>
  );
}

export default function LandingScene({ phase }: { phase: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <Scene phase={phase} />
    </Canvas>
  );
}
