import NavBar from '@/components/NavBar'
import FooterSection from '@/components/FooterSection'
import ContactSection from '@/components/ContactSection'

export default function ContactPage() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ paddingTop: '64px' }}>
        <ContactSection />
      </div>
      <FooterSection />
    </main>
  )
}