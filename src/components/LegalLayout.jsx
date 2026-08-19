import Header from '../components/Header'
import Footer from '../components/Footer'

function LegalLayout({ children }) {
  return (
    <div className="legal-layout">
      <Header />
      <main className="legal-page">{children}</main>
      <Footer />
    </div>
  )
}

export default LegalLayout
