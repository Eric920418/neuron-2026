import NavBar from '@/components/NavBar'
import FooterSection from '@/components/FooterSection'
import WorksPageSection from '@/components/WorksPageSection'

export default function WorksPage() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ paddingTop: '64px' }}>
        <WorksPageSection />
      </div>
      <FooterSection />
    </main>
  )
}