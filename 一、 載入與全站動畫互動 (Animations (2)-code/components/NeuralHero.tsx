'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface NeuralHeroProps {
  onComplete: () => void
}

interface Node {
  id: number
  x: number
  y: number
  z: number
  vx: number
  vy: number
  opacity: number
  size: number
  connected: boolean
}

interface Connection {
  from: number
  to: number
  progress: number
  opacity: number
}

type Phase = 'input' | 'nodes-emerging' | 'connecting' | 'transitioning' | 'complete'

export default function NeuralHero({ onComplete }: NeuralHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const phaseRef = useRef<Phase>('input')
  const scrollYRef = useRef(0)
  const inputValueRef = useRef('')
  const ballPulseRef = useRef(0)
  const transitionProgressRef = useRef(0)

  const [phase, setPhase] = useState<Phase>('input')
  const [inputValue, setInputValue] = useState('')
  const [inputSubmitted, setInputSubmitted] = useState(false)
  const [showSkip, setShowSkip] = useState(false)

  const W = typeof window !== 'undefined' ? window.innerWidth : 1280
  const H = typeof window !== 'undefined' ? window.innerHeight : 800

  const generateNodes = useCallback((count: number, w: number, h: number): Node[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 200 - 100,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: 0,
      size: Math.random() * 3 + 1,
      connected: false,
    }))
  }, [])

  const generateConnections = useCallback((nodes: Node[]): Connection[] => {
    const conns: Connection[] = []
    nodes.forEach((node, i) => {
      const nearby = nodes
        .map((n, j) => ({ n, j, dist: Math.hypot(n.x - node.x, n.y - node.y) }))
        .filter(({ j, dist }) => j !== i && dist < 220)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3)
      nearby.forEach(({ j }) => {
        if (!conns.find(c => (c.from === i && c.to === j) || (c.from === j && c.to === i))) {
          conns.push({ from: i, to: j, progress: 0, opacity: 0 })
        }
      })
    })
    return conns
  }, [])

  // Init nodes on mount
  useEffect(() => {
    const w = window.innerWidth
    const h = window.innerHeight
    nodesRef.current = generateNodes(60, w, h)
    setTimeout(() => setShowSkip(true), 3000)
  }, [generateNodes])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY
      const scrollRatio = Math.min(window.scrollY / 600, 1)

      if (phaseRef.current === 'input' && inputValueRef.current.length > 0) {
        if (scrollRatio > 0.1) {
          phaseRef.current = 'nodes-emerging'
          setPhase('nodes-emerging')
        }
      }

      if (phaseRef.current === 'nodes-emerging' && scrollRatio > 0.5) {
        phaseRef.current = 'connecting'
        setPhase('connecting')
        connectionsRef.current = generateConnections(nodesRef.current)
      }

      if (phaseRef.current === 'connecting' && scrollRatio > 0.85) {
        phaseRef.current = 'transitioning'
        setPhase('transitioning')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [generateConnections])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0

    const draw = () => {
      frame++
      ballPulseRef.current = frame * 0.05

      const cw = canvas.width
      const ch = canvas.height

      ctx.clearRect(0, 0, cw, ch)

      const scrollRatio = Math.min(scrollYRef.current / 600, 1)
      const bgAlpha = phaseRef.current === 'transitioning'
        ? Math.max(0, 1 - transitionProgressRef.current)
        : 1

      // Background
      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`
      ctx.fillRect(0, 0, cw, ch)

      // Subtle radial bg glow
      const grad = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.min(cw, ch) * 0.5)
      grad.addColorStop(0, `rgba(99, 102, 241, ${0.04 * bgAlpha})`)
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, cw, ch)

      const cx = cw / 2
      const cy = ch / 2

      // Draw nodes
      if (phaseRef.current === 'nodes-emerging' || phaseRef.current === 'connecting' || phaseRef.current === 'transitioning') {
        nodesRef.current.forEach((node, i) => {
          node.opacity = Math.min(node.opacity + 0.008 + (i % 5) * 0.001, scrollRatio * 0.8)
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > cw) node.vx *= -1
          if (node.y < 0 || node.y > ch) node.vy *= -1

          if (node.opacity > 0) {
            ctx.beginPath()
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(130, 140, 255, ${node.opacity})`
            ctx.fill()

            const nodeGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4)
            nodeGrad.addColorStop(0, `rgba(99, 102, 241, ${node.opacity * 0.3})`)
            nodeGrad.addColorStop(1, 'transparent')
            ctx.fillStyle = nodeGrad
            ctx.beginPath()
            ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      }

      // Draw connections
      if (phaseRef.current === 'connecting' || phaseRef.current === 'transitioning') {
        connectionsRef.current.forEach((conn) => {
          conn.progress = Math.min(conn.progress + 0.012, 1)
          conn.opacity = Math.min(conn.opacity + 0.008, 0.5)

          const fromNode = nodesRef.current[conn.from]
          const toNode = nodesRef.current[conn.to]
          if (!fromNode || !toNode) return

          const endX = fromNode.x + (toNode.x - fromNode.x) * conn.progress
          const endY = fromNode.y + (toNode.y - fromNode.y) * conn.progress

          ctx.beginPath()
          ctx.moveTo(fromNode.x, fromNode.y)
          ctx.lineTo(endX, endY)

          const lineGrad = ctx.createLinearGradient(fromNode.x, fromNode.y, endX, endY)
          lineGrad.addColorStop(0, `rgba(99, 102, 241, ${conn.opacity})`)
          lineGrad.addColorStop(0.5, `rgba(129, 140, 248, ${conn.opacity * 1.5})`)
          lineGrad.addColorStop(1, `rgba(165, 180, 252, ${conn.opacity * 0.5})`)
          ctx.strokeStyle = lineGrad
          ctx.lineWidth = 0.8
          ctx.stroke()

          if (conn.progress < 1) {
            ctx.beginPath()
            ctx.arc(endX, endY, 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(165, 180, 252, ${conn.opacity * 2})`
            ctx.fill()
          }
        })
      }

      // Central ball — show as soon as there's input
      if (inputValueRef.current.length > 0) {
        const pulse = Math.sin(ballPulseRef.current) * 0.5 + 0.5
        const ballSize = 18 + pulse * 8
        const ballOpacity = phaseRef.current === 'transitioning'
          ? Math.max(0, 1 - transitionProgressRef.current * 2)
          : 1

        // Outer glow rings
        for (let r = 3; r >= 1; r--) {
          const ringGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ballSize * r * 2.5)
          ringGrad.addColorStop(0, `rgba(99, 102, 241, ${0.08 * ballOpacity / r})`)
          ringGrad.addColorStop(1, 'transparent')
          ctx.fillStyle = ringGrad
          ctx.beginPath()
          ctx.arc(cx, cy, ballSize * r * 2.5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Ball body
        const ballGrad = ctx.createRadialGradient(cx - ballSize * 0.3, cy - ballSize * 0.3, 0, cx, cy, ballSize)
        ballGrad.addColorStop(0, `rgba(165, 180, 252, ${ballOpacity})`)
        ballGrad.addColorStop(0.4, `rgba(99, 102, 241, ${ballOpacity})`)
        ballGrad.addColorStop(1, `rgba(67, 56, 202, ${ballOpacity * 0.8})`)
        ctx.beginPath()
        ctx.arc(cx, cy, ballSize, 0, Math.PI * 2)
        ctx.fillStyle = ballGrad
        ctx.fill()

        // Specular highlight
        const specGrad = ctx.createRadialGradient(cx - ballSize * 0.35, cy - ballSize * 0.35, 0, cx, cy, ballSize)
        specGrad.addColorStop(0, `rgba(255, 255, 255, ${0.4 * ballOpacity})`)
        specGrad.addColorStop(0.3, 'transparent')
        ctx.fillStyle = specGrad
        ctx.beginPath()
        ctx.arc(cx, cy, ballSize, 0, Math.PI * 2)
        ctx.fill()

        // Lines from ball to nearby nodes when connecting
        if (phaseRef.current === 'connecting' || phaseRef.current === 'transitioning') {
          nodesRef.current.slice(0, 12).forEach((node) => {
            const dist = Math.hypot(node.x - cx, node.y - cy)
            if (dist < 350) {
              ctx.beginPath()
              ctx.moveTo(cx, cy)
              ctx.lineTo(node.x, node.y)
              const alpha = (1 - dist / 350) * 0.3 * ballOpacity
              ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          })
        }
      }

      // Transition overlay
      if (phaseRef.current === 'transitioning') {
        transitionProgressRef.current = Math.min(transitionProgressRef.current + 0.008, 1)

        // White flash overlay
        ctx.fillStyle = `rgba(255, 255, 255, ${transitionProgressRef.current * 0.15})`
        ctx.fillRect(0, 0, cw, ch)

        if (transitionProgressRef.current >= 1) {
          phaseRef.current = 'complete'
          setPhase('complete')
          onComplete()
          return
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [onComplete])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    inputValueRef.current = val
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    inputValueRef.current = inputValue.trim()
    setInputSubmitted(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!inputValue.trim()) return
      inputValueRef.current = inputValue.trim()
      setInputSubmitted(true)
    }
  }

  const handleSkip = () => {
    inputValueRef.current = 'visitor'
    phaseRef.current = 'transitioning'
    setPhase('transitioning')
  }

  if (phase === 'complete') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      {/* Input phase UI */}
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
              letterSpacing: '0.3em',
              color: 'rgba(129, 140, 248, 0.8)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              元智大學資訊傳播學系 · 第29屆畢業展
            </p>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(48px, 8vw, 72px)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              神經元
            </h1>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.15em',
            }}>
              NEURON 2026
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.05em',
            }}>
              輸入你的專長，點燃神經元
            </p>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="設計 / 程式 / 影像 / 行銷..."
                aria-label="輸入你的專長"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${inputValue ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.4)'}`,
                  borderRadius: '4px',
                  padding: '16px 56px 16px 20px',
                  color: '#fff',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '15px',
                  width: 'clamp(280px, 50vw, 360px)',
                  letterSpacing: '0.02em',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: inputValue ? '0 0 0 2px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)' : 'none',
                }}
                autoFocus
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.8)'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.2), 0 0 24px rgba(99,102,241,0.15)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = inputValue ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.4)'
                  e.currentTarget.style.boxShadow = inputValue ? '0 0 0 2px rgba(99,102,241,0.15), 0 0 20px rgba(99,102,241,0.1)' : 'none'
                }}
              />
              <button
                type="submit"
                aria-label="提交"
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: inputValue ? 'rgba(129, 140, 248, 1)' : 'rgba(129, 140, 248, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.2s ease',
                  padding: '4px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          </form>
        </div>
      )}

      {/* After input — scroll hint */}
      {inputSubmitted && (phase === 'input' || phase === 'nodes-emerging') && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Submitted tag */}
          <div style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '100px',
            padding: '8px 20px',
            display: 'inline-block',
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
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            神經元已激活
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              向下捲動，喚醒神經網絡
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, rgba(129,140,248,0.6))' }} />
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'rgba(129,140,248,0.8)',
                boxShadow: '0 0 8px rgba(129,140,248,0.6)',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Phase labels */}
      {phase === 'connecting' && (
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            color: 'rgba(129, 140, 248, 0.6)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}>
            突觸連結形成中...
          </p>
        </div>
      )}

      {/* Skip button */}
      {showSkip && phase !== 'transitioning' && phase !== 'complete' && (
        <button
          onClick={handleSkip}
          aria-label="跳過開場動畫"
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '40px',
            background: 'none',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '4px',
            padding: '8px 16px',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
          }}
        >
          SKIP
        </button>
      )}

      {/* Scroll progress bar */}
      {phase !== 'input' && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '1px',
          width: `${Math.min(scrollYRef.current / 600, 1) * 100}%`,
          background: 'linear-gradient(90deg, #6366f1, #818cf8)',
          transition: 'width 0.1s linear',
        }} />
      )}
    </div>
  )
}