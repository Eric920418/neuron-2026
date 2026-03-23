import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointMaterial, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function NeuralBackground({ specialty }: { specialty: string }) {
  const groupRef = useRef<any>(null);
  const geometryRef = useRef<any>(null);
  const linesGeometryRef = useRef<any>(null);
  const textGroupRef = useRef<any>(null);
  const textDivRef = useRef<HTMLDivElement>(null);

  const count = 3000;
  const maxLines = 300;
  const { originalPositions, velocities, linePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const lines = new Float32Array(maxLines * 6);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 2.5;
      const sinPhi = Math.sin(phi);
      pos[i * 3] = r * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return { originalPositions: Float32Array.from(pos), velocities: vel, linePositions: lines };
  }, []);

  const [positions] = useState(() => new Float32Array(originalPositions));

  useFrame((state, delta) => {
    if (!geometryRef.current || !groupRef.current) return;

    groupRef.current.rotation.x -= delta / 10;
    groupRef.current.rotation.y -= delta / 15;

    const mousePos = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
    mousePos.unproject(state.camera);
    const dir = mousePos.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z;
    const worldMouse = state.camera.position.clone().add(dir.multiplyScalar(distance));

    const localMouse = worldMouse.clone();
    groupRef.current.worldToLocal(localMouse);

    if (textGroupRef.current) {
      textGroupRef.current.position.lerp(worldMouse, 0.2);
    }

    let isColliding = false;
    const posArray = geometryRef.current.attributes.position.array;
    const interactionRadius = 1.5;
    const interactionRadiusSq = interactionRadius * interactionRadius;
    const lineRadiusSq = (interactionRadius * 1.5) * (interactionRadius * 1.5);
    
    let lineCount = 0;
    const nearbyParticles = [];

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const px = posArray[ix], py = posArray[iy], pz = posArray[iz];
      const ox = originalPositions[ix], oy = originalPositions[iy], oz = originalPositions[iz];

      const dx = px - localMouse.x;
      const dy = py - localMouse.y;
      const dz = pz - localMouse.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < lineRadiusSq) {
        nearbyParticles.push({ index: i, px, py, pz, distSq });
      }

      if (distSq < interactionRadiusSq) {
        isColliding = true;
        const dist = Math.sqrt(distSq) || 0.01;
        const force = (interactionRadius - dist) * 0.05;
        velocities[ix] += (dx / dist) * force;
        velocities[iy] += (dy / dist) * force;
        velocities[iz] += (dz / dist) * force;
      }

      velocities[ix] += (ox - px) * 0.04;
      velocities[iy] += (oy - py) * 0.04;
      velocities[iz] += (oz - pz) * 0.04;

      velocities[ix] *= 0.85;
      velocities[iy] *= 0.85;
      velocities[iz] *= 0.85;

      posArray[ix] += velocities[ix];
      posArray[iy] += velocities[iy];
      posArray[iz] += velocities[iz];
    }

    geometryRef.current.attributes.position.needsUpdate = true;

    for (let i = 0; i < nearbyParticles.length && lineCount < maxLines; i++) {
      const p = nearbyParticles[i];
      if (p.distSq < interactionRadiusSq) {
        linePositions[lineCount * 6] = localMouse.x;
        linePositions[lineCount * 6 + 1] = localMouse.y;
        linePositions[lineCount * 6 + 2] = localMouse.z;
        linePositions[lineCount * 6 + 3] = p.px;
        linePositions[lineCount * 6 + 4] = p.py;
        linePositions[lineCount * 6 + 5] = p.pz;
        lineCount++;
      }
    }

    for (let i = 0; i < nearbyParticles.length; i++) {
      for (let j = i + 1; j < nearbyParticles.length && lineCount < maxLines; j++) {
        const p1 = nearbyParticles[i];
        const p2 = nearbyParticles[j];
        const dx = p1.px - p2.px;
        const dy = p1.py - p2.py;
        const dz = p1.pz - p2.pz;
        if (dx * dx + dy * dy + dz * dz < 0.6) {
          linePositions[lineCount * 6] = p1.px;
          linePositions[lineCount * 6 + 1] = p1.py;
          linePositions[lineCount * 6 + 2] = p1.pz;
          linePositions[lineCount * 6 + 3] = p2.px;
          linePositions[lineCount * 6 + 4] = p2.py;
          linePositions[lineCount * 6 + 5] = p2.pz;
          lineCount++;
        }
      }
    }

    if (linesGeometryRef.current) {
      linesGeometryRef.current.setDrawRange(0, lineCount * 2);
      linesGeometryRef.current.attributes.position.needsUpdate = true;
    }

    if (textDivRef.current) {
      textDivRef.current.style.opacity = isColliding ? '1' : '0';
      textDivRef.current.style.transform = isColliding ? 'translate3d(-50%, -50%, 0) scale(1)' : 'translate3d(-50%, -50%, 0) scale(0.8)';
    }
  });

  return (
    <>
      <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
        <points>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={count}
              array={positions}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
          </bufferGeometry>
          <PointMaterial transparent opacity={0.4} color="#00FFCC" size={0.015} sizeAttenuation={true} depthWrite={false} />
        </points>
        <lineSegments>
          <bufferGeometry ref={linesGeometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={maxLines * 2}
              array={linePositions}
              itemSize={3}
              usage={THREE.DynamicDrawUsage}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00FFCC" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
        </lineSegments>
      </group>
      {/* <group ref={textGroupRef}>
        <Html center style={{ pointerEvents: 'none' }}>
          <div 
            ref={textDivRef}
            className="text-[var(--color-neon)] font-bold tracking-widest whitespace-nowrap bg-black/60 px-6 py-3 rounded-full border border-[var(--color-neon)] backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(0,255,204,0.3)]"
            style={{ opacity: 0, transform: 'translate3d(-50%, -50%, 0) scale(0.8)' }}
          >
            {specialty || '跨域整合'}
          </div>
        </Html>
      </group> */}
    </>
  );
}
