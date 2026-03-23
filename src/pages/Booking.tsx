import { useState, useEffect } from 'react'

type ExhibitionType = 'outdoor' | 'indoor' | null
type Domain = '互動' | '遊戲' | '行銷' | '影視' | null

const DOMAINS = ['互動', '遊戲', '行銷', '影視'] as const

const OUTDOOR_DATES = [
  { label: '05/08 (五)', value: '2026-05-08' },
  { label: '05/09 (六)', value: '2026-05-09' },
  { label: '05/10 (日)', value: '2026-05-10' },
  { label: '05/11 (一)', value: '2026-05-11' },
]
const INDOOR_DATES = [
  { label: '04/24 (五)', value: '2026-04-24' },
  { label: '04/25 (六)', value: '2026-04-25' },
  { label: '04/26 (日)', value: '2026-04-26' },
]

// teamType 對應 domain filter
const TEAM_TYPE_TO_DOMAIN: Record<string, Domain> = {
  '互動': '互動',
  '遊戲': '遊戲',
  '行銷': '行銷',
  '影視': '影視',
}

interface AvailableTeam {
  id: string
  name: string
  slug: string
  teamType: string | null
  description: string | null
  artworkTitle: string | null
  exhibition: {
    id: string
    name: string
    year: number
    slug: string
  }
  config: {
    slotDurationMinutes: number
    maxConcurrentCapacity: number
    dailyStartTime: string
    dailyEndTime: string
  }
  queueStats: {
    waiting: number
    estimatedWaitMinutes: number
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export default function Booking() {
  const [step, setStep] = useState(1)
  const [exhibitionType, setExhibitionType] = useState<ExhibitionType>(null)
  const [selectedDomain, setSelectedDomain] = useState<Domain>(null)
  const [selectedTeam, setSelectedTeam] = useState<AvailableTeam | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)  // value (YYYY-MM-DD)
  const [selectedDateLabel, setSelectedDateLabel] = useState<string | null>(null)
  const [visitorName, setVisitorName] = useState('')
  const [visitorPhone, setVisitorPhone] = useState('')
  const [notes, setNotes] = useState('')

  // API state
  const [teams, setTeams] = useState<AvailableTeam[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [teamsError, setTeamsError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [bookingResult, setBookingResult] = useState<{
    sequenceNumber: number
    estimatedWaitMinutes: number
    teamName: string
    reservationDate: string
  } | null>(null)

  const dates = exhibitionType === 'outdoor' ? OUTDOOR_DATES : INDOOR_DATES

  // 當進入 Step 2 時載入可用組別
  useEffect(() => {
    if (step !== 2) return
    setTeamsLoading(true)
    setTeamsError(null)

    const today = new Date().toISOString().split('T')[0]
    const venueParam = exhibitionType === 'outdoor' ? 'OUTDOOR' : 'INDOOR'
    fetch(`${API_URL}/reservations/available-teams?date=${today}&venueType=${venueParam}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setTeams(json.data.teams ?? [])
        } else {
          setTeamsError(json.error ?? '無法載入組別')
        }
      })
      .catch(() => setTeamsError('無法連線，請稍後再試'))
      .finally(() => setTeamsLoading(false))
  }, [step])

  const domainTeams = selectedDomain
    ? teams.filter(t => TEAM_TYPE_TO_DOMAIN[t.teamType ?? ''] === selectedDomain)
    : []

  const canSubmit = selectedDate && visitorName.trim() && /^09\d{8}$/.test(visitorPhone)

  const handleSubmit = async () => {
    if (!canSubmit || !selectedTeam) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedTeam.id,
          visitorName: visitorName.trim(),
          visitorPhone,
          reservationDate: selectedDate,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      })
      const json = await res.json()
      if (json.success) {
        setBookingResult({
          sequenceNumber: json.data.reservation.sequenceNumber,
          estimatedWaitMinutes: json.data.reservation.estimatedWaitMinutes ?? 0,
          teamName: json.data.team?.name ?? selectedTeam.name,
          reservationDate: selectedDate!,
        })
        setStep(4)
      } else {
        setSubmitError(json.error ?? '預約失敗，請稍後再試')
      }
    } catch {
      setSubmitError('網路連線錯誤，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setExhibitionType(null)
    setSelectedDomain(null)
    setSelectedTeam(null)
    setSelectedDate(null)
    setSelectedDateLabel(null)
    setVisitorName('')
    setVisitorPhone('')
    setNotes('')
    setSubmitError(null)
    setBookingResult(null)
  }

  return (
    <section
      style={{
        background: "#000",
        minHeight: "100vh",
        padding: "clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)",
        paddingTop: "calc(64px + clamp(40px, 6vw, 80px))",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <p
            style={{
              fontFamily: "LINE Seed TW, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.5em",
              color: "rgba(1,255,204,0.5)",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Reservation
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 400,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            預約參觀
          </h2>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "clamp(40px, 5vw, 64px)",
            }}
          >
            {[1, 2, 3].map((s, idx) => {
              const isDone = step > s;
              const isActive = step === s;
              const labels = ["選擇展覽", "選擇組別", "填寫資料"];
              return (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: idx < 2 ? 1 : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border: `1px solid ${isDone ? "#01ffcc" : isActive ? "#01ffcc" : "rgba(255,255,255,0.1)"}`,
                        background: isDone ? "#01ffcc" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isDone ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#000"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span
                          style={{
                            fontFamily: "LINE Seed TW, sans-serif",
                            fontSize: "11px",
                            color: isActive
                              ? "rgba(1,255,204,0.9)"
                              : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {s}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "10px",
                        letterSpacing: "0.05em",
                        color: isActive
                          ? "rgba(1,255,204,0.7)"
                          : isDone
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(255,255,255,0.15)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {labels[idx]}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background:
                          step > s
                            ? "rgba(1,255,204,0.4)"
                            : "rgba(255,255,255,0.06)",
                        margin: "0 12px",
                        marginBottom: "24px",
                        transition: "background 0.3s ease",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Step 1: 選擇展覽 ── */}
        {step === 1 && (
          <div>
            <p
              style={{
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "24px",
                letterSpacing: "0.05em",
              }}
            >
              請選擇您想參觀的展覽
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2px",
              }}
              className="booking-type-grid"
            >
              {[
                {
                  type: "outdoor" as ExhibitionType,
                  label: "校外展",
                  date: "2026.05.08 — 05.11",
                  venue: "松山文創園區 二號倉庫",
                  desc: "台北市信義區，松菸文創聚落",
                },
                {
                  type: "indoor" as ExhibitionType,
                  label: "校內展",
                  date: "2026.04.13 — 04.17",
                  venue: "元智大學 五館三樓、六館玻璃屋",
                  desc: "桃園市中壢區，元智大學校園內",
                },
              ].map((item) => {
                const isSelected = exhibitionType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setExhibitionType(item.type)}
                    style={{
                      background: isSelected
                        ? "rgba(1,255,204,0.07)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(1,255,204,0.4)" : "rgba(255,255,255,0.08)"}`,
                      padding: "clamp(24px, 3vw, 36px)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          border: `1px solid ${isSelected ? "rgba(1,255,204,0.8)" : "rgba(255,255,255,0.2)"}`,
                          background: isSelected
                            ? "rgba(1,255,204,0.8)"
                            : "transparent",
                          transition: "all 0.2s ease",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "LINE Seed TW, sans-serif",
                          fontSize: "10px",
                          letterSpacing: "0.3em",
                          color: isSelected
                            ? "rgba(1,255,204,0.7)"
                            : "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p
                      className="font-display"
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 26px)",
                        fontWeight: 400,
                        color: isSelected ? "#fff" : "rgba(255,255,255,0.6)",
                        letterSpacing: "-0.01em",
                        marginBottom: "8px",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.venue.split(" ")[0]}
                    </p>
                    <p
                      style={{
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "13px",
                        color: isSelected
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(255,255,255,0.25)",
                        marginBottom: "4px",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {item.date}
                    </p>
                    <p
                      style={{
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => exhibitionType && setStep(2)}
                disabled={!exhibitionType}
                style={{
                  padding: "14px 32px",
                  background: exhibitionType
                    ? "rgba(1,255,204,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${exhibitionType ? "rgba(1,255,204,0.35)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: exhibitionType
                    ? "rgba(1,255,204,0.9)"
                    : "rgba(255,255,255,0.2)",
                  cursor: exhibitionType ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: 選擇組別 ── */}
        {step === 2 && (
          <div>
            <p
              style={{
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.4)",
                marginBottom: "24px",
                letterSpacing: "0.05em",
              }}
            >
              請選擇您最感興趣的展出領域與組別
            </p>

            {/* Domain selector */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "2px",
              }}
              className="booking-domain-grid"
            >
              {DOMAINS.map((domain) => {
                const isSelected = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => {
                      setSelectedDomain(domain);
                      setSelectedTeam(null);
                    }}
                    style={{
                      background: isSelected
                        ? "rgba(1,255,204,0.07)"
                        : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(1,255,204,0.4)" : "rgba(255,255,255,0.08)"}`,
                      padding: "28px 20px",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <p
                      className="font-display"
                      style={{
                        fontSize: "clamp(20px, 2.5vw, 28px)",
                        fontWeight: 400,
                        color: isSelected ? "#fff" : "rgba(255,255,255,0.5)",
                        letterSpacing: "-0.01em",
                        marginBottom: "4px",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {domain}
                    </p>
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isSelected
                          ? "rgba(1,255,204,0.8)"
                          : "rgba(255,255,255,0.1)",
                        margin: "8px auto 0",
                        transition: "background 0.2s ease",
                        boxShadow: isSelected
                          ? "0 0 8px rgba(1,255,204,0.4)"
                          : "none",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Loading */}
            {teamsLoading && (
              <div
                style={{
                  marginTop: "32px",
                  textAlign: "center",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: "0.05em",
                }}
              >
                載入組別中...
              </div>
            )}

            {/* Error */}
            {teamsError && (
              <div
                style={{
                  marginTop: "32px",
                  padding: "16px",
                  border: "1px solid rgba(255,80,80,0.2)",
                  background: "rgba(255,80,80,0.05)",
                  borderRadius: "4px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,120,120,0.8)",
                }}
              >
                {teamsError}
              </div>
            )}

            {/* Groups under selected domain */}
            {!teamsLoading && selectedDomain && domainTeams.length > 0 && (
              <div style={{ marginTop: "32px" }}>
                <p
                  style={{
                    fontFamily: "LINE Seed TW, sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.3em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  選擇組別
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "2px",
                  }}
                  className="booking-group-grid"
                >
                  {domainTeams.map((team) => {
                    const isSelected = selectedTeam?.id === team.id;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        style={{
                          background: isSelected
                            ? "rgba(1,255,204,0.07)"
                            : "rgba(255,255,255,0.02)",
                          border: `1px solid ${isSelected ? "rgba(1,255,204,0.4)" : "rgba(255,255,255,0.08)"}`,
                          padding: "clamp(16px, 2vw, 24px)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              border: `1px solid ${isSelected ? "rgba(1,255,204,0.8)" : "rgba(255,255,255,0.2)"}`,
                              background: isSelected
                                ? "rgba(1,255,204,0.8)"
                                : "transparent",
                              transition: "all 0.2s ease",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "LINE Seed TW, sans-serif",
                              fontSize: "10px",
                              letterSpacing: "0.2em",
                              color: isSelected
                                ? "rgba(1,255,204,0.6)"
                                : "rgba(255,255,255,0.25)",
                              textTransform: "uppercase",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {team.teamType}
                          </span>
                        </div>
                        <p
                          className="font-display"
                          style={{
                            fontSize: "clamp(16px, 2vw, 22px)",
                            fontWeight: 400,
                            color: isSelected
                              ? "#fff"
                              : "rgba(255,255,255,0.6)",
                            letterSpacing: "-0.01em",
                            marginBottom: "6px",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {team.artworkTitle ?? team.name}
                        </p>
                        {team.description && (
                          <p
                            style={{
                              fontFamily: "LINE Seed TW, sans-serif",
                              fontSize: "12px",
                              color: "rgba(255,255,255,0.3)",
                              lineHeight: 1.5,
                              marginBottom: "8px",
                            }}
                          >
                            {team.description}
                          </p>
                        )}
                        {/* Queue status */}
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span
                            style={{
                              fontFamily: "LINE Seed TW, sans-serif",
                              fontSize: "11px",
                              color: "rgba(1,255,204,0.5)",
                              letterSpacing: "0.04em",
                            }}
                          >
                            等待中：{team.queueStats.waiting} 組
                          </span>
                          {team.queueStats.estimatedWaitMinutes > 0 && (
                            <span
                              style={{
                                fontFamily: "LINE Seed TW, sans-serif",
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.2)",
                                letterSpacing: "0.04em",
                              }}
                            >
                              預估 {team.queueStats.estimatedWaitMinutes} 分鐘
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No teams in this domain */}
            {!teamsLoading &&
              !teamsError &&
              selectedDomain &&
              domainTeams.length === 0 && (
                <div
                  style={{
                    marginTop: "32px",
                    textAlign: "center",
                    fontFamily: "LINE Seed TW, sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.05em",
                    padding: "32px 0",
                  }}
                >
                  此領域目前無開放預約的組別
                </div>
              )}

            <div
              style={{
                marginTop: "32px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: "14px 24px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                }}
              >
                ← 上一步
              </button>
              <button
                onClick={() => selectedTeam && setStep(3)}
                disabled={!selectedTeam}
                style={{
                  padding: "14px 32px",
                  background: selectedTeam
                    ? "rgba(1,255,204,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedTeam ? "rgba(1,255,204,0.35)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: selectedTeam
                    ? "rgba(1,255,204,0.9)"
                    : "rgba(255,255,255,0.2)",
                  cursor: selectedTeam ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: 填寫資料 ── */}
        {step === 3 && (
          <div>
            {/* Selected team info */}
            {selectedTeam && (
              <div
                style={{
                  padding: "16px 20px",
                  border: "1px solid rgba(1,255,204,0.15)",
                  background: "rgba(1,255,204,0.04)",
                  borderRadius: "4px",
                  marginBottom: "32px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "LINE Seed TW, sans-serif",
                    fontSize: "11px",
                    color: "rgba(1,255,204,0.5)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {selectedTeam.teamType}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: "18px",
                    color: "rgba(255,255,255,0.8)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selectedTeam.name}
                </span>
              </div>
            )}

            {/* Date selection */}
            <div style={{ marginBottom: "32px" }}>
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                選擇日期
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  overflowX: "auto",
                  paddingBottom: "4px",
                }}
              >
                {dates.map((d) => {
                  const isSelected = selectedDate === d.value;
                  return (
                    <button
                      key={d.value}
                      onClick={() => {
                        setSelectedDate(d.value);
                        setSelectedDateLabel(d.label);
                      }}
                      style={{
                        flexShrink: 0,
                        padding: "12px 20px",
                        background: isSelected
                          ? "rgba(1,255,204,0.1)"
                          : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isSelected ? "rgba(1,255,204,0.35)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: "2px",
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "13px",
                        color: isSelected
                          ? "rgba(1,255,204,0.9)"
                          : "rgba(255,255,255,0.4)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visitor name */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                姓名
              </p>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="請輸入您的姓名"
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${visitorName.trim() ? "rgba(1,255,204,0.2)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(1,255,204,0.35)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = visitorName.trim()
                    ? "rgba(1,255,204,0.2)"
                    : "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                手機號碼
              </p>
              <input
                type="tel"
                value={visitorPhone}
                onChange={(e) =>
                  setVisitorPhone(
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                placeholder="09XXXXXXXX"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${visitorPhone && !/^09\d{8}$/.test(visitorPhone) ? "rgba(255,80,80,0.35)" : visitorPhone ? "rgba(1,255,204,0.2)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(1,255,204,0.35)";
                }}
                onBlur={(e) => {
                  if (visitorPhone && !/^09\d{8}$/.test(visitorPhone)) {
                    e.currentTarget.style.borderColor = "rgba(255,80,80,0.35)";
                  } else {
                    e.currentTarget.style.borderColor = visitorPhone
                      ? "rgba(1,255,204,0.2)"
                      : "rgba(255,255,255,0.08)";
                  }
                }}
              />
              {visitorPhone && !/^09\d{8}$/.test(visitorPhone) && (
                <p
                  style={{
                    fontFamily: "LINE Seed TW, sans-serif",
                    fontSize: "11px",
                    color: "rgba(255,80,80,0.7)",
                    marginTop: "6px",
                    letterSpacing: "0.03em",
                  }}
                >
                  請輸入有效的台灣手機號碼（09 開頭，共 10 碼）
                </p>
              )}
            </div>

            {/* Notes (optional) */}
            <div style={{ marginBottom: "40px" }}>
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                備注（選填）
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                placeholder="其他需要說明的事項..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(1,255,204,0.25)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {/* Submit error */}
            {submitError && (
              <div
                style={{
                  marginBottom: "20px",
                  padding: "12px 16px",
                  border: "1px solid rgba(255,80,80,0.25)",
                  background: "rgba(255,80,80,0.05)",
                  borderRadius: "4px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,120,120,0.8)",
                }}
              >
                {submitError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  padding: "14px 24px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                }}
              >
                ← 上一步
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                style={{
                  padding: "14px 32px",
                  background: canSubmit
                    ? "rgba(1,255,204,0.1)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${canSubmit ? "rgba(1,255,204,0.35)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "2px",
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.1em",
                  color: canSubmit
                    ? "rgba(1,255,204,0.9)"
                    : "rgba(255,255,255,0.2)",
                  cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
              >
                {submitting ? "處理中..." : "確認預約 →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Success ── */}
        {step === 4 && bookingResult && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(60px, 10vw, 120px) 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "1px solid rgba(1,255,204,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "32px",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-8px",
                  borderRadius: "50%",
                  border: "1px solid rgba(1,255,204,0.15)",
                }}
              />
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(1,255,204,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p
              style={{
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "11px",
                letterSpacing: "0.5em",
                color: "rgba(1,255,204,0.5)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              預約成功
            </p>

            <h3
              className="font-display"
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 400,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              歡迎蒞臨
            </h3>

            <p
              style={{
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "14px",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "48px",
              }}
            >
              神經元 NEURON 2026
            </p>

            <div
              style={{
                padding: "32px 40px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(1,255,204,0.03)",
                marginBottom: "40px",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                }}
              >
                排隊號碼
              </p>
              <p
                style={{
                  fontFamily: "LINE Seed TW, sans-serif",
                  fontSize: "clamp(40px, 6vw, 64px)",
                  fontWeight: 700,
                  color: "rgba(1,255,204,0.9)",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                  lineHeight: 1,
                }}
              >
                #{bookingResult.sequenceNumber}
              </p>
              {bookingResult.estimatedWaitMinutes > 0 && (
                <p
                  style={{
                    fontFamily: "LINE Seed TW, sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "24px",
                    letterSpacing: "0.03em",
                  }}
                >
                  預估等待約 {bookingResult.estimatedWaitMinutes} 分鐘
                </p>
              )}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {[
                  {
                    label: "展覽",
                    value:
                      exhibitionType === "outdoor"
                        ? "校外展 · 松山文創園區"
                        : "校內展 · 元智大學",
                  },
                  { label: "組別", value: bookingResult.teamName },
                  {
                    label: "日期",
                    value: selectedDateLabel ?? bookingResult.reservationDate,
                  },
                  { label: "姓名", value: visitorName },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "8px",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      style={{
                        fontFamily: "LINE Seed TW, sans-serif",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              style={{
                padding: "12px 28px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.3)",
                cursor: "pointer",
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
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.18);
        }
      `}</style>
    </section>
  );
}
