import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner container">
        <div className="footer-columns">
          <nav className="footer-col" aria-label="Разделы сайта">
            <Link to="/#about" className="footer-link">
              О нас
            </Link>
            <Link to="/#works" className="footer-link">
              Как мы работаем
            </Link>
            <Link to="/#bridal-bouquet" className="footer-link">
              Букет невесты 360°
            </Link>
            <Link to="/#portfolio" className="footer-link">
              Фото с событий
            </Link>
            <Link to="/#look-date" className="footer-link">
              Свободные даты
            </Link>
          </nav>

          <nav className="footer-col" aria-label="Правовая информация">
            <Link to="/privacy" className="footer-link">
              Политика обработки персональных данных
            </Link>
            <Link to="/terms" className="footer-link">
              Пользовательское соглашение
            </Link>
            <Link to="/sitemap" className="footer-link">
              Карта сайта
            </Link>
          </nav>

          <div className="footer-col footer-col--right">
            <Link to="/#look-date" className="footer-link footer-link--pink">
              Забронировать дату
            </Link>
            <Link
              to="/#bridal-bouquet"
              className="footer-link footer-link--green"
            >
              Подобрать флористику
            </Link>
            <a href="tel:+79000000000" className="footer-link">
              +7 (900) 000-00-00
            </a>
            <a
              href="mailto:hello@wedbuket.ru"
              className="footer-link footer-link--mail"
            >
              hello@wedbuket.ru
            </a>
            <p className="footer-copy">© {new Date().getFullYear()} WedBuket</p>
          </div>
        </div>

        <div className="footer-brand" aria-hidden="true">
          <Link to="/">
            <img
              className="footer-brand-img"
              src="/images/WedBuket.svg"
              alt=""
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
