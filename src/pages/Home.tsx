import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import NeuralBackground from '../components/NeuralBackground';
import GallerySection from '../components/GallerySection';

const categories = [
  { id: 'interactive', title: '互動設計', desc: '沉浸體驗' },
  { id: 'game', title: '遊戲設計', desc: '虛擬世界' },
  { id: 'marketing', title: '行銷企劃', desc: '創意發想' },
  { id: 'film', title: '影視動畫', desc: '視覺敘事' },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const location = useLocation();
  const specialty = location.state?.specialty || '互動設計';

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <NeuralBackground specialty={specialty} />
          </Canvas>
        </div>
        
        <motion.div style={{ y }} className="z-10 text-center px-6 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            神經元
          </h1>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm tracking-widest uppercase text-gray-400">
            <div className="flex flex-col items-center">
              <span className="text-white mb-1">校內展</span>
              <span>2026.04.24 - 04.26</span>
              <span>元智大學 圖書館一樓大廳</span>
            </div>
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <div className="flex flex-col items-center">
              <span className="text-white mb-1">校外展</span>
              <span>2026.05.08 - 05.11</span>
              <span>松山文創園區 二號倉庫</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Transition / Scroll Indicator Section */}
      <section className="relative h-[30vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-[#0a0a0a]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center px-6"
        >
          <div className="w-px h-16 bg-gradient-to-b from-[var(--color-neon)] to-transparent mx-auto mb-8 animate-pulse"></div>
          <h2 className="text-xl md:text-2xl font-light tracking-widest text-[var(--color-neon)] mb-4">
            準備進入下一個階段
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            向下探索更多展覽資訊與作品
          </p>
        </motion.div>
      </section>

      {/* Concept Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">跨域、連結</h2>
          </div>
          <div className="text-gray-400 leading-relaxed text-lg font-light">
            <p className="mb-6">
              如同大腦中的神經元，每一個獨立的創意節點在相互碰撞與連結中，激發出前所未有的能量。我們打破領域的界線，讓互動、遊戲、行銷與影視在此交匯。
            </p>
            <p>
              這不僅是一場展覽，更是一個持續生長、演化的有機網絡。每一個參與者都是這個巨大神經網絡中的關鍵節點。
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 border-y border-white/10 relative overflow-hidden">
        {/* Abstract background effect based on hover */}
        <div className="absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none"
             style={{ opacity: hoveredCategory ? 0.1 : 0, background: 'radial-gradient(circle at center, var(--color-neon) 0%, transparent 70%)' }} />
             
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className="group cursor-pointer py-12 border-b md:border-b-0 md:border-r border-white/10 last:border-0"
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-neon)] transition-colors">{cat.title}</h3>
                <p className="text-gray-500 text-sm tracking-widest uppercase">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works Gallery */}
      <GallerySection />

      {/* Partners Section */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <h2 className="text-sm tracking-widest uppercase text-gray-500 text-center mb-16">合作單位</h2>
        <div className="flex flex-wrap justify-center gap-16 opacity-50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-2xl font-bold grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
              標誌 {i}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
