function Portfolio() {
  return (
    <section className="portfolio" id="portfolio">
      <div className="portfolio-inner container">
        <div className="portfolio-photos">
          <div className="portfolio-col portfolio-col--left">
            <div className="portfolio-left-figure">
              <h2 className="portfolio-title">Фото</h2>
              <img
                className="portfolio-image portfolio-image--left"
                src="/images/portfolio1.png"
                alt=""
              />
            </div>
          </div>

          <img
            className="portfolio-image portfolio-image--right"
            src="/images/portfolio2.png"
            alt=""
          />
        </div>

        <h2 className="portfolio-bottom-title">С событий</h2>

        <div className="portfolio-bottom-photos">
          <div className="portfolio-col-bottom portfolio-col-bottom--left">
            <img
              className="portfolio-image-bottom"
              src="/images/portfolio3.png"
              alt=""
            />
            <img
              className="portfolio-image-bottom"
              src="/images/portfolio8.png"
              alt=""
            />
          </div>
          <div className="portfolio-col-bottom portfolio-col-bottom--right">
            <img
              className="portfolio-image-bottom"
              src="/images/portfolio4.png"
              alt=""
            />
            <img
              className="portfolio-image-bottom"
              src="/images/portfolio5.png"
              alt=""
            />
            <img
              className="portfolio-image-bottom"
              src="/images/portfolio7.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
