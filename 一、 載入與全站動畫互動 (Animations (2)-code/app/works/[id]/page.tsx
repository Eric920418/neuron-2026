import NavBar from '@/components/NavBar'
import FooterSection from '@/components/FooterSection'
import WorkDetailClient from '@/components/WorkDetailClient'
import { notFound } from 'next/navigation'

// ── Works data ──
const works = [
  {
    id: 1,
    title: "It's Mine",
    domain: 'game',
    domainLabel: '遊戲',
    year: '2026',
    team: '遊戲組 Team A',
    shortDesc: '多人派對遊戲，搶奪資源、建立同盟，在混亂中尋找勝機。',
    fullDesc: `《It's Mine》是一款支援最多 6 人同場競技的多人派對遊戲。玩家在一個充滿資源的島嶼上展開激烈的搶奪戰，透過建立同盟、設置陷阱、搶奪資源等策略，在混亂中尋找勝機。

遊戲設計靈感來自人類社會中的競爭與合作關係，以輕鬆幽默的方式探討「所有權」的概念。每一局遊戲都是獨特的體驗，玩家的每個決策都可能改變最終結果。

本作品使用 Unity 引擎開發，支援本地多人連線，並針對展覽現場的互動體驗進行了特別優化。`,
    tags: ['Unity', '多人連線', '派對遊戲', 'C#'],
    color: '#818cf8',
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
    domain: 'interactive',
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team B',
    shortDesc: '以身體動作為介面的沉浸式裝置，探索感知的極限與數位空間的可能性。',
    fullDesc: `《感知邊界》是一件以人體動作為核心介面的沉浸式互動裝置。觀眾進入裝置空間後，身體的每一個動作都會即時影響周圍的視覺與聲音環境，創造出獨一無二的感知體驗。

作品探討人類感知系統的邊界——當數位技術能夠捕捉並回應我們最細微的動作時，「真實」與「虛擬」的界線究竟在哪裡？

技術上使用 Kinect 深度感測器結合 openFrameworks 進行即時運算，並透過多聲道音響系統創造空間音效。`,
    tags: ['體感互動', '裝置藝術', 'openFrameworks', 'Kinect'],
    color: '#a5b4fc',
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
    domain: 'film',
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team C',
    shortDesc: '一部關於溝通與誤解的短片，在數位噪音中尋找真實的人際連結。',
    fullDesc: `《訊號》是一部時長約 15 分鐘的劇情短片，講述在資訊爆炸的時代，兩個陌生人透過一系列的誤解與巧合，最終找到真實連結的故事。

影片以「訊號」作為核心隱喻——在充滿雜訊的現代社會中，我們如何辨識真正重要的訊息？如何在數位噪音中聽見彼此的聲音？

本片採用手持攝影風格，搭配環境音效設計，創造出既真實又略帶超現實的視覺語言。後製使用 DaVinci Resolve 進行調色，呈現冷暖對比的色調風格。`,
    tags: ['短片', '劇情片', '後製', 'DaVinci Resolve'],
    color: '#c7d2fe',
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
    domain: 'marketing',
    domainLabel: '行銷',
    year: '2026',
    team: '行銷組 Team D',
    shortDesc: '整合品牌識別系統設計，建立完整的視覺語言與數位行銷策略。',
    fullDesc: `《品牌神經》是一個完整的品牌識別系統設計專案，以神經科學為靈感，為一個虛構的科技新創公司建立從品牌策略到視覺執行的完整系統。

專案包含品牌定位研究、視覺識別設計（Logo、色彩系統、字體規範）、數位行銷策略規劃，以及社群媒體內容創作。

透過深入的消費者研究與競品分析，我們建立了一套能夠在各種媒介上保持一致性的品牌語言，讓每一個觸點都成為記憶的神經節點。`,
    tags: ['品牌設計', '數位行銷', '社群策略', 'Figma'],
    color: '#818cf8',
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
    domain: 'interactive',
    domainLabel: '互動',
    year: '2026',
    team: '互動組 Team E',
    shortDesc: '聲音視覺化裝置，將環境音轉化為即時流動的光影神經網絡。',
    fullDesc: `《迴響》是一件聲音視覺化互動裝置，透過麥克風陣列即時捕捉展場環境中的聲音，並將其轉化為流動的光影神經網絡投影於牆面上。

每一個聲音都會在視覺網絡中留下痕跡，觀眾的說話聲、腳步聲、甚至呼吸聲都成為作品的一部分。裝置記錄並疊加所有聲音的視覺痕跡，形成一幅由集體聲音共同繪製的神經地圖。

技術上使用 p5.js 進行即時視覺運算，搭配 Web Audio API 進行聲音分析，並透過投影機將視覺效果投射於 3×4 公尺的牆面上。`,
    tags: ['聲音藝術', '即時運算', 'p5.js', 'Web Audio API'],
    color: '#a5b4fc',
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
    domain: 'film',
    domainLabel: '影視',
    year: '2026',
    team: '影視組 Team F',
    shortDesc: '紀錄片，記錄畢業前最後一個學期的集體記憶、友誼與告別。',
    fullDesc: `《最後一格》是一部時長約 25 分鐘的紀錄片，跟拍元智大學資訊傳播學系第 29 屆學生在畢業前最後一個學期的生活。

影片以「最後一格」作為隱喻——電影膠卷的最後一格，也是學生生涯的最後一個章節。透過多位同學的視角，記錄了準備畢業展的壓力、對未來的迷茫、以及彼此之間深厚的情誼。

採用觀察式紀錄片手法，盡量減少對拍攝對象的干預，讓真實的情感自然流露。配樂由系上音樂創作同學特別為本片創作。`,
    tags: ['紀錄片', '剪輯', '配樂', 'Premiere Pro'],
    color: '#c7d2fe',
    accentColor: '#c7d2fe',
    images: [
      { id: 'img1', caption: '拍攝現場紀錄' },
      { id: 'img2', caption: '受訪者訪談畫面' },
      { id: 'img3', caption: '剪輯工作照' },
    ],
    video: { id: 'vid1', caption: '紀錄片預告片' },
    members: ['石小柔', '洪小翰', '邱小婷', '范小傑'],
  },
]

export async function generateStaticParams() {
  return works.map((work) => ({
    id: String(work.id),
  }))
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const work = works.find((w) => w.id === Number(id))

  if (!work) {
    notFound()
  }

  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <NavBar />
      <WorkDetailClient work={work} />
      <FooterSection />
    </main>
  )
}