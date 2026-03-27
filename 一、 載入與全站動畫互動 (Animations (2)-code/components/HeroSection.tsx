'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  onComplete: () => void
}

interface Node {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
  connected: boolean
}

export default function HeroSection({ onComplete }: Props) {
  const [phase, setPhase] = useState<'input' | 'nodes' | 'connecting' | 'transition' | 'done'>('input')
  const [inputValue, setInputValue] = useState('')
  const [inputSubmitted, setInputSubmitted] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [ballPulse, setBallPulse] = useState(false)
  const [connections, setConnections] = useState<Array<{x1:number,y1:number,x2:number,y2:number,opacity:number}>>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<Node[]>([])
  const timeRef = useRef(0)

  const handleInputSubmit = useCallback(() => {
    if (!inputValue.trim()) return
    setInputSubmitted(true)
    setBallPulse(true)
    setTimeout(() => setPhase('nodes'), 800)
  }, [inputValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleInputSubmit()
  }, [handleInputSubmit])

  // Generate nodes
  useEffect(() => {
    if (phase !== 'nodes') return
    const generated: Node[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      size: Math.random() * 3 + 1,
      connected: false,
    }))
    nodesRef.current = generated
    setNodes(generated)
  }, [phase])

  // Scroll handler
  useEffect(() => {
    if (phase !== 'nodes' && phase !== 'connecting') return
    const handleScroll = () => {
      const scrollY = window.scrollY
      const progress = Math.min(scrollY / (window.innerHeight * 0.8), 1)
      setScrollProgress(progress)
      if (progress > 0.3 && phase === 'nodes') {
        setPhase('connecting')
      }
      if (progress > 0.85) {
        setPhase('transition')
        setTimeout(() => {
          setPhase('done')
          onComplete()
        }, 1200)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase, onComplete])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const animate = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const currentNodes = nodesRef.current
      if (currentNodes.length === 0) {
        animFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Fade in nodes based on scroll
      currentNodes.forEach((node, i) => {
        const targetOpacity = Math.min(scrollProgress * 2 + (i / currentNodes.length) * 0.3, 0.7)
        node.opacity = node.opacity + (targetOpacity - node.opacity) * 0.05
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      // Draw connections when connecting phase
      if (phase === 'connecting' || phase === 'transition') {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        currentNodes.forEach((node) => {
          const dist = Math.sqrt((node.x - centerX) ** 2 + (node.y - centerY) ** 2)
          const maxDist = 500
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * scrollProgress * 0.6
            const pulse = Math.sin(timeRef.current * 3 + node.id) * 0.5 + 0.5
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(node.x, node.y)
            ctx.strokeStyle = `rgba(99,102,241,${alpha * pulse})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })

        // Node-to-node connections
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const dx = currentNodes[i].x - currentNodes[j].x
            const dy = currentNodes[i].y - currentNodes[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 150) {
              const alpha = (1 - dist / 150) * 0.15 * scrollProgress
              ctx.beginPath()
              ctx.moveTo(currentNodes[i].x, currentNodes[i].y)
              ctx.lineTo(currentNodes[j].x, currentNodes[j].y)
              ctx.strokeStyle = `rgba(129,140,248,${alpha})`
              ctx.lineWidth = 0.3
              ctx.stroke()
            }
          }
        }
      }

      // Draw nodes
      currentNodes.forEach((node) => {
        if (node.opacity <= 0.01) return
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(129,140,248,${node.opacity})`
        ctx.fill()

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4)
        gradient.addColorStop(0, `rgba(99,102,241,${node.opacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(99,102,241,0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Center ball
      if (inputSubmitted) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.15
        const ballSize = 12 * pulseScale

        const ballGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, ballSize * 5)
        ballGradient.addColorStop(0, 'rgba(129,140,248,0.9)')
        ballGradient.addColorStop(0.3, 'rgba(99,102,241,0.5)')
        ballGradient.addColorStop(1, 'rgba(99,102,241,0)')
        ctx.beginPath()
        ctx.arc(centerX, centerY, ballSize * 5, 0, Math.PI * 2)
        ctx.fillStyle = ballGradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(centerX, centerY, ballSize, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(200,200,255,0.95)'
        ctx.fill()

        // Electromagnetic rings
        for (let r = 1; r <= 3; r++) {
          const ringRadius = ballSize * (r * 2.5) + Math.sin(timeRef.current * 2 + r) * 5
          const ringAlpha = (0.3 / r) * (inputSubmitted ? 1 : 0)
          ctx.beginPath()
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(99,102,241,${ringAlpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase, inputSubmitted, scrollProgress])

  if (phase === 'done') return null

  const transitionOpacity = phase === 'transition' ? 0 : 1

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: transitionOpacity,
        pointerEvents: phase === 'transition' ? 'none' : 'auto',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {/* Scroll hint */}
      {phase === 'nodes' && (
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.5,
          }}
        >
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
          }}>
            向下捲動以啟動連結
          </p>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="6" y="2" width="4" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
            <path d="M8 14 L8 22 M4 18 L8 22 L12 18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Input phase */}
      {!inputSubmitted && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.4em',
              color: 'rgba(129,140,248,0.7)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              NEURON 2026
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.05em',
              }}
            >
              你的創意，是哪一種神經元？
            </h1>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '420px' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="輸入你的專長或身份..."
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(129,140,248,0.3)',
                borderRadius: '4px',
                padding: '16px 56px 16px 20px',
                color: '#fff',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '15px',
                outline: 'none',
                letterSpacing: '0.02em',
              }}
              autoFocus
            />
            <button className="focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={handleInputSubmit}
              aria-label="提交專長"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(129,140,248,0.7)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.1em',
          }}>
            按 Enter 或點擊箭頭啟動
          </p>
        </div>
      )}

      {/* After input - show label */}
      {inputSubmitted && phase === 'nodes' && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '100px',
            padding: '8px 20px',
            display: 'inline-block',
            marginBottom: '16px',
          }}>
            <span style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              color: 'rgba(129,140,248,0.9)',
              letterSpacing: '0.05em',
            }}>
              {inputValue}
            </span>
          </div>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            神經元已激活
          </p>
        </div>
      )}

      {/* Connecting phase label */}
      {(phase === 'connecting') && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            color: 'rgba(129,140,248,0.5)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}>
            建立神經突觸連結中...
          </p>
        </div>
      )}

      {/* Scroll progress bar */}
      {phase !== 'input' && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          width: `${scrollProgress * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #818cf8)',
        }} />
      )}
    </div>
  )
}