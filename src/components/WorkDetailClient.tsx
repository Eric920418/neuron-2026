import { Link } from 'react-router-dom'
import type { Work } from '../data/works'

interface WorkDetailClientProps {
  work: Work
}

export default function WorkDetailClient({ work }: WorkDetailClientProps) {
  return (
    <div style={{ paddingTop: '64px' }}>
      {/* ── Hero banner ── */}
      <div
        style={{
          width: '100%',
          aspectRatio: '21/8',
          background: work.color,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          minHeight: '280px',
        }}
      >
        {/* Decorative neural glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 50% 60%, ${work.accentColor}18 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Image placeholder */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            opacity: 0.3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke={work.accentColor}
            strokeWidth="0.7"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              color: work.accentColor,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            主視覺圖片
          </span>
        </div>

        {/* Domain badge */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: 'clamp(20px, 6vw, 80px)',
            padding: '5px 14px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            borderRadius: '100px',
            border: `1px solid ${work.accentColor}40`,
          }}
        >
          <span
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              color: work.accentColor,
              letterSpacing: '0.12em',
            }}
          >
            {work.domainLabel}
          </span>
        </div>

        {/* Back link */}
        <Link
          to="/works"
          style={{
            position: 'absolute',
            top: '24px',
            right: 'clamp(20px, 6vw, 80px)',
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
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.08em',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color = 'rgba(255,255,255,0.85)'
            el.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.color = 'rgba(255,255,255,0.55)'
            el.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回作品列表
        </Link>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) clamp(20px, 6vw, 80px)',
        }}
      >
        {/* Title block */}
        <div style={{ marginBottom: 'clamp(40px, 6vw, 72px)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '10px',
            }}
          >
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {work.title}
            </h1>
            <span
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.12em',
              }}
            >
              {work.year}
            </span>
          </div>
          <p
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              color: `${work.accentColor}90`,
              letterSpacing: '0.06em',
            }}
          >
            {work.team}
          </p>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 'clamp(40px, 5vw, 80px)',
            alignItems: 'start',
          }}
          className="work-page-grid"
        >
          {/* ── Left column ── */}
          <div>
            {/* Short desc lead */}
            <p
              className="font-display"
              style={{
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.55,
                letterSpacing: '-0.01em',
                marginBottom: '40px',
                borderLeft: `3px solid ${work.accentColor}60`,
                paddingLeft: '20px',
              }}
            >
              {work.shortDesc}
            </p>

            {/* Full description */}
            <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                作品介紹
              </p>
              {work.fullDesc.split('\n\n').map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.9,
                    marginBottom: '20px',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* ── Image gallery ── */}
            <div style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}>
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                作品圖片
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                }}
                className="work-images-grid"
              >
                {work.images.map((img) => (
                  <ImageCard key={img.id} img={img} work={work} />
                ))}
              </div>
            </div>

            {/* ── Video embed ── */}
            <div>
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}
              >
                作品影片
              </p>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: `${work.accentColor}18`,
                    border: `1px solid ${work.accentColor}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={work.accentColor}
                    opacity="0.65"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.4)',
                      marginBottom: '6px',
                    }}
                  >
                    {work.video.caption}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.18)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    影片嵌入位置（YouTube / Vimeo / 直接上傳）
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tags */}
            <div
              style={{
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.35em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                使用技術
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 10px',
                      border: `1px solid ${work.accentColor}30`,
                      borderRadius: '100px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: `${work.accentColor}90`,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Team members */}
            <div
              style={{
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.35em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                創作團隊
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {work.members.map((member, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: `${work.accentColor}15`,
                        border: `1px solid ${work.accentColor}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '10px',
                          color: `${work.accentColor}80`,
                          fontWeight: 600,
                        }}
                      >
                        {member.charAt(0)}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.6)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {member}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exhibition info */}
            <div
              style={{
                padding: '24px',
                border: `1px solid ${work.accentColor}20`,
                borderRadius: '8px',
                background: `${work.accentColor}06`,
              }}
            >
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.35em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                展出資訊
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: `${work.accentColor}70`,
                      letterSpacing: '0.08em',
                      marginBottom: '3px',
                    }}
                  >
                    校外展
                  </p>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.65)',
                      fontWeight: 500,
                      marginBottom: '2px',
                    }}
                  >
                    2026.05.08 — 05.11
                  </p>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    松山文創園區 二號倉庫
                  </p>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <div>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.25)',
                      letterSpacing: '0.08em',
                      marginBottom: '3px',
                    }}
                  >
                    校內展
                  </p>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.5)',
                      fontWeight: 500,
                      marginBottom: '2px',
                    }}
                  >
                    2026.04.24 — 04.26
                  </p>
                  <p
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    元智大學 圖書館一樓大廳
                  </p>
                </div>
              </div>
            </div>

            {/* Back to works */}
            <Link
              to="/works"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,255,255,0.7)'
                el.style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,255,255,0.4)'
                el.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              返回所有作品
            </Link>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .work-page-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .work-images-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .work-images-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function ImageCard({
  img,
  work,
}: {
  img: { id: string; caption: string }
  work: Work
}) {
  return (
    <div
      style={{
        aspectRatio: '4/3',
        background: work.color,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${work.accentColor}30`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={work.accentColor}
        strokeWidth="1"
        opacity="0.35"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.05em',
          textAlign: 'center',
          lineHeight: 1.4,
        }}
      >
        {img.caption}
      </span>
    </div>
  )
}
