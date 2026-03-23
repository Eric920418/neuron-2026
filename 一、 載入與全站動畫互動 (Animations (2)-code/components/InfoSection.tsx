'use client'

import { useState, useEffect, useRef } from 'react'

const venueRules = [
  { num: '01', rule: '請勿觸碰展品，除非作品說明標示可互動。' },
  { num: '02', rule: '展場內請保持安靜，勿大聲喧嘩，以維護其他觀眾的觀展品質。' },
  { num: '03', rule: '禁止攜帶食物及飲料進入展場（密封瓶裝水除外）。' },
  { num: '04', rule: '拍攝時請關閉閃光燈，部分作品禁止拍攝，請遵守現場標示。' },
  { num: '05', rule: '請勿攜帶寵物入場（導盲犬除外）。' },
  { num: '06', rule: '12 歲以下兒童須由成人陪同入場。' },
  { num: '07', rule: '展場內禁止吸菸，包含電子菸。' },
  { num: '08', rule: '請將手機調至靜音或震動模式。' },
  { num: '09', rule: '如需使用輪椅或嬰兒車，請洽詢現場工作人員協助。' },
  { num: '10', rule: '緊急出口位於展場東西兩側，請留意逃生路線標示。' },
]

const transportInfo = [
  {
    method: '捷運',
    icon: '🚇',
    desc: '搭乘文湖線至「國父紀念館站」1號出口，步行約 8 分鐘；或搭乘板南線至「市政府站」3號出口，步行約 10 分鐘。',
  },
  {
    method: '公車',
    icon: '🚌',
    desc: '搭乘 33、52、278、299、605 等路線至「松山文創園區」站下車。',
  },
  {
    method: '開車',
    icon: '🚗',
    desc: '地址：台北市信義區光復南路 133 號。園區內設有停車場，建議搭乘大眾運輸工具。',
  },
]

export default function InfoSection() {
  const [openRule, setOpenRule] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="info"
      ref={sectionRef}
      style={{
        background: '#000',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
            color: 'rgba(57,255,20,0.5)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Exhibition Info
          </p>
          <h2 className="font-display" style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            展覽資訊
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(40px, 6vw, 80px)',
          marginBottom: 'clamp(60px, 8vw, 100px)',
        }} className="info-main-grid">
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              展期與地點
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                padding: '28px',
                border: '1px solid rgba(57,255,20,0.2)',
                borderRadius: '8px',
                background: 'rgba(57,255,20,0.03)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '3px',
                  height: '100%',
                  background: 'linear-gradient(to bottom, #39ff14, #2be010)',
                }} />
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: 'rgba(57,255,20,0.7)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  校外展
                </p>
                <p className="font-display" style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 400,
                  color: '#fff',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  2026.05.08 — 05.11
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '4px',
                }}>
                  松山文創園區 二號倉庫
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  台北市信義區光復南路 133 號
                </p>
              </div>

              <div style={{
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.02)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '3px',
                  height: '100%',
                  background: 'rgba(255,255,255,0.15)',
                }} />
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}>
                  校內展
                </p>
                <p className="font-display" style={{
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}>
                  2026.04.13 — 04.17
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '4px',
                }}>
                  元智大學 五館三樓、六館玻璃屋
                </p>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.25)',
                }}>
                  桃園市中壢區遠東路 135 號
                </p>
              </div>
            </div>

            <div style={{ marginTop: '32px' }}>
              <h3 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                交通指引（校外展）
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transportInfo.map(t => (
                  <div key={t.method} style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{t.icon}</span>
                    <div>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '4px',
                        letterSpacing: '0.05em',
                      }}>
                        {t.method}
                      </p>
                      <p style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.35)',
                        lineHeight: 1.6,
                      }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s',
          }}>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              地圖
            </h3>
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'relative',
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.8!2d121.5597!3d25.0408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da9c9b1f%3A0x1234567890abcdef!2z5p2-5bGx5paH5Ym15ZyL5Y2A5LqM6Jmf5YCJ5bqr!5e0!3m2!1szh-TW!2stw!4v1234567890"
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="松山文創園區地圖"
              />
            </div>
            <a
              href="https://maps.google.com/?q=松山文創園區"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '12px',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px',
                color: 'rgba(57,255,20,0.6)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#39ff14' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(57,255,20,0.6)' }}
            >
              在 Google Maps 中開啟
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </div>

        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(24px)',
          transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
        }}>
          <h3 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            展場規範
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {venueRules.map((item, idx) => {
              const isOpen = openRule === item.num
              return (
                <div
                  key={item.num}
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    borderBottom: idx === venueRules.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <button
                    onClick={() => setOpenRule(isOpen ? null : item.num)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '16px 0',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    aria-expanded={isOpen}
                  >
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      letterSpacing: '0.2em',
                      color: isOpen ? 'rgba(57,255,20,0.7)' : 'rgba(255,255,255,0.2)',
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                      transition: 'color 0.2s ease',
                    }}>
                      {item.num}
                    </span>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px',
                      color: isOpen ? '#fff' : 'rgba(255,255,255,0.55)',
                      flex: 1,
                      lineHeight: 1.5,
                      transition: 'color 0.2s ease',
                    }}>
                      {item.rule}
                    </p>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isOpen ? 'rgba(57,255,20,0.7)' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="1.5"
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s ease, stroke 0.2s ease',
                      }}
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .info-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}