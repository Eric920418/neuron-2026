'use client'

import { useState, useEffect, useRef } from 'react'

type Domain = 'all' | 'interactive' | 'game' | 'marketing' | 'film'

const filters: { key: Domain; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'interactive', label: '互動' },
  { key: 'game', label: '遊戲' },
  { key: 'marketing', label: '行銷' },
  { key: 'film', label: '影視' },
]

const works = [
  {
    id: 1,
    title: "It's Mine",
    domain: 'game' as Domain,
    domainLabel: '遊戲',
    year: '2026',
    team: '遊戲組 Team A',
    shortDesc: '多人派對遊戲，最多 6 人同場競技，搶奪資源、建立同盟，在混亂中尋找勝機。',
    fullDesc: `《It's Mine》是一款支援最多 6 人同場競技的多人派對遊戲。玩家在一個充滿資源的島嶼上展開激烈的搶奪戰，透過建立同盟、設置陷阱、搶奪資源等策略，在混亂中尋找勝機。

遊戲設計靈感來自人類社會中的競爭與合作關係，以輕鬆幽默的方式探討「所有權」的概念。每一局遊戲都是獨特的體驗，玩家的每個決策都可能改變最終結果。

本作品使用 Unity 引擎開發，支援本地多人連線，並針對展覽現場的互動體驗進行了特別優化。`,
    tags: ['Unity', '多人連線', '派對遊戲', 'C#'],
    color: 'rgba(99,102,241,0.12)',
    accentColor: '#818cf8',
    images: [
      { id: 'img1', caption: '遊戲主畫面截圖' },
      { id: 'img2', caption: '多人對戰場景' },
      { id: 'img3', caption: '角色設計稿' },
    ],
    video: { id: 'vid1', caption: '遊戲宣傳影片' },
    members: ['王小明', '李小華', '張小美', '陳小強'],
  },
  {
    id: 2,
    title: '感知邊界',
    domain: 'interactive' as Domain,
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team B',
    shortDesc: '以身體動作為介面的沉浸式裝置，探索感知的極限與數位空間的可能性。',
    fullDesc: `《感知邊界》是一件以人體動作為核心介面的沉浸式互動裝置。觀眾進入裝置空間後，身體的每一個動作都會即時影響周圍的視覺與聲音環境，創造出獨一無二的感知體驗。

作品探討人類感知系統的邊界——當數位技術能夠捕捉並回應我們最細微的動作時，「真實」與「虛擬」的界線究竟在哪裡？

技術上使用 Kinect 深度感測器結合 openFrameworks 進行即時運算，並透過多聲道音響系統創造空間音效。`,
    tags: ['體感互動', '裝置藝術', 'openFrameworks', 'Kinect'],
    color: 'rgba(129,140,248,0.1)',
    accentColor: '#a5b4fc',
    images: [
      { id: 'img1', caption: '裝置現場照片' },
      { id: 'img2', caption: '觀眾互動紀錄' },
      { id: 'img3', caption: '技術架構圖' },
    ],
    video: { id: 'vid1', caption: '裝置體驗紀錄影片' },
    members: ['林小雨', '吳小天', '黃小晴'],
  },
  {
    id: 3,
    title: '訊號',
    domain: 'film' as Domain,
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team C',
    shortDesc: '一部關於溝通與誤解的短片，在數位噪音中尋找真實的人際連結。',
    fullDesc: `《訊號》是一部時長約 15 分鐘的劇情短片，講述在資訊爆炸的時代，兩個陌生人透過一系列的誤解與巧合，最終找到真實連結的故事。

影片以「訊號」作為核心隱喻——在充滿雜訊的現代社會中，我們如何辨識真正重要的訊息？如何在數位噪音中聽見彼此的聲音？

本片採用手持攝影風格，搭配環境音效設計，創造出既真實又略帶超現實的視覺語言。後製使用 DaVinci Resolve 進行調色，呈現冷暖對比的色調風格。`,
    tags: ['短片', '劇情片', '後製', 'DaVinci Resolve'],
    color: 'rgba(165,180,252,0.08)',
    accentColor: '#c7d2fe',
    images: [
      { id: 'img1', caption: '劇照 — 場景一' },
      { id: 'img2', caption: '劇照 — 場景二' },
      { id: 'img3', caption: '幕後花絮' },
    ],
    video: { id: 'vid1', caption: '短片正片' },
    members: ['周小安', '鄭小宇', '許小芸', '謝小恩', '蔡小翔'],
  },
  {
    id: 4,
    title: '品牌神經',
    domain: 'marketing' as Domain,
    domainLabel: '行銷',
    year: '2026',
    team: '行銷組 Team D',
    shortDesc: '整合品牌識別系統設計，建立完整的視覺語言與數位行銷策略。',
    fullDesc: `《品牌神經》是一個完整的品牌識別系統設計專案，以神經科學為靈感，為一個虛構的科技新創公司建立從品牌策略到視覺執行的完整系統。

專案包含品牌定位研究、視覺識別設計（Logo、色彩系統、字體規範）、數位行銷策略規劃，以及社群媒體內容創作。

透過深入的消費者研究與競品分析，我們建立了一套能夠在各種媒介上保持一致性的品牌語言，讓每一個觸點都成為記憶的神經節點。`,
    tags: ['品牌設計', '數位行銷', '社群策略', 'Figma'],
    color: 'rgba(99,102,241,0.08)',
    accentColor: '#818cf8',
    images: [
      { id: 'img1', caption: 'Logo 設計展示' },
      { id: 'img2', caption: '品牌色彩系統' },
      { id: 'img3', caption: '社群媒體應用範例' },
    ],
    video: { id: 'vid1', caption: '品牌提案影片' },
    members: ['劉小芳', '楊小凱', '游小涵'],
  },
  {
    id: 5,
    title: '迴響',
    domain: 'interactive' as Domain,
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team E',
    shortDesc: '聲音視覺化裝置，將環境音轉化為即時流動的光影神經網絡。',
    fullDesc: `《迴響》是一件聲音視覺化互動裝置，透過麥克風陣列即時捕捉展場環境中的聲音，並將其轉化為流動的光影神經網絡投影於牆面上。

每一個聲音都會在視覺網絡中留下痕跡，觀眾的說話聲、腳步聲、甚至呼吸聲都成為作品的一部分。裝置記錄並疊加所有聲音的視覺痕跡，形成一幅由集體聲音共同繪製的神經地圖。

技術上使用 p5.js 進行即時視覺運算，搭配 Web Audio API 進行聲音分析，並透過投影機將視覺效果投射於 3×4 公尺的牆面上。`,
    tags: ['聲音藝術', '即時運算', 'p5.js', 'Web Audio API'],
    color: 'rgba(129,140,248,0.12)',
    accentColor: '#a5b4fc',
    images: [
      { id: 'img1', caption: '裝置投影效果' },
      { id: 'img2', caption: '聲音視覺化截圖' },
      { id: 'img3', caption: '裝置架設現場' },
    ],
    video: { id: 'vid1', caption: '裝置運作紀錄' },
    members: ['方小宸', '江小澤'],
  },
  {
    id: 6,
    title: '最後一格',
    domain: 'film' as Domain,
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team F',
    shortDesc: '紀錄片，記錄畢業前最後一個學期的集體記憶、友誼與告別。',
    fullDesc: `《最後一格》是一部時長約 25 分鐘的紀錄片，跟拍元智大學資訊傳播學系第 29 屆學生在畢業前最後一個學期的生活。

影片以「最後一格」作為隱喻——電影膠卷的最後一格，也是學生生涯的最後一個章節。透過多位同學的視角，記錄了準備畢業展的壓力、對未來的迷茫、以及彼此之間深厚的情誼。

採用觀察式紀錄片手法，盡量減少對拍攝對象的干預，讓真實的情感自然流露。配樂由系上音樂創作同學特別為本片創作。`,
    tags: ['紀錄片', '剪輯', '配樂', 'Premiere Pro'],
    color: 'rgba(165,180,252,0.1)',
    accentColor: '#c7d2fe',
    images: [
      { id: 'img1', caption: '拍攝現場紀錄' },
      { id: 'img2', caption: '受訪者訪談畫面' },
      { id: 'img3', caption: '剪輯工作照' },
    ],
    video: { id: 'vid1', caption: '紀錄片預告片' },
    members: ['石小柔', '洪小翰', '邱小婷', '范小傑'],
  },
  {
    id: 7,
    title: '神經市場',
    domain: 'marketing' as Domain,
    domainLabel: '行銷',
    year: '2026',
    team: '行銷組 Team G',
    shortDesc: '以神經科學為靈感的消費者行為研究，結合數據分析與創意內容策略。',
    fullDesc: `《神經市場》是一個結合神經科學研究方法與數位行銷實務的整合性專案。我們以「神經行銷學」為理論基礎，探討消費者在面對不同行銷刺激時的決策機制。

專案分為三個部分：消費者行為研究（問卷調查 + 眼動追蹤實驗）、數據分析與洞察報告，以及基於研究結果設計的創意行銷活動提案。

最終提案包含一個完整的整合行銷傳播計畫，涵蓋社群媒體、內容行銷、KOL 合作等多個面向，並以數據驗證每個策略決策的合理性。`,
    tags: ['消費者研究', '內容行銷', '數據分析', '神經行銷'],
    color: 'rgba(99,102,241,0.1)',
    accentColor: '#818cf8',
    images: [
      { id: 'img1', caption: '研究報告封面' },
      { id: 'img2', caption: '數據視覺化圖表' },
      { id: 'img3', caption: '行銷活動提案展示' },
    ],
    video: { id: 'vid1', caption: '提案簡報影片' },
    members: ['唐小薇', '馮小哲', '程小晨', '魏小勳'],
  },
  {
    id: 8,
    title: '像素夢境',
    domain: 'game' as Domain,
    domainLabel: '遊戲',
    year: '2026',
    team: '遊戲組 Team H',
    shortDesc: '像素風格解謎冒險遊戲，在夢境與現實交錯的世界中尋找記憶的碎片。',
    fullDesc: `《像素夢境》是一款像素風格的解謎冒險遊戲，玩家扮演一位能夠進入他人夢境的偵探，透過解開謎題來尋找失蹤者留下的記憶碎片。

遊戲世界在「夢境」與「現實」之間切換，兩個世界的謎題相互關聯，玩家必須在兩個維度之間靈活切換才能推進劇情。遊戲包含約 4-6 小時的主線劇情，以及多個隱藏結局。

使用 Godot 引擎開發，所有像素藝術資源均由團隊手工繪製，配樂採用 chiptune 風格，致敬經典像素遊戲的同時融入現代音樂元素。`,
    tags: ['像素藝術', '解謎', 'Godot', 'Chiptune'],
    color: 'rgba(129,140,248,0.08)',
    accentColor: '#a5b4fc',
    images: [
      { id: 'img1', caption: '遊戲截圖 — 夢境世界' },
      { id: 'img2', caption: '遊戲截圖 — 現實世界' },
      { id: 'img3', caption: '角色與場景設計稿' },
    ],
    video: { id: 'vid1', caption: '遊戲實機演示影片' },
    members: ['葉小晴', '蕭小宇', '鍾小恩', '韓小翔', '龔小涵'],
  },
]

