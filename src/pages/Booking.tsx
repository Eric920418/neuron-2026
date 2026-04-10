import { useState, useEffect } from 'react'

type Domain = '互動' | '遊戲' | '行銷' | '影視' | '動畫' | null

const DOMAINS = ['互動', '遊戲', '行銷', '影視', '動畫'] as const

// teamType 對應 domain filter
const TEAM_TYPE_TO_DOMAIN: Record<string, Domain> = {
  '互動': '互動',
  '遊戲': '遊戲',
  '行銷': '行銷',
  '影視': '影視',
  '動畫': '動畫',
}

interface TeamPublic {
  id: string
  name: string
  slug: string
  teamType: string | null
  description: string | null
  bookingUrl: string | null
  artworks: Array<{
    id: string
    title: string
    concept: string | null
    conceptShort: string | null
  }>
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export default function Booking() {
  const [selectedDomain, setSelectedDomain] = useState<Domain>(null)
  const [selectedTeam, setSelectedTeam] = useState<TeamPublic | null>(null)

  // API state
  const [teams, setTeams] = useState<TeamPublic[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [teamsError, setTeamsError] = useState<string | null>(null)

  // 進入頁面時從 /teams/public 載入所有組別
  useEffect(() => {
    setTeamsLoading(true)
    setTeamsError(null)

    fetch(`${API_URL}/teams/public`)
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data.teams?.length > 0) {
          setTeams(json.data.teams)
        } else {
          setTeamsError('暫無組別資料')
        }
      })
      .catch(() => setTeamsError('無法連線，請稍後再試'))
      .finally(() => setTeamsLoading(false))
  }, [])

  const domainTeams = selectedDomain
    ? teams.filter(t => TEAM_TYPE_TO_DOMAIN[t.teamType ?? ''] === selectedDomain)
    : []

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
            gridTemplateColumns: "repeat(5, 1fr)",
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
                const artworkTitle = team.artworks?.[0]?.title;
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
                      {artworkTitle ?? team.name}
                    </p>
                    {team.description && (
                      <p
                        style={{
                          fontFamily: "LINE Seed TW, sans-serif",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.3)",
                          lineHeight: 1.5,
                        }}
                      >
                        {team.description}
                      </p>
                    )}
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

        {/* 確認按鈕：僅在選定組別且有 bookingUrl 時顯示 */}
        {selectedTeam?.bookingUrl && (
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => window.open(selectedTeam.bookingUrl!, '_blank', 'noopener,noreferrer')}
              style={{
                padding: "14px 32px",
                background: "rgba(1,255,204,0.1)",
                border: "1px solid rgba(1,255,204,0.35)",
                borderRadius: "2px",
                fontFamily: "LINE Seed TW, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.1em",
                color: "rgba(1,255,204,0.9)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              前往預約 →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .booking-domain-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .booking-group-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
