import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchTeamsPublic, type Work } from '../data/works'
import LazyImage from './LazyImage'

const DOMAIN_EN: Record<string, string> = {
  interactive: 'Interactive',
  game: 'Game',
  marketing: 'Marketing',
  film: 'Film',
}

const SLIDE_DURATION = 4000
const TRANSITION_DURATION = 700

export default function GallerySection() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchTeamsPublic()
      .then(works => setItems(works))
      .catch(err => console.error('[GallerySection] fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [loading])

  const goTo = useCallback((idx: number) => {
    if (transitioning || items.length === 0) return
    setPrevIdx(activeIdx)
    setTransitioning(true)
    setActiveIdx(idx)
    if (transitionRef.current) clearTimeout(transitionRef.current)
    transitionRef.current = setTimeout(() => {
      setPrevIdx(null)
      setTransitioning(false)
    }, TRANSITION_DURATION)
  }, [activeIdx, transitioning, items.length])

  const goNext = useCallback(() => {
    if (items.length === 0) return
    goTo((activeIdx + 1) % items.length)
  }, [activeIdx, goTo, items.length])

  const goPrev = useCallback(() => {
    if (items.length === 0) return
    goTo((activeIdx - 1 + items.length) % items.length)
  }, [activeIdx, goTo, items.length])

  useEffect(() => {
    if (paused || items.length === 0) return
    timerRef.current = setTimeout(() => { goNext() }, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeIdx, paused, goNext, items.length])

  if (!loading && items.length === 0) return null

  const current = items[activeIdx]
  const prev = prevIdx !== null ? items[prevIdx] : null

  // 載入中顯示 skeleton
  if (loading || !current) return (
    <section style={{ background: '#000', padding: 'clamp(80px, 12vw, 160px) 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ padding: '0 clamp(20px, 6vw, 80px)' }}>
        <div style={{ height: '14px', width: '120px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '20px' }} />
        <div style={{ height: '56px', width: '260px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: 'clamp(40px, 5vw, 64px)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px, 4vw, 56px)', minHeight: 'clamp(320px, 45vw, 520px)' }} className="gallery-carousel-grid">
          <div style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.04)', animation: 'gallery-pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: 'clamp(16px, 2vw, 32px) 0' }}>
            <div style={{ height: '12px', width: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
            <div style={{ height: '48px', width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
            <div style={{ height: '60px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gallery-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 768px) { .gallery-carousel-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )

  return (
    <section
      id="gallery"
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(80px, 12vw, 160px) 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '0 clamp(20px, 6vw, 80px)',
        marginBottom: 'clamp(40px, 5vw, 64px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '24px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}>
        <div>
          <p style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(102,140,141,0.5)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Selected Works
          </p>
          <h2 className="font-display" style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            精選作品
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.15em',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {String(activeIdx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          <button onClick={goPrev} aria-label="上一個作品"
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s ease, color 0.2s ease' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goNext} aria-label="下一個作品"
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s ease, color 0.2s ease' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div
        style={{ padding: '0 clamp(20px, 6vw, 80px)', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.15s' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(24px, 4vw, 56px)',
          alignItems: 'stretch',
          minHeight: 'clamp(320px, 45vw, 520px)',
          position: 'relative',
        }} className="gallery-carousel-grid">

          {/* Image panel */}
          <div
            className="gallery-image-panel"
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => navigate(`/works/${current.slug}`)}
          >
            {prev && (
              <div key={`prev-${prevIdx}`} style={{
                position: 'absolute', inset: 0, borderRadius: '8px',
                background: prev.color,
                opacity: transitioning ? 0 : 1,
                transition: `opacity ${TRANSITION_DURATION}ms ease`,
                zIndex: 1, overflow: 'hidden',
              }}>
                <WorkImage work={prev} />
              </div>
            )}
            <div key={`curr-${activeIdx}`} style={{
              position: 'absolute', inset: 0, borderRadius: '8px',
              background: current.color,
              opacity: transitioning ? 0 : 1,
              transition: `opacity ${TRANSITION_DURATION}ms ease`,
              zIndex: 2, overflow: 'hidden',
            }}>
              <WorkImage work={current} />
            </div>
            {/* spacer to give the panel its height */}
            <div style={{ width: '100%', height: '100%', background: current.color, borderRadius: '8px', visibility: 'hidden' }} />

            {/* Domain badge */}
            <div style={{
              position: 'absolute', top: '16px', left: '16px', zIndex: 10,
              padding: '5px 12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
              borderRadius: '100px', border: `1px solid rgba(102,140,141,0.4)`,
            }}>
              <span style={{
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: '10px',
                color: 'rgb(102,140,141)',
                letterSpacing: '0.12em',
              }}>
                {current.domainLabel}
              </span>
            </div>
          </div>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(16px, 2vw, 32px) 0' }}>
            <div>
              <p style={{
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(102,140,141,0.7)',
                textTransform: 'uppercase',
                marginBottom: '20px',
                transition: `color ${TRANSITION_DURATION}ms ease`,
              }}>
                {DOMAIN_EN[current.domain] ?? current.domainLabel} · {current.year}
              </p>
              <h3
                className="font-display"
                style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontSize: 'clamp(28px, 4vw, 52px)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? 'translateY(8px)' : 'none',
                  transition: `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/works/${current.slug}`)}
              >
                {current.title}
              </h3>
              {current.shortDesc && (
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: 'clamp(13px, 1.4vw, 15px)',
                  color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.8,
                  maxWidth: '400px',
                  opacity: transitioning ? 0 : 1,
                  transform: transitioning ? 'translateY(6px)' : 'none',
                  transition: `opacity ${TRANSITION_DURATION}ms ease 0.05s, transform ${TRANSITION_DURATION}ms ease 0.05s`,
                }}>
                  {current.shortDesc}
                </p>
              )}
            </div>

            <div>
              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {items.map((_, idx) => (
                  <button key={idx} onClick={() => goTo(idx)} aria-label={`切換至 ${items[idx].title}`}
                    style={{
                      width: idx === activeIdx ? '28px' : '6px', height: '6px', borderRadius: '3px',
                      background: idx === activeIdx ? 'rgb(102,140,141)' : 'rgba(255,255,255,0.15)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              {/* Progress bar */}
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                <div key={`progress-${activeIdx}`} style={{
                  height: '100%', background: 'rgb(102,140,141)', borderRadius: '1px',
                  animation: paused ? 'none' : `gallery-progress ${SLIDE_DURATION}ms linear forwards`,
                  opacity: paused ? 0.3 : 1,
                }} />
              </div>
              <p style={{
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: '10px',
                color: 'rgba(255,255,255,0.18)',
                letterSpacing: '0.1em',
                marginTop: '10px',
              }}>
                {paused ? '已暫停' : '自動播放中'}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '12px', marginTop: 'clamp(20px, 3vw, 36px)', overflowX: 'auto', paddingBottom: '4px' }} className="gallery-thumbs">
          {items.map((item, idx) => (
            <button key={item.id} onClick={() => goTo(idx)} aria-label={`切換至 ${item.title}`}
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
              style={{
                flexShrink: 0, width: 'clamp(80px, 12vw, 120px)', aspectRatio: '4/3',
                background: item.color,
                border: `1px solid ${idx === activeIdx ? 'rgba(102,140,141,0.6)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '6px', cursor: 'pointer', padding: 0, position: 'relative', overflow: 'hidden',
                opacity: idx === activeIdx ? 1 : 0.45,
                transform: idx === activeIdx ? 'scale(1)' : 'scale(0.96)',
                transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
              }}>
              {item.images[0]?.url ? (
                <LazyImage src={item.images[0].url} alt={item.title} containerClassName="w-full h-full" imgClassName="w-full h-full object-cover" />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(102,140,141,0.3)', border: '1px solid rgba(102,140,141,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgb(102,140,141)', opacity: 0.8 }} />
                  </div>
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p style={{ fontFamily: '"LINE Seed TW", sans-serif', fontWeight: 400, fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gallery-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @media (max-width: 768px) {
          .gallery-carousel-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .gallery-image-panel { aspect-ratio: 16/10; }
        }
        .gallery-thumbs::-webkit-scrollbar { height: 2px; }
        .gallery-thumbs::-webkit-scrollbar-track { background: #111; }
        .gallery-thumbs::-webkit-scrollbar-thumb { background: rgb(102,140,141); border-radius: 1px; }
      `}</style>
    </section>
  )
}

function WorkImage({ work }: { work: Work }) {
  if (work.images[0]?.url) {
    return (
      <LazyImage
        src={work.images[0].url}
        alt={work.title}
        containerClassName="w-full h-full"
        imgClassName="w-full h-full object-cover"
        priority
      />
    )
  }
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: 0.35, userSelect: 'none' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(102,140,141,0.25)', border: '1px solid rgba(102,140,141,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgb(102,140,141)' }} />
      </div>
      <span style={{ fontFamily: '"LINE Seed TW", sans-serif', fontWeight: 400, fontSize: '10px', color: 'rgb(102,140,141)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        作品圖片
      </span>
    </div>
  )
}
