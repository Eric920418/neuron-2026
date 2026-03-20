import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '神經元 2026 — 元智大學資訊傳播學系第29屆畢業展',
  description: '神經元 2026，強調跨域與連結。元智大學資訊傳播學系第29屆畢業展，2026年5月8日至11日，松山文創園區二號倉庫。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}