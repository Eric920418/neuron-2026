import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const galleryItems = [
  { id: 1, title: "It's Mine", domain: '遊戲', domainEn: 'Game', year: '2026', desc: '多人派對遊戲，搶奪資源、建立同盟，在混亂中尋找勝機。', color: 'rgba(57,255,20,0.08)', accentColor: '#39ff14' },
  { id: 2, title: '感知邊界', domain: '互動', domainEn: 'Interactive', year: '2026', desc: '以身體為介面的沉浸式裝置，探索感知的極限與可能。', color: 'rgba(57,255,20,0.06)', accentColor: '#39ff14' },
  { id: 3, title: '訊號', domain: '影視', domainEn: 'Film', year: '2026', desc: '一部關於溝通與誤解的短片，在數位噪音中尋找真實的連結。', color: 'rgba(57,255,20,0.05)', accentColor: '#39ff14' },
  { id: 4, title: '品牌神經', domain: '行銷', domainEn: 'Marketing', year: '2026', desc: '整合品牌識別系統，讓每一個觸點都成為記憶的神經節點。', color: 'rgba(57,255,20,0.07)', accentColor: '#39ff14' },
  { id: 5, title: '迴響', domain: '互動', domainEn: 'Interactive', year: '2026', desc: '聲音視覺化裝置，將環境音轉化為流動的光影神經網絡。', color: 'rgba(57,255,20,0.06)', accentColor: '#39ff14' },
  { id: 6, title: '最後一格', domain: '影視', domainEn: 'Film', year: '2026', desc: '紀錄片，記錄畢業前最後一個學期的集體記憶與告別。', color: 'rgba(57,255,20,0.05)', accentColor: '#39ff14' },
]

const SLIDE_DURATION = 4000
const TRANSITION_DURATION = 700

