import { useState, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import GallerySection from '../components/GallerySection';
import neuronLogo from '../assets/neuron-logo.svg';

// 合作單位 logos
import logoYzuCollege from '../assets/sponsors/元智大學-資訊學院.svg';
import logoYzuIc from '../assets/sponsors/元智大學資訊傳播學系.svg';
import logoTaoyuanCity from '../assets/sponsors/桃園市政府.svg';
import logoTaoyuanYouth from '../assets/sponsors/桃園市政府青年事務局.png';
import logoCts from '../assets/sponsors/華視文教基金會.png';
import logoElephant from '../assets/sponsors/大象杯.png';
import logoWemo from '../assets/sponsors/wemo.png';
import logoBcc from "../assets/sponsors/292.webp";
import llll from "../assets/sponsors/858c5a49ec9c548b.webp";

const NeuralBackground = lazy(() => import('../components/NeuralBackground'));

const categories = [
  { id: "interactive", title: "互動設計", desc: ["突觸之間的連結，", "在回應與反應之中，讓訊號被感知、被改變。"] ,href: "/works?filter=interactive" },
  { id: "game", title: "遊戲設計", desc: ["神經訊號的傳遞路徑，", "在不同的路徑選擇中，創造不同的結果。"] ,href: "/works?filter=game" },
  { id: "marketing", title: "行銷企劃", desc: ["訊號的放大與擴散，", "在不同的傳遞路徑中，讓一個想法被傳出去，也被更多人接收。"] ,href: "/works?filter=marketing" },
  { id: "film", title: "影視動畫", desc: ["訊號轉化成影像與聲音，", "把抽象的感受，變成可以被看見的故事。"] ,href: "/works?filter=film" },
];

const partnerGroups = [
  {
    category: "指導單位",
    items: [
      { name: "桃園市政府", logo: logoTaoyuanCity, small: true },
      { name: "桃園市政府青年事務局", logo: logoTaoyuanYouth },
      { name: "元智大學 資訊學院", logo: logoYzuCollege, small: true },
    ],
  },
  {
    category: "主辦單位",
    items: [{ name: "元智大學 資訊傳播學系", logo: logoYzuIc }],
  },
  {
    category: "執行單位",
    items: [{ name: "元智資傳畢籌會", logo: logoBcc, extraLarge: true }],
  },
  {
    category: "贊助單位",
    items: [
      { name: "元智大學 資訊學院", logo: llll },
      { name: "華視文教基金會", logo: logoCts },
      { name: "WeMo", logo: logoWemo, large: true },
      { name: "大象杯", logo: logoElephant, large: true },
    ],
  },
];
export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const specialty = location.state?.specialty || '互動設計';

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 1] }}>
            <Suspense fallback={null}>
              <NeuralBackground specialty={specialty} />
            </Suspense>
          </Canvas>
        </div>

        <motion.div
          style={{ y }}
          className="z-10 text-center px-6 pointer-events-none"
        >
          <img
            src={neuronLogo}
            alt="神經元"
            className="h-16 md:h-24 mb-6 mx-auto"
          />
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-sm tracking-widest uppercase text-gray-400">
            <div className="flex flex-col items-center">
              <span className="text-white mb-1">校內展</span>
              <span>2026.04.13 - 04.17</span>
              <span>元智大學 五館三樓、六館玻璃屋</span>
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
            對你來說什麼是跨域？什麼是連結？
          </h2>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            向下探索更多展覽資訊與作品
          </p>
        </motion.div>
      </section>

      {/* Concept Section */}
      <section className="py-16 px-6 w-full mx-auto">
        <div className="flex flex-col items-center justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-8">跨域、連結</h2>
          </div>
          <div className="text-gray-400 leading-relaxed text-lg font-light">
            <p className="mb-6 px-0 lg:px-32 text-center text-sm lg:text-lg" >
              跨域、連結，一直都在發生。 神經元就像一座橋，
              在訊號之間流動，讓理性跟感性慢慢接在一起。 這次展覽分成四個展區：
              互動設計、遊戲設計、行銷企劃、影視動畫。 每個作品都是一個點，
              在連結之中，慢慢拼出屬於我們資傳的樣子。 創意，也就在這之中發生。
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-y border-white/10 relative overflow-hidden">
        {/* Abstract background effect based on hover */}
        <div
          className="absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none"
          style={{
            opacity: hoveredCategory ? 0.1 : 0,
            background:
              "radial-gradient(circle at center, var(--color-neon) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="group cursor-pointer py-12 border-b md:border-b-0 md:border-r border-white/10 last:border-0"
                onClick={() => navigate(cat.href || "")}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--color-neon)] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-gray-500 text-sm tracking-widest uppercase">
                  {cat.desc.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < cat.desc.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Works Gallery */}
      <GallerySection />

      {/* Partners Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="space-y-8">
          {partnerGroups.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm tracking-widest text-gray-500 text-center mb-8">
                {group.category}
              </h3>
              <div className="flex flex-wrap justify-center items-center gap-10">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center gap-3"
                  >
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className={`${item.extraLarge ? "h-48" : item.large ? "h-24" : item.small ? "h-9" : "h-14"} w-auto object-contain opacity-60 hover:opacity-100 transition-opacity`}
                      />
                    ) : (
                      <span className="text-sm text-gray-400">{item.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
