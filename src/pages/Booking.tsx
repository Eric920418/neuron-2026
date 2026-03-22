import { useState } from 'react'
import { works } from '../data/works'

type ExhibitionType = 'outdoor' | 'indoor' | null
type Domain = '互動' | '遊戲' | '行銷' | '影視' | null

const DOMAINS = ['互動', '遊戲', '行銷', '影視'] as const

const DOMAIN_KEY_MAP: Record<string, string> = {
  '互動': 'interactive',
  '遊戲': 'game',
  '行銷': 'marketing',
  '影視': 'film',
}

const TIME_SLOTS = [
  '10:00', '10:20', '10:40',
  '11:00', '11:20', '11:40',
  '12:00', '12:20', '12:40',
  '13:00', '13:20', '13:40',
  '14:00', '14:20', '14:40',
  '15:00', '15:20', '15:40',
  '16:00', '16:20', '16:40',
  '17:00', '17:20',
]

const OUTDOOR_DATES = ['05/08 (五)', '05/09 (六)', '05/10 (日)', '05/11 (一)']
const INDOOR_DATES = ['04/24 (五)', '04/25 (六)', '04/26 (日)']

const FULL_SLOTS = new Set(['10:00', '10:20', '14:00', '14:20', '15:00'])

function generateBookingNumber() {
  return 'NR' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function Booking() {
  const [step, setStep] = useState(1)
  const [exhibitionType, setExhibitionType] = useState<ExhibitionType>(null)
  const [selectedDomain, setSelectedDomain] = useState<Domain>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [headcount, setHeadcount] = useState(1)
  const [bookingNumber, setBookingNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const dates = exhibitionType === 'outdoor' ? OUTDOOR_DATES : INDOOR_DATES

  const handleStep3Submit = () => {
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)
    setTimeout(() => {
      setBookingNumber(generateBookingNumber())
      setSubmitting(false)
      setStep(4)
    }, 1200)
  }

  const handleReset = () => {
    setStep(1)
    setExhibitionType(null)
    setSelectedDomain(null)
    setSelectedGroup(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setHeadcount(1)
    setBookingNumber('')
  }

  return (
    <section
      style={{
        background: '#000',
        minHeight: '100vh',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        paddingTop: 'calc(64px + clamp(40px, 6vw, 80px))',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <p
            style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(102,140,141,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Reservation
          </p>
          <h2
            className="font-display"
            style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            預約參觀
          </h2>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 'clamp(40px, 5vw, 64px)',
              gap: '0',
            }}
          >
            {[1, 2, 3].map((s, idx) => {
              const isDone = step > s
              const isActive = step === s
              const labels = ['選擇展覽', '選擇領域', '選擇時段']
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', flex: idx < 2 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: `1px solid ${isDone ? '#668C8D' : isActive ? '#668C8D' : 'rgba(255,255,255,0.1)'}`,
                        background: isDone ? '#668C8D' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isDone ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          style={{
                            fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                            fontSize: '11px',
                            color: isActive ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.2)',
                          }}
                        >
                          {s}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.05em',
                        color: isActive ? 'rgba(102,140,141,0.7)' : isDone ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {labels[idx]}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      style={{
                        flex: 1,
                        height: '1px',
                        background: step > s ? 'rgba(102,140,141,0.4)' : 'rgba(255,255,255,0.06)',
                        margin: '0 12px',
                        marginBottom: '24px',
                        transition: 'background 0.3s ease',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <p style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '24px',
              letterSpacing: '0.05em',
            }}>
              請選擇您想參觀的展覽
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }} className="booking-type-grid">
              {[
                {
                  type: 'outdoor' as ExhibitionType,
                  label: '校外展',
                  date: '2026.05.08 — 05.11',
                  venue: '松山文創園區 二號倉庫',
                  desc: '台北市信義區，松菸文創聚落',
                },
                {
                  type: 'indoor' as ExhibitionType,
                  label: '校內展',
                  date: '2026.04.24 — 04.26',
                  venue: '元智大學 圖書館一樓大廳',
                  desc: '桃園市中壢區，元智大學校園內',
                },
              ].map((item) => {
                const isSelected = exhibitionType === item.type
                return (
                  <button
                    key={item.type}
                    onClick={() => setExhibitionType(item.type)}
                    style={{
                      background: isSelected ? 'rgba(102,140,141,0.07)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'rgba(102,140,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      padding: 'clamp(24px, 3vw, 36px)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          border: `1px solid ${isSelected ? 'rgba(102,140,141,0.8)' : 'rgba(255,255,255,0.2)'}`,
                          background: isSelected ? 'rgba(102,140,141,0.8)' : 'transparent',
                          transition: 'all 0.2s ease',
                        }}
                      />
                      <span style={{
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.3em',
                        color: isSelected ? 'rgba(102,140,141,0.7)' : 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase',
                        transition: 'color 0.2s ease',
                      }}>
                        {item.label}
                      </span>
                    </div>
                    <p className="font-display" style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: 'clamp(18px, 2.5vw, 26px)',
                      fontWeight: 700,
                      color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                      letterSpacing: '-0.01em',
                      marginBottom: '8px',
                      transition: 'color 0.2s ease',
                    }}>
                      {item.venue.split(' ')[0]}
                    </p>
                    <p style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '13px',
                      color: isSelected ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)',
                      marginBottom: '4px',
                      transition: 'color 0.2s ease',
                    }}>
                      {item.date}
                    </p>
                    <p style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      {item.desc}
                    </p>
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => exhibitionType && setStep(2)}
                disabled={!exhibitionType}
                style={{
                  padding: '14px 32px',
                  background: exhibitionType ? 'rgba(102,140,141,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${exhibitionType ? 'rgba(102,140,141,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '2px',
                  fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  color: exhibitionType ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.2)',
                  cursor: exhibitionType ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (() => {
          const domainGroups = selectedDomain
            ? works.filter(w => w.domain === DOMAIN_KEY_MAP[selectedDomain])
            : []

          return (
            <div>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '24px',
                letterSpacing: '0.05em',
              }}>
                請選擇您最感興趣的展出領域
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' }} className="booking-domain-grid">
                {DOMAINS.map((domain) => {
                  const isSelected = selectedDomain === domain
                  return (
                    <button
                      key={domain}
                      onClick={() => {
                        setSelectedDomain(domain)
                        setSelectedGroup(null)
                      }}
                      style={{
                        background: isSelected ? 'rgba(102,140,141,0.07)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(102,140,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '28px 20px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <p className="font-display" style={{
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontSize: 'clamp(20px, 2.5vw, 28px)',
                        fontWeight: 700,
                        color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                        letterSpacing: '-0.01em',
                        marginBottom: '4px',
                        transition: 'color 0.2s ease',
                      }}>
                        {domain}
                      </p>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isSelected ? 'rgba(102,140,141,0.8)' : 'rgba(255,255,255,0.1)',
                        margin: '8px auto 0',
                        transition: 'background 0.2s ease',
                        boxShadow: isSelected ? '0 0 8px rgba(102,140,141,0.4)' : 'none',
                      }} />
                    </button>
                  )
                })}
              </div>

              {/* Groups under selected domain */}
              {selectedDomain && domainGroups.length > 0 && (
                <div style={{ marginTop: '32px' }}>
                  <p style={{
                    fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.2)',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}>
                    選擇組別
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2px' }} className="booking-group-grid">
                    {domainGroups.map((work) => {
                      const isSelected = selectedGroup === work.team
                      return (
                        <button
                          key={work.id}
                          onClick={() => setSelectedGroup(work.team)}
                          style={{
                            background: isSelected ? 'rgba(102,140,141,0.07)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'rgba(102,140,141,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            padding: 'clamp(16px, 2vw, 24px)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              border: `1px solid ${isSelected ? 'rgba(102,140,141,0.8)' : 'rgba(255,255,255,0.2)'}`,
                              background: isSelected ? 'rgba(102,140,141,0.8)' : 'transparent',
                              transition: 'all 0.2s ease',
                              flexShrink: 0,
                            }} />
                            <span style={{
                              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                              fontSize: '10px',
                              letterSpacing: '0.2em',
                              color: isSelected ? 'rgba(102,140,141,0.6)' : 'rgba(255,255,255,0.25)',
                              textTransform: 'uppercase',
                              transition: 'color 0.2s ease',
                            }}>
                              {work.team}
                            </span>
                          </div>
                          <p className="font-display" style={{
                            fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                            fontSize: 'clamp(16px, 2vw, 22px)',
                            fontWeight: 700,
                            color: isSelected ? '#fff' : 'rgba(255,255,255,0.6)',
                            letterSpacing: '-0.01em',
                            marginBottom: '6px',
                            transition: 'color 0.2s ease',
                          }}>
                            {work.title}
                          </p>
                          <p style={{
                            fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.3)',
                            lineHeight: 1.5,
                          }}>
                            {work.shortDesc}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '14px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '2px',
                    fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                  }}
                >
                  ← 上一步
                </button>
                <button
                  onClick={() => selectedDomain && selectedGroup && setStep(3)}
                  disabled={!selectedDomain || !selectedGroup}
                  style={{
                    padding: '14px 32px',
                    background: selectedDomain && selectedGroup ? 'rgba(102,140,141,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedDomain && selectedGroup ? 'rgba(102,140,141,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '2px',
                    fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    color: selectedDomain && selectedGroup ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.2)',
                    cursor: selectedDomain && selectedGroup ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                  }}
                >
                  下一步 →
                </button>
              </div>
            </div>
          )
        })()}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                選擇日期
              </p>
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
                {dates.map((date) => {
                  const isSelected = selectedDate === date
                  return (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                      style={{
                        flexShrink: 0,
                        padding: '12px 20px',
                        background: isSelected ? 'rgba(102,140,141,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(102,140,141,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '2px',
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontSize: '13px',
                        color: isSelected ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.4)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {date}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                參觀人數（1–6 人）
              </p>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setHeadcount(n)}
                    style={{
                      width: '44px',
                      height: '44px',
                      background: headcount === n ? 'rgba(102,140,141,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${headcount === n ? 'rgba(102,140,141,0.35)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '2px',
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '14px',
                      color: headcount === n ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                選擇時段（每場 20 分鐘）
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '4px',
                }}
                className="timeslot-grid"
              >
                {TIME_SLOTS.map((slot) => {
                  const isFull = FULL_SLOTS.has(slot)
                  const isSelected = selectedTime === slot
                  return (
                    <button
                      key={slot}
                      onClick={() => !isFull && setSelectedTime(slot)}
                      disabled={isFull}
                      style={{
                        padding: '10px 4px',
                        background: isSelected
                          ? 'rgba(102,140,141,0.1)'
                          : isFull
                          ? 'rgba(255,255,255,0.01)'
                          : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isSelected ? 'rgba(102,140,141,0.35)' : isFull ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '2px',
                        fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                        fontSize: '11px',
                        color: isSelected
                          ? 'rgba(102,140,141,0.9)'
                          : isFull
                          ? 'rgba(255,255,255,0.1)'
                          : 'rgba(255,255,255,0.4)',
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                    >
                      {slot}
                      {isFull && (
                        <span style={{
                          display: 'block',
                          fontSize: '8px',
                          color: 'rgba(255,255,255,0.15)',
                          letterSpacing: '0.05em',
                          marginTop: '2px',
                        }}>
                          額滿
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '2px',
                  fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                }}
              >
                ← 上一步
              </button>
              <button
                onClick={handleStep3Submit}
                disabled={!selectedDate || !selectedTime || submitting}
                style={{
                  padding: '14px 32px',
                  background: selectedDate && selectedTime ? 'rgba(102,140,141,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selectedDate && selectedTime ? 'rgba(102,140,141,0.35)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '2px',
                  fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  color: selectedDate && selectedTime ? 'rgba(102,140,141,0.9)' : 'rgba(255,255,255,0.2)',
                  cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
              >
                {submitting ? '處理中...' : '確認預約 →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(60px, 10vw, 120px) 0',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: '1px solid rgba(102,140,141,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '1px solid rgba(102,140,141,0.15)',
              }} />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(102,140,141,0.9)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(102,140,141,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              預約成功
            </p>

            <h3 className="font-display" style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}>
              歡迎蒞臨
            </h3>

            <p style={{
              fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '48px',
            }}>
              神經元 NEURON 2026
            </p>

            <div style={{
              padding: '32px 40px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(102,140,141,0.03)',
              marginBottom: '40px',
              width: '100%',
              maxWidth: '400px',
            }}>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                預約編號
              </p>
              <p style={{
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 600,
                color: 'rgba(102,140,141,0.9)',
                letterSpacing: '0.15em',
                marginBottom: '24px',
              }}>
                {bookingNumber}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: '展覽', value: exhibitionType === 'outdoor' ? '校外展 · 松山文創園區' : '校內展 · 元智大學' },
                  { label: '領域', value: selectedDomain || '' },
                  { label: '組別', value: selectedGroup || '' },
                  { label: '日期', value: selectedDate || '' },
                  { label: '時段', value: selectedTime || '' },
                  { label: '人數', value: `${headcount} 人` },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.05em',
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '2px',
                fontFamily: '"LINE Seed JP", "Noto Sans TC", sans-serif',
                fontSize: '12px',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              再次預約
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .booking-type-grid { grid-template-columns: 1fr !important; }
          .booking-domain-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .booking-group-grid { grid-template-columns: 1fr !important; }
          .timeslot-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
