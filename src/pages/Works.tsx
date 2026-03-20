import { useState, useEffect, useRef } from 'react'
import { works, filters, type Domain, type Work } from '../data/works'

export default function Works() {
  const [activeFilter, setActiveFilter] = useState<Domain>('all')
  const [filteredWorks, setFilteredWorks] = useState(works)
  const [animating, setAnimating] = useState(false)
  const [selectedWork, setSelectedWork] = useState<Work | null>(null)
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

  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedWork])

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
    <>
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
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(129,140,248,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              All Works
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <h1 className="font-display" style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 400,
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
          </div>

          {/* Works grid */}
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
                onClick={() => setSelectedWork(work)}
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
                  e.currentTarget.style.borderColor = 'rgba(129,140,248,0.25)'
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
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: work.accentColor,
                      letterSpacing: '0.1em',
                    }}>
                      作品圖片
                    </span>
                  </div>

                  {/* Domain badge */}
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
                      fontFamily: 'Space Grotesk, sans-serif',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <h2 className="font-display" style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '-0.01em',
                    }}>
                      {work.title}
                    </h2>
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
                    color: `${work.accentColor}80`,
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
                    {work.shortDesc}
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work Detail Modal */}
      {selectedWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedWork.title} 作品詳情`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#000',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setSelectedWork(null)}
            aria-label="關閉"
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 210,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Hero */}
          <div style={{
            width: '100%',
            aspectRatio: '21/9',
            background: selectedWork.color,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              opacity: 0.3,
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.7">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                color: selectedWork.accentColor,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                主視覺圖片 / 影片
              </span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, transparent, #000)',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              borderRadius: '100px',
              border: `1px solid ${selectedWork.accentColor}40`,
            }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                color: selectedWork.accentColor,
                letterSpacing: '0.12em',
              }}>
                {selectedWork.domainLabel}
              </span>
            </div>

            <div style={{
              position: 'absolute',
              bottom: '32px',
              left: 'clamp(24px, 6vw, 80px)',
              right: 'clamp(24px, 6vw, 80px)',
            }}>
              <h2 className="font-display" style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}>
                {selectedWork.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  color: `${selectedWork.accentColor}90`,
                  letterSpacing: '0.05em',
                }}>
                  {selectedWork.team}
                </span>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.1em',
                }}>
                  {selectedWork.year}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)',
          }}>
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '56px' }}>
              {selectedWork.tags.map(tag => (
                <span key={tag} style={{
                  padding: '5px 12px',
                  border: `1px solid ${selectedWork.accentColor}35`,
                  borderRadius: '100px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: `${selectedWork.accentColor}90`,
                  letterSpacing: '0.06em',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品介紹
              </p>
              <div style={{ maxWidth: '720px' }}>
                {selectedWork.fullDesc.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.9,
                    marginBottom: '20px',
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Images */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品圖片
              </p>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: selectedWork.color,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
                overflow: 'hidden',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.8" opacity="0.35">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.08em',
                }}>
                  {selectedWork.images[0]?.caption}
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }} className="work-images-secondary-grid">
                {selectedWork.images.slice(1).map(img => (
                  <div key={img.id} style={{
                    aspectRatio: '4/3',
                    background: selectedWork.color,
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.9" opacity="0.35">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.06em',
                      textAlign: 'center',
                      padding: '0 16px',
                    }}>
                      {img.caption}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品影片
              </p>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${selectedWork.accentColor}18`,
                  border: `1px solid ${selectedWork.accentColor}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={selectedWork.accentColor} opacity="0.7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '6px',
                  }}>
                    {selectedWork.video.caption}
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: '0.05em',
                  }}>
                    影片嵌入位置（YouTube / Vimeo / 直接上傳）
                  </p>
                </div>
              </div>
            </div>

            {/* Team & Exhibition */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '72px',
            }} className="work-meta-grid">
              <div style={{
                padding: '32px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  創作團隊
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedWork.members.map((member, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `${selectedWork.accentColor}15`,
                        border: `1px solid ${selectedWork.accentColor}28`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '11px',
                          color: `${selectedWork.accentColor}80`,
                          fontWeight: 600,
                        }}>
                          {member.charAt(0)}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.65)',
                        letterSpacing: '0.02em',
                      }}>
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '32px',
                border: `1px solid ${selectedWork.accentColor}20`,
                borderRadius: '10px',
                background: `${selectedWork.accentColor}05`,
              }}>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  展出資訊
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: `${selectedWork.accentColor}70`,
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}>
                      校外展
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '2px',
                    }}>
                      2026.05.08 — 05.11
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      松山文創園區 二號倉庫
                    </p>
                  </div>
                  <div style={{ height: '1px', background: `${selectedWork.accentColor}15` }} />
                  <div>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: `${selectedWork.accentColor}70`,
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}>
                      校內展
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '2px',
                    }}>
                      2026.04.24 — 04.26
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      元智大學 圖書館一樓大廳
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back button */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
              <button
                onClick={() => setSelectedWork(null)}
                style={{
                  padding: '12px 32px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '100px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                返回所有作品
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .work-meta-grid { grid-template-columns: 1fr !important; }
          .work-images-secondary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
