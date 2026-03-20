'use client'

import { useState } from 'react'

type ExhibitionType = 'outdoor' | 'indoor' | null
type Domain = string | null

const domains = ['互動', '遊戲', '行銷', '影視']
const timeSlots = [
  '10:00', '10:20', '10:40', '11:00', '11:20', '11:40',
  '12:00', '12:20', '12:40', '13:00', '13:20', '13:40',
  '14:00', '14:20', '14:40', '15:00', '15:20', '15:40',
  '16:00', '16:20', '16:40', '17:00',
]
const fullSlots = ['10:40', '11:20', '13:00', '14:40', '16:20']

const dates = [
  { date: '05/08', day: '五', label: '2026.05.08' },
  { date: '05/09', day: '六', label: '2026.05.09' },
  { date: '05/10', day: '日', label: '2026.05.10' },
  { date: '05/11', day: '一', label: '2026.05.11' },
]

function generateBookingId() {
  return 'N2026-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function BookingSystem() {
  const [step, setStep] = useState(1)
  const [exhibitionType, setExhibitionType] = useState<ExhibitionType>(null)
  const [selectedDomain, setSelectedDomain] = useState<Domain>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [people, setPeople] = useState(1)
  const [bookingId, setBookingId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleConfirm = () => {
    setBookingId(generateBookingId())
    setStep(4)
  }

  return (
    <section
      id="booking"
      style={{
        background: '#000',
        padding: '120px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
      data-animate="reveal-on-scroll"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'rgba(129,140,248,0.7)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            Reservation
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: '56px',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            預約參觀
          </h2>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ display: 'flex', gap: '0', marginBottom: '64px', maxWidth: '600px' }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: step >= s ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: step >= s ? '0 0 12px rgba(99,102,241,0.4)' : 'none',
                }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: step >= s ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}>
                    {s}
                  </span>
                </div>
                {s < 3 && (
                  <div style={{
                    flex: 1,
                    height: '1px',
                    background: step > s ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)',
                    margin: '0 8px',
                  }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Exhibition type */}
        {step === 1 && (
          <div data-animate="fade-up">
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '32px',
              letterSpacing: '0.02em',
            }}>
              選擇展覽類型
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
              {[
                {
                  type: 'outdoor' as ExhibitionType,
                  title: '校外展',
                  subtitle: '松山文創園區二號倉庫',
                  date: '2026.05.08 — 05.11',
                },
                {
                  type: 'indoor' as ExhibitionType,
                  title: '校內展',
                  subtitle: '元智大學資訊館',
                  date: '2026.04.25 — 04.27',
                },
              ].map((opt) => (
                <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                  key={opt.type ?? ''}
                  onClick={() => setExhibitionType(opt.type)}
                  aria-pressed={exhibitionType === opt.type}
                  style={{
                    background: exhibitionType === opt.type
                      ? 'rgba(99,102,241,0.15)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${exhibitionType === opt.type ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px',
                    padding: '28px 24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <p style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '24px',
                    color: '#fff',
                    marginBottom: '8px',
                    fontWeight: 400,
                  }}>
                    {opt.title}
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: '4px',
                  }}>
                    {opt.subtitle}
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    color: exhibitionType === opt.type ? '#818cf8' : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.05em',
                  }}>
                    {opt.date}
                  </p>
                </button>
              ))}
            </div>
            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => exhibitionType && setStep(2)}
              disabled={!exhibitionType}
              style={{
                marginTop: '40px',
                background: exhibitionType ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '4px',
                padding: '14px 32px',
                color: exhibitionType ? '#fff' : 'rgba(255,255,255,0.3)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                letterSpacing: '0.1em',
                cursor: exhibitionType ? 'pointer' : 'not-allowed',
                fontWeight: 600,
              }}
            >
              下一步
            </button>
          </div>
        )}

        {/* Step 2: Domain */}
        {step === 2 && (
          <div data-animate="fade-up">
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '32px',
            }}>
              選擇展出領域
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '700px' }}>
              {(domains ?? []).map((d) => (
                <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  aria-pressed={selectedDomain === d}
                  style={{
                    background: selectedDomain === d ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedDomain === d ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '6px',
                    padding: '20px 16px',
                    cursor: 'pointer',
                    color: selectedDomain === d ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '22px',
                    fontWeight: 400,
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => setStep(1)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  padding: '14px 24px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                上一步
              </button>
              <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => selectedDomain && setStep(3)}
                disabled={!selectedDomain}
                style={{
                  background: selectedDomain ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '14px 32px',
                  color: selectedDomain ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  cursor: selectedDomain ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                }}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Date / Time / People */}
        {step === 3 && (
          <div data-animate="fade-up">
            <h3 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '16px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '32px',
            }}>
              選擇日期、時段與人數
            </h3>

            {/* Date selector */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                日期
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {(dates ?? []).map((d) => (
                  <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    aria-pressed={selectedDate === d.date}
                    style={{
                      background: selectedDate === d.date ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedDate === d.date ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '6px',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{
                      fontFamily: 'Instrument Serif, serif',
                      fontSize: '20px',
                      color: selectedDate === d.date ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                      fontWeight: 400,
                      marginBottom: '4px',
                    }}>
                      {d.date}
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.3)',
                    }}>
                      {d.day}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* People */}
            <div style={{ marginBottom: '32px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                人數
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setPeople(Math.max(1, people - 1))}
                  aria-label="減少人數"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  −
                </button>
                <span style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: '32px',
                  color: '#fff',
                  minWidth: '40px',
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                  {people}
                </span>
                <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setPeople(Math.min(6, people + 1))}
                  aria-label="增加人數"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  +
                </button>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  最多6人
                </span>
              </div>
            </div>

            {/* Time slots */}
            <div style={{ marginBottom: '40px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}>
                時段（每格20分鐘）
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(timeSlots ?? []).map((slot) => {
                  const isFull = fullSlots.includes(slot)
                  const isSelected = selectedTime === slot
                  return (
                    <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                      key={slot}
                      onClick={() => !isFull && setSelectedTime(slot)}
                      disabled={isFull}
                      aria-pressed={isSelected}
                      aria-label={`${slot} ${isFull ? '已額滿' : ''}`}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '4px',
                        border: `1px solid ${isSelected ? 'rgba(99,102,241,0.6)' : isFull ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}`,
                        background: isSelected
                          ? 'rgba(99,102,241,0.2)'
                          : isFull
                          ? 'rgba(255,255,255,0.02)'
                          : 'transparent',
                        color: isSelected
                          ? '#a5b4fc'
                          : isFull
                          ? 'rgba(255,255,255,0.15)'
                          : 'rgba(255,255,255,0.55)',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '12px',
                        cursor: isFull ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.05em',
                        textDecoration: isFull ? 'line-through' : 'none',
                      }}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.2)',
                marginTop: '12px',
              }}>
                ✕ 劃線時段已額滿
              </p>
            </div>

            {/* Contact info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '500px', marginBottom: '32px' }}>
              <div>
                <label style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}>
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="您的姓名"
                  aria-label="姓名"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '8px',
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => setStep(2)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '4px',
                  padding: '14px 24px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                上一步
              </button>
              <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={handleConfirm}
                disabled={!selectedDate || !selectedTime || !name || !email}
                style={{
                  background: selectedDate && selectedTime && name && email
                    ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                    : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '14px 32px',
                  color: selectedDate && selectedTime && name && email ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  cursor: selectedDate && selectedTime && name && email ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                }}
              >
                確認預約
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              textAlign: 'center',
            }}
            data-animate="hero-entrance"
          >
            {/* Success animation */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              boxShadow: '0 0 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: '48px',
                fontWeight: 400,
                color: '#fff',
                marginBottom: '16px',
                letterSpacing: '-0.02em',
              }}
            >
              預約成功
            </h3>

            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '32px',
            }}>
              您的預約編號
            </p>

            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '8px',
              padding: '20px 40px',
              marginBottom: '40px',
            }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '24px',
                fontWeight: 700,
                color: '#a5b4fc',
                letterSpacing: '0.15em',
              }}>
                {bookingId}
              </span>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '40px',
            }}>
              {[
                { label: '展覽', value: exhibitionType === 'outdoor' ? '校外展 — 松山文創園區' : '校內展 — 元智大學' },
                { label: '領域', value: selectedDomain ?? '' },
                { label: '日期', value: selectedDate ?? '' },
                { label: '時段', value: selectedTime ?? '' },
                { label: '人數', value: `${people} 人` },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.3)',
                    minWidth: '40px',
                    textAlign: 'right',
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => { setStep(1); setExhibitionType(null); setSelectedDomain(null); setSelectedDate(null); setSelectedTime(null); setPeople(1); setName(''); setEmail('') }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '12px 24px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              再次預約
            </button>
          </div>
        )}
      </div>
    </section>
  )
}