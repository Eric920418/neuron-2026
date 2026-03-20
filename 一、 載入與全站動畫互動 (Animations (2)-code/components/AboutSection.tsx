'use client'

import { useEffect, useRef, useState } from 'react'

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: '#000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background noise texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        pointerEvents: 'none',
        opacity: 0.4,
      }} />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '30%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative' }}>

        {/* Editorial layout — asymmetric */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 8vw, 120px)',
          alignItems: 'center',
        }} className="about-hero-grid">

          {/* Left — giant title */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(40px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}>
            {/* Eyebrow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            }}>
              <div style={{
                width: '32px',
                height: '1px',
                background: 'rgba(57,255,20,0.5)',
              }} />
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.5em',
                color: 'rgba(57,255,20,0.5)',
                textTransform: 'uppercase',
              }}>
                元智大學資訊傳播學系
              </p>
            </div>

            {/* Main title — editorial oversized */}
            <h1 className="font-display" style={{
              fontSize: 'clamp(72px, 12vw, 160px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              marginBottom: '0',
            }}>
              神<br />經<br />元
            </h1>

            {/* Year — hollow outline style */}
            <p className="font-display" style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 400,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
              letterSpacing: '-0.02em',
              marginTop: '8px',
              lineHeight: 1,
            }}>
              2026
            </p>
          </div>

          {/* Right — outdoor exhibition only, horizontal layout */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(40px)',
            transition: 'opacity 1s ease 0.25s, transform 1s ease 0.25s',
          }}>
            {/* Outdoor exhibition — horizontal card */}
            <div style={{
              padding: 'clamp(28px, 3.5vw, 48px)',
              border: '1px solid rgba(57,255,20,0.2)',
              borderRadius: '2px',
              background: 'rgba(57,255,20,0.03)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Green accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, #39ff14, transparent)',
              }} />

              {/* Label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '28px',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#39ff14',
                  boxShadow: '0 0 8px rgba(57,255,20,0.8)',
                }} />
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(57,255,20,0.7)',
                  textTransform: 'uppercase',
                }}>
                  校外展
                </p>
              </div>

              {/* Horizontal info row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
                alignItems: 'start',
              }} className="about-info-row">

                {/* Date */}
                <div>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.2)',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}>
                    展期
                  </p>
                  <p className="font-display" style={{
                    fontSize: 'clamp(22px, 3vw, 36px)',
                    fontWeight: 400,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                  }}>
                    05.08<br />— 05.11
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(57,255,20,0.5)',
                    letterSpacing: '0.1em',
                    marginTop: '8px',
                  }}>
                    2026
                  </p>
                </div>

                {/* Location */}
                <div>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.2)',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                  }}>
                    地點
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(14px, 1.8vw, 18px)',
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.85)',
                    lineHeight: 1.4,
                    marginBottom: '6px',
                  }}>
                    松山文創園區
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.03em',
                    marginBottom: '4px',
                  }}>
                    二號倉庫
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.03em',
                  }}>
                    台北市信義區
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{
                width: '100%',
                height: '1px',
                background: 'rgba(57,255,20,0.1)',
                margin: '28px 0',
              }} />

              {/* Bottom row — opening hours + CTA */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(57,255,20,0.5)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.05em',
                  }}>
                    10:00 — 18:00
                  </p>
                </div>

                <a
                  href="/booking"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid rgba(57,255,20,0.35)',
                    borderRadius: '2px',
                    color: 'rgba(57,255,20,0.8)',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    background: 'rgba(57,255,20,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'rgba(57,255,20,0.12)'
                    el.style.borderColor = 'rgba(57,255,20,0.6)'
                    el.style.color = '#39ff14'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.background = 'rgba(57,255,20,0.05)'
                    el.style.borderColor = 'rgba(57,255,20,0.35)'
                    el.style.color = 'rgba(57,255,20,0.8)'
                  }}
                >
                  預約參觀
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Scroll hint */}
            <div style={{
              paddingTop: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              opacity: 0.4,
            }}>
              <div style={{
                width: '1px',
                height: '40px',
                background: 'linear-gradient(to bottom, rgba(57,255,20,0.6), transparent)',
              }} />
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
              }}>
                向下探索
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .about-info-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </section>
  )
}