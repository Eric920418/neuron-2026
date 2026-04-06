import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchTeamsPublic, type Work } from '../data/works'
import LazyImage from '../components/LazyImage'
import { IMAGE_PRESETS, buildSrcSet, getOptimizedImageUrl } from '../utils/image'

export default function WorkDetail() {
  const { slug } = useParams()
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    fetchTeamsPublic()
      .then(works => {
        const found = works.find(w => w.slug === slug)
        if (found) {
          setWork(found)
        } else {
          setError('找不到此作品')
        }
      })
      .catch(err => setError(err.message || '無法載入作品'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!work?.images[0]?.url) return
    const heroUrl = work.images[0].url
    const preset = IMAGE_PRESETS.hero
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedImageUrl(heroUrl, 1200, 90)
    link.setAttribute('imagesrcset', buildSrcSet(heroUrl, preset.widths, 90))
    link.setAttribute('imagesizes', preset.sizes)
    link.fetchPriority = 'high'
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [work])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '64px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(102,140,141,0.3)',
          borderTopColor: 'rgb(102,140,141)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (error || !work) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        paddingTop: '64px',
      }}>
        <p style={{
          fontFamily: '"LINE Seed TW", sans-serif',
          fontSize: '16px',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {error || '找不到此作品'}
        </p>
        <Link
          to="/works"
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: '"LINE Seed TW", sans-serif',
            fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          返回作品列表
        </Link>
      </div>
    )
  }

  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url)

  return (
    <div style={{ background: '#000', minHeight: '100vh', paddingTop: '64px' }}>
      {/* Hero */}
      <div className="work-hero" style={{
        width: '100%',
        aspectRatio: '21/9',
        background: work.color,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {work.images[0]?.url ? (
          isVideo(work.images[0].url) ? (
            <video
              src={work.images[0].url}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <LazyImage
              src={work.images[0].url}
              alt={work.title}
              containerClassName="w-full h-full"
              imgClassName="w-full h-full object-cover"
              preset="hero"
              priority
            />
          )
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            opacity: 0.3,
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={work.accentColor} strokeWidth="0.7">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <span style={{
              fontFamily: '"LINE Seed TW", sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: work.accentColor,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              主視覺圖片 / 影片
            </span>
          </div>
        )}

        {/* Subtle bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '15%',
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
          border: '1px solid rgba(102,140,141,0.4)',
        }}>
          <span style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontWeight: 400,
            fontSize: '11px',
            color: work.accentColor,
            letterSpacing: '0.12em',
          }}>
            {work.domainLabel}
          </span>
        </div>

        {/* Back link */}
        <Link
          to="/works"
          style={{
            position: 'absolute',
            top: '28px',
            right: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.12)',
            textDecoration: 'none',
            color: 'rgba(255,255,255,0.55)',
            fontFamily: '"LINE Seed TW", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.08em',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回作品列表
        </Link>

      </div>

      {/* Title block — below hero image */}
      <div style={{
        padding: 'clamp(24px, 4vw, 48px) clamp(24px, 6vw, 80px)',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        <h2 className="font-display" style={{
          fontFamily: '"LINE Seed TW", sans-serif',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          {work.title}
        </h2>
        <span style={{
          fontFamily: '"LINE Seed TW", sans-serif',
          fontWeight: 400,
          fontSize: '12px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
        }}>
          {work.year}
        </span>
        {work.orgName && (
          <span style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontWeight: 400,
            fontSize: '15px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.05em',
            display: 'block',
            marginTop: '8px',
          }}>
            {work.orgName}
          </span>
        )}
        {work.team.startsWith('指導老師') && (
          <span style={{
            fontFamily: '"LINE Seed TW", sans-serif',
            fontWeight: 400,
            fontSize: '18px',
            color: 'rgba(102,140,141,0.85)',
            letterSpacing: '0.05em',
            display: 'block',
            marginTop: '8px',
          }}>
            {work.team}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)',
      }}>
        {/* Tags */}
        {work.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '56px' }}>
            {work.tags.map(tag => (
              <span key={tag} style={{
                padding: '5px 12px',
                border: '1px solid rgba(102,140,141,0.35)',
                borderRadius: '100px',
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: 'rgba(102,140,141,0.9)',
                letterSpacing: '0.06em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {work.shortDesc && (
          <div style={{ marginBottom: '72px' }}>
            <p style={{
              fontFamily: '"LINE Seed TW", sans-serif',
              fontWeight: 400,
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              作品介紹
            </p>
            <div style={{ maxWidth: '720px' }}>
              <p style={{
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(15px, 1.6vw, 18px)',
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.8,
                borderLeft: '2px solid rgba(102,140,141,0.6)',
                paddingLeft: '20px',
                marginBottom: work.fullDesc !== work.shortDesc ? '32px' : '0',
              }}>
                {work.shortDesc}
              </p>
              {work.fullDesc !== work.shortDesc && work.fullDesc.split('\n\n').map((para, i) => (
                <p key={i} style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
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
        )}

        {/* Image Gallery */}
        {work.images.length > 1 && (
          <div style={{ marginBottom: '72px' }}>
            <p style={{
              fontFamily: '"LINE Seed TW", sans-serif',
              fontWeight: 400,
              fontSize: '10px',
              letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              作品圖片
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              {work.images.filter(img => img.url).map(img => (
                <div key={img.id} style={{
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  background: work.color,
                }}>
                  {isVideo(img.url!) ? (
                    <video
                      src={img.url}
                      controls
                      playsInline
                      preload="metadata"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <LazyImage
                      src={img.url!}
                      alt={img.caption}
                      containerClassName="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                      preset="gallery"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team & Exhibition */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '72px',
        }} className="work-meta-grid">
          {work.members.length > 0 && (
            <div style={{
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <p style={{
                fontFamily: '"LINE Seed TW", sans-serif',
                fontWeight: 400,
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}>
                創作團隊
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {work.members.map((member, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(102,140,141,0.15)',
                      border: '1px solid rgba(102,140,141,0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: '"LINE Seed TW", sans-serif',
                        fontSize: '11px',
                        color: 'rgba(102,140,141,0.8)',
                        fontWeight: 700,
                      }}>
                        {member.charAt(0)}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: '"LINE Seed TW", sans-serif',
                      fontWeight: 400,
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
          )}

          <div style={{
            padding: '32px',
            border: '1px solid rgba(102,140,141,0.2)',
            borderRadius: '10px',
            background: 'rgba(102,140,141,0.05)',
          }}>
            <p style={{
              fontFamily: '"LINE Seed TW", sans-serif',
              fontWeight: 400,
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
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: 'rgba(102,140,141,0.7)',
                  letterSpacing: '0.06em',
                  marginBottom: '4px',
                }}>
                  校外展
                </p>
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '2px',
                }}>
                  2026.05.08 — 05.11
                </p>
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  松山文創園區 二號倉庫
                </p>
              </div>
              <div style={{ height: '1px', background: 'rgba(102,140,141,0.15)' }} />
              <div>
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '11px',
                  color: 'rgba(102,140,141,0.7)',
                  letterSpacing: '0.06em',
                  marginBottom: '4px',
                }}>
                  校內展
                </p>
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '2px',
                }}>
                  2026.04.13 — 04.17
                </p>
                <p style={{
                  fontFamily: '"LINE Seed TW", sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  元智大學 五館三樓、六館玻璃屋
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
          <Link
            to="/works"
            style={{
              padding: '12px 32px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              fontFamily: '"LINE Seed TW", sans-serif',
              fontWeight: 400,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
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
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .work-meta-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .work-hero { aspect-ratio: 16/9 !important; }
        }
      `}</style>
    </div>
  )
}
