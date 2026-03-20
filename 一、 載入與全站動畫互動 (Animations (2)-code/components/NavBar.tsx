'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: '展覽資訊', href: '/info' },
  { label: '作品', href: '/works' },
  { label: '聯絡', href: '/contact' },
  { label: '預約', href: '/booking' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: scrolled ? '12px clamp(20px, 5vw, 60px)' : '20px clamp(20px, 5vw, 60px)',
          background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
          aria-label="神經元 2026 首頁"
        >
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #a0ff80, #39ff14)',
            boxShadow: '0 0 8px rgba(57,255,20,0.5)',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.8)',
            letterSpacing: '0.08em',
          }}>
            神經元 <span style={{ color: 'rgba(57,255,20,0.7)', fontWeight: 400 }}>2026</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            const isBooking = item.href === '/booking'
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: isBooking ? '8px 18px' : '8px 14px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  letterSpacing: isBooking ? '0.1em' : '0.08em',
                  color: isActive
                    ? '#39ff14'
                    : (isBooking ? '#39ff14' : 'rgba(255,255,255,0.45)'),
                  textDecoration: 'none',
                  borderRadius: '4px',
                  background: isBooking
                    ? 'rgba(57,255,20,0.1)'
                    : (isActive ? 'rgba(57,255,20,0.08)' : 'transparent'),
                  border: isBooking
                    ? '1px solid rgba(57,255,20,0.35)'
                    : '1px solid transparent',
                  transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease',
                  marginLeft: isBooking ? '8px' : '0',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (isBooking) {
                    el.style.background = 'rgba(57,255,20,0.18)'
                    el.style.borderColor = 'rgba(57,255,20,0.6)'
                  } else if (!isActive) {
                    el.style.color = 'rgba(255,255,255,0.8)'
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (isBooking) {
                    el.style.background = 'rgba(57,255,20,0.1)'
                    el.style.borderColor = 'rgba(57,255,20,0.35)'
                  } else if (!isActive) {
                    el.style.color = 'rgba(255,255,255,0.45)'
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? '關閉選單' : '開啟選單'}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {navItems.map(item => {
            const isBooking = item.href === '/booking'
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: isBooking ? '14px' : '20px',
                  fontWeight: 400,
                  color: isBooking ? '#39ff14' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  padding: isBooking ? '14px 40px' : '12px 32px',
                  letterSpacing: isBooking ? '0.1em' : '0.05em',
                  marginTop: isBooking ? '16px' : '0',
                  background: isBooking ? 'rgba(57,255,20,0.1)' : 'transparent',
                  border: isBooking ? '1px solid rgba(57,255,20,0.35)' : 'none',
                  borderRadius: isBooking ? '4px' : '0',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}