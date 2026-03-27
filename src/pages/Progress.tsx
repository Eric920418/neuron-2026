import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

interface TeamProgress {
  teamId: string
  teamName: string
  artworkTitle: string | null
  latestSequenceNumber: number
  currentServingNumber: number
  waitingCount: number
  isOpen: boolean
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export default function Progress() {
  const [teams, setTeams] = useState<TeamProgress[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [connected, setConnected] = useState(true)
  const [loading, setLoading] = useState(true)
  const prevRef = useRef<Map<string, number>>(new Map())
  const [flashing, setFlashing] = useState<Set<string>>(new Set())

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_URL}/reservations/progress`)
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      if (json.success) {
        const newTeams: TeamProgress[] = json.data.teams

        // 偵測變化
        const flash = new Set<string>()
        newTeams.forEach((t) => {
          const prev = prevRef.current.get(t.teamId)
          if (prev !== undefined && prev !== t.latestSequenceNumber) {
            flash.add(t.teamId)
          }
          prevRef.current.set(t.teamId, t.latestSequenceNumber)
        })
        if (flash.size > 0) {
          setFlashing(flash)
          setTimeout(() => setFlashing(new Set()), 1200)
        }

        setTeams(newTeams)
        setLastUpdated(new Date())
        setConnected(true)
      }
    } catch {
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
    let interval: ReturnType<typeof setInterval> | null = null

    const start = () => { interval = setInterval(fetchProgress, 10000) }
    const stop = () => { if (interval) { clearInterval(interval); interval = null } }

    const onVisibility = () => {
      if (document.hidden) { stop() } else { fetchProgress(); start() }
    }

    start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  return (
    <section
      style={{
        background: '#000',
        minHeight: '100vh',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
        paddingTop: 'calc(64px + clamp(40px, 6vw, 80px))',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(1,255,204,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            Queue Progress
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            預約進度
          </h2>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '16px',
              letterSpacing: '0.05em',
            }}
          >
            即時顯示各組目前取號與叫號進度
          </p>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: connected ? '#01ffcc' : '#ff4444',
                boxShadow: connected ? '0 0 8px rgba(1,255,204,0.5)' : 'none',
              }}
            />
            <span
              style={{
                fontFamily: 'LINE Seed TW, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.05em',
              }}
            >
              {connected ? '自動更新中' : '連線中斷'}
            </span>
          </div>
          {lastUpdated && (
            <span
              style={{
                fontFamily: 'LINE Seed TW, sans-serif',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              {lastUpdated.toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <div
              className="w-8 h-8 border-2 border-[rgba(1,255,204,0.2)] border-t-[rgba(1,255,204,0.8)] rounded-full animate-spin"
            />
          </div>
        ) : teams.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'LINE Seed TW, sans-serif',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              目前沒有開放預約的組別
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2px',
            }}
          >
            {teams.map((team) => (
              <ProgressCard
                key={team.teamId}
                team={team}
                isFlashing={flashing.has(team.teamId)}
              />
            ))}
          </div>
        )}

        {/* Footer link */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <Link
            to="/booking"
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '13px',
              color: 'rgba(1,255,204,0.6)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(1,255,204,0.9)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(1,255,204,0.6)')}
          >
            ← 前往預約
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProgressCard({ team, isFlashing }: { team: TeamProgress; isFlashing: boolean }) {
  return (
    <div
      style={{
        background: isFlashing
          ? 'rgba(1,255,204,0.06)'
          : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isFlashing ? 'rgba(1,255,204,0.3)' : 'rgba(255,255,255,0.06)'}`,
        padding: 'clamp(24px, 3vw, 36px)',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Team name + status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            fontFamily: 'LINE Seed TW, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.05em',
          }}
        >
          {team.artworkTitle || team.teamName}
        </span>
        <span
          style={{
            fontFamily: 'LINE Seed TW, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.1em',
            padding: '3px 10px',
            borderRadius: '1px',
            background: team.isOpen
              ? 'rgba(1,255,204,0.1)'
              : 'rgba(255,255,255,0.03)',
            color: team.isOpen
              ? 'rgba(1,255,204,0.7)'
              : 'rgba(255,255,255,0.2)',
            border: `1px solid ${team.isOpen ? 'rgba(1,255,204,0.2)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          {team.isOpen ? '開放中' : '已結束'}
        </span>
      </div>

      {/* Latest sequence number (primary) */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p
          style={{
            fontFamily: 'LINE Seed TW, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: 'rgba(1,255,204,0.5)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          目前取號
        </p>
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(48px, 6vw, 72px)',
            fontWeight: 400,
            color: isFlashing ? '#01ffcc' : '#fff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            transition: 'color 0.4s ease',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {team.latestSequenceNumber || '—'}
        </p>
      </div>

      {/* Secondary stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.1em',
              marginBottom: '6px',
            }}
          >
            目前叫號
          </p>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              color: 'rgba(255,200,60,0.8)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {team.currentServingNumber || '—'}
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.1em',
              marginBottom: '6px',
            }}
          >
            等候人數
          </p>
          <p
            style={{
              fontFamily: 'LINE Seed TW, sans-serif',
              fontSize: '22px',
              fontWeight: 700,
              color: 'rgba(100,180,255,0.8)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {team.waitingCount}
          </p>
        </div>
      </div>
    </div>
  )
}