export default function WorksPageSection() {
  const [activeFilter, setActiveFilter] = useState<Domain>('all')
  const [filteredWorks, setFilteredWorks] = useState(works)
  const [animating, setAnimating] = useState(false)
  const [selectedWork, setSelectedWork] = useState<typeof works[0] | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedWork) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedWork])

  const handleFilter = (key: Domain) => {
    if (key === activeFilter) return
    setAnimating(true)
    setTimeout(() => {
      setActiveFilter(key)
      setFilteredWorks(key === 'all' ? works : works.filter(w => w.domain === key))
      setAnimating(false)
    }, 200)
  }

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          background: '#000',
          padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 80px)',
          minHeight: '100vh',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            marginBottom: 'clamp(48px, 6vw, 80px)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}>
            <p style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.5em',
              color: 'rgba(129,140,248,0.5)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              All Works
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
              <h1 className="font-display" style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 400,
                color: '#fff',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                所有作品
              </h1>

              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {filters.map(f => (
                  <button
                    key={f.key}
                    onClick={() => handleFilter(f.key)}
                    style={{
                      padding: '8px 16px',
                      background: activeFilter === f.key ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: `1px solid ${activeFilter === f.key ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: '100px',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '12px',
                      color: activeFilter === f.key ? '#818cf8' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (activeFilter !== f.key) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (activeFilter !== f.key) {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
                      }
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Works grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'none',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            {filteredWorks.map((work, idx) => (
              <article
                key={work.id}
                onClick={() => setSelectedWork(work)}
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(20px)',
                  transition: `opacity 0.6s ease ${idx * 0.05}s, transform 0.6s ease ${idx * 0.05}s, border-color 0.2s ease, transform 0.2s ease`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(129,140,248,0.25)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Image area */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: work.color,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {/* Placeholder — replace with <img> when real images are available */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.4,
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={work.accentColor} strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: work.accentColor,
                      letterSpacing: '0.1em',
                    }}>
                      作品圖片
                    </span>
                  </div>

                  {/* Domain badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '3px 8px',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: work.accentColor,
                      letterSpacing: '0.08em',
                    }}>
                      {work.domainLabel}
                    </span>
                  </div>

                  {/* View detail hint */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.5)',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: '0.05em',
                    }}>
                      查看詳情
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <h2 className="font-display" style={{
                      fontSize: '20px',
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.85)',
                      letterSpacing: '-0.01em',
                    }}>
                      {work.title}
                    </h2>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.1em',
                    }}>
                      {work.year}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: `${work.accentColor}80`,
                    letterSpacing: '0.05em',
                    marginBottom: '10px',
                  }}>
                    {work.team}
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.6,
                    marginBottom: '14px',
                  }}>
                    {work.shortDesc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {work.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '3px 8px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '100px',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.3)',
                        letterSpacing: '0.05em',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work Detail — Full-page overlay (single-page layout, not cards) */}
      {selectedWork && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedWork.title} 作品詳情`}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#000',
            overflowY: 'auto',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedWork(null)}
            aria-label="關閉"
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 210,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* ── HERO: full-width image / video banner ── */}
          <div style={{
            width: '100%',
            aspectRatio: '21/9',
            background: selectedWork.color,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {/* Placeholder — replace with <img src="..." /> or <video> */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              opacity: 0.3,
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.7">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '13px',
                color: selectedWork.accentColor,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}>
                主視覺圖片 / 影片
              </span>
            </div>

            {/* Gradient overlay at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, transparent, #000)',
              pointerEvents: 'none',
            }} />

            {/* Domain badge */}
            <div style={{
              position: 'absolute',
              top: '28px',
              left: '28px',
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(8px)',
              borderRadius: '100px',
              border: `1px solid ${selectedWork.accentColor}40`,
            }}>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px',
                color: selectedWork.accentColor,
                letterSpacing: '0.12em',
              }}>
                {selectedWork.domainLabel}
              </span>
            </div>

            {/* Title overlay at bottom-left */}
            <div style={{
              position: 'absolute',
              bottom: '32px',
              left: 'clamp(24px, 6vw, 80px)',
              right: 'clamp(24px, 6vw, 80px)',
            }}>
              <h2 className="font-display" style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                marginBottom: '8px',
              }}>
                {selectedWork.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  color: `${selectedWork.accentColor}90`,
                  letterSpacing: '0.05em',
                }}>
                  {selectedWork.team}
                </span>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.1em',
                }}>
                  {selectedWork.year}
                </span>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: 'clamp(48px, 6vw, 80px) clamp(24px, 6vw, 80px)',
          }}>

            {/* Tags row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '56px',
            }}>
              {selectedWork.tags.map(tag => (
                <span key={tag} style={{
                  padding: '5px 12px',
                  border: `1px solid ${selectedWork.accentColor}35`,
                  borderRadius: '100px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: `${selectedWork.accentColor}90`,
                  letterSpacing: '0.06em',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* ── Section: 作品介紹 ── */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品介紹
              </p>
              <div style={{
                maxWidth: '720px',
              }}>
                {selectedWork.fullDesc.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.9,
                    marginBottom: '20px',
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* ── Section: 作品圖片 ── */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品圖片
              </p>

              {/* Large first image */}
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: selectedWork.color,
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Replace with <img src="..." style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.8" opacity="0.35">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.2)',
                  letterSpacing: '0.08em',
                }}>
                  {selectedWork.images[0]?.caption}
                </span>
              </div>

              {/* Remaining images in a 2-col grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }} className="work-images-secondary-grid">
                {selectedWork.images.slice(1).map(img => (
                  <div key={img.id} style={{
                    aspectRatio: '4/3',
                    background: selectedWork.color,
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {/* Replace with <img src="..." style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={selectedWork.accentColor} strokeWidth="0.9" opacity="0.35">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.2)',
                      letterSpacing: '0.06em',
                      textAlign: 'center',
                      padding: '0 16px',
                    }}>
                      {img.caption}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Section: 作品影片 ── */}
            <div style={{ marginBottom: '72px' }}>
              <p style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '10px',
                letterSpacing: '0.4em',
                color: 'rgba(255,255,255,0.2)',
                textTransform: 'uppercase',
                marginBottom: '24px',
              }}>
                作品影片
              </p>
              <div style={{
                width: '100%',
                aspectRatio: '16/9',
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/*
                  Replace this placeholder with one of:
                  <iframe src="https://www.youtube.com/embed/VIDEO_ID" ... />
                  <iframe src="https://player.vimeo.com/video/VIDEO_ID" ... />
                  <video src="/videos/work.mp4" controls style={{width:'100%',height:'100%'}} />
                */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: `${selectedWork.accentColor}18`,
                  border: `1px solid ${selectedWork.accentColor}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={selectedWork.accentColor} opacity="0.7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: '6px',
                  }}>
                    {selectedWork.video.caption}
                  </p>
                  <p style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.18)',
                    letterSpacing: '0.05em',
                  }}>
                    影片嵌入位置（YouTube / Vimeo / 直接上傳）
                  </p>
                </div>
              </div>
            </div>

            {/* ── Section: 創作團隊 & 展出資訊 (side-by-side) ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '72px',
            }} className="work-meta-grid">

              {/* Team members */}
              <div style={{
                padding: '32px',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  創作團隊
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedWork.members.map((member, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `${selectedWork.accentColor}15`,
                        border: `1px solid ${selectedWork.accentColor}28`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <span style={{
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontSize: '11px',
                          color: `${selectedWork.accentColor}80`,
                          fontWeight: 600,
                        }}>
                          {member.charAt(0)}
                        </span>
                      </div>
                      <span style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.65)',
                        letterSpacing: '0.02em',
                      }}>
                        {member}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exhibition info */}
              <div style={{
                padding: '32px',
                border: `1px solid ${selectedWork.accentColor}20`,
                borderRadius: '10px',
                background: `${selectedWork.accentColor}05`,
              }}>
                <p style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                }}>
                  展出資訊
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: `${selectedWork.accentColor}70`,
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}>
                      校外展
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '2px',
                    }}>
                      2026.05.08 — 05.11
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      松山文創園區 二號倉庫
                    </p>
                  </div>
                  <div style={{
                    height: '1px',
                    background: `${selectedWork.accentColor}15`,
                  }} />
                  <div>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '11px',
                      color: `${selectedWork.accentColor}70`,
                      letterSpacing: '0.06em',
                      marginBottom: '4px',
                    }}>
                      校內展
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '2px',
                    }}>
                      2026.05.15 — 05.18
                    </p>
                    <p style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.35)',
                    }}>
                      元智大學 圖書館展覽廳
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Back button ── */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
              <button
                onClick={() => setSelectedWork(null)}
                style={{
                  padding: '12px 32px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '100px',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                返回所有作品
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .work-meta-grid { grid-template-columns: 1fr !important; }
          .work-images-secondary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}