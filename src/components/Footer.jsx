function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-inner container">
        <div className="footer-columns">
          <nav className="footer-col" aria-label="Разделы сайта">
            <a href="#about" className="footer-link">
              О нас
            </a>
            <a href="#works" className="footer-link">
              Как мы работаем
            </a>
            <a href="#bridal-bouquet" className="footer-link">
              Букет невесты 360°
            </a>
            <a href="#portfolio" className="footer-link">
              Фото с событий
            </a>
            <a href="#look-date" className="footer-link">
              Свободные даты
            </a>
          </nav>

          <nav className="footer-col" aria-label="Правовая информация">
            <a href="#privacy" className="footer-link">
              Политика обработки персональных данных
            </a>
            <a href="#terms" className="footer-link">
              Пользовательское соглашение
            </a>
            <a href="#sitemap" className="footer-link">
              Карта сайта
            </a>
          </nav>

          <div className="footer-col footer-col--right">
            <a href="#look-date" className="footer-link footer-link--pink">
              Забронировать дату
            </a>
            <a href="#bridal-bouquet" className="footer-link footer-link--green">
              Подобрать флористику
            </a>
            <a href="tel:+79000000000" className="footer-link">
              +7 (900) 000-00-00
            </a>
            <a href="mailto:hello@wedbuket.ru" className="footer-link footer-link--mail">
              hello@wedbuket.ru
            </a>
            <p className="footer-copy">© {new Date().getFullYear()} WedBuket</p>
          </div>
        </div>

        <div className="footer-brand" aria-hidden="true">
          <img
            className="footer-brand-img"
            src="/images/WedBuket.svg"
            alt=""
          />
        </div>
      </div>
    </footer>
  )
}

export default Footer
