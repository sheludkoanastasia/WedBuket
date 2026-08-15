function About() {
  return (
    <section className="about" id="about">
      <div className="about-inner container">
        <div className="about-grid">
          <div className="about-left">
            <div className="about-intro">
              <h2 className="about-title">Что для нас важно</h2>
              <p className="about-text">
                Цельный образ — букет не существует отдельно
                <br /> от площадки
              </p>
              <p className="about-text">
                Форма и стиль — воздух, линия, цвет: чтобы
                <br /> на фото было «вау», а не «просто цветы»
              </p>
              <p className="about-text">
                Дата и процесс — сначала понимаем свадьбу,
                <br /> потом фиксируем состав и монтаж
              </p>
            </div>
            <div className="about-image-left-grid">
              <img className="about-img" src="/images/about1.png" alt="" />
              <img className="about-img" src="/images/about2.png" alt="" />
            </div>
          </div>

          <div className="about-right">
            <h2 className="about-title about-title--line">Свадебные профи</h2>
            <img
              className="about-img about-img--tall"
              src="/images/about3.png"
              alt=""
            />
            <div className="about-actions">
              <a href="#look-date" className="btn btn-look-date">
                Просмотреть свободные даты
              </a>
              <a href="#bridal-bouquet" className="btn">
                Подобрать флористику
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
