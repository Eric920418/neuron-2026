import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3-force';

const FALLBACK_TEXT = (specialty: string) =>
  `「${specialty}」正是資訊傳播領域跨域整合的核心之一。在這裡，你的專業將與程式開發、視覺設計、行銷企劃等不同節點產生緊密連結，共同激盪出全新的數位體驗與互動火花。`;

const mockPeople = [
  {  role: '前端開發' },
  {  role: '3D動畫' },
  {  role: '行銷企劃' },
  {  role: '視覺設計' },
  {  role: '遊戲程式' },
  {  role: 'UI/UX' },
  {  role: '後端開發' },
];

export default function InteractiveNetwork({ specialty, onNext }: { specialty: string, onNext: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [showText, setShowText] = useState(false);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);

  const [aiText, setAiText] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const aiDoneRef = useRef(false);

  // 3.5 秒後動畫就緒
  useEffect(() => {
    const timer = setTimeout(() => setAnimationReady(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  // API 呼叫：元件 mount 時立即發起，與動畫並行
  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialty }),
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.text) {
          setAiText(data.text);
          setAiError(null);
        } else {
          setAiError(data.error || 'AI 回應格式異常');
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setAiError(err.message || '網路連線失敗');
        }
      });

    // 30 秒超時保護
    const timeout = setTimeout(() => {
      setAiError(prev => prev ?? '回應超時，使用預設文案');
    }, 30000);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [specialty]);

  // 動畫就緒 + API 完成 → 顯示文字面板
  useEffect(() => {
    if (animationReady && (aiText !== null || aiError !== null)) {
      setShowText(true);
    }
  }, [animationReady, aiText, aiError]);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const initialNodes = [
      { id: 'user', name: '您', role: specialty, isUser: true, x: width / 2, y: height / 2 },
      ...mockPeople.map((p, i) => ({
        ...p,
        id: `node-${i}`,
        x: width / 2 + (Math.random() - 0.5) * 400,
        y: height / 2 + (Math.random() - 0.5) * 400
      }))
    ];

    const initialLinks = mockPeople.map((_, i) => ({ source: 'user', target: `node-${i}` }));
    // Add some random interconnections
    initialLinks.push({ source: 'node-0', target: 'node-1' });
    initialLinks.push({ source: 'node-2', target: 'node-3' });
    initialLinks.push({ source: 'node-4', target: 'node-0' });
    initialLinks.push({ source: 'node-1', target: 'node-4' });
    initialLinks.push({ source: 'node-5', target: 'node-6' });
    initialLinks.push({ source: 'node-2', target: 'node-5' });

    const simulation = d3.forceSimulation(initialNodes)
      .force('link', d3.forceLink(initialLinks).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(60))
      .on('tick', () => {
        // Force re-render with new positions
        setNodes([...simulation.nodes()]);
        setLinks([...initialLinks]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [specialty]);

  const handlePointerDown = (e: React.PointerEvent, node: any) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    node.isDragging = true;
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  };

  const handlePointerMove = (e: React.PointerEvent, node: any) => {
    if (node.isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      node.fx = e.clientX - rect.left;
      node.fy = e.clientY - rect.top;
    }
  };

  const handlePointerUp = (e: React.PointerEvent, node: any) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    node.isDragging = false;
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0);
    }
    node.fx = null;
    node.fy = null;
  };

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((link, i) => {
          // d3-force replaces source/target string IDs with actual node object references
          const source = link.source as any;
          const target = link.target as any;
          if (!source.x || !target.x) return null;
          return (
            <motion.line
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#00FFCC"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1, delay: 1 + i * 0.15, ease: "easeOut" }}
            />
          );
        })}
      </svg>
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          onPointerDown={(e) => handlePointerDown(e, node)}
          onPointerMove={(e) => handlePointerMove(e, node)}
          onPointerUp={(e) => handlePointerUp(e, node)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: node.isUser ? 0.5 : 1.5 + i * 0.15,
            type: "spring"
          }}
          className={`absolute flex flex-col items-center justify-center rounded-full cursor-grab active:cursor-grabbing backdrop-blur-md transform -translate-x-1/2 -translate-y-1/2 ${
            node.isUser
              ? 'bg-[#00FFCC]/20 border-2 border-[#00FFCC] text-[#00FFCC] shadow-[0_0_20px_rgba(0,255,204,0.5)] z-20 px-6 py-4'
              : 'bg-white/10 border border-white/30 text-white px-4 py-3 z-10'
          }`}
          style={{
            left: node.x || 0,
            top: node.y || 0,
            touchAction: 'none' // Prevent scrolling while dragging on mobile
          }}
        >
          <span className={`mt-1 opacity-80 ${node.isUser ? 'text-sm' : 'text-xs text-gray-300'}`}>
            {node.role}
          </span>
        </motion.div>
      ))}

      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-lg bg-black/40 border border-white/20 backdrop-blur-md p-6 rounded-2xl text-center z-30 shadow-2xl pointer-events-auto"
          >
            <h3 className="text-[#00FFCC] font-bold text-lg mb-3 tracking-wider">與資傳領域的連結</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {aiText || FALLBACK_TEXT(specialty)}
            </p>
            {aiError && (
              <p className="text-red-400/70 text-xs mb-4">{aiError}</p>
            )}
            <button
              onClick={onNext}
              className="px-6 py-2 border border-[#00FFCC] text-[#00FFCC] hover:bg-[#00FFCC] hover:text-black transition-colors tracking-widest uppercase text-sm rounded-full"
            >
              繼續探索
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
