import NavBar from '@/components/NavBar'
import FooterSection from '@/components/FooterSection'
import InfoSection from '@/components/InfoSection'

export default function InfoPage() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ paddingTop: '64px' }}>
        <InfoSection />
      </div>
      <FooterSection />
    </main>
  )
}