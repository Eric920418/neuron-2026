import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AsciiText from './AsciiText';
import logoSvg from '../assets/logo.svg';

function NavLink({ to, children }: { to: string; children: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      to={to}
      className="hover:text-[var(--color-neon)] transition-colors inline-block text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AsciiText text={children} isHovered={isHovered} />
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 路由切換時關閉選單
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Don't show navbar on landing page
  if (location.pathname === '/') return null;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/home" className="flex items-center">
          <img src={logoSvg} alt="神經元 2026" className="h-8" />
        </Link>
        {/* 桌面版導航 */}
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
          <NavLink to="/info">展覽資訊</NavLink>
          <NavLink to="/works">參展作品</NavLink>
          <NavLink to="/contact">意見回饋</NavLink>
          <Link
            to="/booking"
            className="relative px-5 py-2 text-black font-bold tracking-widest uppercase text-sm bg-[var(--color-neon)] rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:scale-105 active:scale-95"
          >
            預約
          </Link>
        </div>

        {/* 漢堡按鈕 (手機版) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* 手機版展開選單 */}
      <motion.div
        initial={false}
        animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md"
      >
        <div className="flex flex-col items-center space-y-6 py-8 text-sm uppercase tracking-widest">
          <NavLink to="/info">展覽資訊</NavLink>
          <NavLink to="/works">參展作品</NavLink>
          <NavLink to="/contact">意見回饋</NavLink>
          <Link
            to="/booking"
            className="relative px-5 py-2 text-black font-bold tracking-widest uppercase text-sm bg-[var(--color-neon)] rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:scale-105 active:scale-95"
            onClick={() => setMenuOpen(false)}
          >
            預約
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
