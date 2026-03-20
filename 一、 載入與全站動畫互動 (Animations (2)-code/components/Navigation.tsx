'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

interface NavigationProps {
  visible: boolean
}

const navItems = [
  { label: '關於', href: '#about' },
  { label: '領域', href: '#domains' },
  { label: '作品', href: '#gallery' },
  { label: '展覽資訊', href: '#info' },
  { label: '預約', href: '#booking' },
  { label: '聯絡', href: '#contact' },
]

export default function Navigation({ visible }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    setActiveSection(href)
  }

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#818cf8',
            boxShadow: '0 0 12px rgba(129,140,248,0.8)',
          }}
        />
        <span
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 18,
            letterSpacing: '0.05em',
            color: '#fff',
          }}
        >
          神經元 2026
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            style={{
              color: activeSection === item.href ? '#818cf8' : 'rgba(255,255,255,0.6)',
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500,
              borderBottom: activeSection === item.href ? '1px solid #818cf8' : '1px solid transparent',
              paddingBottom: 2,
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
          >
            {item.label}
          </a>
        ))}

        {/* CTA */}
        <motion.a
          href="#booking"
          onClick={(e) => handleNavClick(e, '#booking')}
          whileTap={{ scale: 0.97 }}
          style={{
            background: '#818cf8',
            color: '#000',
            padding: '8px 20px',
            fontSize: 12,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          立即預約
        </motion.a>
      </div>
    </motion.nav>
  )
}