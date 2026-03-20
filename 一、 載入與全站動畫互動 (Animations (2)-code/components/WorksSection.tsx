'use client'

import { useState, useEffect, useRef } from 'react'

type Domain = 'all' | 'interactive' | 'game' | 'marketing' | 'film'

const filters: { key: Domain; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'interactive', label: '互動' },
  { key: 'game', label: '遊戲' },
  { key: 'marketing', label: '行銷' },
  { key: 'film', label: '影視' },
]

const works = [
  {
    id: 1,
    title: "It's Mine",
    domain: 'game' as Domain,
    domainLabel: '遊戲',
    year: '2026',
    team: '遊戲組 Team A',
    desc: '多人派對遊戲，最多 6 人同場競技，搶奪資源、建立同盟，在混亂中尋找勝機。',
    tags: ['Unity', '多人連線', '派對遊戲'],
    color: 'rgba(99,102,241,0.12)',
  },
  {
    id: 2,
    title: '感知邊界',
    domain: 'interactive' as Domain,
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team B',
    desc: '以身體動作為介面的沉浸式裝置，探索感知的極限與數位空間的可能性。',
    tags: ['體感互動', '裝置藝術', 'openFrameworks'],
    color: 'rgba(129,140,248,0.1)',
  },
  {
    id: 3,
    title: '訊號',
    domain: 'film' as Domain,
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team C',
    desc: '一部關於溝通與誤解的短片，在數位噪音中尋找真實的人際連結。',
    tags: ['短片', '劇情片', '後製'],
    color: 'rgba(165,180,252,0.08)',
  },
  {
    id: 4,
    title: '品牌神經',
    domain: 'marketing' as Domain,
    domainLabel: '行銷',
    year: '2026',
    team: '行銷組 Team D',
    desc: '整合品牌識別系統設計，建立完整的視覺語言與數位行銷策略。',
    tags: ['品牌設計', '數位行銷', '社群策略'],
    color: 'rgba(99,102,241,0.08)',
  },
  {
    id: 5,
    title: '迴響',
    domain: 'interactive' as Domain,
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team E',
    desc: '聲音視覺化裝置，將環境音轉化為即時流動的光影神經網絡。',
    tags: ['聲音藝術', '即時運算', 'p5.js'],
    color: 'rgba(129,140,248,0.12)',
  },
  {
    id: 6,
    title: '最後一格',
    domain: 'film' as Domain,
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team F',
    desc: '紀錄片，記錄畢業前最後一個學期的集體記憶、友誼與告別。',
    tags: ['紀錄片', '剪輯', '配樂'],
    color: 'rgba(165,180,252,0.1)',
  },
  {
    id: 7,
    title: '神經市場',
    domain: 'marketing' as Domain,
    domainLabel: '行銷',
    year: '2026',
    team: '行銷組 Team G',
    desc: '以神經科學為靈感的消費者行為研究，結合數據分析與創意內容策略。',
    tags: ['消費者研究', '內容行銷', '數據分析'],
    color: 'rgba(99,102,241,0.1)',
  },
  {
    id: 8,
    title: '像素夢境',
    domain: 'game' as Domain,
    domainLabel: '遊戲',
    year: '2026',
    team: '遊戲組 Team H',
    desc: '像素風格解謎冒險遊戲，在夢境與現實交錯的世界中尋找記憶的碎片。',
    tags: ['像素藝術', '解謎', 'Godot'],
    color: 'rgba(129,140,248,0.08)',
  },
]

export default function WorksSection() {
  const [activeFilter, setActiveFilter] = useState<Domain>('all')
  const [filteredWorks, setFilteredWorks] = useState(works)
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleFilter = (key: Domain) => {
    if (key === activeFilter) return
    setAnimating(true)
    setTimeout(() => {
      setActiveFilter(key)
      setFilteredWorks(key === 'all' ? works : works.filter(w => w.domain === key))
      setAnimating(false)
    }, 200)
  }

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'clamp(40px, 5vw, 64px)',
          flexWrap: 'wrap',
          gap: '24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <div>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(129,140,248,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              All Works
            </p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              所有作品
            </h2>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => handleFilter(f.key)}
                style={{
                  padding: '8px 16px',
                  background: activeFilter === f.key ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: `1px solid ${activeFilter === f.key ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '100px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: activeFilter === f.key ? '#818cf8' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (activeFilter !== f.key) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeFilter !== f.key) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Works grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(8px)' : 'none',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {filteredWorks.map((work, idx) => (
            <div
              key={work.id}
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(20px)',
                transition: `opacity 0.6s ease ${idx * 0.05}s, transform 0.6s ease ${idx * 0.05}s, border-color 0.2s ease`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(129,140,248,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              {/* Image placeholder */}
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: work.color,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(129,140,248,0.2)',
                  border: '1px solid rgba(129,140,248,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(129,140,248,0.6)' }} />
                </div>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  padding: '3px 8px',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '100px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '10px',
                    color: 'rgba(129,140,248,0.8)',
                    letterSpacing: '0.08em',
                  }}>
                    {work.domainLabel}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <h3 className="font-display" style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.85)',
                    letterSpacing: '-0.01em',
                  }}>
                    {work.title}
                  </h3>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.2)',
                    letterSpacing: '0.1em',
                  }}>
                    {work.year}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(129,140,248,0.5)',
                  letterSpacing: '0.05em',
                  marginBottom: '10px',
                }}>
                  {work.team}
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.6,
                  marginBottom: '14px',
                }}>
                  {work.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {work.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '3px 8px',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '100px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.05em',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}