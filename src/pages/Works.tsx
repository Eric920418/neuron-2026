import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { filters, type Domain, type Work, type APIResponse, teamToWork } from '../data/works'

export default function Works() {
  const navigate = useNavigate()
  const [allWorks, setAllWorks] = useState<Work[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeFilter, setActiveFilter] = useState<Domain>('all')
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([])
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // 從後台載入組別
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL ?? '/api'
    fetch(`${apiUrl}/teams/public`)
      .then(res => res.json())
      .then((json: APIResponse) => {
        if (json.success && json.data.teams.length > 0) {
          const mapped = json.data.teams.map((t, i) => teamToWork(t, i))
          setAllWorks(mapped)
          setFilteredWorks(mapped)
        } else {
          setError('暫無作品資料')
        }
      })
      .catch(() => setError('無法載入作品，請稍後再試'))
      .finally(() => setLoading(false))
  }, [])

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
      setFilteredWorks(key === 'all' ? allWorks : allWorks.filter(w => w.domain === key))
      setAnimating(false)
    }, 200)
  }

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        minHeight: '100vh',
        paddingTop: 'calc(64px + clamp(40px, 6vw, 80px))',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: 'clamp(48px, 6vw, 80px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(20px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <p style={{
            fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(102,140,141,0.5)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            All Works
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <h1 className="font-display" style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              所有作品
            </h1>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  style={{
                    padding: '10px 16px 8px',
                    background: activeFilter === f.key ? 'rgba(102,140,141,0.15)' : 'transparent',
                    border: `1px solid ${activeFilter === f.key ? 'rgba(102,140,141,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '100px',
                    fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: 1,
                    color: activeFilter === f.key ? 'rgb(102,140,141)' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    if (activeFilter !== f.key) {
                      e.currentTarget.style.borderColor = 'rgba(102,140,141,0.25)'
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
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ height: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px', width: '60%' }} />
                  <div style={{ height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            letterSpacing: '0.05em',
          }}>
            {error}
          </div>
        )}

        {/* Works grid */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'none',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            {filteredWorks.map((work, idx) => (
              <article
                key={work.id}
                onClick={() => navigate(`/works/${work.slug}`)}
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
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(102,140,141,0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Image area */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: work.color,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {work.images[0]?.url ? (
                    <img
                      src={work.images[0].url}
                      alt={work.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: 0.4,
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={work.accentColor} strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span style={{
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontWeight: 400,
                        fontSize: '10px',
                        color: work.accentColor,
                        letterSpacing: '0.1em',
                      }}>
                        作品圖片
                      </span>
                    </div>
                  )}

                  {/* Domain badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '5px 10px 4px',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: 1,
                      color: work.accentColor,
                      letterSpacing: '0.08em',
                    }}>
                      {work.domainLabel}
                    </span>
                  </div>

                  {/* View detail hint */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontWeight: 400,
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.05em',
                    }}>
                      查看詳情
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                    <h2 className="font-display" style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '-0.01em',
                    }}>
                      {work.title}
                    </h2>
                    <span style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.1em',
                    }}>
                      {work.year}
                    </span>
                  </div>
                  {work.shortDesc && (
                    <p style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.4)',
                      lineHeight: 1.6,
                      marginBottom: '14px',
                    }}>
                      {work.shortDesc}
                    </p>
                  )}
                  {work.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {work.tags.map(tag => (
                        <span key={tag} style={{
                          padding: '3px 8px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '100px',
                          fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                          fontWeight: 400,
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.3)',
                          letterSpacing: '0.05em',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}
