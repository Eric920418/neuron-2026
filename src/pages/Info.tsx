import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Calendar, Clock } from 'lucide-react';
import LazyImage from '../components/LazyImage';

const rules = [
  { id: 1, title: '禁止飲食', content: '展區內全面禁止飲食，請將食物與飲料寄放於服務台。' },
  { id: 2, title: '請勿觸摸展品', content: '除標示可互動之作品外，請勿觸摸任何展品，以免造成損壞。' },
  { id: 3, title: '拍照規定', content: '歡迎拍照分享，但請關閉閃光燈，並尊重創作者版權，勿作商業用途。' },
  { id: 4, title: '保持安靜', content: '展區內請輕聲細語，將手機調至靜音，共同維護觀展品質。' },
  { id: 5, title: '大型物品寄放', content: '攜帶大於 A3 尺寸之背包或長柄傘，請先至服務台寄放。' },
  { id: 6, title: '寵物規範', content: '除導盲犬外，展區內禁止攜帶寵物入內。' },
  { id: 7, title: '孩童參觀', content: '12 歲以下孩童需由成人陪同參觀，並請注意孩童安全。' },
  { id: 8, title: '無障礙服務', content: '展場設有無障礙坡道與電梯，如有需要請洽現場工作人員。' },
  { id: 9, title: '緊急狀況', content: '遇緊急狀況時，請保持冷靜，並聽從現場工作人員指示疏散。' },
  { id: 10, title: '主辦方權利', content: '主辦單位保有最終修改、變更、活動解釋及取消本活動之權利。' },
];

export default function Info() {
  const [openRule, setOpenRule] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-24">
          展覽資訊
        </h1>

        {/* Info Blocks */}
        <div className="space-y-32 mb-32">
          {/* Block 1: Internal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] bg-white/5 overflow-hidden">
              <LazyImage 
                src="https://picsum.photos/seed/yzu/800/600" 
                alt="YZU Campus" 
                containerClassName="w-full h-full"
                imgClassName="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">校內展</h2>
                <p className="text-[var(--color-neon)] tracking-widest uppercase text-sm">元智大學</p>
              </div>
              
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-white" />
                  <span>2026.05.10 (日) - 05.14 (四)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-white" />
                  <span>10:00 - 18:00</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-white" />
                  <span>元智大學 五館三樓 (桃園市中壢區遠東路135號)</span>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-gray-500">
                校內展為神經元展覽的首站，展示學生們在校園環境中孕育的初步創意與實驗性作品。這裡充滿了未經雕琢的原始能量，是探索未來設計趨勢的最佳起點。
              </p>
            </div>
          </div>

          {/* Block 2: External */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">校外展</h2>
                <p className="text-[var(--color-neon)] tracking-widest uppercase text-sm">松山文創園區</p>
              </div>
              
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-white" />
                  <span>2026.05.22 (五) - 05.25 (一)</span>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-white" />
                  <span>09:00 - 20:00 (最後一日至 17:00)</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-white" />
                  <span>松山文創園區 北向製菸工廠 (台北市信義區光復南路133號)</span>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-gray-500">
                移師台北松山文創園區，作品經過淬鍊與優化，以更成熟的姿態面向大眾。這裡不僅是展示成果的舞台，更是與業界交流、碰撞火花的關鍵節點。
              </p>
            </div>
            <div className="order-1 md:order-2 aspect-[4/3] bg-white/5 overflow-hidden">
              <LazyImage 
                src="https://picsum.photos/seed/songshan/800/600" 
                alt="Songshan Park" 
                containerClassName="w-full h-full"
                imgClassName="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" 
              />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-32">
          <h2 className="text-2xl font-bold mb-8">展場位置</h2>
          <div className="w-full h-[400px] bg-white/5 border border-white/10 relative overflow-hidden">
            {/* Placeholder for Dark Mode Google Map */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 tracking-widest uppercase text-sm z-20 pointer-events-none">
              互動地圖整合
            </div>
            {/* Using a static dark map image as placeholder */}
            <LazyImage 
              src="https://picsum.photos/seed/mapdark/1200/400?grayscale" 
              alt="Map" 
              containerClassName="absolute inset-0 w-full h-full"
              imgClassName="w-full h-full object-cover opacity-30" 
            />
          </div>
        </div>

        {/* Rules Section */}
        <div>
          <h2 className="text-2xl font-bold mb-8">觀展規範</h2>
          <div className="border-t border-white/10">
            {rules.map((rule) => (
              <div key={rule.id} className="border-b border-white/10">
                <button
                  onClick={() => setOpenRule(openRule === rule.id ? null : rule.id)}
                  className="w-full py-6 flex justify-between items-center text-left hover:text-[var(--color-neon)] transition-colors"
                >
                  <span className="text-lg font-medium">
                    <span className="text-gray-500 mr-4 text-sm">{String(rule.id).padStart(2, '0')}</span>
                    {rule.title}
                  </span>
                  <motion.div
                    animate={{ rotate: openRule === rule.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openRule === rule.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-gray-400 pl-10">
                        {rule.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
