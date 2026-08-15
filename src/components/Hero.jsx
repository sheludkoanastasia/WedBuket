import { useEffect, useRef, useState } from 'react'

const REVEAL_RADIUS = 160

function Hero() {
  const stageRef = useRef(null)
  const rafRef = useRef(0)
  const pointRef = useRef({ x: 0, y: 0 })
  const [active, setActive] = useState(false)
  const [point, setPoint] = useState({ x: 0, y: 0 })

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const flushPoint = () => {
    rafRef.current = 0
    setPoint({ ...pointRef.current })
  }

  const onPointerMove = (event) => {
    const stage = stageRef.current
    if (!stage) return

    const rect = stage.getBoundingClientRect()
    pointRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(flushPoint)
    }
  }

  const onPointerEnter = (event) => {
    onPointerMove(event)
    setActive(true)
  }

  const onPointerLeave = () => {
    setActive(false)
  }

  return (
    <section className="hero" id="hero">
      <div
        ref={stageRef}
        className={`hero-image-reveal${active ? ' is-active' : ''}`}
        onPointerEnter={onPointerEnter}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{
          '--mx': `${point.x}px`,
          '--my': `${point.y}px`,
          '--reveal-radius': active ? `${REVEAL_RADIUS}px` : '0px',
        }}
      >
        <img
          className="hero-image hero-image--base"
          src="/images/wedding-bouquet-garden-glass.png"
          alt=""
          draggable={false}
        />
        <img
          className="hero-image hero-image--lens"
          src="/images/wedding-bouquet-garden-under-glass.jpg"
          alt=""
          draggable={false}
        />
      </div>

      <div className="hero-decoration-wrap container container--landing">
        <p className="hero-decoration" aria-hidden="true">
          WedBuket
        </p>
      </div>

      <div className="hero-content container container--landing">
        <div className="hero-content-inner">
          <h1 className="hero-title">
          <span>Собери флористику&nbsp;мечты</span>
            <span>на свою свадьбу</span>
          </h1>
          <p className="hero-description">
            Букет невесты, оформление церемонии и банкета — в одном стиле,
            <br />
            без шаблонных композиций.
          </p>
          <a href="#bridal-bouquet" className="btn">
            Подобрать букет невесты
          </a>
        </div>
      </div>
    </section>
  )
}

export default Hero
