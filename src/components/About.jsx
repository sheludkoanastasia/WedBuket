import Picture from './Picture'
import { useReveal } from '../hooks/useReveal'

function About() {
  const revealRef = useReveal()

  return (
    <section className="about reveal" id="about" ref={revealRef}>
      <div className="about-inner container">
        <div className="about-grid">
          <div className="about-left reveal-child">
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
              <Picture
                className="about-picture"
                imgClassName="about-img"
                webp="/images/about1.webp"
                fallback="/images/about1.webp"
                alt="Детали свадебной флористики: бутоны и зелень крупным планом"
                loading="lazy"
              />
              <Picture
                className="about-picture"
                imgClassName="about-img"
                webp="/images/about2.webp"
                fallback="/images/about2.webp"
                alt="Свадебный букет невесты в руках"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-right reveal-child">
            <h2 className="about-title about-title--line">Свадебные профи</h2>
            <Picture
              className="about-picture"
              imgClassName="about-img about-img--tall"
              webp="/images/about3.webp"
              fallback="/images/about3.webp"
              alt="Невеста с букетом на свадебной площадке"
              loading="lazy"
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
