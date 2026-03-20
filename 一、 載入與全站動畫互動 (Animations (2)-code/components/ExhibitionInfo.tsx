'use client'

import { useState } from 'react'

const rules = [
  { num: '01', text: '展場內請保持安靜，勿大聲喧嘩，以維護其他觀展者的體驗。' },
  { num: '02', text: '互動裝置作品請依照現場工作人員指示操作，勿強行觸碰或移動設備。' },
  { num: '03', text: '展場內禁止飲食，飲料請置於展場外指定區域。' },
  { num: '04', text: '拍照攝影歡迎，但請關閉閃光燈，並尊重其他觀展者不入鏡的意願。' },
  { num: '05', text: '部分作品有年齡限制或內容警示，請依現場標示遵守。' },
  { num: '06', text: '展場空間有限，高峰時段可能實施人流管制，敬請耐心等候。' },
  { num: '07', text: '攜帶嬰兒車或輪椅者，請洽詢現場工作人員協助無障礙動線。' },
  { num: '08', text: '展品為學生心血結晶，請勿觸碰非互動類展品，共同維護展覽品質。' },
  { num: '09', text: '如有任何疑問或緊急狀況，請立即聯繫現場工作人員或前往服務台。' },
  { num: '10', text: '離場前歡迎填寫觀展回饋表，您的意見是我們最珍貴的收穫。' },
]

export default function ExhibitionInfo() {
  const [openRule, setOpenRule] = useState<string | null>(null)

  return (
    <section
      id="info"
      style={{
        background: '#000',
        padding: '120px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
      data-animate="reveal-on-scroll"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 80px' }}>
        {/* Section label */}
        <p style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: 'rgba(129,140,248,0.7)',
          textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          Exhibition Info
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: '56px',
            fontWeight: 400,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '80px',
          }}
        >
          展覽資訊
        </h2>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          {/* Left — map + info */}
          <div>
            {/* Map placeholder */}
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '32px',
              position: 'relative',
              background: '#0d0d0d',
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.7!2d121.5598!3d25.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9a4f4f4f4f4%3A0x0!2z5p2-5bGx5paH5Yib5ZyL5Y2A!5e0!3m2!1szh-TW!2stw!4v1234567890"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)',
                  display: 'block',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="松山文創園區地圖"
              />
            </div>

            {/* Location info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  ),
                  label: '地址',
                  value: '台北市信義區光復南路133號 松山文創園區二號倉庫',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  ),
                  label: '校外展期',
                  value: '2026年5月8日（五）至5月11日（一）',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  ),
                  label: '交通',
                  value: 'MRT板南線國父紀念館站5號出口，步行約10分鐘',
                },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ color: 'rgba(129,140,248,0.6)', marginTop: '2px', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.3)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '4px',
                    }}>
                      {item.label}
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6,
                    }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — rules accordion */}
          <div>
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginBottom: '32px',
            }}>
              展場規範
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(rules ?? []).map((rule) => {
                const isOpen = openRule === rule.num
                return (
                  <div
                    key={rule.num}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                      onClick={() => setOpenRule(isOpen ? null : rule.num)}
                      aria-expanded={isOpen}
                      aria-label={`規範 ${rule.num}`}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '20px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{
                        fontFamily: 'Instrument Serif, serif',
                        fontSize: '14px',
                        color: isOpen ? '#818cf8' : 'rgba(255,255,255,0.2)',
                        minWidth: '28px',
                        letterSpacing: '0.05em',
                      }}>
                        {rule.num}
                      </span>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '14px',
                        color: isOpen ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
                        flex: 1,
                        lineHeight: 1.5,
                      }}>
                        {rule.text.slice(0, 20)}...
                      </span>
                      <span style={{
                        color: isOpen ? '#818cf8' : 'rgba(255,255,255,0.2)',
                        flexShrink: 0,
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {isOpen
                            ? <path d="M18 15l-6-6-6 6" />
                            : <path d="M6 9l6 6 6-6" />
                          }
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ paddingBottom: '20px', paddingLeft: '48px' }}>
                        <p style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.6)',
                          lineHeight: 1.8,
                        }}>
                          {rule.text}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}