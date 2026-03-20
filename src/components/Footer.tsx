import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <footer className="bg-black text-white pt-24 pb-12 overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div>
            <h3 className="text-2xl font-bold mb-6">神經元 2026</h3>
            <p className="text-gray-400 max-w-sm">
              2026 跨域互動設計展，探索科技與藝術的交匯點，連結每一個神經元。
            </p>
          </div>
          <div className="flex flex-col md:items-end space-y-4">
            <h4 className="text-sm uppercase tracking-widest text-gray-500 mb-2">社群連結</h4>
            <a href="https://www.instagram.com/yzuic_29/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-neon)] transition-colors">Instagram</a>
            <a href="https://www.threads.com/@yzuic_29" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-neon)] transition-colors">Threads</a>
            <a href="https://lin.ee/sFMgbgw" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-neon)] transition-colors">LINE</a>
          </div>
        </div>
        
        <div className="flex justify-center items-center w-full relative">
          <h1 className="text-[15vw] leading-none font-black tracking-tighter text-outline select-none">
            神經元
          </h1>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; 2026 神經元展覽. 保留所有權利.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/info" className="hover:text-white">隱私權政策</Link>
            <Link to="/contact" className="hover:text-white">聯絡我們</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
