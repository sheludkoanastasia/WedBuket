import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import { usePageMeta } from '../hooks/usePageMeta'

function NotFoundPage() {
  usePageMeta(
    'Страница не найдена — WedBuket',
    'Запрашиваемая страница не найдена. Вернитесь на главную WedBuket.'
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="not-found">
      <Header />
      <main className="not-found-main">
        <div className="not-found-copy">
          <h1 className="not-found-title">
            Постараемся решить проблему как можно скорее
          </h1>
          <Link to="/" className="btn not-found-btn">
            Вернуться на главную
          </Link>
        </div>

        <div className="not-found-visual" aria-hidden="true">
          <img
            className="not-found-404"
            src="/images/404.png"
            alt=""
            decoding="async"
          />
        </div>
      </main>
    </div>
  )
}

export default NotFoundPage
