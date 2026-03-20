'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  pulsePhase: number
  isDragging?: boolean
}

interface Connection {
  from: number
  to: number
  opacity: number
  phase: number
}

export default function NeuronHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const animFrameRef = useRef<number>(0)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const dragNodeRef = useRef<number | null>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const CONNECTION_DIST = 180
  const NODE_COUNT = 38

  const initNodes = useCallback((w: number, h: number) => {
    const nodes: Node[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        id: i,
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }
    nodesRef.current = nodes
  }, [])

  const buildConnections = useCallback(() => {
    const nodes = nodesRef.current
    const conns: Connection[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECTION_DIST) {
          conns.push({
            from: i,
            to: j,
            opacity: (1 - dist / CONNECTION_DIST) * 0.35,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }
    connectionsRef.current = conns
  }, [])

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)

    const nodes = nodesRef.current

    // Update positions
    for (const node of nodes) {
      if (node.isDragging) continue
      node.x += node.vx
      node.y += node.vy
      if (node.x < 0 || node.x > w) node.vx *= -1
      if (node.y < 0 || node.y > h) node.vy *= -1
      node.x = Math.max(0, Math.min(w, node.x))
      node.y = Math.max(0, Math.min(h, node.y))
    }

    // Rebuild connections dynamically
    const conns: Connection[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECTION_DIST) {
          conns.push({
            from: i,
            to: j,
            opacity: (1 - dist / CONNECTION_DIST) * 0.3,
            phase: 0,
          })
        }
      }
    }

    // Draw connections
    for (const conn of conns) {
      const a = nodes[conn.from]
      const b = nodes[conn.to]
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.001 + conn.from * 0.3)
      ctx.beginPath()
      ctx.moveTo(a?.x, a?.y)
      ctx.lineTo(b?.x, b?.y)
      ctx.strokeStyle = `rgba(57,255,20,${conn.opacity * (0.6 + 0.4 * pulse)})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    // Draw nodes
    for (const node of nodes) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.0015 + node.pulsePhase)
      const r = node.radius * (1 + 0.3 * pulse)
      const glow = node.isDragging ? 18 : 8

      // Outer glow
      const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r + glow)
      grad.addColorStop(0, `rgba(57,255,20,${node.isDragging ? 0.9 : node.opacity})`)
      grad.addColorStop(0.4, `rgba(57,255,20,${(node.isDragging ? 0.5 : node.opacity) * 0.4})`)
      grad.addColorStop(1, 'rgba(57,255,20,0)')
      ctx.beginPath()
      ctx.arc(node.x, node.y, r + glow, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Core dot
      ctx.beginPath()
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
      ctx.fillStyle = node.isDragging ? '#39ff14' : `rgba(57,255,20,${node.opacity})`
      ctx.fill()
    }

    animFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      initNodes(rect.width, rect.height)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      ro.disconnect()
    }
  }, [mounted, initNodes, draw])

  // Mouse/touch events
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    }
  }

  const findNearestNode = (x: number, y: number) => {
    let nearest = -1
    let minDist = 24
    nodesRef.current.forEach((node, i) => {
      const dx = node.x - x
      const dy = node.y - y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    })
    return nearest
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e)
    const idx = findNearestNode(pos.x, pos.y)
    if (idx >= 0) {
      dragNodeRef.current = idx
      nodesRef.current[idx].isDragging = true
      dragOffsetRef.current = {
        x: nodesRef.current[idx].x - pos.x,
        y: nodesRef.current[idx].y - pos.y,
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getPos(e)
    mouseRef.current = pos
    if (dragNodeRef.current !== null) {
      const node = nodesRef.current[dragNodeRef.current]
      node.x = pos.x + dragOffsetRef.current.x
      node.y = pos.y + dragOffsetRef.current.y
    }
  }

  const handleMouseUp = () => {
    if (dragNodeRef.current !== null) {
      nodesRef.current[dragNodeRef.current].isDragging = false
      dragNodeRef.current = null
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const pos = getPos(e)
    const idx = findNearestNode(pos.x, pos.y)
    if (idx >= 0) {
      dragNodeRef.current = idx
      nodesRef.current[idx].isDragging = true
      dragOffsetRef.current = {
        x: nodesRef.current[idx].x - pos.x,
        y: nodesRef.current[idx].y - pos.y,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e)
    if (dragNodeRef.current !== null) {
      const node = nodesRef.current[dragNodeRef.current]
      node.x = pos.x + dragOffsetRef.current.x
      node.y = pos.y + dragOffsetRef.current.y
    }
  }

  const handleTouchEnd = () => {
    if (dragNodeRef.current !== null) {
      nodesRef.current[dragNodeRef.current].isDragging = false
      dragNodeRef.current = null
    }
  }

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Interactive canvas background */}
      {mounted && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            cursor: dragNodeRef.current !== null ? 'grabbing' : 'grab',
            zIndex: 1,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}

      {/* Radial vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Content — horizontal layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 48px',
          paddingTop: '96px',
          paddingBottom: '80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Left — Neural identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '32px',
                height: '1px',
                background: '#39ff14',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#39ff14',
                textTransform: 'uppercase',
              }}
            >
              NTUA · 29th Graduation Exhibition
            </span>
          </div>

          {/* Main title */}
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-instrument-serif), serif',
                fontSize: 'clamp(64px, 8vw, 120px)',
                fontWeight: 400,
                lineHeight: 0.9,
                color: '#fff',
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              神經元
            </h1>
            <h1
              style={{
                fontFamily: 'var(--font-instrument-serif), serif',
                fontSize: 'clamp(64px, 8vw, 120px)',
                fontWeight: 400,
                lineHeight: 0.9,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(57,255,20,0.6)',
                letterSpacing: '-0.02em',
              }}
            >
              連結
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: '380px',
            }}
          >
            從黑暗虛空中喚醒跨域創意的神經脈動，
            <br />
            每一個節點都是一道光的起點。
          </p>

          {/* Drag hint */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="#39ff14" opacity="0.7" />
              <circle cx="8" cy="8" r="6" stroke="#39ff14" strokeWidth="0.8" opacity="0.3" />
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}
            >
              拖曳節點以互動
            </span>
          </div>
        </div>

        {/* Right — Exhibition info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            paddingLeft: '80px',
          }}
        >
          {/* School exhibition */}
          <ExhibitionBlock
            label="校內展"
            dateRange="2025.06.06 — 06.08"
            location="國立臺灣藝術大學"
            sublocation="展覽館 B1–3F"
            hours="10:00 – 18:00"
            accent
          />

          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255,255,255,0.06)',
              margin: '40px 0',
            }}
          />

          {/* Off-campus exhibition */}
          <ExhibitionBlock
            label="校外展"
            dateRange="2025.06.13 — 06.22"
            location="松山文創園區"
            sublocation="5號倉庫"
            hours="10:00 – 18:00"
          />

          {/* CTA */}
          <div style={{ marginTop: '48px', pointerEvents: 'auto' }}>
            <a
              href="/booking"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 28px',
                border: '1px solid rgba(57,255,20,0.4)',
                color: '#39ff14',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = 'rgba(57,255,20,0.08)'
                el.style.borderColor = '#39ff14'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = 'transparent'
                el.style.borderColor = 'rgba(57,255,20,0.4)'
              }}
            >
              預約參觀
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#39ff14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(57,255,20,0.5), transparent)',
          }}
        />
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 0 24px !important;
          }
          .hero-right {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid rgba(255,255,255,0.08) !important;
            padding-top: 40px !important;
          }
        }
      `}</style>
    </section>
  )
}

function ExhibitionBlock({
  label,
  dateRange,
  location,
  sublocation,
  hours,
  accent,
}: {
  label: string
  dateRange: string
  location: string
  sublocation: string
  hours: string
  accent?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: accent ? '#39ff14' : 'rgba(255,255,255,0.3)',
            flexShrink: 0,
            boxShadow: accent ? '0 0 8px rgba(57,255,20,0.6)' : 'none',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: accent ? '#39ff14' : 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>

      {/* Date */}
      <div>
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif), serif',
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 400,
            color: '#fff',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          {dateRange}
        </p>
      </div>

      {/* Location details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.02em',
          }}
        >
          {location}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          {sublocation}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.05em',
          }}
        >
          {hours}
        </p>
      </div>
    </div>
  )
}