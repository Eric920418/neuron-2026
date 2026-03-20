'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import NeuralHero from '@/components/NeuralHero'
import NavBar from '@/components/NavBar'
import AboutSection from '@/components/AboutSection'
import DomainsSection from '@/components/DomainsSection'
import GallerySection from '@/components/GallerySection'
import PartnersSection from '@/components/PartnersSection'
import FooterSection from '@/components/FooterSection'

// ─── Draggable Neural Network Background ────────────────────────────────────

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nodesRef = useRef<Node[]>([])
  const animFrameRef = useRef<number>(0)
  const dragRef = useRef<{ id: number; offsetX: number; offsetY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const NODE_COUNT = 28
    const w = canvas.width
    const h = canvas.height
    nodesRef.current = Array.from({ length: NODE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 3 + 2,
    }))

    const CONNECT_DIST = 160

    const draw = () => {
      const cw = canvas.width
      const ch = canvas.height
      ctx.clearRect(0, 0, cw, ch)

      const nodes = nodesRef.current

      nodes.forEach((n) => {
        if (dragRef.current?.id === n?.id) return
        n.x += n?.vx
        n.y += n?.vy
        if (n?.x < 0 || n?.x > cw) n.vx *= -1
        if (n?.y < 0 || n?.y > ch) n.vy *= -1
        n.x = Math.max(0, Math.min(cw, n?.x))
        n.y = Math.max(0, Math.min(ch, n?.y))
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      nodes.forEach((n) => {
        const isDragged = dragRef.current?.id === n?.id ?? []
        if (!isDragged?.length) return
        ctx.beginPath()
        ctx.arc(n?.x, n?.y, isDragged ? n?.radius * 1.8 : n?.radius, 0, Math.PI * 2)
        ctx.fillStyle = isDragged
          ? 'rgba(167, 139, 250, 0.95)'
          : 'rgba(139, 92, 246, 0.75)'
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n?.x, n?.y, (isDragged ? n?.radius * 1.8 : n?.radius) + 4, 0, Math.PI * 2)
        ctx.fillStyle = isDragged
          ? 'rgba(167, 139, 250, 0.15)'
          : 'rgba(139, 92, 246, 0.08)'
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      if ('touches' in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }

    const onDown = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getPos(e)
      const nodes = nodesRef.current
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i]
        const dx = x - n?.x
        const dy = y - n?.y
        if (Math.sqrt(dx * dx + dy * dy) < n?.radius + 10) {
          dragRef.current = { id: n?.id, offsetX: dx, offsetY: dy }
          e.preventDefault()
          break
        }
      }
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current) return
      e.preventDefault()
      const { x, y } = getPos(e)
      const node = nodesRef.current.find((n) => n?.id === dragRef.current!.id)
      if (node) {
        node.x = x - dragRef.current.offsetX
        node.y = y - dragRef.current.offsetY
      }
    }

    const onUp = () => { dragRef.current = null }

    canvas.addEventListener('mousedown', onDown)
    canvas.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    canvas.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousedown', onDown)
      canvas.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchstart', onDown)
      canvas.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />
    </div>
  )
}

// ─── Animated Neuron SVG ─────────────────────────────────────────────────────

function NeuronSVG() {
  return (
    <div style={{ width: '100%', maxWidth: 200, margin: '0 auto 0 0' }}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="ng1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
          </radialGradient>
          <radialGradient id="ng2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
          </radialGradient>
          <filter id="nglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[
          [100, 100, 40, 40],
          [100, 100, 160, 40],
          [100, 100, 30, 130],
          [100, 100, 170, 130],
          [100, 100, 100, 170],
          [40, 40, 160, 40],
          [30, 130, 170, 130],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
        ))}
        {[
          [40, 40, 'ng2'],
          [160, 40, 'ng1'],
          [30, 130, 'ng1'],
          [170, 130, 'ng2'],
          [100, 170, 'ng1'],
        ].map(([cx, cy, grad], i) => (
          <g key={i}>
            <circle cx={cx as number} cy={cy as number} r={8} fill={`url(#${grad})`} filter="url(#nglow)">
              <animate attributeName="r" values="7;9;7" dur={`${2 + (i as number) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <circle cx="100" cy="100" r="18" fill="url(#ng1)" filter="url(#nglow)">
          <animate attributeName="r" values="16;20;16" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="100" r="10" fill="rgba(167,139,250,0.9)" />
      </svg>
    </div>
  )
}

// ─── Neural Hero Section (vertical layout, no info panel) ───────────────────

function NeuralExhibitionSection() {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d0a1a 50%, #080d1a 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NeuralBackground />

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Vertical centered content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
          padding: '6rem 2rem',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Neuron SVG centered */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <NeuronSVG />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            color: '#a78bfa',
            textTransform: 'uppercase',
            fontWeight: 600,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          元智大學資訊傳播學系 · 第29屆畢業展
        </p>

        {/* Main title */}
        <div>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.05,
              fontFamily: 'Space Grotesk, sans-serif',
              marginBottom: '0.5rem',
            }}
          >
            神經元
          </h2>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            NEURON 2026
          </h2>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '1rem',
            color: '#9ca3af',
            lineHeight: 1.75,
            maxWidth: '440px',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          探索人工智慧與藝術的交匯，感受神經網路的創造力，
          體驗科技與人文的深度對話。
        </p>

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              background: 'rgba(167,139,250,0.12)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '6px',
              color: '#a78bfa',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(167,139,250,0.2)'
              el.style.borderColor = 'rgba(167,139,250,0.7)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'rgba(167,139,250,0.12)'
              el.style.borderColor = 'rgba(167,139,250,0.4)'
            }}
          >
            探索展覽
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
          <a
            href="/works"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              letterSpacing: '0.08em',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(255,255,255,0.35)'
              el.style.color = 'rgba(255,255,255,0.85)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(255,255,255,0.15)'
              el.style.color = 'rgba(255,255,255,0.55)'
            }}
          >
            瀏覽作品
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Drag hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(139,92,246,0.5)',
          fontSize: '0.72rem',
          letterSpacing: '0.1em',
          pointerEvents: 'none',
          userSelect: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01" />
        </svg>
        拖動節點以互動
      </div>
    </section>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [heroComplete, setHeroComplete] = useState(false)
  const [navVisible, setNavVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      const done = sessionStorage.getItem('neuron_hero_done')
      if (done === '1') {
        setHeroComplete(true)
        setNavVisible(true)
      }
    } catch {}
    setChecked(true)
  }, [])

  const handleHeroComplete = useCallback(() => {
    try { sessionStorage.setItem('neuron_hero_done', '1') } catch {}
    setHeroComplete(true)
    setTimeout(() => setNavVisible(true), 400)
  }, [])

  if (!checked) return null

  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      {/* NeuralHero — has input interaction + scroll-triggered neural animation */}
      {!heroComplete && <NeuralHero onComplete={handleHeroComplete} />}

      {!heroComplete && (
        <div aria-hidden="true" style={{ height: '300vh', pointerEvents: 'none' }} />
      )}

      {heroComplete && (
        <>
          {navVisible && <NavBar />}
          {/* Hero section with draggable neural background — vertical layout */}
          <NeuralExhibitionSection />
          {/* Full navigation sections below */}
          <section id="about"><AboutSection /></section>
          <section id="domains"><DomainsSection /></section>
          <section id="gallery"><GallerySection /></section>
          <section id="partners"><PartnersSection /></section>
          <FooterSection />
        </>
      )}
    </main>
  )
}