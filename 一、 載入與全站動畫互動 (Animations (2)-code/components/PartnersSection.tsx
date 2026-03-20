'use client'

import { useEffect, useRef, useState } from 'react'

const partners = [
  { name: '松山文創園區', nameEn: 'Songshan Cultural Park', type: '場地合作' },
  { name: '元智大學', nameEn: 'Yuan Ze University', type: '主辦單位' },
  { name: '資訊傳播學系', nameEn: 'Dept. of Information Communication', type: '主辦單位' },
  { name: '合作夥伴 A', nameEn: 'Partner A', type: '贊助單位' },
  { name: '合作夥伴 B', nameEn: 'Partner B', type: '媒體合作' },
  { name: '合作夥伴 C', nameEn: 'Partner C', type: '技術支援' },
]

export default function PartnersSection() {
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
      id="partners"
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(60px, 8vw, 100px) clamp(20px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: 'clamp(32px, 4vw, 56px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.4em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            合作單位
          </p>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {partners.map((partner, idx) => (
            <div
              key={partner.name}
              style={{
                padding: '28px 24px',
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(12px)',
                transition: `opacity 0.6s ease ${idx * 0.06}s, transform 0.6s ease ${idx * 0.06}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#000' }}
            >
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(57,255,20,0.4)',
                textTransform: 'uppercase',
              }}>
                {partner.type}
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.02em',
              }}>
                {partner.name}
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.05em',
              }}>
                {partner.nameEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}