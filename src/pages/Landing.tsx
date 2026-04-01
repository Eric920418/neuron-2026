import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LandingScene = lazy(() => import('../components/LandingScene'));
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

export default function Landing() {
  const [phase, setPhase] = useState<'narrative' | 'input' | 'network'>('narrative');
  const [specialty, setSpecialty] = useState('');
  const [revealedCount, setRevealedCount] = useState(0);
  const revealedCountRef = useRef(0);
  const cooldownRef = useRef(false);
  const [showScene, setShowScene] = useState(false);
  const navigate = useNavigate();

  // 延遲 800ms 掛載 3D 場景，讓文字 UI 先渲染
  useEffect(() => {
    const timer = setTimeout(() => setShowScene(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Input 階段預載 InteractiveNetwork
  useEffect(() => {
    if (phase === 'input') {
      import('../components/InteractiveNetwork');
    }
  }, [phase]);

  const revealNext = useCallback(() => {
    setRevealedCount(prev => {
      const next = Math.min(prev + 2, NARRATIVE_SEQUENCE.length);
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

  // 手機觸控滑動推進敘事
  useEffect(() => {
    if (phase !== 'narrative') return;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = startY - e.changedTouches[0].clientY;
      if (deltaY < 30 || cooldownRef.current) return;

      if (revealedCountRef.current >= NARRATIVE_SEQUENCE.length) {
        setPhase('input');
        return;
      }

      cooldownRef.current = true;
      revealNext();
      setTimeout(() => { cooldownRef.current = false; }, 600);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [phase, revealNext]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && specialty.trim()) {
      setPhase('network');
    }
  };

  const narrativeComplete = revealedCount >= NARRATIVE_SEQUENCE.length;

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden touch-none">
      <div className="absolute inset-0 z-0">
        {showScene && (
          <Suspense fallback={null}>
            <LandingScene phase={phase} />
          </Suspense>
        )}
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
                ↓ 滑動繼續
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
            className="z-10 absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <p className="text-gray-400 mb-4 tracking-widest text-sm">你能告訴我，你擅長做什麼嗎？</p>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="例如：互動設計"
              className="bg-transparent border-b border-white/30 text-white text-3xl text-center focus:outline-none focus:border-[#00FFCC] transition-colors pb-2 w-full max-w-96 placeholder:text-white/10"
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
              <InteractiveNetwork specialty={specialty} onNext={() => navigate('/home', { state: { specialty } })} />
            </Suspense>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
