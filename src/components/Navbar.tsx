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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest">
          <NavLink to="/info">展覽資訊</NavLink>
          <NavLink to="/works">組別介紹</NavLink>
          <NavLink to="/contact">意見回饋</NavLink>
          <Link
            to="/booking"
            className="relative px-5 py-2 text-black font-bold tracking-widest uppercase text-sm bg-[var(--color-neon)] rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,204,0.4)] hover:scale-105 active:scale-95"
          >
            預約
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
