import NavBar from '@/components/NavBar'
import FooterSection from '@/components/FooterSection'
import BookingSection from '@/components/BookingSection'

export default function BookingPage() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ paddingTop: '64px' }}>
        <BookingSection />
      </div>
      <FooterSection />
    </main>
  )
}