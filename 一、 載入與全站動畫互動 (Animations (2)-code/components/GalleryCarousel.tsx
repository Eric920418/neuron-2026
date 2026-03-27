'use client'

import { useState } from 'react'

const works = [
  {
    id: 1,
    title: "It's Mine",
    domain: '遊戲',
    year: '2026',
    image: 'https://picsum.photos/seed/game-itsmind/800/500',
    color: '#8b5cf6',
  },
  {
    id: 2,
    title: '感知邊界',
    domain: '互動',
    year: '2026',
    image: 'https://picsum.photos/seed/interactive-boundary/800/500',
    color: '#6366f1',
  },
  {
    id: 3,
    title: '品牌重塑計畫',
    domain: '行銷',
    year: '2026',
    image: 'https://picsum.photos/seed/marketing-brand/800/500',
    color: '#06b6d4',
  },
  {
    id: 4,
    title: '城市之聲',
    domain: '影視',
    year: '2026',
    image: 'https://picsum.photos/seed/film-city/800/500',
    color: '#f59e0b',
  },
  {
    id: 5,
    title: '數位迷宮',
    domain: '遊戲',
    year: '2026',
    image: 'https://picsum.photos/seed/game-maze/800/500',
    color: '#8b5cf6',
  },
  {
    id: 6,
    title: '觸覺裝置',
    domain: '互動',
    year: '2026',
    image: 'https://picsum.photos/seed/interactive-touch/800/500',
    color: '#6366f1',
  },
  {
    id: 7,
    title: '無聲的告白',
    domain: '影視',
    year: '2026',
    image: 'https://picsum.photos/seed/film-silent/800/500',
    color: '#f59e0b',
  },
  {
    id: 8,
    title: '社群實驗室',
    domain: '行銷',
    year: '2026',
    image: 'https://picsum.photos/seed/marketing-social/800/500',
    color: '#06b6d4',
  },
]

export default function GalleryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState<number | null>(null)

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1))
  const next = () => setActiveIndex((i) => Math.min(works.length - 3, i + 1))

  const visibleWorks = works.slice(activeIndex, activeIndex + 3)

  return (
    <section
      style={{
        background: '#000',
        padding: 'clamp(40px, 10vw, 80px) 0 clamp(60px, 10vw, 120px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        overflow: 'hidden',
      }}
      data-animate="reveal-on-scroll"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px, 6vw, 80px)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(129,140,248,0.7)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Selected Works
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              精選作品
            </h2>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
            }}>
              {String(activeIndex + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
            </span>
            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="上一個作品"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: activeIndex === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={next}
              disabled={activeIndex >= works.length - 3}
              aria-label="下一個作品"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: activeIndex >= works.length - 3 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                cursor: activeIndex >= works.length - 3 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="gallery-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {visibleWorks.map((work, idx) => (
            <div
              key={work.id}
              onClick={() => setZoomed(zoomed === work.id ? null : work.id)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              data-animate="hover-lift"
            >
              <div style={{
                position: 'relative',
                overflow: 'hidden',
                aspectRatio: '16/10',
              }}>
                <img
                  src={work.image}
                  width={800}
                  height={500}
                  alt={work.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'brightness(0.75)',
                  }}
                />
                {/* Domain badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${work.color}40`,
                  borderRadius: '3px',
                  padding: '4px 10px',
                }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: work.color,
                    letterSpacing: '0.1em',
                  }}>
                    {work.domain}
                  </span>
                </div>
              </div>

              <div style={{
                padding: '20px 24px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <h3 style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: '22px',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '6px',
                  letterSpacing: '-0.01em',
                }}>
                  {work.title}
                </h3>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.1em',
                }}>
                  {work.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
          {Array.from({ length: works.length - 2 }, (_, i) => (
            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`跳至第${i + 1}組作品`}
              style={{
                width: activeIndex === i ? '24px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: activeIndex === i ? '#6366f1' : 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .gallery-cards-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .gallery-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Zoom modal */}
      {zoomed !== null && (
        <div
          onClick={() => setZoomed(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="作品放大預覽"
        >
          {(() => {
            const work = works.find(w => w.id === zoomed)
            if (!work) return null
            return (
              <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
                <img
                  src={work.image}
                  width={800}
                  height={500}
                  alt={work.title}
                  style={{ width: '100%', borderRadius: '8px', display: 'block' }}
                />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '28px',
                    color: '#fff',
                    fontWeight: 400,
                  }}>
                    {work.title}
                  </h3>
                  <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                    onClick={() => setZoomed(null)}
                    aria-label="關閉預覽"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </section>
  )
}