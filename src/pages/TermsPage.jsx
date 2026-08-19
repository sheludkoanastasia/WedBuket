import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout'

function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <LegalLayout>
      <div className="legal-page-inner container">
        <p className="legal-back">
          <Link to="/">← На главную</Link>
        </p>
        <h1 className="legal-title">Пользовательское соглашение</h1>
        <p className="legal-lead">
          Текст соглашения будет добавлен. Пока страница-заглушка, чтобы
          ссылка из футера и карты сайта открывалась как отдельный адрес.
        </p>
        <p className="legal-note">
          <Link to="/sitemap">Карта сайта</Link>
        </p>
      </div>
    </LegalLayout>
  )
}

export default TermsPage
