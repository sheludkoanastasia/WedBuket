import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import LegalLayout from '../components/LegalLayout'
import { usePageMeta } from '../hooks/usePageMeta'

const SECTIONS = [
  { to: '/#hero', label: 'Главная' },
  { to: '/#about', label: 'О нас' },
  { to: '/#works', label: 'Как мы работаем' },
  { to: '/#bridal-bouquet', label: 'Букет невесты 360°' },
  { to: '/#portfolio', label: 'Фото с событий' },
  { to: '/#look-date', label: 'Свободные даты' },
]

const LEGAL = [
  { to: '/privacy', label: 'Политика обработки персональных данных' },
  { to: '/terms', label: 'Пользовательское соглашение' },
]

const CONTACTS = [
  { href: 'tel:+79000000000', label: '+7 (900) 000-00-00' },
  {
    href: 'mailto:sheludkoanastasiakrasnodar@gmail.com',
    label: 'sheludkoanastasiakrasnodar@gmail.com',
  },
]

function SitemapPage() {
  usePageMeta(
    'Карта сайта — WedBuket',
    'Карта сайта WedBuket: разделы главной, букет 360°, свободные даты и правовые страницы.'
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <LegalLayout>
      <div className="legal-page-inner container">
        <p className="legal-back">
          <Link to="/">← На главную</Link>
        </p>
        <h1 className="legal-title">Карта сайта</h1>
        <p className="legal-lead">
          Разделы портфолио-проекта WedBuket и правовая информация.
        </p>

        <section className="sitemap-block" aria-labelledby="sitemap-sections">
          <h2 id="sitemap-sections" className="sitemap-heading">
            Разделы
          </h2>
          <ul className="sitemap-list">
            {SECTIONS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="sitemap-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="sitemap-block" aria-labelledby="sitemap-legal">
          <h2 id="sitemap-legal" className="sitemap-heading">
            Правовая информация
          </h2>
          <ul className="sitemap-list">
            {LEGAL.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="sitemap-link">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <span className="sitemap-link sitemap-link--current">
                Карта сайта
              </span>
            </li>
          </ul>
        </section>

        <section className="sitemap-block" aria-labelledby="sitemap-contacts">
          <h2 id="sitemap-contacts" className="sitemap-heading">
            Контакты
          </h2>
          <ul className="sitemap-list">
            {CONTACTS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="sitemap-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </LegalLayout>
  )
}

export default SitemapPage
