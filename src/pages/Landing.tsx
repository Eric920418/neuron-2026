import { useState, useRef, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Line } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const InteractiveNetwork = lazy(() => import('../components/InteractiveNetwork'));

type NarrativeItem = { type: 'line'; text: string } | { type: 'divider' };

const NARRATIVE_SEQUENCE: NarrativeItem[] = [
  { type: 'line', text: '一開始，我們都是各自閃爍的點。' },
  { type: 'line', text: '在不同的時間，做著不同的事，走著不同的路。' },
  { type: 'divider' },
  { type: 'line', text: '有時候會覺得，' },
  { type: 'line', text: '好像沒有人真的注意到自己。' },
  { type: 'divider' },
  { type: 'line', text: '但其實，' },
  { type: 'line', text: '也許只是還沒連在一起而已。' },
  { type: 'divider' },
  { type: 'line', text: '當不同的人湊在一起，' },
  { type: 'line', text: '很多東西就會慢慢變得有意義。' },
  { type: 'divider' },
  { type: 'line', text: '那你呢？' },
  { type: 'line', text: '你能告訴我，你擅長做什麼嗎？' },
];

function PulseLine({ target, currentProgress }: { target: THREE.Vector3, currentProgress: React.MutableRefObject<number> }) {
  const lineRef = useRef<any>(null);
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), target], [target]);

  useFrame(() => {
    const progress = currentProgress.current;
    // Phase B: 0.5 to 0.8
    const phaseBProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
    // Phase C: 0.8 to 1.0 (fade out)
    const phaseCProgress = Math.max(0, Math.min(1, (progress - 0.8) / 0.2));
    
    if (lineRef.current) {
      const material = lineRef.current.material;
      material.opacity = phaseBProgress * (1 - phaseCProgress);
      material.dashOffset -= 0.02; // Pulse effect
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
  const centralNodeRef = useRef<any>(null);
  const surroundingNodesRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);

  const targetProgress = (phase === 'narrative' || phase === 'input') ? 0 : (phase === 'network' ? 0.8 : 1);
  const currentProgress = useRef(0);

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

    // Phase 0: 0.0 to 0.2 (Fade in central node)
    const phase0Progress = Math.max(0, Math.min(1, progress / 0.2));
    // Phase A: 0.2 to 0.5 (Fade in surrounding nodes)
    const phaseAProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.3));
    // Phase B: 0.5 to 0.8 (Fade in lines)
    const phaseBProgress = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
    // Phase C: 0.8 to 1.0 (Zoom out and fade all)
    const phaseCProgress = Math.max(0, Math.min(1, (progress - 0.8) / 0.2));

    if (groupRef.current) {
      // Zoom out effect in Phase C
      const scale = 1 - phaseCProgress * 0.5;
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.position.z = -phaseCProgress * 5;
    }

    if (centralNodeRef.current) {
      centralNodeRef.current.rotation.x = time * 0.2;
      centralNodeRef.current.rotation.y = time * 0.3;
      
      const pulse = progress > 0.4 ? Math.sin(time * 5) * 0.1 : Math.sin(time * 2) * 0.05;
      const scale = (1 + pulse + (progress > 0.4 ? 0.2 : 0)) * phase0Progress;
      centralNodeRef.current.scale.set(scale, scale, scale);

      // Fade in Phase 0, Fade out in Phase C
      const material = centralNodeRef.current.material;
      material.opacity = phase0Progress * (1 - phaseCProgress);
      material.transparent = true;
    }

    if (surroundingNodesRef.current) {
      surroundingNodesRef.current.children.forEach((child, i) => {
        const targetPos = nodesData[i];
        const startPos = targetPos.clone().multiplyScalar(2);
        child.position.lerpVectors(startPos, targetPos, phaseAProgress);
        
        const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.opacity = phaseAProgress * 0.6 * (1 - phaseCProgress);
        material.transparent = true;
        
        // Highlight nodes when connected (Phase B)
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
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sphere ref={centralNodeRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#00FFCC"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={5}
        />
      </Sphere>

      <group ref={surroundingNodesRef}>
        {nodesData.map((pos, i) => (
          <Sphere key={i} args={[0.15, 16, 16]} position={pos}>
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

export default function Landing() {
  const [phase, setPhase] = useState<'narrative' | 'input' | 'network' | 'title'>('narrative');
  const [specialty, setSpecialty] = useState('');
  const [revealedCount, setRevealedCount] = useState(0);
  const revealedCountRef = useRef(0);
  const cooldownRef = useRef(false);
  const navigate = useNavigate();

  const revealNext = useCallback(() => {
    setRevealedCount(prev => {
      const next = Math.min(prev + 1, NARRATIVE_SEQUENCE.length);
      revealedCountRef.current = next;
      return next;
    });
  }, []);

  // 進入頁面 1.2 秒後自動顯示第一行
  useEffect(() => {
    if (phase === 'narrative' && revealedCount === 0) {
      const timer = setTimeout(() => revealNext(), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase, revealedCount, revealNext]);

  // Wheel 事件控制敘事推進
  useEffect(() => {
    if (phase !== 'narrative') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cooldownRef.current || e.deltaY <= 0) return;

      if (revealedCountRef.current >= NARRATIVE_SEQUENCE.length) {
        setPhase('input');
        return;
      }

      cooldownRef.current = true;
      revealNext();
      setTimeout(() => { cooldownRef.current = false; }, 600);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [phase, revealNext]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && specialty.trim()) {
      setPhase('network');
    }
  };

  const narrativeComplete = revealedCount >= NARRATIVE_SEQUENCE.length;

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <Scene phase={phase} />
        </Canvas>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'narrative' && (
          <motion.div
            key="narrative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.8 }}
            className="z-10 absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <div className="flex flex-col items-center gap-1 max-w-lg">
              {NARRATIVE_SEQUENCE.slice(0, revealedCount).map((item, i) => (
                item.type === 'divider' ? (
                  <motion.div
                    key={`divider-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="h-8"
                  />
                ) : (
                  <motion.p
                    key={`line-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-white/90 text-lg md:text-xl tracking-widest leading-relaxed text-center font-light"
                  >
                    {item.text}
                  </motion.p>
                )
              ))}
            </div>

            {!narrativeComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-12 text-white/30 text-xs tracking-widest"
              >
                ↓ 滾動繼續
              </motion.div>
            )}

            {narrativeComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-12 text-[#00FFCC]/50 text-xs tracking-widest"
              >
                ↓ 繼續
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="z-10 absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-gray-400 mb-4 tracking-widest text-sm">你能告訴我，你擅長做什麼嗎？</p>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="例如：互動設計"
              className="bg-transparent border-b border-white/30 text-white text-3xl text-center focus:outline-none focus:border-[#00FFCC] transition-colors pb-2 w-96 placeholder:text-white/10"
              autoFocus
            />
          </motion.div>
        )}

        {phase === 'network' && (
          <motion.div 
            key="network"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-10"
          >
            <Suspense fallback={<div className="absolute inset-0" />}>
              <InteractiveNetwork specialty={specialty} onNext={() => setPhase('title')} />
            </Suspense>
          </motion.div>
        )}

        {phase === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="z-20 absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-widest text-white drop-shadow-[0_0_30px_rgba(0,255,204,0.5)]">
              神經元
            </h1>
            <p className="text-[#00FFCC] tracking-[0.5em] mt-4 text-xl">2026</p>
            
            <button
              onClick={() => navigate('/home', { state: { specialty } })}
              className="mt-12 px-8 py-3 border border-[#00FFCC] text-[#00FFCC] hover:bg-[#00FFCC] hover:text-black transition-colors tracking-widest uppercase text-sm pointer-events-auto"
            >
              進入展覽
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
