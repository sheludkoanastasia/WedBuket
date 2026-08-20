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
                fallback="/images/portfolio1.png"
                alt=""
                loading="lazy"
              />
            </div>
          </div>

          <Picture
            className="portfolio-picture portfolio-picture--right"
            imgClassName="portfolio-image portfolio-image--right"
            webp="/images/portfolio2.webp"
            fallback="/images/portfolio2.png"
            alt=""
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
              fallback="/images/portfolio3.png"
              alt=""
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio8.webp"
              fallback="/images/portfolio8.png"
              alt=""
              loading="lazy"
            />
          </div>
          <div className="portfolio-col-bottom portfolio-col-bottom--right">
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio4.webp"
              fallback="/images/portfolio4.png"
              alt=""
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio5.webp"
              fallback="/images/portfolio5.png"
              alt=""
              loading="lazy"
            />
            <Picture
              className="portfolio-picture-bottom"
              imgClassName="portfolio-image-bottom"
              webp="/images/portfolio7.webp"
              fallback="/images/portfolio7.png"
              alt=""
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
