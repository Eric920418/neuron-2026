'use client'

export default function FooterSection() {
  return (
    <footer
      style={{
        background: '#000',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: 'clamp(24px, 3vw, 32px) clamp(20px, 6vw, 80px)' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #a0ff80, #39ff14)',
              boxShadow: '0 0 8px rgba(57,255,20,0.4)',
              flexShrink: 0,
            }} />
            <div>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                神經元 2026
              </p>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.05em',
              }}>
                元智大學資訊傳播學系 第29屆畢業展
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a
              href="https://www.instagram.com/yzuic_29/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @yzuic_29"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.1em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @yzuic_29
            </a>
            <a
              href="https://www.threads.com/@yzuic_29"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads @yzuic_29"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(255,255,255,0.3)',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.1em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068c0-3.516.85-6.37 2.495-8.423C5.845 1.341 8.598.16 12.18.136h.014c2.746.018 5.1.818 6.998 2.378 1.798 1.476 2.994 3.552 3.556 6.17l-2.882.602c-.44-2.099-1.327-3.726-2.638-4.836-1.27-1.075-2.94-1.636-4.962-1.65-2.69.018-4.73.87-6.063 2.532C4.87 6.9 4.18 9.22 4.18 12.068c0 2.85.69 5.168 2.023 6.736 1.333 1.662 3.373 2.514 6.063 2.532 1.998-.014 3.618-.538 4.814-1.558 1.27-1.082 1.97-2.66 2.08-4.69H12.18v-2.68h9.32v1.34c0 3.516-.98 6.3-2.912 8.27C16.66 23.19 14.64 24 12.186 24z" />
              </svg>
              @yzuic_29
            </a>
          </div>

          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.15)',
            letterSpacing: '0.05em',
          }}>
            © 2026 元智大學資訊傳播學系第29屆畢業展
          </p>
        </div>
      </div>

      {/* Bottom large text — 中文「神經元」取代英文 NEURON */}
      <div style={{ padding: '0 clamp(20px, 6vw, 80px)', paddingBottom: 'clamp(16px, 3vw, 32px)', overflow: 'hidden' }}>
        <p
          className="font-display text-hollow"
          style={{
            fontSize: 'clamp(48px, 10vw, 120px)',
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          神經元
        </p>
      </div>
    </footer>
  )
}