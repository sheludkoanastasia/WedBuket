import Picture from './Picture'
import { useReveal } from '../hooks/useReveal'

function Portfolio() {
  const revealRef = useReveal()

  return (
    <section className="portfolio reveal" id="portfolio" ref={revealRef}>
      <div className="portfolio-inner container">
        <div className="portfolio-photos reveal-child">
          <div className="portfolio-col portfolio-col--left">
            <div className="portfolio-left-figure">
              <h2 className="portfolio-title">Фото</h2>
              <Picture
                className="portfolio-picture portfolio-picture--left"
                imgClassName="portfolio-image portfolio-image--left"
                webp="/images/portfolio1.webp"
                fallback="/images/portfolio1.webp"
                alt="Свадебный стол с цветочной композицией"
                loading="lazy"
              />
            </div>
          </div>

          <Picture
            className="portfolio-picture portfolio-picture--right"
            imgClassName="portfolio-image portfolio-image--right"
            webp="/images/portfolio2.webp"
            fallback="/images/portfolio2.webp"
            alt="Оформление церемонии живыми цветами"
            loading="lazy"
          />
        </div>

        <h2 className="portfolio-bottom-title reveal-child">С событий</h2>

        <div className="portfolio-bottom-photos reveal-child">
          <div className="portfolio-col-bottom portfolio-col-bottom--left">
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio3.webp"
              fallback="/images/portfolio3.webp"
              alt="Букет невесты на фоне свадебного декора"
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio8.webp"
              fallback="/images/portfolio8.webp"
              alt="Цветочная арка на свадебной церемонии"
              loading="lazy"
            />
          </div>
          <div className="portfolio-col-bottom portfolio-col-bottom--right">
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio4.webp"
              fallback="/images/portfolio4.webp"
              alt="Банкетные композиции на гостевых столах"
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio5.webp"
              fallback="/images/portfolio5.webp"
              alt="Детали флористики: бутоньерка и цветы"
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio7.webp"
              fallback="/images/portfolio7.webp"
              alt="Свадебная фотозона с цветочным оформлением"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
