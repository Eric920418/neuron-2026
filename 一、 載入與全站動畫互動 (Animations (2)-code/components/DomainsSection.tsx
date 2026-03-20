'use client'

import { useState, useEffect, useRef } from 'react'

const domains = [
  {
    id: 'interactive',
    num: '01',
    title: '互動',
    titleEn: 'Interactive',
    desc: '打破螢幕邊界，以感官為介面，創造沉浸式的互動體驗。從裝置藝術到體感互動，每一個觸碰都是一次對話。',
    tags: ['裝置藝術', '體感互動', '沉浸體驗', 'UI/UX'],
    accent: 'rgba(57,255,20,0.8)',
  },
  {
    id: 'game',
    num: '02',
    title: '遊戲',
    titleEn: 'Game',
    desc: '遊戲是最純粹的互動敘事。我們開發多人派對遊戲、獨立遊戲與嚴肅遊戲，探索玩樂與意義的邊界。',
    tags: ['多人派對遊戲', '獨立遊戲', '遊戲設計', 'It\'s Mine'],
    accent: 'rgba(57,255,20,0.8)',
  },
  {
    id: 'marketing',
    num: '03',
    title: '行銷',
    titleEn: 'Marketing',
    desc: '品牌不只是標誌，是一套完整的感知系統。整合數位行銷、品牌策略與創意內容，讓訊息精準觸達每一個神經元。',
    tags: ['品牌策略', '數位行銷', '社群經營', '整合傳播'],
    accent: 'rgba(57,255,20,0.8)',
  },
  {
    id: 'film',
    num: '04',
    title: '影視',
    titleEn: 'Film & Video',
    desc: '用光影說故事，以鏡頭捕捉情感。從短片、紀錄片到動態影像，每一格畫面都是精心構築的視覺詩篇。',
    tags: ['短片', '紀錄片', '動態影像', '影像敘事'],
    accent: 'rgba(57,255,20,0.8)',
  },
]

export default function DomainsSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
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
      id="domains"
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 'clamp(48px, 6vw, 80px)',
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
              color: 'rgba(57,255,20,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Exhibition Domains
            </p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              四大展出領域
            </h2>
          </div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.3)',
            maxWidth: '320px',
            lineHeight: 1.7,
            textAlign: 'right',
          }} className="domains-desc">
            跨域的神經脈衝，在四個維度同時迸發
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {domains.map((domain, idx) => {
            const isActive = activeIdx === idx
            return (
              <div
                key={domain.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  borderBottom: idx === domains.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  padding: isActive ? 'clamp(24px, 3vw, 40px) 0' : 'clamp(20px, 2.5vw, 32px) 0',
                  cursor: 'default',
                  transition: 'padding 0.3s ease',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(16px)',
                  transitionDelay: `${idx * 0.08 + 0.2}s`,
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: '24px',
                  alignItems: 'center',
                }} className="domain-row">
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    letterSpacing: '0.2em',
                    color: isActive ? 'rgba(57,255,20,0.7)' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.3s ease',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {domain.num}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: isActive ? '16px' : '0', transition: 'margin 0.3s ease' }}>
                      <h3 className="font-display" style={{
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        fontWeight: 400,
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        transition: 'color 0.3s ease',
                      }}>
                        {domain.title}
                      </h3>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '13px',
                        color: isActive ? 'rgba(57,255,20,0.6)' : 'rgba(255,255,255,0.15)',
                        letterSpacing: '0.1em',
                        transition: 'color 0.3s ease',
                      }}>
                        {domain.titleEn}
                      </span>
                    </div>

                    <div style={{
                      overflow: 'hidden',
                      maxHeight: isActive ? '200px' : '0',
                      opacity: isActive ? 1 : 0,
                      transition: 'max-height 0.4s ease, opacity 0.3s ease',
                    }}>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.5)',
                        lineHeight: 1.75,
                        marginBottom: '16px',
                        maxWidth: '600px',
                      }}>
                        {domain.desc}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {domain.tags.map(tag => (
                          <span key={tag} style={{
                            padding: '4px 12px',
                            border: '1px solid rgba(57,255,20,0.25)',
                            borderRadius: '100px',
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontSize: '11px',
                            color: 'rgba(57,255,20,0.7)',
                            letterSpacing: '0.05em',
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isActive ? 'rgba(57,255,20,0.8)' : 'rgba(255,255,255,0.15)'}
                    strokeWidth="1.5"
                    style={{
                      transform: isActive ? 'rotate(45deg)' : 'none',
                      transition: 'transform 0.3s ease, stroke 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .domain-row { grid-template-columns: 48px 1fr auto !important; gap: 12px !important; }
          .domains-desc { text-align: left !important; }
        }
      `}</style>
    </section>
  )
}