export default function GallerySection() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const [prevIdx, setPrevIdx] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback((idx: number) => {
    if (transitioning) return
    setPrevIdx(activeIdx)
    setTransitioning(true)
    setActiveIdx(idx)
    if (transitionRef.current) clearTimeout(transitionRef.current)
    transitionRef.current = setTimeout(() => {
      setPrevIdx(null)
      setTransitioning(false)
    }, TRANSITION_DURATION)
  }, [activeIdx, transitioning])

  const goNext = useCallback(() => {
    goTo((activeIdx + 1) % galleryItems.length)
  }, [activeIdx, goTo])

  const goPrev = useCallback(() => {
    goTo((activeIdx - 1 + galleryItems.length) % galleryItems.length)
  }, [activeIdx, goTo])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(() => { goNext() }, SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [activeIdx, paused, goNext])

  const current = galleryItems[activeIdx]
  const prev = prevIdx !== null ? galleryItems[prevIdx] : null

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
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.5em', color: 'rgba(57,255,20,0.5)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Selected Works
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 400, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
            精選作品
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', fontVariantNumeric: 'tabular-nums' }}>
            {String(activeIdx + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
          </span>
          <button onClick={goPrev} aria-label="上一個作品" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s ease, color 0.2s ease' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goNext} aria-label="下一個作品" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s ease, color 0.2s ease' }}>
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

          <div
            style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => navigate(`/works/${current.id}`)}
          >
            {prev && (
              <div key={`prev-${prevIdx}`} style={{
                position: 'absolute', inset: 0, background: prev.color, borderRadius: '8px',
                opacity: transitioning ? 0 : 1, transition: `opacity ${TRANSITION_DURATION}ms ease`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
              }}>
                <ImagePlaceholder item={prev} />
              </div>
            )}
            <div key={`curr-${activeIdx}`} style={{
              position: 'absolute', inset: 0, background: current?.color, borderRadius: '8px',
              opacity: transitioning ? 0 : 1, transition: `opacity ${TRANSITION_DURATION}ms ease`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
            }}>
              <ImagePlaceholder item={current} />
            </div>
            <div style={{ width: '100%', height: '100%', background: current?.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', visibility: 'hidden' }}>
              <ImagePlaceholder item={current} />
            </div>
            <div style={{
              position: 'absolute', top: '16px', left: '16px', zIndex: 10,
              padding: '5px 12px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
              borderRadius: '100px', border: `1px solid ${current?.accentColor}40`,
              transition: `border-color ${TRANSITION_DURATION}ms ease`,
            }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: current?.accentColor, letterSpacing: '0.12em', transition: `color ${TRANSITION_DURATION}ms ease` }}>
                {current?.domain}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 'clamp(16px, 2vw, 32px) 0' }}>
            <div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.3em', color: `${current?.accentColor}70`, textTransform: 'uppercase', marginBottom: '20px', transition: `color ${TRANSITION_DURATION}ms ease` }}>
                {current?.domainEn} · {current?.year}
              </p>
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 400, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '20px',
                  opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(8px)' : 'none',
                  transition: `opacity ${TRANSITION_DURATION}ms ease, transform ${TRANSITION_DURATION}ms ease`,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/works/${current.id}`)}
              >
                {current?.title}
              </h3>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(13px, 1.4vw, 15px)', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: '400px',
                opacity: transitioning ? 0 : 1, transform: transitioning ? 'translateY(6px)' : 'none',
                transition: `opacity ${TRANSITION_DURATION}ms ease 0.05s, transform ${TRANSITION_DURATION}ms ease 0.05s`,
              }}>
                {current?.desc}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {galleryItems.map((item, idx) => (
                  <button key={item.id} onClick={() => goTo(idx)} aria-label={`切換至 ${item.title}`}
                    style={{
                      width: idx === activeIdx ? '28px' : '6px', height: '6px', borderRadius: '3px',
                      background: idx === activeIdx ? current?.accentColor : 'rgba(255,255,255,0.15)',
                      border: 'none', cursor: 'pointer', padding: 0,
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
                <div key={`progress-${activeIdx}`} style={{
                  height: '100%', background: current?.accentColor, borderRadius: '1px',
                  animation: paused ? 'none' : `gallery-progress ${SLIDE_DURATION}ms linear forwards`,
                  opacity: paused ? 0.3 : 1,
                }} />
              </div>
              <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', marginTop: '10px' }}>
                {paused ? '已暫停' : '自動播放中'}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: 'clamp(20px, 3vw, 36px)', overflowX: 'auto', paddingBottom: '4px' }} className="gallery-thumbs">
          {galleryItems.map((item, idx) => (
            <button key={item.id} onClick={() => goTo(idx)} aria-label={`切換至 ${item.title}`}
              onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
              style={{
                flexShrink: 0, width: 'clamp(80px, 12vw, 120px)', aspectRatio: '4/3',
                background: item.color, border: `1px solid ${idx === activeIdx ? item.accentColor + '60' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '6px', cursor: 'pointer', padding: 0, position: 'relative', overflow: 'hidden',
                opacity: idx === activeIdx ? 1 : 0.45, transform: idx === activeIdx ? 'scale(1)' : 'scale(0.96)',
                transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease',
              }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: `${item.accentColor}30`, border: `1px solid ${item.accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: item.accentColor, opacity: 0.8 }} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
          .gallery-carousel-grid { grid-template-columns: 1fr !important; }
        }
        .gallery-thumbs::-webkit-scrollbar { height: 2px; }
        .gallery-thumbs::-webkit-scrollbar-track { background: #111; }
        .gallery-thumbs::-webkit-scrollbar-thumb { background: #39ff14; border-radius: 1px; }
      `}</style>
    </section>
  )
}

function ImagePlaceholder({ item }: { item: typeof galleryItems[0] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${item.accentColor}25`, border: `1px solid ${item.accentColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: item.accentColor }} />
      </div>
      <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: item.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        作品圖片
      </span>
    </div>
  )
}
